import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '../../../../../prisma/client';
import { registerFormSchema } from '@/lib/validation/registerFormSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      username,
      email,
      phone,
      password,
      confirmPassword
    } = registerFormSchema.parse(body);

    if (password !== confirmPassword) {
      return NextResponse.json(
        { user: null, message: 'Confirm password does not match' },
        { status: 409 }
      );
    }

    const existUserByName = await prisma.user.findUnique({
      where: { username }
    });

    if (existUserByName) {
      return NextResponse.json(
        { user: null, message: 'Username already exists' },
        { status: 409 }
      );
    }

    const existUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existUserByEmail) {
      return NextResponse.json(
        { user: null, message: 'Email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        password: hashedPassword,
        loyaltyAccount: {
          create: {
            points: 0,
            totalEarned: 0,
            tier: 'BRONZE'
          }
        },
        preferences: {
          create: {}
        }
      }
    });

    return NextResponse.json(
      { message: 'User created' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}
