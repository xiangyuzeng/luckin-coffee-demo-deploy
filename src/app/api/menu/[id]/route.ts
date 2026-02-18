import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';

export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validation with safeParse
    /* const validation = userSchema.safeParse(body);
    if (!validation.success) {
      NextResponse.json(validation.error.format(), { status: 400 });
    }*/

    const menuItem = await prisma.menu.findUnique({
      where: { id: params.id },
      include: { images: true, categories: true }
    });

    if (!menuItem) {
      return NextResponse.json(
        {
          message: `Menu: ${params.id} not found`
        },
        { status: 404 }
      );
    }

    const modifiedMenuItem = {
      ...menuItem,
      images: menuItem.images.map((image) => ({ ...image })),
      categories: menuItem.categories.map((category) => ({
        ...category,
        menuIDs: [...category.menuIDs]
      }))
    };

    return NextResponse.json(
      {
        menuItem: modifiedMenuItem,
        message: `Menu: ${params.id} with records are returned`
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
