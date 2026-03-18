'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Users, ShoppingBag, Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    matchPrefix?: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Bookings', href: '/bookings', icon: <CalendarDays size={20} />, matchPrefix: '/bookings' },
    { label: 'Sales', href: '/sales', icon: <ShoppingBag size={20} />, matchPrefix: '/sales' },
    { label: 'Clients', href: '/customers', icon: <Users size={20} />, matchPrefix: '/customers' },
];

function MobileBottomNavInner() {
    const pathname = usePathname();
    const { setMobileOpen } = useSidebar();

    const isActive = (item: NavItem) => {
        if (item.href === '/') return pathname === '/';
        return pathname.startsWith(item.matchPrefix || item.href);
    };

    return (
        <nav className="mobileBottomNav" aria-label="Mobile navigation">
            {NAV_ITEMS.map(item => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={isActive(item) ? 'active' : ''}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        padding: 'var(--space-1)',
                        borderRadius: 'var(--radius-md)',
                        color: isActive(item) ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                        textDecoration: 'none',
                        fontSize: '10px',
                        fontWeight: 500,
                        minWidth: '56px',
                        transition: 'color 150ms ease',
                    }}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </Link>
            ))}
            {/* More — opens sidebar */}
            <button
                onClick={() => setMobileOpen(true)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    padding: 'var(--space-1)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-tertiary)',
                    fontSize: '10px',
                    fontWeight: 500,
                    minWidth: '56px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}
                aria-label="Open full menu"
            >
                <Menu size={20} />
                <span>More</span>
            </button>
        </nav>
    );
}

const MobileBottomNav = React.memo(MobileBottomNavInner);
export default MobileBottomNav;
