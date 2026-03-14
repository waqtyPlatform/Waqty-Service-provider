'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download } from 'lucide-react';

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
    { id: 'CS-001', date: '2026-03-14', time: '09:15', client: 'Fatima Ali', services: 'Haircut, Blow Dry', amount: 320, method: 'Cash', receipt: 'RCP-2041', cashier: 'Nora' },
    { id: 'CS-002', date: '2026-03-23', time: '10:30', client: 'Rania Khalil', services: 'Hair Coloring', amount: 450, method: 'Cash', receipt: 'RCP-2042', cashier: 'Nora' },
    { id: 'CS-003', date: '2026-03-17', time: '11:00', client: 'Walk-in', services: 'Classic Facial', amount: 280, method: 'Cash', receipt: 'RCP-2043', cashier: 'Nora' },
    { id: 'CS-004', date: '2026-03-21', time: '12:45', client: 'Huda Saleh', services: 'Manicure, Pedicure', amount: 180, method: 'Cash', receipt: 'RCP-2044', cashier: 'Sara' },
    { id: 'CS-005', date: '2026-03-18', time: '14:00', client: 'Maryam Ibrahim', services: 'Swedish Massage', amount: 350, method: 'Cash', receipt: 'RCP-2045', cashier: 'Sara' },
    { id: 'CS-006', date: '2026-03-15', time: '09:30', client: 'Noura Ahmed', services: 'Keratin Treatment', amount: 800, method: 'Cash', receipt: 'RCP-2038', cashier: 'Nora' },
    { id: 'CS-007', date: '2026-03-23', time: '11:15', client: 'Sama Latif', services: 'HydraFacial', amount: 520, method: 'Cash', receipt: 'RCP-2039', cashier: 'Nora' },
    { id: 'CS-008', date: '2026-03-12', time: '13:00', client: 'Lina Qasim', services: 'Gel Nails', amount: 150, method: 'Cash', receipt: 'RCP-2040', cashier: 'Sara' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    amount: { fontWeight: 'var(--font-semibold)', color: 'var(--color-success)' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
};

export default function CashSalesPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const filtered = data.filter(d => d.client.toLowerCase().includes(search.toLowerCase()) || d.services.toLowerCase().includes(search.toLowerCase()));
    const total = filtered.reduce((s, d) => s + d.amount, 0);

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => (
                    <Link key={tab.href} href={tab.href} style={{ ...s.tab, ...(tab.href === '/transactions/cash-sales' ? s.tabActive : {}) }}>{t(tab.labelKey)}</Link>
                ))}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{total.toLocaleString()} EGP</div><div style={s.kpiLbl}>{t('txn.cash.total')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{filtered.length}</div><div style={s.kpiLbl}>{t('txn.transactions')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{Math.round(total / Math.max(filtered.length, 1))} EGP</div><div style={s.kpiLbl}>{t('txn.cash.avgTicket')}</div></div>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={{ ...s.searchIcon as React.CSSProperties, left: lang === 'ar' ? 'auto' : 12, right: lang === 'ar' ? 12 : 'auto' }} />
                    <input style={{ ...s.searchInput, paddingLeft: lang === 'ar' ? 12 : 40, paddingRight: lang === 'ar' ? 40 : 12 }} placeholder={t('txn.cash.search')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button style={s.exportBtn}><Download size={16} /> {t('txn.export')}</button>
            </div>

            <table style={s.table}>
                <thead><tr>
                    {['txn.thTxnNum', 'txn.thDateTime', 'txn.cash.thTime', 'txn.thClient', 'txn.cash.thServices', 'txn.thAmount', 'txn.cash.thReceipt', 'txn.cash.thCashier'].map(h => <th key={h} style={{ ...s.th as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(h)}</th>)}
                </tr></thead>
                <tbody>
                    {filtered.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td>
                            <td style={s.td} dir="ltr">{row.date}</td>
                            <td style={s.td} dir="ltr">{row.time}</td>
                            <td style={s.td}>{row.client}</td>
                            <td style={s.td}>{row.services}</td>
                            <td style={{ ...s.td, ...s.amount }} dir="ltr">{row.amount} EGP</td>
                            <td style={s.td}>{row.receipt}</td>
                            <td style={s.td}>{row.cashier}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
