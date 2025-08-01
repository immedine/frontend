'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useAddCategory,
  useUpdateCategory,
  useCategory
} from '@/hooks/settings/use-category';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

const CATEGORY_TYPE_MAP = {
  story: 2,
  route: 3
} as const;

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  colorCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Must be a valid hex color code'
  }),
  type: z.enum(['story', 'route'])
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryForm({
  categoryId,
  pageTitle
}: {
  categoryId: string;
  pageTitle: string;
}) {
  const { mutate: addCategory, isPending: isAddPending } = useAddCategory();
  const { mutate: updateCategory, isPending: isUpdatePending } =
    useUpdateCategory(categoryId);
  const { data: categoryData } = useCategory(categoryId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      colorCode: '#000000',
      type: 'story'
    }
  });

  useEffect(() => {
    if (categoryId !== 'new' && categoryData?.data) {
      const category = categoryData.data;
      const typeMap = {
        2: 'story',
        3: 'route'
      } as const;
      form.reset({
        name: category.name,
        colorCode: category.colorCode,
        type: typeMap[category.categoryType as 1 | 2 | 3]
      });
    }
  }, [categoryData, form, categoryId]);

  async function onSubmit(values: FormValues) {
    const apiData = {
      name: values.name,
      colorCode: values.colorCode,
      categoryType: CATEGORY_TYPE_MAP[values.type]
    };

    if (categoryId === 'new') {
      addCategory(apiData);
    } else {
      updateCategory(apiData);
    }
  }

  const isPending = isAddPending || isUpdatePending;

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" className="w-12" {...field} />
                        <Input
                          placeholder="#000000"
                          {...field}
                          className="flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="route">Route</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {categoryId === 'new' ? 'Create Category' : 'Update Category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
