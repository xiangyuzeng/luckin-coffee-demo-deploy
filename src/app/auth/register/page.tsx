'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { registerFormSchema } from '@/lib/validation/registerFormSchema';
import { useTranslation } from '@/lib/i18n/LanguageContext';

type formType = z.infer<typeof registerFormSchema>;

const Register = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
          confirmPassword: data.confirmPassword
        })
      });
      if (response.ok) {
        toast.success('Account created! Welcome to Luckin Coffee.');
        router.push('/auth/login?onboarding=true');
      } else {
        setSubmitting(false);
        const body = await response.json();
        if (body.message) {
          toast.error(body.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-sm pb-20">
      <div className="mb-6 text-center">
        <Image
          src="/luckin-logo-blue.svg"
          alt="Luckin Coffee"
          width={48}
          height={48}
          className="mx-auto mb-3"
        />
        <h1 className="text-2xl font-bold">{t('auth.joinLuckin')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('auth.createAccount')}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('checkout.name')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('checkout.name')}
                    type="text"
                    disabled={isSubmitting}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="email@example.com"
                    type="email"
                    disabled={isSubmitting}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.phone')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+1 234 567 8900"
                    type="tel"
                    disabled={isSubmitting}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('auth.password')}
                    type="password"
                    disabled={isSubmitting}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('auth.confirmPassword')}
                    type="password"
                    disabled={isSubmitting}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-gray-500">
            {t('auth.alreadyHave')}{' '}
            <Link
              href="/auth/login"
              className="font-medium text-[#1A3C8B] hover:underline"
            >
              {t('auth.signInLink')}
            </Link>
          </p>
          <Button
            className="w-full rounded-full bg-[#1A3C8B] py-6 text-base font-medium hover:bg-[#2D5BB9]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t('auth.createAccountBtn')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
