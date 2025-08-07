'use client';

import { Suspense } from 'react';
import AuthLayout from '../../_components/auth-layout';
import ResetPasswordForm from './reset-password-form';
import { usePathname } from 'next/navigation';
import { getPathName } from '@/lib/utils';

export default function ResetPasswordView() {
  const pathname = usePathname();
  
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter the OTP sent to your email and your new password"
      backButtonLabel="Back to Sign In"
      backButtonHref={`${getPathName(pathname, true)}/auth/sign-in`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
