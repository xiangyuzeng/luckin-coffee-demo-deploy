import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getAIRecommendation } from '@/lib/ai-barista';
import { getMockWeather } from '@/lib/weather';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Fetch all menu items
    const allMenus = await prisma.menu.findMany({
      include: {
        images: true,
        categories: true,
      },
    });

    // Get order history if user is authenticated
    let orderHistory: { menuId: string; menuName: string; count: number }[] = [];

    if (session?.user?.id) {
      const orders = await prisma.order.findMany({
        where: { userId: session.user.id, paid: true },
        include: {
          cartItems: {
            include: { menu: true },
          },
        },
      });

      // Count menu item frequency
      const menuCounts = new Map<string, { menuId: string; menuName: string; count: number }>();
      for (const order of orders) {
        for (const item of order.cartItems) {
          const existing = menuCounts.get(item.menuID);
          if (existing) {
            existing.count += item.quantity;
          } else {
            menuCounts.set(item.menuID, {
              menuId: item.menuID,
              menuName: item.menu.name,
              count: item.quantity,
            });
          }
        }
      }
      orderHistory = Array.from(menuCounts.values());
    }

    const weather = getMockWeather();
    const recommendation = getAIRecommendation(allMenus, orderHistory, weather.tempF);

    return NextResponse.json(
      {
        recommendation,
        weather,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
