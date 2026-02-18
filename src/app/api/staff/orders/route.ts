import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'STAFF' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: {
        paid: true,
        tracking: { status: { not: 'PICKED_UP' } },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        tracking: { include: { events: { orderBy: { createdAt: 'asc' } } } },
        cartItems: { include: { menu: { include: { images: true } } } },
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
