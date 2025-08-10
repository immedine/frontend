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
import { getPathName } from '@/lib/utils';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Mobile number must be at least 10 digits'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileEditForm() {
  const pathname = usePathname();
  const user = getAuthUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.personalInfo.fullName || '',
      email: user?.personalInfo.email || '',
      phoneNumber: user?.personalInfo.phone?.number || '',
    }
  });

  const onSubmit = async (values: FormValues) => {
    // const formData = new FormData();
    // formData.append('fullName', values.fullName);
    // formData.append('email', values.email);
    const res = await profileService.updateProfile({
      fullName: values.fullName,
      email: values.email,
      phone: {
        number: values.phoneNumber
      }
    }, getPathName(pathname));
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
             <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <Button type="submit">
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
