'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users,
    Calendar,
    BarChart3,
    Clock,
    Award,
    Target,
    Briefcase,
    UserCog,
    Plus
} from 'lucide-react';
import styles from './employees.module.css';

const tabItems = [
    { label: 'Staff List', href: '/employees', icon: <Users size={16} /> },
    { label: 'Schedule', href: '/employees/schedule', icon: <Calendar size={16} /> },
    { label: 'Performance', href: '/employees/performance', icon: <BarChart3 size={16} /> },
    { label: 'Time Tracking', href: '/employees/time-tracking', icon: <Clock size={16} /> },
    { label: 'Commissions', href: '/employees/commissions', icon: <Award size={16} /> },
    { label: 'Targets', href: '/employees/targets', icon: <Target size={16} /> },
    { label: 'Roles', href: '/employees/roles', icon: <Briefcase size={16} /> },
    { label: 'Permissions', href: '/employees/permissions', icon: <UserCog size={16} /> },
];

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className={styles.page}>
            {/* Sticky Header Wrapper */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div>
                        <h1 className={styles.title}>Employees</h1>
                        <p className={styles.subtitle}>Manage your team, roles, and performance.</p>
                    </div>
                    <button className={styles.btnAdd}>
                        <Plus size={16} /> Add Employee
                    </button>
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
