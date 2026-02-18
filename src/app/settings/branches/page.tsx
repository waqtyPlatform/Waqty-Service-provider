'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Save } from 'lucide-react';

const tabs = [
    { label: 'General', href: '/settings' },
    { label: 'Branches', href: '/settings/branches' },
    { label: 'Services', href: '/settings/services' },
    { label: 'Invoice', href: '/settings/invoice' },
    { label: 'Devices', href: '/settings/devices' },
    { label: 'Integrations', href: '/settings/integrations' },
    { label: 'Roles', href: '/settings/roles' },
    { label: 'Audit Log', href: '/settings/audit-log' },
    { label: 'Subscription', href: '/settings/subscription' },
];

const branches = [
    { id: 1, name: 'Downtown Branch', address: '15 Tahrir Street, Cairo', phone: '+20 2 2345 6789', manager: 'Sara Ahmed', employees: 6, status: 'active' },
    { id: 2, name: 'Mall of Arabia', address: 'Mall of Arabia, 6th of October', phone: '+20 2 3456 7890', manager: 'Fatma Hosny', employees: 3, status: 'active' },
    { id: 3, name: 'New Cairo Branch', address: '5th Settlement, New Cairo', phone: '+20 2 4567 8901', manager: 'Amira Sayed', employees: 4, status: 'active' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
    cardHead: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-success-light)', color: 'var(--color-success)' },
    row: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', fontSize: 'var(--text-sm)' },
    label: { color: 'var(--text-tertiary)' },
    val: { fontWeight: 'var(--font-medium)' },
};

export default function BranchesPage() {
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/settings/branches' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>
            <div style={s.grid}>
                {branches.map(b => (
                    <div key={b.id} style={s.card}>
                        <div style={s.cardHead}>
                            <div style={s.icon}><Building2 size={20} /></div>
                            <div><div style={s.name}>{b.name}</div><span style={s.badge}>{b.status}</span></div>
                        </div>
                        <div style={s.row}><span style={s.label}>Address</span><span style={s.val}>{b.address}</span></div>
                        <div style={s.row}><span style={s.label}>Phone</span><span style={s.val}>{b.phone}</span></div>
                        <div style={s.row}><span style={s.label}>Manager</span><span style={s.val}>{b.manager}</span></div>
                        <div style={s.row}><span style={s.label}>Employees</span><span style={s.val}>{b.employees}</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
