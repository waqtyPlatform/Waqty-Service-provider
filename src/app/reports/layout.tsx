'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, DollarSign, CalendarDays, Users, Star, Package, Activity, Download } from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './reports.module.css';

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t, lang } = useTranslation();

    const tabItems = [
        { label: t('reports.tabOverview'), href: '/reports', icon: <BarChart3 size={16} /> },
        { label: t('reports.tabRevenue'), href: '/reports/revenue', icon: <DollarSign size={16} /> },
        { label: t('reports.tabBookings'), href: '/reports/bookings', icon: <CalendarDays size={16} /> },
        { label: t('reports.tabClients'), href: '/reports/clients', icon: <Users size={16} /> },
        { label: t('reports.tabEmployees'), href: '/reports/employees', icon: <Star size={16} /> },
        { label: t('reports.tabServices'), href: '/reports/services', icon: <Package size={16} /> },
        { label: t('reports.tabCustom'), href: '/reports/custom', icon: <Activity size={16} /> },
    ];

    return (
        <div className={styles.container} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Sticky Header Wrapper */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>{t('reports.title')}</h1>
                        <div className={styles.subtitle}>{t('reports.subtitle')}</div>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline">
                            <Download size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('reports.exportBtn')}
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={styles.tabsScrollContainer}>
                    {tabItems.map(t => {
                        const isActive = pathname === t.href;
                        return (
                            <Link
                                key={t.href}
                                href={t.href}
                                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                            >
                                {t.icon} {t.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {children}
        </div>
    );
}
