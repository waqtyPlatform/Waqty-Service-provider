import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Public routes that don't require authentication ──
const PUBLIC_ROUTES = ['/login', '/forgot-password', '/onboarding'];
const PUBLIC_PREFIXES = ['/invite/'];

// ── Role-based access control ──
// Routes restricted to specific roles only
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
    '/settings/security': ['admin'],
    '/settings/roles': ['admin'],
    '/settings/audit-log': ['admin'],
    '/settings/subscription': ['admin'],
    '/settings/integrations': ['admin'],
    '/settings/devices': ['admin'],
    '/employees/permissions': ['admin'],
    '/employees/roles': ['admin', 'manager'],
    '/employees/payroll': ['admin', 'manager'],
    '/employees/commissions': ['admin', 'manager'],
    '/employees/commission-settings': ['admin'],
    '/employees/deductions': ['admin', 'manager'],
    '/transactions/safe-balances': ['admin', 'manager'],
    '/transactions/petty-cash': ['admin', 'manager'],
};

function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname)) return true;
    return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function getRoleFromCookie(request: NextRequest): string | null {
    // Try to get role from the auth cookie
    const authData = request.cookies.get('hagzy_auth')?.value;
    if (authData) {
        try {
            const parsed = JSON.parse(authData);
            return parsed.role || null;
        } catch {
            return null;
        }
    }
    return null;
}

function hasToken(request: NextRequest): boolean {
    // Check cookie first, then fallback header hint
    const authCookie = request.cookies.get('hagzy_auth')?.value;
    if (authCookie) {
        try {
            const parsed = JSON.parse(authCookie);
            return !!parsed.token;
        } catch {
            return false;
        }
    }
    // For localStorage-based auth, we check for a lightweight marker cookie
    // The AuthContext should set this cookie when logging in
    const tokenMarker = request.cookies.get('hagzy_logged_in')?.value;
    return tokenMarker === 'true';
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // static files
    ) {
        return NextResponse.next();
    }

    const isPublic = isPublicRoute(pathname);
    const isAuthenticated = hasToken(request);

    // ── Redirect unauthenticated users to login ──
    if (!isPublic && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Redirect authenticated users away from login/onboarding ──
    if (isPublic && isAuthenticated && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ── Role-based route protection ──
    if (!isPublic && isAuthenticated) {
        const userRole = getRoleFromCookie(request);
        if (userRole) {
            // Check if the current route has role restrictions
            for (const [route, allowedRoles] of Object.entries(ROLE_RESTRICTED_ROUTES)) {
                if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
                    // Redirect unauthorized roles to dashboard with a flag
                    const dashboardUrl = new URL('/', request.url);
                    dashboardUrl.searchParams.set('unauthorized', '1');
                    return NextResponse.redirect(dashboardUrl);
                }
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
