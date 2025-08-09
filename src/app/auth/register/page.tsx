import { Metadata } from 'next';
import Register from './_components/register';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create your account'
};

export default function RegisterPage() {
  return <Register />;
}
