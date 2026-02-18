import prisma from '../../../../prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { OrderSchema } from '@/types/order';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderSchema = await req.json();
    const { cart, userId, customerName, email, pickupName, phone } = body;

    const newOrder = await prisma.order.create({
      data: {
        paid: false,
        cartItems: {
          create: cart.map((item) => ({
            menu: { connect: { id: item.menu.id } },
            size: item.size,
            quantity: item.quantity,
            milkType: item.customization?.milkType || 'REGULAR',
            sugarLevel: item.customization?.sugarLevel || 'NORMAL',
            shots: item.customization?.shots || 1
          }))
        },
        user: { connect: { id: userId } },
        customerName: customerName,
        email: email,
        pickupName: pickupName || customerName,
        phone: phone,
        tracking: {
          create: {
            status: 'PLACED',
            placedAt: new Date()
          }
        }
      }
    });

    const stripe = getStripe();
    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    cart.forEach((item) => {
      stripeLineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: 'USD',
          product_data: {
            name: item.menu.name,
            description: `${item.size}${item.customization?.milkType && item.customization.milkType !== 'REGULAR' ? ` · ${item.customization.milkType} milk` : ''}${item.customization?.shots && item.customization.shots > 1 ? ` · ${item.customization.shots} shots` : ''}`,
            metadata: {
              size: item.size
            }
          },
          unit_amount: Math.round(item.menu.price * 100)
        }
      });
    });

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      metadata: {
        userId: userId,
        orderId: newOrder.id
      },
      success_url: `${process.env.NEXT_SERVER_URL}/checkout?orderId=${newOrder.id}&success=true`,
      cancel_url: `${process.env.NEXT_SERVER_URL}/checkout?orderId=${newOrder.id}&canceled=true`
    });

    return NextResponse.json(
      {
        stripeSessionUrl: stripeSession.url,
        message: 'Order created'
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'An error occurred'
      },
      { status: 500 }
    );
  }
}
