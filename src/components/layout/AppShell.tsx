'use client';

import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { SidebarProvider, useSidebar } from './SidebarContext';
import { ToastProvider } from '@/components/ui';
import styles from './AppShell.module.css';

import { usePathname } from 'next/navigation';

function AppContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();
    const pathname = usePathname();

    const isPublicRoute = pathname === '/login' || pathname === '/onboarding' || pathname === '/forgot-password' || pathname?.startsWith('/invite/');

    if (isPublicRoute) {
        return <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>{children}</div>;
    }

    return (
        <div className={`${styles.layout} ${collapsed ? styles.sidebarCollapsed : ''}`}>
            <Sidebar />
            <TopBar />
            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ToastProvider>
                <AppContent>{children}</AppContent>
            </ToastProvider>
        </SidebarProvider>
    );
}
