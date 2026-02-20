'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

const tabItems = [
    { label: 'Clients', href: '/customers', icon: <Users size={16} /> },
    { label: 'Client Groups', href: '/customers/groups', icon: <Star size={16} /> },
    { label: 'Account Statements', href: '/customers/statements', icon: <CreditCard size={16} /> },
    { label: 'Last Visits', href: '/customers/last-visits', icon: <Clock size={16} /> },
];

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className={styles.customersPage}>
            {/* Sticky Header Wrapper */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Customers</h1>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                            Manage your client database and relationships.
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        <button className={styles.btnOutline}>
                            <Upload size={16} /> Import
                        </button>
                        <button className={styles.btnOutline}>
                            <Download size={16} /> Export
                        </button>
                        <button className={styles.btnPrimary}>
                            <Plus size={16} /> Add Client
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
