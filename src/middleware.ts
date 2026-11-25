import { NextResponse, type NextRequest } from 'next/server';

/**
 * Sends signed-out visitors of protected areas to sign-in, remembering the exact page they asked
 * for so they land back on it. This only checks that a session cookie exists; the account and admin
 * layouts still verify it (and the role) on the server.
 */
export function middleware(req: NextRequest) {
  if (req.cookies.has('__session')) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/account/:path*', '/admin/:path*'] };
