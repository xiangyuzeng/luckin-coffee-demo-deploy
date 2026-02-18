'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import { menuFormSchema } from '@/lib/validation/menuFormSchema';

type formType = z.infer<typeof menuFormSchema>;

interface MenuCreateProps {
  handleMenuRefetch: () => void;
  categoryList: Category[];
}

const MenuCreate = ({
  handleMenuRefetch,
  categoryList
}: MenuCreateProps) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);

  const form = useForm<formType>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      menuName: '',
      menuDescription: '',
      menuImage: [],
      menuCategory: [],
      menuPrice: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'menuImage'
  });

  useEffect(() => {
    if (fields.length >= 3) {
      setIsButtonDisable(true);
    }
    if (fields.length < 3) {
      setIsButtonDisable(false);
    }
  }, [fields.length]);

  const handleImgAddClick = () => {
    if (fields.length < 3) {
      append({ url: '' });
    }
  };

  const handleImgRemoveClick = (index: number) => {
    if (fields.length > 0) {
      remove(index);
    }
  };

  useEffect(() => {
    form.reset({
      menuName: '',
      menuDescription: '',
      menuImage: [],
      menuCategory: [],
      menuPrice: ''
    });
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit = async (data: z.infer<typeof menuFormSchema>) => {
    try {
      setSubmitting(true);

      const response = await fetch('/api/menu/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuName: data.menuName,
          menuDescription: data.menuDescription,
          menuImage: data.menuImage,
          menuCategory: data.menuCategory,
          menuPrice: data.menuPrice
        })
      });

      if (response.ok) {
        setSubmitting(false);
        handleMenuRefetch();
        toast.success(
          `Menu: ${data.menuName} has been created successfully`
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
          name="menuName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
        <FormField
          control={form.control}
          name="menuDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Menu description"
                  className="resize-none"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="menuImage"
          render={() => (
            <FormItem>
              <div className="mb-4 flex flex-row justify-between">
                <div>
                  <FormLabel className="mb-4 text-base">
                    Image URL
                  </FormLabel>
                  <FormDescription>
                    Maximum 3 URLs can be add
                  </FormDescription>
                </div>
                <Button
                  type="button"
                  size="icon"
                  onClick={handleImgAddClick}
                  disabled={isButtonDisable}
                >
                  <PlusCircle />
                </Button>
              </div>
              {fields.map((image, index) => (
                <FormField
                  key={image.id}
                  control={form.control}
                  name={`menuImage.${index}.url`}
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={image.id}
                        className="flex flex-col items-stretch space-x-3 space-y-0"
                      >
                        <div className="flex flex-grow flex-row gap-4">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/image1.jpg"
                              type="text"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            size="icon"
                            onClick={() =>
                              handleImgRemoveClick(index)
                            }
                          >
                            <MinusCircle />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="menuCategory"
          render={() => (
            <FormItem>
              <FormLabel className="mb-4 text-base">
                Category
              </FormLabel>
              <div className="grid grid-cols-3 gap-3">
                {categoryList.map((category) => (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name="menuCategory"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              disabled={isSubmitting}
                              checked={field.value?.includes(
                                category.id
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      category.id
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) =>
                                          value !== category.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="menuPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (€)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="0.99"
                  type="number"
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

export default MenuCreate;
