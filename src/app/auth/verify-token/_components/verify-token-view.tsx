'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPathName } from '@/lib/utils';

export default function VerifyTokenView() {
  // const { mutate: requestPasswordReset, isPending } = useForgotPassword();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      if (token) {
        authService.verifyToken(token).then((res) => {
          if (res?.data?.success) {
            router.push(`/auth/reset-password?token=${token}`)
          }
        });
      }
    }

  }, [token]);


  return (
    <div>Verifying...</div>
  );
}
