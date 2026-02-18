import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
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
    });

    if (!loyaltyAccount) {
      return NextResponse.json([], { status: 200 });
    }

    const transactions = await prisma.pointTransaction.findMany({
      where: { loyaltyAccountId: loyaltyAccount.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
