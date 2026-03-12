'use client';

import React from 'react';
import Link from 'next/link';

import { useTranslation } from '@/hooks/useTranslation';

const tabs = [
    { labelKey: 'txn.tabLog', href: '/transactions' },
    { labelKey: 'txn.tabCashSales', href: '/transactions/cash-sales' },
    { labelKey: 'txn.tabAdvance', href: '/transactions/advance-payments' },
    { labelKey: 'txn.tabPettyCash', href: '/transactions/petty-cash' },
    { labelKey: 'txn.tabTransfers', href: '/transactions/transfers' },
    { labelKey: 'txn.tabSafeBalances', href: '/transactions/safe-balances' },
    { labelKey: 'txn.tabShifts', href: '/transactions/shifts' },
    { labelKey: 'txn.tabDailies', href: '/transactions/dailies' },
    { labelKey: 'txn.tabBestSales', href: '/transactions/best-sales' },
    { labelKey: 'txn.tabClientSales', href: '/transactions/client-sales' },
    { labelKey: 'txn.tabPackageSales', href: '/transactions/package-sales' },
];

const data = [
    { date: '2026-03-25', revenue: 7850, cash: 5300, card: 2100, other: 450, shifts: 2, closedShifts: 1, status: 'open' },
    { date: '2026-03-26', revenue: 7150, cash: 4600, card: 2200, other: 350, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-03-18', revenue: 5500, cash: 3280, card: 1800, other: 420, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-03-20', revenue: 6200, cash: 4100, card: 1700, other: 400, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-03-12', revenue: 4800, cash: 3200, card: 1300, other: 300, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-03-26', revenue: 8100, cash: 5500, card: 2200, other: 400, shifts: 2, closedShifts: 2, status: 'closed' },
    { date: '2026-03-21', revenue: 3200, cash: 2100, card: 900, other: 200, shifts: 1, closedShifts: 1, status: 'closed' },
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
    const { t, lang } = useTranslation();
    const totalRev = data.reduce((a, d) => a + d.revenue, 0);
    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => <Link key={tab.href} href={tab.href} style={{ ...s.tab, ...(tab.href === '/transactions/dailies' ? s.tabActive : {}) }}>{t(tab.labelKey)}</Link>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{totalRev.toLocaleString()} EGP</div><div style={s.kpiLbl}>{t('txn.dailies.weekly')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{Math.round(totalRev / 7).toLocaleString()} EGP</div><div style={s.kpiLbl}>{t('txn.dailies.avg')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{data.filter(d => d.status === 'closed').length}/{data.length}</div><div style={s.kpiLbl}>{t('txn.dailies.closed')}</div></div>
            </div>

            <table style={s.table}>
                <thead><tr>{['txn.dailies.thDate', 'txn.dailies.thRevenue', 'txn.dailies.thBreakdown', 'txn.dailies.thShifts', 'txn.dailies.thDayStatus'].map(h => <th key={h} style={{ ...s.th as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(h)}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.date}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }} dir="ltr"><span style={{ direction: 'ltr', display: 'inline-block' }}>{row.date}</span></td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }} dir="ltr">{row.revenue.toLocaleString()} EGP</td>
                            <td style={s.td}>
                                <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                                    <span style={{ color: 'var(--color-success)' }} dir="ltr">{Math.round(row.cash / row.revenue * 100)}% {t('txn.dailies.lblCash')}</span>
                                    <span style={{ color: 'var(--color-info)' }} dir="ltr">{Math.round(row.card / row.revenue * 100)}% {t('txn.dailies.lblCard')}</span>
                                    <span style={{ color: 'var(--color-warning)' }} dir="ltr">{Math.round(row.other / row.revenue * 100)}% {t('txn.dailies.lblOther')}</span>
                                </div>
                                <div style={{ ...s.bar, transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
                                    <div style={{ width: `${row.cash / row.revenue * 100}%`, background: 'var(--color-success)', borderRadius: 3 }} />
                                    <div style={{ width: `${row.card / row.revenue * 100}%`, background: 'var(--color-info)', borderRadius: 3 }} />
                                    <div style={{ width: `${row.other / row.revenue * 100}%`, background: 'var(--color-warning)', borderRadius: 3 }} />
                                </div>
                            </td>
                            <td style={s.td} dir="ltr">{row.closedShifts}/{row.shifts}</td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: row.status === 'closed' ? 'var(--color-success-light)' : 'var(--color-info-light)', color: row.status === 'closed' ? 'var(--color-success)' : 'var(--color-info)' }}>
                                    {row.status === 'closed' ? t('txn.dailies.statusClosed') : t('txn.dailies.statusOpen')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
