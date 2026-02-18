import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET active order tracking for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Find the most recent non-picked-up order for this user
    const activeOrder = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        paid: true,
        tracking: {
          status: { not: 'PICKED_UP' },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        tracking: true,
        cartItems: {
          include: { menu: { include: { images: true } } },
        },
      },
    });

    if (!activeOrder) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(activeOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
