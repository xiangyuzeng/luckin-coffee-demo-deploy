import { z } from 'zod';

export const authFormSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(10)
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email')
      .trim(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(3, 'Password must have min 3 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Password confirmation is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match'
  });
