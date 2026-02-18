import { z } from 'zod';

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(30)
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email')
      .trim(),
    phone: z.string().min(1, 'Phone is required').max(15),
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
