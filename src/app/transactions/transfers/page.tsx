'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';

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
    { id: 'TF-001', date: '2026-02-17', time: '18:00', fromSafe: 'Cashier 1 Safe', toSafe: 'Main Safe', amount: 3200, cashier: 'Nora Ali', status: 'completed' },
    { id: 'TF-002', date: '2026-02-17', time: '18:15', fromSafe: 'Cashier 2 Safe', toSafe: 'Main Safe', amount: 2450, cashier: 'Sara Ahmed', status: 'completed' },
    { id: 'TF-003', date: '2026-02-16', time: '18:30', fromSafe: 'Cashier 1 Safe', toSafe: 'Main Safe', amount: 4100, cashier: 'Nora Ali', status: 'completed' },
    { id: 'TF-004', date: '2026-02-16', time: '10:00', fromSafe: 'Main Safe', toSafe: 'Cashier 1 Safe', amount: 500, cashier: 'Admin', status: 'completed' },
    { id: 'TF-005', date: '2026-02-15', time: '18:00', fromSafe: 'Cashier 1 Safe', toSafe: 'Main Safe', amount: 2800, cashier: 'Nora Ali', status: 'completed' },
    { id: 'TF-006', date: '2026-02-15', time: '14:00', fromSafe: 'Main Safe', toSafe: 'Bank Deposit', amount: 10000, cashier: 'Admin', status: 'pending' },
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
    arrow: { color: 'var(--text-tertiary)', margin: '0 6px' },
};

export default function TransfersPage() {
    const { t, lang } = useTranslation();
    const total = data.reduce((a, d) => a + d.amount, 0);
    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => <Link key={tab.href} href={tab.href} style={{ ...s.tab, ...(tab.href === '/transactions/transfers' ? s.tabActive : {}) }}>{t(tab.labelKey)}</Link>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{total.toLocaleString()} EGP</div><div style={s.kpiLbl}>{t('txn.transfers.total')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{data.length}</div><div style={s.kpiLbl}>{t('txn.transfers.count')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{data.filter(d => d.status === 'pending').length}</div><div style={s.kpiLbl}>{t('txn.transfers.pending')}</div></div>
            </div>

            <table style={s.table}>
                <thead><tr>{['txn.petty.thID', 'txn.thDateTime', 'txn.transfers.thTime', 'txn.transfers.thFromTo', 'txn.thAmount', 'txn.shifts.thCashier', 'txn.thStatus'].map(h => <th key={h} style={{ ...s.th as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(h)}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td><td style={s.td} dir="ltr">{row.date}</td><td style={s.td} dir="ltr">{row.time}</td>
                            <td style={s.td}>
                                <span style={{ fontWeight: 'var(--font-medium)' }}>{row.fromSafe}</span>
                                <ArrowRightLeft size={14} style={{ ...s.arrow, transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                                <span style={{ fontWeight: 'var(--font-medium)' }}>{row.toSafe}</span>
                            </td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }} dir="ltr">{row.amount.toLocaleString()} EGP</td>
                            <td style={s.td}>{row.cashier}</td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: row.status === 'completed' ? 'var(--color-success-light)' : 'var(--color-warning-light)', color: row.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                    {row.status === 'completed' ? t('txn.transfers.statusDone') : t('txn.transfers.statusPending')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
