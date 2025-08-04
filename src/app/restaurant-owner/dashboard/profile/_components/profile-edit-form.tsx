'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuthUser } from '@/lib/auth';
import { profileService } from '@/services/profile.service';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { AUTH_TOKEN } from '@/config/cookie-keys';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address')
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileEditForm() {
  const pathname = usePathname();
  const user = getAuthUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.personalInfo.firstName || '',
      lastName: user?.personalInfo.lastName || '',
      email: user?.personalInfo.email || '',
    }
  });

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    const res = await profileService.updateProfile(formData, pathname.split('/')[1]);
    if (res.data) {
      toast.success("Profile updated successfully!");
      const token = Cookies.get(AUTH_TOKEN);
      if (token) {
        const updateToken = JSON.parse(token);
        Cookies.set(AUTH_TOKEN, JSON.stringify({
          accessToken: updateToken.accessToken,
          user: {
            personalInfo: res.data.personalInfo,
            _id: res.data._id,
            restaurantId: res.data.restaurantRef
          }
        }));
        window.location.reload();
      }
      
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
