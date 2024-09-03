import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*'], // Protecting /dashboard and its subpaths
};

export async function middleware(req: NextRequest) {
  const { nextUrl: url, cookies } = req;
  const refreshToken = cookies.get('refreshToken')?.value; // Get the value of the cookie

  // Debugging log for token retrieval
  console.log('Retrieved refresh token:', refreshToken);

  if (!refreshToken) {
    console.log('No refresh token found, redirecting to /signin');
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  try {
    const verifyUrl = new URL('/api/auth/verify', process.env.NEXT_PUBLIC_BASE_URL_LOCAL);
    verifyUrl.searchParams.set('token', refreshToken);
    
    const userResponse = await fetch(verifyUrl.toString());
    console.log('User response:', userResponse);
    
    if (!userResponse.ok) {
      throw new Error('Failed to verify token');
    }
    
    const json = await userResponse.json();
    console.log('User JSON:', json);

    if (!json.user) {
      console.log('User not found, redirecting to /signin');
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Clone the request and set a new header with the user information
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-info', JSON.stringify(json.user));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}