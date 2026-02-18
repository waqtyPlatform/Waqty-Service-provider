'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Download } from 'lucide-react';

const tabs = [
    { label: 'Transaction Log', href: '/transactions' },
    { label: 'Cash Sales', href: '/transactions/cash-sales' },
    { label: 'Advance Pay', href: '/transactions/advance-payments' },
    { label: 'Petty Cash', href: '/transactions/petty-cash' },
    { label: 'Transfers', href: '/transactions/transfers' },
    { label: 'Safe Balances', href: '/transactions/safe-balances' },
    { label: 'Shifts', href: '/transactions/shifts' },
    { label: 'Dailies', href: '/transactions/dailies' },
    { label: 'Best Sales', href: '/transactions/best-sales' },
    { label: 'Client Sales', href: '/transactions/client-sales' },
    { label: 'Package Sales', href: '/transactions/package-sales' },
];

const data = [
    { id: 'PKS-001', date: '2026-02-17', client: 'Fatima Ali', package: 'Bridal Glow Package', price: 2500, sessionsTotal: 8, sessionsUsed: 3, expires: '2026-04-17', status: 'active' },
    { id: 'PKS-002', date: '2026-02-15', client: 'Rania Khalil', package: 'VIP Monthly Care', price: 1200, sessionsTotal: 6, sessionsUsed: 2, expires: '2026-03-17', status: 'active' },
    { id: 'PKS-003', date: '2026-02-10', client: 'Noura Ahmed', package: 'Relaxation Retreat', price: 800, sessionsTotal: 4, sessionsUsed: 4, expires: '2026-03-27', status: 'completed' },
    { id: 'PKS-004', date: '2026-02-08', client: 'Huda Saleh', package: 'VIP Monthly Care', price: 1200, sessionsTotal: 6, sessionsUsed: 5, expires: '2026-03-10', status: 'active' },
    { id: 'PKS-005', date: '2026-01-20', client: 'Maryam Ibrahim', package: 'Hair Transformation', price: 1500, sessionsTotal: 5, sessionsUsed: 5, expires: '2026-02-19', status: 'completed' },
    { id: 'PKS-006', date: '2026-01-15', client: 'Sama Latif', package: 'Relaxation Retreat', price: 800, sessionsTotal: 4, sessionsUsed: 2, expires: '2026-02-28', status: 'expired' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    progress: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', width: 60 },
    progressFill: { height: '100%', borderRadius: 3 },
};

const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    completed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    expired: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

export default function PackageSalesPage() {
    const totalRev = data.reduce((a, d) => a + d.price, 0);
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/transactions/package-sales' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalRev.toLocaleString()} EGP</div><div style={s.kpiLbl}>Package Revenue</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.length}</div><div style={s.kpiLbl}>Packages Sold</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.filter(d => d.status === 'active').length}</div><div style={s.kpiLbl}>Active</div></div>
            </div>

            <table style={s.table}>
                <thead><tr>{['ID', 'Date', 'Client', 'Package', 'Price', 'Sessions', 'Progress', 'Expires', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td><td style={s.td}>{row.date}</td><td style={s.td}>{row.client}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.package}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>{row.price} EGP</td>
                            <td style={s.td}>{row.sessionsUsed}/{row.sessionsTotal}</td>
                            <td style={s.td}>
                                <div style={s.progress}>
                                    <div style={{ ...s.progressFill, width: `${row.sessionsUsed / row.sessionsTotal * 100}%`, background: row.sessionsUsed === row.sessionsTotal ? 'var(--color-success)' : 'var(--color-primary-500)' }} />
                                </div>
                            </td>
                            <td style={s.td}>{row.expires}</td>
                            <td style={s.td}><span style={{ ...s.badge, ...statusColors[row.status] }}>{row.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
