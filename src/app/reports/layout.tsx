'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    DollarSign,
    CalendarDays,
    Users,
    Star,
    Package,
    FileText,
    Activity,
    Download,
    Filter
} from 'lucide-react';
import { Button, Select } from '@/components/ui';
import styles from './reports.module.css';

const tabItems = [
    { label: 'Overview', href: '/reports', icon: <BarChart3 size={16} /> },
    { label: 'Revenue', href: '/reports/revenue', icon: <DollarSign size={16} /> },
    { label: 'Bookings', href: '/reports/bookings', icon: <CalendarDays size={16} /> },
    { label: 'Clients', href: '/reports/clients', icon: <Users size={16} /> },
    { label: 'Employees', href: '/reports/employees', icon: <Star size={16} /> },
    { label: 'Services', href: '/reports/services', icon: <Package size={16} /> },
    { label: 'Custom', href: '/reports/custom', icon: <Activity size={16} /> },
];

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className={styles.container}>
            {/* Sticky Header Wrapper */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>Reports</h1>
                        <div className={styles.subtitle}>
                            Analyze business performance and trends.
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <Button variant="outline"><Download size={16} /> Export Report</Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={styles.tabsScrollContainer}>
                    {tabItems.map((t) => {
                        const isActive = pathname === t.href;
                        return (
                            <Link
                                key={t.href}
                                href={t.href}
                                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                            >
                                {t.icon} {t.label}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {children}
        </div>
    );
}
