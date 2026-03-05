'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2, Clock, Palette, Bell, Shield, Globe,
    CreditCard, FileText, Webhook, Database, Lock,
    MapPin, Scissors, Monitor, UserCog, ScrollText, Crown,
    FolderTree, Users, Armchair, CalendarCog, Timer,
    Fingerprint, MapPinned, Coins,
} from 'lucide-react';
import styles from './SettingsTabs.module.css';
import { useTranslation } from '@/hooks/useTranslation';

const tabs = [
    { labelKey: 'settings.tab.general', href: '/settings', icon: <Building2 size={16} /> },
    { labelKey: 'settings.tab.branches', href: '/settings/branches', icon: <MapPin size={16} /> },
    { labelKey: 'settings.tab.hours', href: '/settings/hours', icon: <Clock size={16} /> },
    { labelKey: 'settings.tab.services', href: '/settings/services', icon: <Scissors size={16} /> },
    { labelKey: 'settings.tab.serviceCategories', href: '/settings/service-categories', icon: <FolderTree size={16} /> },
    { labelKey: 'settings.tab.serviceEmployees', href: '/settings/service-employees', icon: <Users size={16} /> },
    { labelKey: 'settings.tab.resources', href: '/settings/resources', icon: <Armchair size={16} /> },
    { labelKey: 'settings.tab.invoice', href: '/settings/invoice', icon: <FileText size={16} /> },
    { labelKey: 'settings.tab.payment', href: '/settings/payment-methods', icon: <CreditCard size={16} /> },
    { labelKey: 'settings.tab.safes', href: '/settings/safes', icon: <Lock size={16} /> },
    { labelKey: 'settings.tab.roles', href: '/settings/roles', icon: <UserCog size={16} /> },
    { labelKey: 'settings.tab.appearance', href: '/settings/appearance', icon: <Palette size={16} /> },
    { labelKey: 'settings.tab.notifications', href: '/settings/notifications', icon: <Bell size={16} /> },
    { labelKey: 'settings.tab.security', href: '/settings/security', icon: <Shield size={16} /> },
    { labelKey: 'settings.tab.localization', href: '/settings/localization', icon: <Globe size={16} /> },
    { labelKey: 'settings.tab.devices', href: '/settings/devices', icon: <Monitor size={16} /> },
    { labelKey: 'settings.tab.integrations', href: '/settings/integrations', icon: <Webhook size={16} /> },
    { labelKey: 'settings.tab.data', href: '/settings/data', icon: <Database size={16} /> },
    { labelKey: 'settings.tab.audit', href: '/settings/audit-log', icon: <ScrollText size={16} /> },
    { labelKey: 'settings.tab.subscription', href: '/settings/subscription', icon: <Crown size={16} /> },
    { labelKey: 'settings.tab.diaryAutomations', href: '/settings/diary-automations', icon: <CalendarCog size={16} /> },
    { labelKey: 'settings.tab.shiftAutomations', href: '/settings/shift-automations', icon: <Timer size={16} /> },
    { labelKey: 'settings.tab.fpDevices', href: '/settings/fingerprint-devices', icon: <Fingerprint size={16} /> },
    { labelKey: 'settings.tab.fpAreas', href: '/settings/fingerprint-areas', icon: <MapPinned size={16} /> },
    { labelKey: 'settings.tab.pettyCash', href: '/settings/petty-cash-items', icon: <Coins size={16} /> },
];

export default function SettingsTabs() {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                    >
                        {tab.icon} {t(tab.labelKey)}
                    </Link>
                );
            })}
        </div>
    );
}
