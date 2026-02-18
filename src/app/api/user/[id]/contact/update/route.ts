import { NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/client';
import { ContactProfileProps } from '@/types/profile';
import { contactFormSchema } from '@/lib/validation/contactFormSchema';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: ContactProfileProps = await req.json();

    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }

    await prisma.user.update({
      where: { id: params.id },
      data: {
        phone: body.phone
      }
    });

    return NextResponse.json(
      { message: `Profile id:${params.id} is updated` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}
