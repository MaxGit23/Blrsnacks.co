import { NextResponse, type NextRequest } from 'next/server';

/**
 * Route protection middleware.
 * Checks for the presence of the access-token cookie.
 *
 * Protected client routes:  /orders, /checkout, /account
 * Admin routes:             /admin/**
 * Auth routes (redirect if already logged in): /login, /register
 */

const PROTECTED_PATHS = ['/orders', '/checkout', '/account'];
const ADMIN_PATHS = ['/admin'];
const AUTH_PATHS = ['/login', '/register'];

function isPathMatch(pathname: string, paths: string[]): boolean {
    return paths.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasToken = request.cookies.has('access_token');

    // Redirect authenticated users away from auth pages
    if (hasToken && isPathMatch(pathname, AUTH_PATHS)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Protect authenticated routes
    if (!hasToken && isPathMatch(pathname, PROTECTED_PATHS)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Protect admin routes
    if (!hasToken && isPathMatch(pathname, ADMIN_PATHS)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/orders/:path*',
        '/checkout/:path*',
        '/account/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
};
