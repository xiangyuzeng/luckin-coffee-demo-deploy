import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: { userId: session.user.id },
      });
    }

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { milkPreference, sugarLevel, defaultSize, favoriteDrinkId, onboardingComplete } = body;

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        ...(milkPreference && { milkPreference }),
        ...(sugarLevel && { sugarLevel }),
        ...(defaultSize && { defaultSize }),
        ...(favoriteDrinkId && { favoriteDrinkId }),
        ...(onboardingComplete !== undefined && { onboardingComplete }),
      },
      create: {
        userId: session.user.id,
        ...(milkPreference && { milkPreference }),
        ...(sugarLevel && { sugarLevel }),
        ...(defaultSize && { defaultSize }),
        ...(favoriteDrinkId && { favoriteDrinkId }),
        ...(onboardingComplete !== undefined && { onboardingComplete }),
      },
    });

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
