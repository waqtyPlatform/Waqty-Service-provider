'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import {
    Users,
    Star,
    CreditCard,
    Clock,
    Plus,
    Download,
    Upload
} from 'lucide-react';
import styles from './customers.module.css';

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t } = useTranslation();

    const tabItems = [
        { label: t('customers.tabClients'), href: '/customers', icon: <Users size={16} /> },
        { label: t('customers.tabGroups'), href: '/customers/groups', icon: <Star size={16} /> },
        { label: t('customers.tabStatements'), href: '/customers/statements', icon: <CreditCard size={16} /> },
        { label: t('customers.tabVisits'), href: '/customers/last-visits', icon: <Clock size={16} /> },
    ];

    return (
        <div className={styles.customersPage}>
            {/* Sticky Header Wrapper */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{t('sidebar.customers')}</h1>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                            {t('customers.desc')}
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <button className={styles.btnOutline}>
                            <Upload size={16} /> {t('customers.import')}
                        </button>
                        <button className={styles.btnOutline}>
                            <Download size={16} /> {t('customers.export')}
                        </button>
                        <button className={styles.btnPrimary}>
                            <Plus size={16} /> {t('customers.addClient')}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={styles.tabsScrollContainer}>
                    {tabItems.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                            >
                                {tab.icon} {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {children}
        </div>
    );
}
