'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Menu,
    Plus,
    X,
    CalendarPlus,
    UserPlus,
    ShoppingBag,
    Wallet,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useTranslation } from '@/hooks/useTranslation';

function MobileBottomNavInner() {
    const pathname = usePathname();
    const router = useRouter();
    const { setMobileOpen } = useSidebar();
    const { t } = useTranslation();
    const [sheetOpen, setSheetOpen] = useState(false);

    const homeActive = pathname === '/';
    const bookingsActive = pathname.startsWith('/bookings');
    const clientsActive = pathname.startsWith('/customers');

    const go = useCallback(
        (href: string) => {
            setSheetOpen(false);
            router.push(href);
        },
        [router]
    );

    // The handful of things a front-desk user does all shift — the mobile twin
    // of the command palette's Actions section.
    const actions = [
        { label: t('cmd.newBooking'), href: '/bookings/new', icon: <CalendarPlus size={20} /> },
        { label: t('cmd.addClient'), href: '/customers', icon: <UserPlus size={20} /> },
        { label: t('cmd.newSale'), href: '/sales', icon: <ShoppingBag size={20} /> },
        { label: t('cmd.recordExpense'), href: '/expenses', icon: <Wallet size={20} /> },
    ];

    const sheetZ = 'var(--z-modal)' as React.CSSProperties['zIndex'];

    return (
        <>
            {/* Quick-action bottom sheet */}
            {sheetOpen && (
                <>
                    <div
                        onClick={() => setSheetOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'var(--bg-overlay)',
                            zIndex: sheetZ,
                            animation: 'fadeIn 150ms ease',
                        }}
                    />
                    <div
                        role="dialog"
                        aria-label={t('nav.quickActions')}
                        style={{
                            position: 'fixed',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: sheetZ,
                            background: 'var(--bg-primary)',
                            borderTopLeftRadius: 'var(--radius-2xl)',
                            borderTopRightRadius: 'var(--radius-2xl)',
                            boxShadow: 'var(--shadow-xl)',
                            padding: 'var(--space-4) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom))',
                            animation: 'slideInUp 200ms ease both',
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 4,
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--border-strong)',
                                margin: '0 auto var(--space-4)',
                            }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 'var(--space-3)',
                            }}
                        >
                            <span
                                style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}
                            >
                                {t('nav.quickActions')}
                            </span>
                            <button
                                onClick={() => setSheetOpen(false)}
                                aria-label={t('nav.closeMenu')}
                                style={{ color: 'var(--text-tertiary)', display: 'inline-flex' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            {actions.map(a => (
                                <button
                                    key={a.label}
                                    onClick={() => go(a.href)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textAlign: 'start',
                                    }}
                                >
                                    <span style={{ color: 'var(--color-primary-600)', display: 'inline-flex' }}>
                                        {a.icon}
                                    </span>
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <nav className="mobileBottomNav" aria-label={t('nav.mobileNavigation')}>
                <Link href="/" className={homeActive ? 'active' : ''}>
                    <LayoutDashboard size={20} />
                    <span>{t('nav.home')}</span>
                </Link>
                <Link href="/bookings" className={bookingsActive ? 'active' : ''}>
                    <CalendarDays size={20} />
                    <span>{t('nav.bookings')}</span>
                </Link>

                {/* Center action FAB */}
                <button
                    onClick={() => setSheetOpen(true)}
                    aria-label={t('nav.quickActions')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 52,
                        height: 52,
                        minWidth: 52,
                        marginTop: -22,
                        padding: 0,
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-primary-500)',
                        color: '#fff',
                        border: '4px solid var(--bg-primary)',
                        boxShadow: 'var(--shadow-primary)',
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                >
                    <Plus size={24} />
                </button>

                <Link href="/customers" className={clientsActive ? 'active' : ''}>
                    <Users size={20} />
                    <span>{t('nav.clients')}</span>
                </Link>
                <button onClick={() => setMobileOpen(true)} aria-label={t('nav.openFullMenu')}>
                    <Menu size={20} />
                    <span>{t('nav.more')}</span>
                </button>
            </nav>
        </>
    );
}

const MobileBottomNav = React.memo(MobileBottomNavInner);
export default MobileBottomNav;
