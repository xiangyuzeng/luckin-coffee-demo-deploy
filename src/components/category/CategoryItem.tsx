'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pencil, X } from 'lucide-react';
import { categoryFormSchema } from '@/lib/validation/categoryFormSchema';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import DeleteCategoryModal from '@/components/category/DeleteCategoryModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

type formType = z.infer<typeof categoryFormSchema>;

interface CategoryItemProps {
  category: Category;
  editId: string;
  handleCategoryRefetch: () => void;
  handleCategoryEdit: (id: string) => void;
}

const CategoryItem = ({
  category,
  editId,
  handleCategoryRefetch,
  handleCategoryEdit
}: CategoryItemProps) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: ''
    }
  });

  useEffect(() => {
    form.setValue('categoryName', category.name);
  }, []);

  const onSubmit = async (
    data: z.infer<typeof categoryFormSchema>
  ) => {
    try {
      setSubmitting(true);
      const toastId = toast.loading('Updating ...');

      const response = await fetch(
        `/api/category/${category.id}/update`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryName: data.categoryName
          })
        }
      );

      if (response.ok) {
        setIsEdit(false);
        setSubmitting(false);
        handleCategoryRefetch();
        toast.success(
          `Category: ${data.categoryName} has been updated successfully`,
          { id: toastId }
        );
      } else {
        setSubmitting(false);
        const body = await response.json();
        if (body.message) {
          toast.error(body.message, { id: toastId });
        } else {
          toast.error('An unexpected error occurred', {
            id: toastId
          });
        }
      }
      handleCategoryEdit('');
    } catch (error) {
      setSubmitting(false);
      handleCategoryEdit('');
      toast.error('An unexpected error is occured');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mb-8 mt-5 flex max-w-md flex-row gap-2"
      >
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Category Name"
                  type="text"
                  disabled={!isEdit || editId !== category.id}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isEdit || editId !== category.id ? (
          <div className="flex flex-row gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsEdit(true);
                      handleCategoryEdit(category.id);
                    }}
                  >
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DeleteCategoryModal
              category={category}
              handleCategoryRefetch={handleCategoryRefetch}
            />
          </div>
        ) : (
          <div className="flex flex-row gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsEdit(false);
                      handleCategoryEdit('');
                      form.setValue('categoryName', category.name);
                    }}
                    disabled={isSubmitting}
                  >
                    <X />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:text-green-600"
                    disabled={isSubmitting}
                  >
                    <Check />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CategoryItem;
