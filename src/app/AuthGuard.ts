// "use client";
import { redirect } from 'next/navigation';
import { AUTH_TOKEN } from '@/config/cookie-keys';
import { cookies } from 'next/headers';

export default function AuthGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const storeVal = cookieStore.get(AUTH_TOKEN)?.value;

  if (!storeVal) {
    return redirect('/auth/sign-in');
  } else {
    return children;
  }


}
