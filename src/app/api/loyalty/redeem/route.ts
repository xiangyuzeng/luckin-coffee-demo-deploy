import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { REDEMPTION_OPTIONS } from '@/lib/loyalty';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { rewardId } = await req.json();
    const reward = REDEMPTION_OPTIONS.find((r) => r.id === rewardId);

    if (!reward) {
      return NextResponse.json({ message: 'Invalid reward' }, { status: 400 });
    }

    const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!loyaltyAccount || loyaltyAccount.points < reward.pointsCost) {
      return NextResponse.json({ message: 'Not enough points' }, { status: 400 });
    }

    const [updatedAccount] = await prisma.$transaction([
      prisma.loyaltyAccount.update({
        where: { userId: session.user.id },
        data: {
          points: { decrement: reward.pointsCost },
        },
      }),
      prisma.pointTransaction.create({
        data: {
          loyaltyAccountId: loyaltyAccount.id,
          points: -reward.pointsCost,
          type: 'REDEEMED',
          description: `Redeemed: ${reward.name}`,
        },
      }),
    ]);

    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
