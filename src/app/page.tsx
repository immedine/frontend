
import { cookies } from 'next/headers';
import { AUTH_TOKEN } from '@/config/cookie-keys';
import { redirect } from 'next/navigation';


export default function Home() {
  const cookieStore = cookies();
  const storeVal = cookieStore.get(AUTH_TOKEN)?.value;

  redirect('/index.html')
  // if (storeVal) {
  //   return redirect('/restaurant-owner/dashboard/overview');
  // } else {
  //   return redirect('/restaurant-owner/auth/sign-in');
  // }
  
}
