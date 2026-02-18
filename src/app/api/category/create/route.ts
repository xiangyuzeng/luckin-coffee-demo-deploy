import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/client';
import { categoryFormSchema } from '@/lib/validation/categoryFormSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryName } = categoryFormSchema.parse(body);

    // Validation with safeParse
    /* const validation = userSchema.safeParse(body);
    if (!validation.success) {
      NextResponse.json(validation.error.format(), { status: 400 });
    }*/

    const existCategoryByName = await prisma.category.findUnique({
      where: {
        name: categoryName
      }
    });

    if (existCategoryByName) {
      return NextResponse.json(
        {
          category: null,
          message: 'Category already exist'
        },
        {
          status: 409
        }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: categoryName
      }
    });

    return NextResponse.json(
      {
        // category: newCategory,
        message: 'Category created'
      },
      { status: 201 }
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
