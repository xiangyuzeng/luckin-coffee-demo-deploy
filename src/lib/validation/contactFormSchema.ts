import { z } from 'zod';

export const contactFormSchema = z.object({
  phone: z.string().min(1, 'Phone is required').max(15)
});
