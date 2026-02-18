import { z } from 'zod';

export const orderFormSchema = z.object({
  username: z.string().min(1, 'Name is required').max(30).trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email')
    .trim(),
  pickupName: z.string().min(1, 'Pickup name is required').max(30).trim(),
  phone: z.string().min(1, 'Phone is required').max(15)
});
