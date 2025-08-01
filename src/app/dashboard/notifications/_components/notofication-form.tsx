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
import { Textarea } from '@/components/ui/textarea';
import { useSendNotification } from '@/hooks/notification/use-notification';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Type for the form data
export type Notification = {
  message: string;
  title: string;
  notificationType: string;
  redirectionId: string;
};

const formSchema = z.object({
  notificationType: z.string().min(1, 'Notification type is required'),
  message: z.string().min(1, 'Message is required'),
  title: z.string().min(1, 'Title is required'),
  redirectionId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Sample data - replace with API data later
const SAMPLE_CONFIG: Notification = {
  notificationType: '',
  message: '',
  title: '',
  redirectionId: ''
};

export default function NotificationForm() {
  const { mutate: sendNotification } = useSendNotification(); 
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: SAMPLE_CONFIG
  });

  async function onSubmit(values: FormValues) {
    console.log(values);

    await sendNotification({
      title: values.title,
      message: values.message,
      notificationType: values.notificationType,
      redirectionId: values.redirectionId
    });

    form.reset({
      title: '',
      message: '',
      notificationType: undefined,
      redirectionId: ''

    }); // Reset the form after submission
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Send Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="notificationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Type</FormLabel>
                      <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="STORY">Story</SelectItem>
                        <SelectItem value="ROUTE">Route</SelectItem>
                      </SelectContent>
                    </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="redirectionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirection Id</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter redirection Id"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                      <Textarea
                          placeholder="Enter message"
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='text-right'>
              <Button type="submit">Send</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
