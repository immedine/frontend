'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { categoryService } from '@/services/category.service';
import { usePathname, useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  order: z.string().regex(/^(?:[2-9]|\d\d\d*)$/, {
    message: 'Must be a number more than 1'
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryForm({
  categoryId,
  setAdded
}: {
  categoryId: string;
  setAdded: any
}) {
  // const { mutate: addCategory, isPending: isAddPending } = useAddCategory();
  // const { mutate: updateCategory, isPending: isUpdatePending } =
  //   useUpdateCategory(categoryId);
  // const { data: categoryData } = useCategory(categoryId);

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      order: ''
    }
  });

  const fetchCategoryDetails = async () => {
    const res = await categoryService.getCategory(categoryId, pathname.split('/')[1]);
    if (res.data && Object.keys(res.data)) {
      form.reset({
        name: res.data.name,
        order: res.data.order.toString()
      })
    }
  };

  useEffect(() => {
    if (categoryId !== 'new') {
      fetchCategoryDetails();
    }
  }, [form, categoryId]);

  async function onSubmit(values: FormValues) {
    const apiData = {
      name: values.name,
      order: Number(values.order)
    };

    let res;

    if (categoryId === 'new') {
      res = await categoryService.addCategory(apiData, pathname.split('/')[1]);
      if (res) {
        setAdded();
      }
    } else {
      res = await categoryService.updateCategory(categoryId, apiData, pathname.split('/')[1]);
      setAdded();
    }
  }

  // const isPending = isAddPending || isUpdatePending;

  return (
    <Card className="mx-auto w-full border-none shadow-none">
      <CardContent className='p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="mt-0"> */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category order" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className='flex justify-end'>
            <Button type="submit">
              {categoryId === 'new' ? 'Create' : 'Update'}
            </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
