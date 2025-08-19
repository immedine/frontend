"use client";
// import { Metadata } from 'next';
import SignInViewPage from './_components/signin-view';
import { SessionProvider } from 'next-auth/react';


// export const metadata: Metadata = {
//   title: 'Sign In',
//   description: 'Sign in to your account'
// };

export default function SignInPage() {
  return <SessionProvider><SignInViewPage /></SessionProvider>;
}
