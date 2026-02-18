import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';

export async function GET() {
  try {
    const quickItems = await prisma.menu.findMany({
      where: { estimatedPrepMinutes: { lt: 5 } },
      include: { images: true },
      take: 3,
      orderBy: { estimatedPrepMinutes: 'asc' },
    });

    return NextResponse.json(quickItems, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}
