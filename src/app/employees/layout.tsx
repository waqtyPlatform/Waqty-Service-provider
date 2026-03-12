'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    Calendar,
    BarChart3,
    Clock,
    Target,
    Briefcase,
    UserCog,
    Plus,
    Award,
    Wallet,
    Building2,
    ClipboardCheck,
    Layers,
    ScanLine,
    Settings,
    ArrowLeftRight,
    Fingerprint,
    BadgeCheck,
    Cog
} from 'lucide-react';
import styles from './employees.module.css';
import { useTranslation } from '@/hooks/useTranslation';

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { t, lang } = useTranslation();

    const tabItems = [
        { label: t('empLayout.tabStaff'), href: '/employees', icon: <Users size={16} /> },
        { label: t('empLayout.tabDepartments'), href: '/employees/departments', icon: <Building2 size={16} /> },
        { label: t('empLayout.tabSchedule'), href: '/employees/schedule', icon: <Calendar size={16} /> },
        { label: t('empLayout.tabAttendance'), href: '/employees/attendance', icon: <ClipboardCheck size={16} /> },
        { label: t('empLayout.tabPerformance'), href: '/employees/performance', icon: <BarChart3 size={16} /> },
        { label: t('empLayout.tabPayroll'), href: '/employees/payroll', icon: <Wallet size={16} /> },
        { label: t('empLayout.tabRoles'), href: '/employees/roles', icon: <Briefcase size={16} /> },
        { label: t('empLayout.tabTransfers'), href: '/employees/transfers', icon: <ArrowLeftRight size={16} /> },
    ];

    const isTabPage = tabItems.some(tab => pathname === tab.href);
    const showHeaderContent = pathname === '/employees';
    const showStickyHeader = showHeaderContent || isTabPage;

    return (
        <div className={styles.page} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Sticky Header Wrapper */}
            {showStickyHeader && (
                <div className={styles.stickyHeader}>
                    {showHeaderContent && (
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>{t('empLayout.title')}</h1>
                                <p className={styles.subtitle}>{t('empLayout.subtitle')}</p>
                            </div>
                            <button className={styles.btnAdd} onClick={() => window.dispatchEvent(new Event('openAddEmployee'))}>
                                <Plus size={16} /> {t('empLayout.addEmployee')}
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    {isTabPage && (
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
                    )}
                </div>
            )}

            {children}
        </div>
    );
}
