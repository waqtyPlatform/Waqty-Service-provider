'use client';

import React from 'react';
import Link from 'next/link';
import { Vault, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

const safes = [
    { name: 'Main Safe', type: 'Main', opening: 5000, deposits: 12550, withdrawals: 3200, balance: 14350, color: '#10B981' },
    { name: 'Cashier 1 Safe', type: 'Cashier', opening: 500, deposits: 4200, withdrawals: 4200, balance: 500, color: '#3B82F6' },
    { name: 'Cashier 2 Safe', type: 'Cashier', opening: 500, deposits: 3100, withdrawals: 3100, balance: 500, color: '#8B5CF6' },
    { name: 'Bank Account', type: 'Bank', opening: 45000, deposits: 10000, withdrawals: 0, balance: 55000, color: '#F59E0B' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    safeName: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    safeType: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    balance: { marginLeft: 'auto', textAlign: 'right' },
    balVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    balLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    rows: { borderTop: '1px solid var(--border-color)' },
    row: { display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--border-color)', fontSize: 'var(--text-sm)' },
    rowLabel: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)' },
    rowVal: { fontWeight: 'var(--font-semibold)' },
};

export default function SafeBalancesPage() {
    const { t, lang } = useTranslation();
    const totalBalance = safes.reduce((a, s) => a + s.balance, 0);
    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => <Link key={tab.href} href={tab.href} style={{ ...s.tab, ...(tab.href === '/transactions/safe-balances' ? s.tabActive : {}) }}>{t(tab.labelKey)}</Link>)}
            </div>

            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{t('txn.safe.total')}</div>
                <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)', marginTop: 4 }} dir="ltr">{totalBalance.toLocaleString()} EGP</div>
            </div>

            <div style={s.grid}>
                {safes.map(safe => (
                    <div key={safe.name} style={s.card}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: safe.color }}><Vault size={20} /></div>
                            <div>
                                <div style={s.safeName}>{safe.name}</div>
                                <div style={s.safeType}>{safe.type}</div>
                            </div>
                            <div style={{ ...s.balance as React.CSSProperties, marginLeft: lang === 'ar' ? 0 : 'auto', marginRight: lang === 'ar' ? 'auto' : 0, textAlign: lang === 'ar' ? 'left' : 'right' }}>
                                <div style={s.balVal} dir="ltr">{safe.balance.toLocaleString()}</div>
                                <div style={s.balLbl}>{t('txn.safe.current')}</div>
                            </div>
                        </div>
                        <div style={s.rows}>
                            <div style={s.row}><span style={s.rowLabel}><Minus size={14} /> {t('txn.safe.opening')}</span><span style={s.rowVal} dir="ltr">{safe.opening.toLocaleString()} EGP</span></div>
                            <div style={s.row}><span style={{ ...s.rowLabel, color: 'var(--color-success)' }}><TrendingUp size={14} /> {t('txn.safe.deposits')}</span><span style={{ ...s.rowVal, color: 'var(--color-success)' }} dir="ltr">+{safe.deposits.toLocaleString()} EGP</span></div>
                            <div style={{ ...s.row, borderBottom: 'none' }}><span style={{ ...s.rowLabel, color: 'var(--color-error)' }}><TrendingDown size={14} /> {t('txn.safe.withdrawals')}</span><span style={{ ...s.rowVal, color: 'var(--color-error)' }} dir="ltr">-{safe.withdrawals.toLocaleString()} EGP</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
