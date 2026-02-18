import { EmailTemplate } from '@/components/email-template';
import { contactUsFormSchema } from '@/lib/validation/contactUsFormSchema';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { message: 'Email service not configured' },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { name, email, subject, message } =
      contactUsFormSchema.parse(body);

    const data = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: EmailTemplate({ name: name, message: message })
    });

    return NextResponse.json(
      {
        message: data
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
