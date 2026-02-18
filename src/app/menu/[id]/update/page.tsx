'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { ExtendedMenu } from '@/types/menu';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type MenuProps = {
  menuItem: ExtendedMenu;
};

type ListCategoryProps = {
  categoryList: Category[];
};

type formType = z.infer<typeof menuFormSchema>;

const MenuEdit = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [isSubmitting, setSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItem, setMenuItem] = useState<ExtendedMenu>();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
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

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: ListCategoryProps = await response.json();
        setCategoryList(data.categoryList);
      } else {
        setIsError(true);
        setIsLoading(false);
        toast.error('An unexpected error occurred');
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      toast.error('An unexpected error is occured');
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menu/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });

      if (response.ok) {
        const data: MenuProps = await response.json();
        setMenuItem(data.menuItem);
        setIsLoading(false);
      } else {
        setIsError(true);
        setIsLoading(false);
        toast.error('An unexpected error occurred');
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      toast.error('An unexpected error is occured');
    }
  };

  useEffect(() => {
    fetchCategory();
    if (!isError) {
      fetchMenu();
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      form.setValue('menuName', menuItem!.name);
      form.setValue('menuDescription', menuItem!.description);
      form.setValue('menuImage', menuItem!.images);
      form.setValue('menuCategory', menuItem!.categoryIDs);
      form.setValue('menuPrice', menuItem!.price.toString());
    }
  }, [isLoading]);

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
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        menuName: '',
        menuDescription: '',
        menuImage: [],
        menuCategory: [],
        menuPrice: ''
      });
    }
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit = async (data: z.infer<typeof menuFormSchema>) => {
    try {
      setSubmitting(true);

      const response = await fetch(`/api/menu/${params.id}/update`, {
        method: 'PUT',
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
        router.push(`/user/${session?.user.id}/admin`);
        toast.success(
          `Menu: ${data.menuName} has been updated successfully`
        );
      } else {
        setSubmitting(false);
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
      setSubmitting(false);
      toast.error('An unexpected error is occured');
    }
  };

  if (status === 'unauthenticated') {
    return router.push('/login');
  }

  if (status === 'loading') {
    return <Loading />;
  }

  if (session?.user.role !== 'ADMIN') {
    return (
      <p className="text-base opacity-50">
        You do not have <b>ADMIN</b> permission do view this page
      </p>
    );
  }

  return (
    <div className="w-[320px]">
      <h1 className="text-top my-5 text-4xl font-bold">Update</h1>
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
          <div className="flex flex-row justify-between gap-1">
            <Link
              href={`/user/${session.user.id}/admin`}
              className={cn(
                buttonVariants({
                  variant: 'default'
                }),
                'flex w-28 gap-1 text-right'
              )}
            >
              Cancel
            </Link>
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
        </form>
      </Form>
    </div>
  );
};

export default MenuEdit;
