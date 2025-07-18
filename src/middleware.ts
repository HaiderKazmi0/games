import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected paths that require authentication
  const isProtectedPath = path.startsWith('/profile') || 
                         path.startsWith('/dashboard');

  // Skip middleware for static files and public content
  if (path.startsWith('/_next') || 
      path.startsWith('/static') || 
      path.startsWith('/api') ||
      path.includes('game') ||
      path.includes('title') ||
      path.includes('description') ||
      path === '/best-games') {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // If trying to access protected path without token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access auth pages, redirect to home
  if ((path === '/login' || path === '/signup') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/best-games'
  ],
}; 