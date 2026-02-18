'use client';

import React from 'react';
import { ArrowRightLeft, Search } from 'lucide-react';

const data = [
    { id: 'TR-001', date: '2026-02-15', employee: 'Maya Adel', from: 'Mall of Arabia', to: 'Downtown Branch', type: 'Permanent', status: 'completed' },
    { id: 'TR-002', date: '2026-02-10', employee: 'Rana Fawzy', from: 'Downtown Branch', to: 'New Cairo Branch', type: 'Temporary', status: 'active', until: '2026-03-10' },
    { id: 'TR-003', date: '2026-01-28', employee: 'Salma Karim', from: 'New Cairo Branch', to: 'Mall of Arabia', type: 'Permanent', status: 'completed' },
    { id: 'TR-004', date: '2026-01-15', employee: 'Nadia Omar', from: 'Downtown Branch', to: 'New Cairo Branch', type: 'Permanent', status: 'completed' },
    { id: 'TR-005', date: '2026-02-17', employee: 'Yara Emad', from: 'New Cairo Branch', to: 'Downtown Branch', type: 'Temporary', status: 'pending', until: '2026-02-24' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
    completed: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    active: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

export default function TransfersPage() {
    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Employee Transfers</div>
            <table style={s.table}>
                <thead><tr>{['ID', 'Date', 'Employee', 'From Branch', '', 'To Branch', 'Type', 'Status'].map((h, i) => <th key={i} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td><td style={s.td}>{row.date}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.employee}</td>
                            <td style={s.td}>{row.from}</td>
                            <td style={s.td}><ArrowRightLeft size={14} style={{ color: 'var(--text-tertiary)' }} /></td>
                            <td style={s.td}>{row.to}</td>
                            <td style={s.td}><span style={{ ...s.badge, background: row.type === 'Permanent' ? 'var(--color-primary-50)' : 'var(--color-warning-light)', color: row.type === 'Permanent' ? 'var(--color-primary-600)' : 'var(--color-warning)' }}>{row.type}</span></td>
                            <td style={s.td}><span style={{ ...s.badge, ...statusColors[row.status] }}>{row.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
