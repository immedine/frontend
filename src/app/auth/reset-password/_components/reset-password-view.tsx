'use client';

import { Suspense } from 'react';
import AuthLayout from '../../_components/auth-layout';
import ResetPasswordForm from './reset-password-form';
import { usePathname } from 'next/navigation';

export default function ResetPasswordView() {
  const pathname = usePathname();
  
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter the OTP sent to your email and your new password"
      backButtonLabel="Back to Sign In"
      backButtonHref={`/${pathname.split('/')[1]}/auth/sign-in`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
