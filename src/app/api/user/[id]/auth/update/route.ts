import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '../../../../../../../prisma/client';
import { authFormSchema } from '@/lib/validation/authFormSchema';
import { AuthProfileProps } from '@/types/profile';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: AuthProfileProps = await req.json();

    // Validation with safeParse
    const validation = authFormSchema.safeParse(body);
    if (!validation.success) {
      NextResponse.json(validation.error.format(), { status: 400 });
    }

    const hashedPassword = await hash(body.password!, 10);

    const updateProfile = await prisma.user.update({
      where: { id: params.id },
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword
      }
    });

    return NextResponse.json(
      {
        message: `Profile id:${params.id} is updated`
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
