'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
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
import Image from 'next/image';
import googleLogo from '../../../../public/google_logo.svg';
import { loginFormSchema } from '@/lib/validation/loginFormSchema';
import { useTranslation } from '@/lib/i18n/LanguageContext';

type formType = z.infer<typeof loginFormSchema>;

const Login = () => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const redirect = searchParams.get('redirect');
  const onboarding = searchParams.get('onboarding');

  const [isSubmittingCredentials, setSubmittingCredentials] = useState(false);
  const [isSubmittingGoogle, setSubmittingGoogle] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      setSubmittingCredentials(true);
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });
      if (response?.ok) {
        if (onboarding === 'true') {
          router.push('/onboarding');
        } else if (redirect === 'checkout') {
          router.push('/checkout');
        } else {
          router.push('/');
        }
      }
      if (response?.error) {
        setSubmittingCredentials(false);
        toast.error('Email or password is incorrect');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setSubmittingCredentials(false);
    }
  };

  if (status === 'authenticated') {
    return (
      <p className="m-auto my-5 text-center text-lg text-gray-500">
        {t('auth.alreadySigned')}
      </p>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-sm pb-20">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">{t('auth.welcomeBack')}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t('auth.signInToEarn')}
        </p>
      </div>

      {/* Google Sign In - Primary CTA */}
      <Button
        type="button"
        className="w-full rounded-full bg-[#1A3C8B] py-6 text-base font-medium text-white hover:bg-[#2D5BB9]"
        onClick={async () => {
          setSubmittingGoogle(true);
          await signIn('google', {
            callbackUrl: onboarding === 'true' ? '/onboarding' : redirect === 'checkout' ? '/checkout' : '/'
          });
        }}
        disabled={isSubmittingCredentials || isSubmittingGoogle}
      >
        {isSubmittingGoogle && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        <Image
          src={googleLogo}
          alt="Google"
          width="0"
          height="0"
          className="mr-2 h-auto w-5 brightness-0 invert"
          loading="lazy"
        />
        Google
      </Button>

      {/* Divider */}
      <div className="relative mt-5 flex items-center py-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 flex-shrink text-sm text-gray-400">{t('auth.orSignInWithEmail')}</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Email/Password Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
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
                    disabled={isSubmittingCredentials || isSubmittingGoogle}
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
                    disabled={isSubmittingCredentials || isSubmittingGoogle}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full rounded-full bg-[#1A3C8B] py-6 text-base font-medium hover:bg-[#2D5BB9]"
            type="submit"
            disabled={isSubmittingCredentials || isSubmittingGoogle}
          >
            {isSubmittingCredentials && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t('common.signIn')}
          </Button>
        </form>
      </Form>

      {/* Register Link */}
      <p className="mt-4 text-center text-sm text-gray-500">
        {t('auth.noAccount')}{' '}
        <Link
          href="/auth/register"
          className="font-medium text-[#1A3C8B] hover:underline"
        >
          {t('auth.registerLink')}
        </Link>
      </p>
    </div>
  );
};

export default Login;
