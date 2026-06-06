'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { ToastProvider } from '@/components/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import MobileBottomNav from './MobileBottomNav';
import { OfflineBanner } from '@/components/OfflineBanner';
import { RoleGuard } from '@/components/RoleGuard';
import styles from './AppShell.module.css';
import { useTranslation } from '@/hooks/useTranslation';

import { usePathname } from 'next/navigation';

// Lazy-load CommandPalette — only rendered on Ctrl+K, not needed at initial paint
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });

function AppContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();
    const pathname = usePathname();
    const { t } = useTranslation();

    const isPublicRoute =
        pathname === '/login' ||
        pathname === '/onboarding' ||
        pathname === '/forgot-password' ||
        pathname?.startsWith('/invite/');

    if (isPublicRoute) {
        return <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>{children}</div>;
    }

    return (
        <div className={`${styles.layout} ${collapsed ? styles.sidebarCollapsed : ''}`}>
            <a href="#main-content" className={styles.skipLink}>
                {t('common.skipToContent')}
            </a>
            <Sidebar />
            <TopBar />
            <CommandPalette />
            <main id="main-content" className={styles.main}>
                <div className={styles.content}>
                    <RoleGuard>{children}</RoleGuard>
                </div>
            </main>
            <MobileBottomNav />
        </div>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ToastProvider>
                <ErrorBoundary>
                    <AppContent>{children}</AppContent>
                    <OfflineBanner />
                </ErrorBoundary>
            </ToastProvider>
        </SidebarProvider>
    );
}
