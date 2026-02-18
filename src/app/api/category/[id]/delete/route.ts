import { NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedCategoryItem = await prisma.category.delete({
      where: {
        id: params.id
      },
      include: {
        menus: true
      }
    });

    const deletedCategoryMenuIDs = deletedCategoryItem.menus.map(
      (menu) => menu.id
    );

    // Fetch the existing menu items that contain the deleted category ID
    const existingMenus = await prisma.menu.findMany({
      where: {
        id: {
          in: deletedCategoryMenuIDs
        }
      },
      select: {
        id: true,
        categories: {
          select: {
            id: true
          }
        }
      }
    });

    // Update each menu item to keep only category IDs that are not deleted
    const updatePromises = existingMenus.map(async (menu) => {
      const remainingCategoryIDs = menu.categories
        .map((category) => category.id)
        .filter((categoryId) => categoryId !== params.id);

      await prisma.menu.update({
        where: {
          id: menu.id
        },
        data: {
          categoryIDs: {
            set: remainingCategoryIDs
          }
        }
      });
    });

    return NextResponse.json(
      {
        categoryItem: null,
        message: `Category: ${deletedCategoryItem.name} with ${params.id} has been removed from the database`
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
