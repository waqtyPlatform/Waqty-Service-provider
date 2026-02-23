'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2, Clock, Palette, Bell, Shield, Globe,
    CreditCard, FileText, Webhook, Database,
    MapPin, Scissors, Monitor, UserCog, ScrollText, Crown,
} from 'lucide-react';
import styles from './SettingsTabs.module.css';

const tabs = [
    { label: 'General', href: '/settings', icon: <Building2 size={16} /> },
    { label: 'Branches', href: '/settings/branches', icon: <MapPin size={16} /> },
    { label: 'Working Hours', href: '/settings/hours', icon: <Clock size={16} /> },
    { label: 'Services', href: '/settings/services', icon: <Scissors size={16} /> },
    { label: 'Invoice', href: '/settings/invoice', icon: <FileText size={16} /> },
    { label: 'Payment Methods', href: '/settings/payment-methods', icon: <CreditCard size={16} /> },
    { label: 'Roles & Permissions', href: '/settings/roles', icon: <UserCog size={16} /> },
    { label: 'Appearance', href: '/settings/appearance', icon: <Palette size={16} /> },
    { label: 'Notifications', href: '/settings/notifications', icon: <Bell size={16} /> },
    { label: 'Security', href: '/settings/security', icon: <Shield size={16} /> },
    { label: 'Localization', href: '/settings/localization', icon: <Globe size={16} /> },
    { label: 'Devices', href: '/settings/devices', icon: <Monitor size={16} /> },
    { label: 'Integrations', href: '/settings/integrations', icon: <Webhook size={16} /> },
    { label: 'Data & Backup', href: '/settings/data', icon: <Database size={16} /> },
    { label: 'Audit Log', href: '/settings/audit-log', icon: <ScrollText size={16} /> },
    { label: 'Subscription', href: '/settings/subscription', icon: <Crown size={16} /> },
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
