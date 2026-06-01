'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Users, ShoppingBag, Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useTranslation } from '@/hooks/useTranslation';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    matchPrefix?: string;
}

function MobileBottomNavInner() {
    const pathname = usePathname();
    const { setMobileOpen } = useSidebar();
    const { t } = useTranslation();

    const NAV_ITEMS: NavItem[] = [
        { label: t('nav.home'), href: '/', icon: <LayoutDashboard size={20} /> },
        { label: t('nav.bookings'), href: '/bookings', icon: <CalendarDays size={20} />, matchPrefix: '/bookings' },
        { label: t('nav.sales'), href: '/sales', icon: <ShoppingBag size={20} />, matchPrefix: '/sales' },
        { label: t('nav.clients'), href: '/customers', icon: <Users size={20} />, matchPrefix: '/customers' },
    ];

    const isActive = (item: NavItem) => {
        if (item.href === '/') return pathname === '/';
        return pathname.startsWith(item.matchPrefix || item.href);
    };

    return (
        <nav className="mobileBottomNav" aria-label={t('nav.mobileNavigation')}>
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
                aria-label={t('nav.openFullMenu')}
            >
                <Menu size={20} />
                <span>{t('nav.more')}</span>
            </button>
        </nav>
    );
}

const MobileBottomNav = React.memo(MobileBottomNavInner);
export default MobileBottomNav;
