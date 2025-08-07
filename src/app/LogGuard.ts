// "use client";
import { redirect } from 'next/navigation';
import { AUTH_TOKEN } from '@/config/cookie-keys';
import { cookies } from 'next/headers';

export default function LogGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const storeVal = cookieStore.get(AUTH_TOKEN)?.value;

  if (storeVal) {
    return redirect('/dashboard');
  } else {
    return children;
  }


}
