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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  useAddLanguage,
  useUpdateLanguage,
  useLanguage
} from '@/hooks/settings/use-language';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LangCodes } from '@/config/config';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Please choose a language code')
});

type FormValues = z.infer<typeof formSchema>;

interface LanguageFormProps {
  languageId: string;
  pageTitle: string;
}

export default function LanguageForm({
  languageId,
  pageTitle
}: LanguageFormProps) {
  const { mutate: addLanguage, isPending: isAddPending } = useAddLanguage();
  const { mutate: updateLanguage, isPending: isUpdatePending } =
    useUpdateLanguage(languageId);
  const { data: languageData } = useLanguage(languageId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: ''
    }
  });

  useEffect(() => {
    if (languageData?.data) {
      const language = languageData.data;
      form.reset({
        name: language.name,
        code: language.code
      });
    }
  }, [languageData, form]);

  async function onSubmit(values: FormValues) {
    console.log("languageId ", languageId)

    if (languageId === 'new') {
      addLanguage(values);
    } else {
      updateLanguage(values);
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
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter language name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Code</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city" />
                        </SelectTrigger>
                        <FormControl>
                          <SelectContent>
                            {Object.values(LangCodes).map(code => (
                              <SelectItem key={code} value={code}>
                                {code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </FormControl>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {languageId === 'new' ? 'Create Language' : 'Update Language'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
