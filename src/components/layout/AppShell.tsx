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
import styles from './AppShell.module.css';

import { usePathname } from 'next/navigation';

// Lazy-load CommandPalette — only rendered on Ctrl+K, not needed at initial paint
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });

function AppContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();
    const pathname = usePathname();

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
            <Sidebar />
            <TopBar />
            <CommandPalette />
            <main className={styles.main}>
                <div className={styles.content}>{children}</div>
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
