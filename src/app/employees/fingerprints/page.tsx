'use client';

import React from 'react';
import { Fingerprint, Plus, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const data = [
    { id: 1, employee: 'Sara Ahmed', device: 'BioStation A2', enrollDate: '2026-01-05', fingers: 2, status: 'enrolled' },
    { id: 2, employee: 'Nora Ali', device: 'BioStation A2', enrollDate: '2026-01-05', fingers: 2, status: 'enrolled' },
    { id: 3, employee: 'Layla Hassan', device: 'BioStation A2', enrollDate: '2026-01-10', fingers: 2, status: 'enrolled' },
    { id: 4, employee: 'Hana Youssef', device: 'BioStation A2', enrollDate: '2026-01-10', fingers: 1, status: 'partial' },
    { id: 5, employee: 'Reem Mohamed', device: 'BioStation A2', enrollDate: '-', fingers: 0, status: 'not_enrolled' },
    { id: 6, employee: 'Dina Nabil', device: 'FaceStation F2', enrollDate: '2026-02-01', fingers: 2, status: 'enrolled' },
];

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    enrolled: { label: '✓ Enrolled', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    partial: { label: '◐ Partial', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    not_enrolled: { label: '✗ Not Enrolled', bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    btn: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, color: 'var(--color-primary-600)' },
};

export default function FingerprintsPage() {
    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Fingerprint Management</div>
            <table style={s.table}>
                <thead><tr>{['Employee', 'Device', 'Enrolled Date', 'Fingers', 'Status', 'Action'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => {
                        const st = statusMap[row.status];
                        return (
                            <tr key={row.id}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.employee}</td>
                                <td style={s.td}>{row.device}</td>
                                <td style={s.td}>{row.enrollDate}</td>
                                <td style={s.td}>{row.fingers}/2</td>
                                <td style={s.td}><span style={{ ...s.badge, background: st.bg, color: st.color }}>{st.label}</span></td>
                                <td style={s.td}>
                                    <button style={s.btn}><RefreshCw size={12} /> {row.status === 'not_enrolled' ? 'Enroll' : 'Re-enroll'}</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
