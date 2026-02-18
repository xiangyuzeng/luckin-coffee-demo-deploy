import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(null, { status: 200 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { order: { userId: session.user.id, paid: true } },
      include: { menu: { include: { images: true } } },
    });

    if (cartItems.length === 0) return NextResponse.json(null, { status: 200 });

    // Aggregate by menuID to find most frequent
    const freq: Record<string, { count: number; menu: any; size: string; milkType: string; sugarLevel: string }> = {};
    for (const ci of cartItems) {
      if (!freq[ci.menuID]) {
        freq[ci.menuID] = { count: 0, menu: ci.menu, size: ci.size, milkType: ci.milkType, sugarLevel: ci.sugarLevel };
      }
      freq[ci.menuID].count += ci.quantity;
    }

    const usual = Object.values(freq).sort((a, b) => b.count - a.count)[0];
    return NextResponse.json(usual, { status: 200 });
  } catch (error) {
    return NextResponse.json(null, { status: 200 });
  }
}
