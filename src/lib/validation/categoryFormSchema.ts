import { z } from 'zod';

export const categoryFormSchema = z.object({
  categoryName: z.string().min(1, 'Category is required').trim()
});
