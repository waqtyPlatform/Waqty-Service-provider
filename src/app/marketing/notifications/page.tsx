'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Bell, Send, Smartphone, Mail, MessageSquare } from 'lucide-react';

import MarketingTabs from '@/components/MarketingTabs';

const notifications = [
    { id: 1, title: 'Eid Special Offer!', channel: 'SMS', audience: 'All Clients', sent: 142, opened: 98, date: '2026-02-10', status: 'sent' },
    { id: 2, title: 'Your appointment is tomorrow', channel: 'Push', audience: 'Booked Clients', sent: 28, opened: 25, date: '2026-02-17', status: 'sent' },
    { id: 3, title: 'Spring Sale – 30% Off!', channel: 'Email', audience: 'VIP Group', sent: 0, opened: 0, date: '2026-03-01', status: 'scheduled' },
    { id: 4, title: 'We miss you! Come back for 20% off', channel: 'WhatsApp', audience: 'Inactive > 30 days', sent: 38, opened: 15, date: '2026-02-05', status: 'sent' },
    { id: 5, title: 'Rate your experience', channel: 'SMS', audience: 'Today\'s Completed', sent: 12, opened: 8, date: '2026-02-16', status: 'sent' },
    { id: 6, title: 'Happy Birthday! Gift inside', channel: 'Push', audience: 'Birthday Today', sent: 3, opened: 3, date: '2026-02-17', status: 'sent' },
];

const channelIcons: Record<string, React.ReactNode> = {
    SMS: <Smartphone size={14} />, Push: <Bell size={14} />, Email: <Mail size={14} />, WhatsApp: <MessageSquare size={14} />,
};

const statusColors: Record<string, { bg: string; color: string }> = {
    sent: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    scheduled: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    draft: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

export default function NotificationsPage() {
    const totalSent = notifications.reduce((a, n) => a + n.sent, 0);
    const totalOpened = notifications.reduce((a, n) => a + n.opened, 0);

    return (
        <div style={s.page}>
            <MarketingTabs />

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalSent}</div><div style={s.kpiLbl}>Total Sent</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{totalOpened}</div><div style={s.kpiLbl}>Total Opened</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{totalSent > 0 ? Math.round(totalOpened / totalSent * 100) : 0}%</div><div style={s.kpiLbl}>Open Rate</div></div>
            </div>

            <div style={s.toolbar}><button style={s.addBtn}><Plus size={16} /> Compose</button></div>

            <table style={s.table}>
                <thead><tr>{['Title', 'Channel', 'Audience', 'Sent', 'Opened', 'Date', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {notifications.map(n => (
                        <tr key={n.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{n.title}</td>
                            <td style={s.td}><span style={{ ...s.badge, background: 'var(--bg-secondary)' }}>{channelIcons[n.channel]} {n.channel}</span></td>
                            <td style={s.td}>{n.audience}</td>
                            <td style={s.td}>{n.sent}</td>
                            <td style={{ ...s.td, color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' }}>{n.opened}</td>
                            <td style={s.td}>{n.date}</td>
                            <td style={s.td}><span style={{ ...s.badge, ...statusColors[n.status] }}>{n.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
