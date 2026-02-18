import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';

export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderListbyUserId = await prisma.order.findMany({
      where: {
        userId: params.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        cartItems: {
          include: {
            menu: true // Include Menu details within cartItems
          }
        }
      }
    });

    return NextResponse.json(
      {
        orderList: orderListbyUserId,
        message: `All orders to userId: ${params.id} are returned`
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error
      },
      { status: 500 }
    );
  }
}
