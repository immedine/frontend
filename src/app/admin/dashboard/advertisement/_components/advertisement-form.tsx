'use client';

import { FileUploader } from '@/components/file-uploader';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Advertisement } from './advertisement-tables/columns';

const MAX_FILE_SIZE = 5000000;

const AVAILABLE_LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'French' },
  { id: 'jp', name: 'Japanese' },
  { id: 'ar', name: 'Arabic' }
];

const formSchema = z.object({
  type: z.enum(['audio', 'image', 'video']),
  media: z
    .any()
    .refine((files) => files?.length == 1, 'Media file is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    ),
  languageRef: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AdvertisementForm({
  initialData,
  pageTitle
}: {
  initialData: Advertisement | null;
  pageTitle: string;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || 'image',
      languageRef: initialData?.languageRef
    }
  });

  const watchType = form.watch('type');

  async function onSubmit(values: FormValues) {
    console.log(values);
    // Add API integration here
  }

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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advertisement Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === 'audio' && (
                <FormField
                  control={form.control}
                  name="languageRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AVAILABLE_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Media</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={MAX_FILE_SIZE}
                        // accept={
                        //   watchType === 'image'
                        //     ? 'image/*'
                        //     : watchType === 'video'
                        //     ? 'video/*'
                        //     : 'audio/*'
                        // }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">
              {initialData ? 'Update Advertisement' : 'Create Advertisement'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
