// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { AUTH_TOKEN } from './config/cookie-keys';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_TOKEN);

  // If there's no auth token and the user is trying to access an admin route
  // if (!authToken && request.nextUrl.pathname.startsWith('/admin')) {
  //   // Redirect to the sign-in page
  //   return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  // }

  // For all other cases, continue to the next middleware or to the final handler
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes starting with /admin
    // '/admin/:path*',
    // Optionally, you can add more routes here that should be protected
    // '/api/:path*',
  ]
};
