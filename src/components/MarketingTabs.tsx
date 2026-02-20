'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tag, Package, Bell, MessageSquare, Layers, Percent } from 'lucide-react';

const tabs = [
    { label: 'Offers', href: '/marketing/offers', icon: <Tag size={16} /> },
    { label: 'Packages', href: '/marketing/packages', icon: <Package size={16} /> },
    { label: 'Notifications', href: '/marketing/notifications', icon: <Bell size={16} /> },
    { label: 'Promo Codes', href: '/marketing/promo-codes', icon: <Percent size={16} /> },
    { label: 'Messages', href: '/marketing/messages', icon: <MessageSquare size={16} /> },
    { label: 'Service Groups', href: '/marketing/service-groups', icon: <Layers size={16} /> },
];

export default function MarketingTabs() {
    const pathname = usePathname();

    return (
        <div style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto', marginBottom: 'var(--space-6)' }}>
            {tabs.map((t) => {
                const isActive = pathname === t.href;
                return (
                    <Link
                        key={t.href}
                        href={t.href}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)',
                            color: isActive ? 'var(--color-primary-500)' : 'var(--text-tertiary)',
                            borderBottom: isActive ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                            marginBottom: '-2px', textDecoration: 'none', whiteSpace: 'nowrap'
                        }}
                    >
                        {t.icon} {t.label}
                    </Link>
                );
            })}
        </div>
    );
}
