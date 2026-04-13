'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tag, Package, Bell, MessageSquare, Layers, Percent, Megaphone } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

export default function MarketingTabs() {
    const pathname = usePathname();
    const { t } = useTranslation();

    const tabs = [
        { label: t('mkt.lblOffers'), href: '/marketing/offers', icon: <Tag size={16} /> },
        { label: t('mkt.lblCampaigns'), href: '/marketing/packages', icon: <Package size={16} /> },
        { label: t('mkt.lblNotifications'), href: '/marketing/notifications', icon: <Bell size={16} /> },
        { label: t('mkt.lblPromoCodes'), href: '/marketing/promo-codes', icon: <Percent size={16} /> },
        { label: t('mkt.lblMessages'), href: '/marketing/messages', icon: <MessageSquare size={16} /> },
        { label: t('mkt.lblServiceGroups'), href: '/marketing/service-groups', icon: <Layers size={16} /> },
        { label: t('announcements.title'), href: '/marketing/announcements', icon: <Megaphone size={16} /> },
    ];

    return (
        <div
            style={{
                display: 'flex',
                gap: 'var(--space-1)',
                borderBottom: '2px solid var(--border-color)',
                overflowX: 'auto',
                marginBottom: 'var(--space-6)',
            }}
        >
            {tabs.map(t => {
                const isActive = pathname === t.href;
                return (
                    <Link
                        key={t.href}
                        href={t.href}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            color: isActive ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                            borderBottom: isActive ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            marginBottom: '-2px',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {t.icon} {t.label}
                    </Link>
                );
            })}
        </div>
    );
}
