'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';

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
    { date: '2026-02-17', revenue: 7850, cash: 5300, card: 2100, other: 450, shifts: 2, closedShifts: 1, status: 'open' },
    { date: '2026-02-16', revenue: 7150, cash: 4600, card: 2200, other: 350, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-02-15', revenue: 5500, cash: 3280, card: 1800, other: 420, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-02-14', revenue: 6200, cash: 4100, card: 1700, other: 400, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-02-13', revenue: 4800, cash: 3200, card: 1300, other: 300, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-02-12', revenue: 8100, cash: 5500, card: 2200, other: 400, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-02-11', revenue: 3200, cash: 2100, card: 900, other: 200, shifts: 1, closedShifts: 1, status: 'closed' },
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
    bar: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', overflow: 'hidden', display: 'flex', gap: 1 },
};

export default function DailiesPage() {
    const totalRev = data.reduce((a, d) => a + d.revenue, 0);
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/transactions/dailies' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalRev.toLocaleString()} EGP</div><div style={s.kpiLbl}>Weekly Revenue</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{Math.round(totalRev / 7).toLocaleString()} EGP</div><div style={s.kpiLbl}>Daily Average</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.filter(d => d.status === 'closed').length}/{data.length}</div><div style={s.kpiLbl}>Days Closed</div></div>
            </div>

            <table style={s.table}>
                <thead><tr>{['Date', 'Revenue', 'Cash / Card / Other', 'Shifts', 'Day Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.date}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.date}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{row.revenue.toLocaleString()} EGP</td>
                            <td style={s.td}>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                                    <span style={{ color: 'var(--color-success)' }}>{Math.round(row.cash / row.revenue * 100)}% Cash</span>
                                    <span style={{ color: 'var(--color-info)' }}>{Math.round(row.card / row.revenue * 100)}% Card</span>
                                    <span style={{ color: 'var(--color-warning)' }}>{Math.round(row.other / row.revenue * 100)}% Other</span>
                                </div>
                                <div style={s.bar}>
                                    <div style={{ width: `${row.cash / row.revenue * 100}%`, background: 'var(--color-success)', borderRadius: 3 }} />
                                    <div style={{ width: `${row.card / row.revenue * 100}%`, background: 'var(--color-info)', borderRadius: 3 }} />
                                    <div style={{ width: `${row.other / row.revenue * 100}%`, background: 'var(--color-warning)', borderRadius: 3 }} />
                                </div>
                            </td>
                            <td style={s.td}>{row.closedShifts}/{row.shifts}</td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: row.status === 'closed' ? 'var(--color-success-light)' : 'var(--color-info-light)', color: row.status === 'closed' ? 'var(--color-success)' : 'var(--color-info)' }}>
                                    {row.status === 'closed' ? '✓ Closed' : '● Open'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
