'use client';

import { useEffect, useState } from 'react';
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
import { categoryFormSchema } from '@/lib/validation/categoryFormSchema';

type formType = z.infer<typeof categoryFormSchema>;

interface CategoryCreateProps {
  handleCategoryRefetch: () => void;
}

const CategoryCreate = ({
  handleCategoryRefetch
}: CategoryCreateProps) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: ''
    }
  });

  useEffect(() => {
    form.reset({
      categoryName: ''
    });
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit = async (
    data: z.infer<typeof categoryFormSchema>
  ) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryName: data.categoryName
        })
      });

      if (response.ok) {
        setSubmitting(false);
        handleCategoryRefetch();
        toast.success(
          `Category: ${data.categoryName} has been created successfully`
        );
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
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Category</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Menu name"
                  type="text"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex w-28 gap-1 text-right"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryCreate;
