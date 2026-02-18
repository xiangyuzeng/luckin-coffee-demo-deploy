import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import prisma from '../../../../prisma/client';
import { LoyaltyTier } from '@prisma/client';
import { calculatePointsForOrder, calculateStreak, getStreakBonus } from '@/lib/loyalty';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true
  });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  const endpointSecret = process.env.STRIPE_SIGNATURE_SECRET || '';
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );

    if (event.type === 'checkout.session.completed') {
      const orderId = event?.data?.object?.metadata?.orderId;
      const userId = event?.data?.object?.metadata?.userId;
      const isPaid = event?.data?.object?.payment_status === 'paid';

      if (isPaid && orderId) {
        // Update order as paid
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { paid: true },
          include: { cartItems: { include: { menu: true } } }
        });

        // Advance tracking to PREPARING
        await prisma.orderTracking.updateMany({
          where: { orderId: orderId },
          data: {
            status: 'PREPARING',
            preparingAt: new Date()
          }
        });

        // Award loyalty points
        if (userId) {
          const totalAmount = order.cartItems.reduce((sum, item) => {
            return sum + item.menu.price * item.quantity;
          }, 0);
          const pointsEarned = calculatePointsForOrder(totalAmount);

          // Upsert loyalty account
          let loyaltyAccount = await prisma.loyaltyAccount.findUnique({
            where: { userId }
          });

          if (!loyaltyAccount) {
            loyaltyAccount = await prisma.loyaltyAccount.create({
              data: { userId, points: 0, totalEarned: 0, tier: 'BRONZE' }
            });
          }

          // Calculate new tier
          const newTotalEarned = loyaltyAccount.totalEarned + pointsEarned;
          let newTier: LoyaltyTier = 'BRONZE';
          if (newTotalEarned >= 1500) newTier = 'GOLD';
          else if (newTotalEarned >= 500) newTier = 'SILVER';

          // Update loyalty account
          await prisma.loyaltyAccount.update({
            where: { id: loyaltyAccount.id },
            data: {
              points: { increment: pointsEarned },
              totalEarned: { increment: pointsEarned },
              tier: newTier,
              lastVisit: new Date()
            }
          });

          // Record point transaction
          await prisma.pointTransaction.create({
            data: {
              loyaltyAccountId: loyaltyAccount.id,
              points: pointsEarned,
              type: 'EARNED',
              description: `Order #${orderId.slice(-8)}`,
              orderId: orderId
            }
          });

          // Update order with points earned
          await prisma.order.update({
            where: { id: orderId },
            data: { loyaltyPointsEarned: pointsEarned }
          });

          // Check streak bonus
          const { newStreak, bonusPoints } = calculateStreak(loyaltyAccount.lastVisit);
          const streakBonus = bonusPoints || getStreakBonus(newStreak);

          if (streakBonus > 0) {
            await prisma.loyaltyAccount.update({
              where: { id: loyaltyAccount.id },
              data: {
                points: { increment: streakBonus },
                totalEarned: { increment: streakBonus },
                streak: newStreak
              }
            });

            await prisma.pointTransaction.create({
              data: {
                loyaltyAccountId: loyaltyAccount.id,
                points: streakBonus,
                type: 'STREAK',
                description: `${newStreak}-day streak bonus!`
              }
            });
          }
        }
      }
    }

    return NextResponse.json(
      { message: event },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Webhook error: ${error}` },
      { status: 500 }
    );
  }
}
