import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const VALID_TRANSITIONS: Record<string, string> = {
  PLACED: 'PREPARING',
  PREPARING: 'READY',
  READY: 'PICKED_UP',
};

const TIMESTAMP_FIELDS: Record<string, string> = {
  PREPARING: 'preparingAt',
  READY: 'readyAt',
  PICKED_UP: 'pickedUpAt',
};

const EVENT_LABELS: Record<string, string> = {
  PREPARING: 'Barista started preparing your order',
  READY: 'Your order is ready for pickup',
  PICKED_UP: 'Order picked up',
};

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'STAFF' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const tracking = await prisma.orderTracking.findUnique({
      where: { orderId: params.orderId },
    });

    if (!tracking) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const nextStatus = VALID_TRANSITIONS[tracking.status];
    if (!nextStatus) {
      return NextResponse.json({ message: 'Order cannot be advanced further' }, { status: 400 });
    }

    const timestampField = TIMESTAMP_FIELDS[nextStatus];
    const now = new Date();

    // Update tracking status and timestamp
    await prisma.orderTracking.update({
      where: { orderId: params.orderId },
      data: {
        status: nextStatus as any,
        [timestampField]: now,
      },
    });

    // Create order event
    await prisma.orderEvent.create({
      data: {
        trackingId: tracking.id,
        status: nextStatus as any,
        label: EVENT_LABELS[nextStatus] || `Status changed to ${nextStatus}`,
      },
    });

    // Refetch with events
    const result = await prisma.orderTracking.findUnique({
      where: { orderId: params.orderId },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
