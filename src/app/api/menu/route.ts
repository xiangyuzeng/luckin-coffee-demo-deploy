import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    // Validation with safeParse
    /* const validation = userSchema.safeParse(body);
    if (!validation.success) {
      NextResponse.json(validation.error.format(), { status: 400 });
    }*/

    const menuList = await prisma.menu.findMany({
      include: { images: true, categories: true }
    });

    return NextResponse.json(
      {
        menuList: menuList,
        message: 'All menu with records are returned'
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
