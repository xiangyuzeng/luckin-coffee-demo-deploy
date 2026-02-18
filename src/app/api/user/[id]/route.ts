import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: params.id }
    });

    return NextResponse.json(
      {
        profile: userProfile,
        message: `User id:${params.id} records are returned`
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
