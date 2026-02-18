import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/client';

export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderItem = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        user: true,
        cartItems: {
          include: {
            menu: {
              include: {
                images: true // Include Images within the Menu details
              }
            }
          }
        }
      }
    });

    if (!orderItem) {
      return NextResponse.json(
        {
          message: `OrderId: ${params.orderId} has not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        orderItem: orderItem,
        message: `OrderId: ${params.orderId} with records are returned`
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
