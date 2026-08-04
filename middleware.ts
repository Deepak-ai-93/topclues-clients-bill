import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SessionData {
  userId: string;
  email: string;
  role: 'admin' | 'client';
}

function readSession(request: NextRequest): SessionData | null {
  try {
    const cookie = request.cookies.get('client_portal_session');
    if (!cookie?.value) return null;
    const json = atob(cookie.value);
    const data = JSON.parse(json) as SessionData;
    if (!data?.userId || !data?.role) return null;
    return data;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSession(request);

  // Client portal: requires a 'client' session (login page is public)
  if (pathname.startsWith('/client') && !pathname.startsWith('/client/login')) {
    if (!session || session.role !== 'client') {
      const loginUrl = new URL('/client/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin console: requires an 'admin' session (login page is public)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!session || session.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role mismatch: a client visiting /admin (or vice versa) -> own portal
  if (session) {
    if (pathname.startsWith('/client') && session.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (pathname.startsWith('/admin') && session.role === 'client') {
      return NextResponse.redirect(new URL('/client', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/client/:path*', '/admin/:path*'],
};
