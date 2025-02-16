import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLogin = request.cookies.get('isLogin')?.value;
  // const role = request.cookies.get('role')?.value;

  const url = request.nextUrl.clone();

  if (!isLogin) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // if (url.pathname.startsWith('/admin') && userRole !== 'admin') {
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  // if (url.pathname.startsWith('/profile') && !isLoggedIn) {
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)', // Exclude API routes, static files, and login page
  ],
};