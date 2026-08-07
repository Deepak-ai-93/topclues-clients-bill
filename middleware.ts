import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

interface SessionData {
  userId: string;
  email: string;
  role: 'admin' | 'client';
}

/**
 * Reads and VERIFIES the signed session cookie. A forged or tampered cookie
 * (e.g. someone hand-crafting `{"role":"admin"}`) fails the HMAC check and is
 * treated as no session — so the admin console stays locked at the edge.
 */
async function readSession(request: NextRequest): Promise<SessionData | null> {
  try {
    const cookie = request.cookies.get('client_portal_session');
    if (!cookie?.value) return null;
    const data = (await verifySession(cookie.value)) as SessionData | null;
    if (!data?.userId || !data?.role) return null;
    return data;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

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
