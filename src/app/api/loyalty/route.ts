import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const loyaltyAccount = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
      include: {
        achievements: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!loyaltyAccount) {
      // Auto-create loyalty account if it doesn't exist
      const newAccount = await prisma.loyaltyAccount.create({
        data: {
          userId: session.user.id,
        },
        include: {
          achievements: true,
          transactions: true,
        },
      });
      return NextResponse.json(newAccount, { status: 200 });
    }

    return NextResponse.json(loyaltyAccount, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
