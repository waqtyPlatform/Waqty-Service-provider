import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Public routes that don't require authentication ──
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/onboarding', '/employee-portal/login'];
const PUBLIC_PREFIXES = ['/invite/', '/employee-portal/'];

// NOTE: role-based access control is enforced client-side by `<RoleGuard>` in AppShell.
// The middleware only checks authentication state. Role checks here would rely on a
// client-set cookie (forgeable), so they are intentionally not performed at the edge.
// Real role enforcement must be done by the backend API — see README "Security notes".

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname)) return true;
    return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function hasToken(request: NextRequest): boolean {
    // The AuthContext sets `hagzy_logged_in=true` on login. This is a non-sensitive
    // marker used only to gate route access at the edge; the real Bearer token
    // lives in localStorage and is attached by the API client per-request.
    const tokenMarker = request.cookies.get('hagzy_logged_in')?.value;
    return tokenMarker === 'true';
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // static files
    ) {
        return NextResponse.next();
    }

    const isPublic = isPublicRoute(pathname);
    const isAuthenticated = hasToken(request);

    if (!isPublic && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isPublic && isAuthenticated && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
