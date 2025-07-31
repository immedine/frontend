import { Metadata } from 'next';
import SignInViewPage from '../../../auth/sign-in/_components/signin-view';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
};

export default function SignInPage() {
  return <SignInViewPage />;
}
