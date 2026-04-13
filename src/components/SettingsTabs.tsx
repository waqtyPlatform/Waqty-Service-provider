'use client';

import React, { useState } from 'react';
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
    Database,
    Lock,
    MapPin,
    Scissors,
    Monitor,
    ScrollText,
    Crown,
    FolderTree,
    Users,
    Armchair,
    CalendarCog,
    Timer,
    Fingerprint,
    MapPinned,
    Coins,
    ChevronDown,
    HandCoins,
    Gift,
} from 'lucide-react';
import styles from './SettingsTabs.module.css';
import { useTranslation } from '@/hooks/useTranslation';

interface SettingsTab {
    labelKey: string;
    href: string;
    icon: React.ReactNode;
}

interface SettingsCategory {
    labelKey: string;
    tabs: SettingsTab[];
}

const categories: SettingsCategory[] = [
    {
        labelKey: 'settings.cat.business',
        tabs: [
            { labelKey: 'settings.tab.general', href: '/settings', icon: <Building2 size={16} /> },
            { labelKey: 'settings.tab.branches', href: '/settings/branches', icon: <MapPin size={16} /> },
            { labelKey: 'settings.tab.hours', href: '/settings/hours', icon: <Clock size={16} /> },
        ],
    },
    {
        labelKey: 'settings.cat.services',
        tabs: [
            { labelKey: 'settings.tab.services', href: '/settings/services', icon: <Scissors size={16} /> },
            {
                labelKey: 'settings.tab.serviceCategories',
                href: '/settings/service-categories',
                icon: <FolderTree size={16} />,
            },
            {
                labelKey: 'settings.tab.serviceEmployees',
                href: '/settings/service-employees',
                icon: <Users size={16} />,
            },
            { labelKey: 'settings.tab.servicePricing', href: '/settings/service-pricing', icon: <Coins size={16} /> },
            { labelKey: 'settings.tab.resources', href: '/settings/resources', icon: <Armchair size={16} /> },
        ],
    },
    {
        labelKey: 'settings.cat.finance',
        tabs: [
            { labelKey: 'settings.tab.invoice', href: '/settings/invoice', icon: <FileText size={16} /> },
            { labelKey: 'settings.tab.payment', href: '/settings/payment-methods', icon: <CreditCard size={16} /> },
            { labelKey: 'settings.tab.safes', href: '/settings/safes', icon: <Lock size={16} /> },
            { labelKey: 'settings.tab.pettyCash', href: '/settings/petty-cash-items', icon: <Coins size={16} /> },
            { labelKey: 'tipping.title', href: '/settings/tipping', icon: <HandCoins size={16} /> },
            { labelKey: 'loyalty.title', href: '/settings/loyalty', icon: <Gift size={16} /> },
        ],
    },
    {
        labelKey: 'settings.cat.scheduling',
        tabs: [
            {
                labelKey: 'settings.tab.diaryAutomations',
                href: '/settings/diary-automations',
                icon: <CalendarCog size={16} />,
            },
            { labelKey: 'settings.tab.shifts', href: '/settings/shifts', icon: <CalendarCog size={16} /> },
            {
                labelKey: 'settings.tab.shiftAutomations',
                href: '/settings/shift-automations',
                icon: <Timer size={16} />,
            },
        ],
    },
    {
        labelKey: 'settings.cat.hardware',
        tabs: [
            { labelKey: 'settings.tab.devices', href: '/settings/devices', icon: <Monitor size={16} /> },
            {
                labelKey: 'settings.tab.fpDevices',
                href: '/settings/fingerprint-devices',
                icon: <Fingerprint size={16} />,
            },
            { labelKey: 'settings.tab.fpAreas', href: '/settings/fingerprint-areas', icon: <MapPinned size={16} /> },
        ],
    },
    {
        labelKey: 'settings.cat.system',
        tabs: [
            { labelKey: 'settings.tab.appearance', href: '/settings/appearance', icon: <Palette size={16} /> },
            { labelKey: 'settings.tab.localization', href: '/settings/localization', icon: <Globe size={16} /> },
            { labelKey: 'settings.tab.notifications', href: '/settings/notifications', icon: <Bell size={16} /> },
            { labelKey: 'settings.tab.security', href: '/settings/security', icon: <Shield size={16} /> },
            { labelKey: 'settings.tab.integrations', href: '/settings/integrations', icon: <Webhook size={16} /> },
            { labelKey: 'settings.tab.data', href: '/settings/data', icon: <Database size={16} /> },
            { labelKey: 'settings.tab.audit', href: '/settings/audit-log', icon: <ScrollText size={16} /> },
            { labelKey: 'settings.tab.subscription', href: '/settings/subscription', icon: <Crown size={16} /> },
        ],
    },
];

export default function SettingsTabs() {
    const pathname = usePathname();
    const { t } = useTranslation();

    // Auto-expand the category containing the active tab
    const activeCatIndex = categories.findIndex(cat =>
        cat.tabs.some(tab => pathname === tab.href || (tab.href !== '/settings' && pathname.startsWith(tab.href)))
    );

    const [expandedCats, setExpandedCats] = useState<number[]>(activeCatIndex >= 0 ? [activeCatIndex] : [0]);

    const toggleCategory = (index: number) => {
        setExpandedCats(prev => (prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]));
    };

    return (
        <nav className={styles.sidebar}>
            {categories.map((cat, catIdx) => {
                const isExpanded = expandedCats.includes(catIdx);
                const hasActive = cat.tabs.some(
                    tab => pathname === tab.href || (tab.href !== '/settings' && pathname.startsWith(tab.href))
                );

                return (
                    <div key={cat.labelKey} className={styles.category}>
                        <button
                            className={`${styles.categoryHeader} ${hasActive ? styles.categoryActive : ''}`}
                            onClick={() => toggleCategory(catIdx)}
                        >
                            <span>{t(cat.labelKey)}</span>
                            <ChevronDown
                                size={14}
                                className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                            />
                        </button>

                        {isExpanded && (
                            <div className={styles.categoryItems}>
                                {cat.tabs.map(tab => {
                                    const isActive =
                                        pathname === tab.href ||
                                        (tab.href !== '/settings' && pathname.startsWith(tab.href + '/'));
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
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
