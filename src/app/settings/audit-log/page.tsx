'use client';

import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { settingsApi, type AuditLogEntry } from '@/lib/api';

const fallbackLogs = [
    {
        uuid: '1',
        user_uuid: '',
        user_name: 'Sara Ahmed',
        user_role: 'Manager',
        action: 'Created',
        entity_type: 'Booking',
        entity_uuid: 'BK-1044',
        details: { description: 'New booking for Fatima Ali – Hair Coloring' },
        ip_address: '192.168.1.15',
        created_at: '2026-03-25 10:05',
    },
    {
        uuid: '2',
        user_uuid: '',
        user_name: 'Dina Nabil',
        user_role: 'Cashier',
        action: 'Updated',
        entity_type: 'Client Profile',
        entity_uuid: null,
        details: { description: 'Updated phone number for Noura Ahmed' },
        ip_address: '192.168.1.10',
        created_at: '2026-03-18 09:55',
    },
    {
        uuid: '3',
        user_uuid: '',
        user_name: 'Sara Ahmed',
        user_role: 'Manager',
        action: 'Processed',
        entity_type: 'Payment',
        entity_uuid: 'TXN-2043',
        details: { description: 'Cash payment of 450 EGP – Hair Coloring' },
        ip_address: '192.168.1.15',
        created_at: '2026-03-19 09:30',
    },
    {
        uuid: '4',
        user_uuid: '',
        user_name: 'System',
        user_role: 'System',
        action: 'Auto',
        entity_type: 'Shift',
        entity_uuid: 'SH-031',
        details: { description: 'Auto-opened morning shift for Downtown branch' },
        ip_address: 'System',
        created_at: '2026-03-20 09:00',
    },
    {
        uuid: '5',
        user_uuid: '',
        user_name: 'Sara Ahmed',
        user_role: 'Manager',
        action: 'Closed',
        entity_type: 'Shift',
        entity_uuid: 'SH-030',
        details: { description: 'Closed evening shift – Variance: +50 EGP' },
        ip_address: '192.168.1.15',
        created_at: '2026-03-22 18:15',
    },
    {
        uuid: '6',
        user_uuid: '',
        user_name: 'Admin',
        user_role: 'Owner',
        action: 'Modified',
        entity_type: 'Commission Settings',
        entity_uuid: null,
        details: { description: 'Changed Hair Coloring rate from 8% to 10%' },
        ip_address: '192.168.1.2',
        created_at: '2026-03-12 17:00',
    },
    {
        uuid: '7',
        user_uuid: '',
        user_name: 'Nora Ali',
        user_role: 'Cashier',
        action: 'Refunded',
        entity_type: 'Return',
        entity_uuid: 'RTN-005',
        details: { description: 'Cash refund of 280 EGP – Client request' },
        ip_address: '192.168.1.20',
        created_at: '2026-03-13 16:30',
    },
    {
        uuid: '8',
        user_uuid: '',
        user_name: 'Admin',
        user_role: 'Owner',
        action: 'Created',
        entity_type: 'Promo Code',
        entity_uuid: null,
        details: { description: 'Created promo code EID25 – 25% discount' },
        ip_address: '192.168.1.2',
        created_at: '2026-03-22 14:00',
    },
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
    searchIcon: {
        position: 'absolute',
        insetInlineStart: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
    },
    searchInput: {
        width: '100%',
        height: 40,
        paddingInlineStart: 40,
        paddingInlineEnd: 'var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
    exportBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        background: 'var(--bg-primary)',
    },
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'start',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
    },
    badge: {
        display: 'inline-flex',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
    },
};

export default function AuditLogPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const {
        data: apiLogs,
        loading,
        error,
        refetch,
    } = useApiQuery<AuditLogEntry[]>(() => settingsApi.getAuditLog(), [], {
        fallbackData: fallbackLogs as AuditLogEntry[],
    });

    const logs = (apiLogs || []).map(l => ({
        id: l.uuid,
        time: l.created_at,
        user: l.user_name,
        action: l.action,
        entity: `${l.entity_type}${l.entity_uuid ? ' #' + l.entity_uuid : ''}`,
        details: (l.details as Record<string, string>)?.description || JSON.stringify(l.details),
        ip: l.ip_address || 'N/A',
    }));

    const filtered = logs.filter(
        l =>
            l.details.toLowerCase().includes(search.toLowerCase()) ||
            l.user.toLowerCase().includes(search.toLowerCase())
    );

    const getTranslatedAction = (action: string) => {
        const key = `settings.audit.action.${action}` as string;
        return t(key) || action;
    };

    return (
        <div style={s.page}>
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input
                        style={s.searchInput}
                        placeholder={t('settings.audit.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button style={s.exportBtn}>
                    <Download size={16} /> {t('settings.audit.export')}
                </button>
            </div>
            <table style={s.table}>
                <thead>
                    <tr>
                        {[
                            t('settings.audit.colTime'),
                            t('settings.audit.colUser'),
                            t('settings.audit.colAction'),
                            t('settings.audit.colEntity'),
                            t('settings.audit.colDetails'),
                            t('settings.audit.colIp'),
                        ].map(h => (
                            <th
                                key={h}
                                style={{
                                    ...(s.th as React.CSSProperties),
                                    textAlign: 'start',
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(log => (
                        <tr key={log.id}>
                            <td style={{ ...s.td, textAlign: 'start' }}>{log.time}</td>
                            <td
                                style={{
                                    ...s.td,
                                    fontWeight: 'var(--font-medium)',
                                    textAlign: 'start',
                                }}
                            >
                                {log.user}
                            </td>
                            <td style={{ ...s.td, textAlign: 'start' }}>
                                <span style={{ ...s.badge, ...actionColors[log.action] }}>
                                    {getTranslatedAction(log.action)}
                                </span>
                            </td>
                            <td
                                style={{
                                    ...s.td,
                                    fontWeight: 'var(--font-medium)',
                                    textAlign: 'start',
                                }}
                            >
                                {log.entity}
                            </td>
                            <td
                                style={{
                                    ...s.td,
                                    color: 'var(--text-secondary)',
                                    textAlign: 'start',
                                }}
                            >
                                {log.details}
                            </td>
                            <td
                                style={{
                                    ...s.td,
                                    fontFamily: 'monospace',
                                    fontSize: 'var(--text-xs)',
                                    textAlign: 'start',
                                    direction: 'ltr',
                                }}
                            >
                                {log.ip}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
