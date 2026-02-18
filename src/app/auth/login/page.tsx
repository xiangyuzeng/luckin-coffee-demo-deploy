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

      {/* Demo Social Buttons */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          disabled
          className="flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-3 text-sm font-medium text-gray-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Apple
          <span className="rounded bg-gray-200 px-1 py-0.5 text-[9px]">Demo</span>
        </button>

        <button
          disabled
          className="flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-3 text-sm font-medium text-gray-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
          </svg>
          WeChat
          <span className="rounded bg-gray-200 px-1 py-0.5 text-[9px]">Demo</span>
        </button>
      </div>

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
