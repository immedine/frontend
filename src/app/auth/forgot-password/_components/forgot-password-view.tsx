'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import AuthLayout from '../../_components/auth-layout';
import { useForgotPassword } from '@/hooks/auth/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { authService } from '@/services/auth.service';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getPathName } from '@/lib/utils';

const formSchema = z.object({
  email: z.string().email('Invalid email address')
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordView() {
  // const { mutate: requestPasswordReset, isPending } = useForgotPassword();
  const router = useRouter();
  const [isPending, setPending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });
  const pathname = usePathname();

  const onSubmit =  async (values: FormValues) => {
    setPending(true);
    await authService.requestPasswordReset(values, getPathName(pathname));
    setPending(false);
    // if (res) {
    //   router.push(`${getPathName(pathname, true)}/auth/reset-password?email=${values.email}`);
    // }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email and we'll send you a reset link"
      backButtonLabel="Back to Sign In"
      backButtonHref={`${getPathName(pathname,true)}/auth/sign-in`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Verification Link
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
