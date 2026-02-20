'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2,
    Clock,
    Palette,
    Bell,
    Shield,
    Globe,
    CreditCard,
    FileText,
    Webhook,
    Database
} from 'lucide-react';
import styles from './SettingsTabs.module.css';

const tabs = [
    { label: 'General', href: '/settings', icon: <Building2 size={16} /> },
    { label: 'Working Hours', href: '/settings/hours', icon: <Clock size={16} /> },
    { label: 'Appearance', href: '/settings/appearance', icon: <Palette size={16} /> },
    { label: 'Notifications', href: '/settings/notifications', icon: <Bell size={16} /> },
    { label: 'Security', href: '/settings/security', icon: <Shield size={16} /> },
    { label: 'Localization', href: '/settings/localization', icon: <Globe size={16} /> },
    { label: 'Payment Methods', href: '/settings/payment-methods', icon: <CreditCard size={16} /> },
    { label: 'Invoice Template', href: '/settings/invoice', icon: <FileText size={16} /> },
    { label: 'Integrations', href: '/settings/integrations', icon: <Webhook size={16} /> },
    { label: 'Data & Backup', href: '/settings/data', icon: <Database size={16} /> },
];

export default function SettingsTabs() {
    const pathname = usePathname();

    return (
        <div className={styles.container}>
            {tabs.map((t) => {
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
    );
}
