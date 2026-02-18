import { z } from 'zod';

export const contactUsFormSchema = z.object({
  name: z.string().min(1, 'Contact name is required').max(20).trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email')
    .trim(),
  subject: z.string().min(1, 'Subject is required').max(20).trim(),
  message: z.string().min(1, 'Message is required').trim()
});
