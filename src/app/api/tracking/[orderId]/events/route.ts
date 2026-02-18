import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const tracking = await prisma.orderTracking.findUnique({
      where: { orderId: params.orderId },
      include: {
        events: { orderBy: { createdAt: 'asc' } },
        order: { select: { userId: true } },
      },
    });

    if (!tracking) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    // Allow access for order owner, staff, or admin
    const isOwner = tracking.order.userId === session.user.id;
    const isStaff = session.user.role === 'STAFF' || session.user.role === 'ADMIN';
    if (!isOwner && !isStaff) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(tracking.events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
