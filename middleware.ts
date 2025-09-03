import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  console.log('ACCESS TOKEN:', token);

  // ❌ Nếu không có token mà cố truy cập /account => chuyển về login
  if (!token && pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Nếu có token mà truy cập /login => chuyển về /
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',  // bảo vệ tất cả route /account/*
    '/login',           // dùng để kiểm tra nếu user đã login thì chuyển về /
  ],
};
