'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { authFormSchema } from '@/lib/validation/authFormSchema';
import { AuthProfileProps } from '@/types/profile';

type formType = z.infer<typeof authFormSchema>;

interface AuthProps {
  id: string;
  authProfile: AuthProfileProps;
  handleUpdateAuth: (username: string, email: string) => void;
}

const AuthProfile = ({
  id,
  authProfile,
  handleUpdateAuth
}: AuthProps) => {
  const { data: session } = useSession();

  const [isSubmitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    form.setValue('username', authProfile.username);
    form.setValue('email', authProfile.email);
  }, []);

  const onSubmit = async (data: z.infer<typeof authFormSchema>) => {
    try {
      setSubmitting(true);

      const response = await fetch(`/api/user/${id}/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password
        })
      });

      if (response.ok) {
        handleUpdateAuth(data.username, data.email);
        setIsEdit(false);
        setSubmitting(false);
        toast.success('Profile has been updated successfully');
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
      setSubmitting(false);
      toast.error('An unexpected error is occured');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mb-8 mt-5 flex max-w-md flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Username"
                  type="text"
                  disabled={!isEdit}
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="email@example.com"
                  type="email"
                  disabled={!isEdit}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {session?.user.provider !== 'GOOGLE' && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Password"
                      type="password"
                      disabled={!isEdit}
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirm Password"
                      type="password"
                      disabled={!isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {session?.user.provider !== 'GOOGLE' && (
          <>
            {!isEdit ? (
              <div className="my-5 text-right">
                <Button
                  type="button"
                  className="mx-auto w-28"
                  onClick={() => setIsEdit(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="my-5 flex flex-row justify-between">
                <Button
                  type="button"
                  className="w-28 text-left"
                  onClick={() => setIsEdit(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex w-28 gap-1 text-right"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>
            )}
          </>
        )}
      </form>{' '}
    </Form>
  );
};

export default AuthProfile;
