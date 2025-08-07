import { Metadata } from 'next';
import ForgotPasswordView from './_components/forgot-password-view';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password'
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
