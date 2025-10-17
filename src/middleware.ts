/**
 * Next.js Middleware for route protection
 * Handles authentication and authorization for admin routes
 * 
 * Note: Since we use localStorage for auth, client-side protection is handled
 * by the ProtectedRoute component. This middleware is minimal.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Client-side auth check happens in the ProtectedRoute component
  // which has access to localStorage
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
  ],
};
