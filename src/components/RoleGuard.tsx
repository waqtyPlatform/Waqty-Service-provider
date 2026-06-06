'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, type UserRole } from '@/contexts/AuthContext';

const ROLE_RESTRICTED_ROUTES: Record<string, UserRole[]> = {
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

function findRestrictedMatch(pathname: string): UserRole[] | null {
    for (const [route, roles] of Object.entries(ROLE_RESTRICTED_ROUTES)) {
        if (pathname === route || pathname.startsWith(`${route}/`)) {
            return roles;
        }
    }
    return null;
}

// Exported so navigation (sidebar + command palette) can hide links the guard
// would bounce — keeping nav visibility and route protection in sync from one
// source of truth instead of re-encoding role rules in the sidebar.
export function isRouteAllowedForRole(route: string, role: UserRole): boolean {
    const required = findRestrictedMatch(route);
    return !required || required.includes(role);
}

export function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Synchronously detect an unauthorized state so we never render restricted
    // page content before the redirect fires (avoids flash of restricted UI).
    const required = pathname ? findRestrictedMatch(pathname) : null;
    const isUnauthorized = Boolean(!loading && user && required && !required.includes(user.role));

    useEffect(() => {
        if (isUnauthorized) {
            router.replace('/?unauthorized=1');
        }
    }, [isUnauthorized, router]);

    if (isUnauthorized) {
        return null;
    }

    return <>{children}</>;
}
