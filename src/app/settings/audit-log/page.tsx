'use client';

import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const logs = [
    { id: 1, time: '2026-02-17 10:05', user: 'Sara Ahmed', action: 'Created', entity: 'Booking #BK-1044', details: 'New booking for Fatima Ali – Hair Coloring', ip: '192.168.1.15' },
    { id: 2, time: '2026-02-17 09:55', user: 'Dina Nabil', action: 'Updated', entity: 'Client Profile', details: 'Updated phone number for Noura Ahmed', ip: '192.168.1.10' },
    { id: 3, time: '2026-02-17 09:30', user: 'Sara Ahmed', action: 'Processed', entity: 'Payment #TXN-2043', details: 'Cash payment of 450 EGP – Hair Coloring', ip: '192.168.1.15' },
    { id: 4, time: '2026-02-17 09:00', user: 'System', action: 'Auto', entity: 'Shift #SH-031', details: 'Auto-opened morning shift for Downtown branch', ip: 'System' },
    { id: 5, time: '2026-02-16 18:15', user: 'Sara Ahmed', action: 'Closed', entity: 'Shift #SH-030', details: 'Closed evening shift – Variance: +50 EGP', ip: '192.168.1.15' },
    { id: 6, time: '2026-02-16 17:00', user: 'Admin', action: 'Modified', entity: 'Commission Settings', details: 'Changed Hair Coloring rate from 8% to 10%', ip: '192.168.1.2' },
    { id: 7, time: '2026-02-16 16:30', user: 'Nora Ali', action: 'Refunded', entity: 'Return #RTN-005', details: 'Cash refund of 280 EGP – Client request', ip: '192.168.1.20' },
    { id: 8, time: '2026-02-16 14:00', user: 'Admin', action: 'Created', entity: 'Promo Code', details: 'Created promo code EID25 – 25% discount', ip: '192.168.1.2' },
];

const actionColors: Record<string, { bg: string; color: string }> = {
    Created: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    Updated: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    Processed: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    Auto: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
    Closed: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Modified: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Refunded: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

export default function AuditLogPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const filtered = logs.filter(l => l.details.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()));

    const getTranslatedAction = (action: string) => {
        const key = `settings.audit.action.${action}` as any;
        return t(key) || action;
    };

    return (
        <div style={s.page}>
<div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={{ ...s.searchIcon as React.CSSProperties, left: lang === 'ar' ? 'auto' : 12, right: lang === 'ar' ? 12 : 'auto' }} /><input style={{ ...s.searchInput, paddingLeft: lang === 'ar' ? 16 : 40, paddingRight: lang === 'ar' ? 40 : 16 }} placeholder={t('settings.audit.search')} value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.exportBtn}><Download size={16} /> {t('settings.audit.export')}</button>
            </div>
            <table style={s.table}>
                <thead><tr>{[t('settings.audit.colTime'), t('settings.audit.colUser'), t('settings.audit.colAction'), t('settings.audit.colEntity'), t('settings.audit.colDetails'), t('settings.audit.colIp')].map(h => <th key={h} style={{ ...s.th as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(log => (
                        <tr key={log.id}>
                            <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>{log.time}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{log.user}</td>
                            <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}><span style={{ ...s.badge, ...actionColors[log.action] }}>{getTranslatedAction(log.action)}</span></td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{log.entity}</td>
                            <td style={{ ...s.td, color: 'var(--text-secondary)', textAlign: lang === 'ar' ? 'right' : 'left' }}>{log.details}</td>
                            <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 'var(--text-xs)', textAlign: lang === 'ar' ? 'right' : 'left', direction: 'ltr' }}>{log.ip}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
