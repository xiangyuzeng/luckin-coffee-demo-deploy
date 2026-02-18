import { NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/client';
import { categoryProps } from '@/types/category';
import { categoryFormSchema } from '@/lib/validation/categoryFormSchema';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: categoryProps = await req.json();

    // Validation with safeParse
    const validation = categoryFormSchema.safeParse(body);
    if (!validation.success) {
      NextResponse.json(validation.error.format(), { status: 400 });
    }

    const updateCategory = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: body.categoryName
      }
    });

    return NextResponse.json(
      {
        message: `Category id:${params.id} is updated`
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
