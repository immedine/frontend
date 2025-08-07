import { Metadata } from 'next';
import ResetPasswordView from './_components/reset-password-view';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password'
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
