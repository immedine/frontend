import { Metadata } from 'next';
import SignInViewPage from './_components/signin-view';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
};

export default function SignInPage() {
  return <SignInViewPage />;
}
