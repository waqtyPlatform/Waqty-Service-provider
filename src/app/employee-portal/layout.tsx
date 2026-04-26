'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Calendar, Clock, LogOut, Menu, X } from 'lucide-react';
import { employeeApi } from '@/lib/api';
import { safeJsonParse } from '@/lib/storage';

interface EmployeeUser {
    uuid: string;
    name: string;
    email: string;
    branch?: string;
}

const NAV_ITEMS = [
    { href: '/employee-portal/dashboard', label: 'Dashboard', icon: Home },
    { href: '/employee-portal/shifts', label: 'My Shifts', icon: Calendar },
    { href: '/employee-portal/attendance', label: 'Attendance', icon: Clock },
];

export default function EmployeePortalLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [employee, setEmployee] = useState<EmployeeUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Skip auth check on login page
        if (pathname === '/employee-portal/login') {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('hagzy_employee_token');
        const stored = localStorage.getItem('hagzy_employee_user');

        if (!token) {
            router.push('/employee-portal/login');
            return;
        }

        const parsed = safeJsonParse<EmployeeUser | null>(stored, null);
        if (parsed) {
            setEmployee(parsed);
            setLoading(false);
        }

        // Verify token is still valid
        (async () => {
            try {
                // Temporarily override the token for employee API calls
                const origToken = localStorage.getItem('hagzy_token');
                localStorage.setItem('hagzy_token', token);
                const res = await employeeApi.me();
                if (origToken) localStorage.setItem('hagzy_token', origToken);
                else localStorage.removeItem('hagzy_token');

                if (res.success && res.data) {
                    const emp: EmployeeUser = {
                        uuid: res.data.uuid,
                        name: res.data.name,
                        email: res.data.email,
                        branch: res.data.branch?.name,
                    };
                    setEmployee(emp);
                    localStorage.setItem('hagzy_employee_user', JSON.stringify(emp));
                }
            } catch {
                // Token invalid — redirect to login
                localStorage.removeItem('hagzy_employee_token');
                localStorage.removeItem('hagzy_employee_user');
                router.push('/employee-portal/login');
            } finally {
                setLoading(false);
            }
        })();
    }, [pathname, router]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('hagzy_employee_token');
            if (token) {
                const origToken = localStorage.getItem('hagzy_token');
                localStorage.setItem('hagzy_token', token);
                await employeeApi.logout();
                if (origToken) localStorage.setItem('hagzy_token', origToken);
                else localStorage.removeItem('hagzy_token');
            }
        } catch {
            // Ignore logout errors
        }
        localStorage.removeItem('hagzy_employee_token');
        localStorage.removeItem('hagzy_employee_user');
        router.push('/employee-portal/login');
    };

    // Login page renders without the portal layout
    if (pathname === '/employee-portal/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--bg-secondary)',
                }}
            >
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Loading...</div>
            </div>
        );
    }

    const initials =
        employee?.name
            ?.split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'EP';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            {/* Top Bar */}
            <header
                style={{
                    background: 'var(--bg-primary)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: 'var(--space-3) var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            padding: 4,
                        }}
                        className="md-hide-menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link
                        href="/employee-portal/dashboard"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            fontWeight: 'var(--font-bold)',
                            fontSize: 'var(--text-lg)',
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 'var(--radius-md)',
                                background:
                                    'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                            }}
                        />
                        Employee Portal
                    </Link>
                </div>

                <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    {NAV_ITEMS.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-2) var(--space-3)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
                                    color: active ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                    background: active ? 'var(--color-primary-50)' : 'transparent',
                                    textDecoration: 'none',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <item.icon size={16} />
                                <span className="nav-label-hide-mobile">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'var(--color-primary-500)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            {initials}
                        </div>
                        <div style={{ lineHeight: 1.2 }}>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                {employee?.name}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                                {employee?.branch || 'Employee'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-2)',
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            {/* Mobile nav overlay */}
            {menuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        top: 56,
                        background: 'var(--bg-primary)',
                        zIndex: 30,
                        padding: 'var(--space-4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)',
                    }}
                >
                    {NAV_ITEMS.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: active ? 'var(--font-semibold)' : 'var(--font-normal)',
                                    color: active ? 'var(--color-primary-600)' : 'var(--text-primary)',
                                    background: active ? 'var(--color-primary-50)' : 'transparent',
                                    textDecoration: 'none',
                                }}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Main Content */}
            <main style={{ maxWidth: 960, margin: '0 auto', padding: 'var(--space-6)' }}>{children}</main>
        </div>
    );
}
