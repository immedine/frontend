'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPathName } from '@/lib/utils';
import { toast } from 'sonner';

export default function VerifyTokenView() {
  // const { mutate: requestPasswordReset, isPending } = useForgotPassword();
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  useEffect(() => {
    if (token) {
      if (token) {
        if (type === 'reset') {
          authService.verifyToken(token).then((res) => {
            if (res?.data?.success) {
              router.push(`${getPathName(pathname, true)}/auth/reset-password?token=${token}`);
            }
          });
        } else if (type === 'register') {
          authService.verifyRegistrationToken(token).then((res) => {
            if (res?.data?.success) {
              toast.success('Account verified successfully!');
              router.push(`${getPathName(pathname, true)}/auth/sign-in`);
            }
          });
        }

      }
    }

  }, [token]);


  return (
    <div>Verifying...</div>
  );
}
