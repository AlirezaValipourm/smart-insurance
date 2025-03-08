import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle CORS for all routes
 * This ensures that all responses have the appropriate CORS headers
 */
export function middleware(request: NextRequest) {
  // Get the response for the request
  const response = NextResponse.next();
  
  // Add CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  return response;
}

/**
 * Configure which routes the middleware applies to
 */
export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
  ],
}; 