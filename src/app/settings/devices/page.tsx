'use client';

import React from 'react';
import Link from 'next/link';
import { Monitor, Smartphone, Printer, Wifi, WifiOff } from 'lucide-react';

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

const devices = [
    { id: 1, name: 'Reception POS', type: 'POS Terminal', model: 'Sunmi V2 Pro', branch: 'Downtown', lastSeen: '2026-02-17 10:05', online: true },
    { id: 2, name: 'BioStation A2', type: 'Fingerprint Scanner', model: 'Suprema BioStation A2', branch: 'Downtown', lastSeen: '2026-02-17 10:00', online: true },
    { id: 3, name: 'FaceStation F2', type: 'Face Recognition', model: 'Suprema FaceStation F2', branch: 'Downtown', lastSeen: '2026-02-17 09:58', online: true },
    { id: 4, name: 'Receipt Printer', type: 'Printer', model: 'Epson TM-T88VI', branch: 'Downtown', lastSeen: '2026-02-17 09:45', online: true },
    { id: 5, name: 'Mall POS', type: 'POS Terminal', model: 'Sunmi V2 Pro', branch: 'Mall of Arabia', lastSeen: '2026-02-17 08:30', online: true },
    { id: 6, name: 'New Cairo POS', type: 'POS Terminal', model: 'Sunmi V2 Pro', branch: 'New Cairo', lastSeen: '2026-02-16 18:00', online: false },
];

const typeIcons: Record<string, React.ReactNode> = {
    'POS Terminal': <Monitor size={20} />,
    'Fingerprint Scanner': <Smartphone size={20} />,
    'Face Recognition': <Smartphone size={20} />,
    'Printer': <Printer size={20} />,
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

export default function DevicesPage() {
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/settings/devices' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>
            <table style={s.table}>
                <thead><tr>{['Device', 'Type', 'Model', 'Branch', 'Last Seen', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {devices.map(d => (
                        <tr key={d.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{d.name}</td>
                            <td style={s.td}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{typeIcons[d.type]} {d.type}</div></td>
                            <td style={s.td}>{d.model}</td>
                            <td style={s.td}>{d.branch}</td>
                            <td style={s.td}>{d.lastSeen}</td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: d.online ? 'var(--color-success-light)' : 'var(--color-error-light)', color: d.online ? 'var(--color-success)' : 'var(--color-error)' }}>
                                    {d.online ? <><Wifi size={12} /> Online</> : <><WifiOff size={12} /> Offline</>}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
