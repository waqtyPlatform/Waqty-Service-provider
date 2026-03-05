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
    { id: 'SH-001', date: '2026-02-17', cashier: 'Nora Ali', safe: 'Cashier 1 Safe', openTime: '09:00', closeTime: '18:00', opening: 500, expected: 4700, actual: 4680, variance: -20, status: 'closed' },
    { id: 'SH-002', date: '2026-02-17', cashier: 'Sara Ahmed', safe: 'Cashier 2 Safe', openTime: '09:00', closeTime: '-', opening: 500, expected: 3100, actual: 0, variance: 0, status: 'open' },
    { id: 'SH-003', date: '2026-02-16', cashier: 'Nora Ali', safe: 'Cashier 1 Safe', openTime: '09:00', closeTime: '18:15', opening: 500, expected: 4600, actual: 4600, variance: 0, status: 'closed' },
    { id: 'SH-004', date: '2026-02-16', cashier: 'Sara Ahmed', safe: 'Cashier 2 Safe', openTime: '09:00', closeTime: '17:45', opening: 500, expected: 3050, actual: 3050, variance: 0, status: 'closed' },
    { id: 'SH-005', date: '2026-02-15', cashier: 'Nora Ali', safe: 'Cashier 1 Safe', openTime: '09:00', closeTime: '18:00', opening: 500, expected: 3300, actual: 3280, variance: -20, status: 'closed' },
    { id: 'SH-006', date: '2026-02-15', cashier: 'Sara Ahmed', safe: 'Cashier 2 Safe', openTime: '10:00', closeTime: '17:30', opening: 500, expected: 2200, actual: 2200, variance: 0, status: 'closed' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

export default function ShiftsPage() {
    const { t, lang } = useTranslation();
    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => <Link key={tab.href} href={tab.href} style={{ ...s.tab, ...(tab.href === '/transactions/shifts' ? s.tabActive : {}) }}>{t(tab.labelKey)}</Link>)}
            </div>

            <table style={s.table}>
                <thead><tr>{['txn.petty.thID', 'txn.thDateTime', 'txn.shifts.thCashier', 'txn.shifts.thSafe', 'txn.shifts.thOpen', 'txn.shifts.thClose', 'txn.shifts.thOpening', 'txn.shifts.thExpected', 'txn.shifts.thActual', 'txn.shifts.thVariance', 'txn.thStatus'].map(h => <th key={h} style={{ ...s.th as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(h)}</th>)}</tr></thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td><td style={s.td} dir="ltr">{row.date}</td><td style={s.td}>{row.cashier}</td>
                            <td style={s.td}>{row.safe}</td><td style={s.td} dir="ltr">{row.openTime}</td><td style={s.td} dir="ltr">{row.closeTime}</td>
                            <td style={s.td} dir="ltr">{row.opening} EGP</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }} dir="ltr">{row.expected.toLocaleString()} EGP</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }} dir="ltr">{row.status === 'open' ? '-' : `${row.actual.toLocaleString()} EGP`}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: row.variance < 0 ? 'var(--color-error)' : row.variance === 0 ? 'var(--color-success)' : 'var(--text-primary)' }} dir="ltr">
                                {row.status === 'open' ? '-' : `${row.variance} EGP`}
                            </td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: row.status === 'closed' ? 'var(--color-success-light)' : 'var(--color-info-light)', color: row.status === 'closed' ? 'var(--color-success)' : 'var(--color-info)' }}>
                                    {row.status === 'closed' ? t('txn.shifts.statusClosed') : t('txn.shifts.statusOpen')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
