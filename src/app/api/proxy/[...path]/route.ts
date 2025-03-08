import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://assignment.devotel.io';

/**
 * Handle all HTTP methods through the proxy
 * @param request - The incoming request
 * @param method - The HTTP method to use
 * @param params - The path parameters
 * @returns The response from the API
 */
async function handleRequest(
  request: NextRequest,
  method: string,
  params: { path: string[] }
) {
  try {
    // Construct the target URL
    const path = params.path.join('/');
    const url = new URL(request.url);
    const targetUrl = `${BASE_URL}/api/${path}${url.search}`;
    
    // Get the request body for methods that support it
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = await request.json().catch(() => null);
      } else {
        body = await request.text().catch(() => null);
      }
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    };
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Make the request to the target API
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
    
    // Get the response data
    let data;
    const responseContentType = response.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      data = await response.text().catch(() => '');
    }
    
    // Return the response
    if (typeof data === 'object') {
      return NextResponse.json(data, {
        status: response.status,
      });
    } else {
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': responseContentType,
        },
      });
    }
  } catch (error) {
    console.error(`Proxy error (${method}):`, error);
    return NextResponse.json(
      { error: `Failed to ${method.toLowerCase()} data from API` },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests (CORS preflight)
 */
export async function OPTIONS() {
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

/**
 * Handle GET requests
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Convert params to the expected format
  const pathParams = { path: params.path };
  return handleRequest(request, 'GET', pathParams);
}

/**
 * Handle POST requests
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Convert params to the expected format
  const pathParams = { path: params.path };
  return handleRequest(request, 'POST', pathParams);
}

/**
 * Handle PUT requests
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Convert params to the expected format
  const pathParams = { path: params.path };
  return handleRequest(request, 'PUT', pathParams);
}

/**
 * Handle DELETE requests
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Convert params to the expected format
  const pathParams = { path: params.path };
  return handleRequest(request, 'DELETE', pathParams);
} 