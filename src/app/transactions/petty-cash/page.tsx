'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';

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
    { id: 'PC-001', date: '2026-02-17', category: 'Cleaning Supplies', description: 'Towels & Disinfectant', vendor: 'CleanCo', amount: 180, approvedBy: 'Sara Ahmed', status: 'approved' },
    { id: 'PC-002', date: '2026-02-17', category: 'Office Supplies', description: 'Paper, Ink Cartridge', vendor: 'OfficeMax', amount: 95, approvedBy: 'Sara Ahmed', status: 'approved' },
    { id: 'PC-003', date: '2026-02-17', category: 'Refreshments', description: 'Coffee, Tea, Water', vendor: 'Hypermarket', amount: 120, approvedBy: '-', status: 'pending' },
    { id: 'PC-004', date: '2026-02-16', category: 'Maintenance', description: 'AC Filter Replacement', vendor: 'CoolTech', amount: 350, approvedBy: 'Sara Ahmed', status: 'approved' },
    { id: 'PC-005', date: '2026-02-16', category: 'Staff Allowances', description: 'Team Lunch', vendor: 'Local Restaurant', amount: 450, approvedBy: 'Sara Ahmed', status: 'approved' },
    { id: 'PC-006', date: '2026-02-15', category: 'Cleaning Supplies', description: 'Salon Floor Cleaner', vendor: 'CleanCo', amount: 65, approvedBy: '-', status: 'pending' },
    { id: 'PC-007', date: '2026-02-15', category: 'Transport', description: 'Delivery from supplier', vendor: 'Careem', amount: 45, approvedBy: 'Sara Ahmed', status: 'approved' },
];

const catColors: Record<string, string> = { 'Cleaning Supplies': '#3B82F6', 'Office Supplies': '#8B5CF6', 'Refreshments': '#F59E0B', 'Maintenance': '#EF4444', 'Staff Allowances': '#EC4899', 'Transport': '#10B981' };

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    dot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block', marginRight: 8 },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
};

export default function PettyCashPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');
    const filtered = data.filter(d => d.description.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()));
    const total = data.reduce((a, d) => a + d.amount, 0);
    const pending = data.filter(d => d.status === 'pending').reduce((a, d) => a + d.amount, 0);

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => <Link key={tab.href} href={tab.href} style={{ ...s.tab, ...(tab.href === '/transactions/petty-cash' ? s.tabActive : {}) }}>{t(tab.labelKey)}</Link>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{total.toLocaleString()} EGP</div><div style={s.kpiLbl}>{t('txn.petty.total')}</div></div>
                <div style={s.kpi}><div style={{ ...s.kpiVal, color: 'var(--color-warning)' }} dir="ltr">{pending.toLocaleString()} EGP</div><div style={s.kpiLbl}>{t('txn.petty.pending')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal} dir="ltr">{data.length}</div><div style={s.kpiLbl}>{t('txn.petty.entries')}</div></div>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={{ ...s.searchIcon as React.CSSProperties, left: lang === 'ar' ? 'auto' : 12, right: lang === 'ar' ? 12 : 'auto' }} /><input style={{ ...s.searchInput, paddingLeft: lang === 'ar' ? 12 : 40, paddingRight: lang === 'ar' ? 40 : 12 }} placeholder={t('txn.petty.search')} value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.addBtn}><Plus size={16} /> {t('txn.petty.newEntry')}</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['txn.petty.thID', 'txn.thDateTime', 'txn.petty.thCategory', 'txn.thDescription', 'txn.petty.thVendor', 'txn.thAmount', 'txn.petty.thApprovedBy', 'txn.thStatus'].map(h => <th key={h} style={{ ...s.th as React.CSSProperties, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(h)}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td><td style={s.td} dir="ltr">{row.date}</td>
                            <td style={s.td}><span style={{ ...s.dot, background: catColors[row.category] || '#6B7280', [lang === 'ar' ? 'marginLeft' : 'marginRight']: 8 }} />{row.category}</td>
                            <td style={s.td}>{row.description}</td><td style={s.td}>{row.vendor}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-error)' }} dir="ltr">-{row.amount} EGP</td>
                            <td style={s.td}>{row.approvedBy}</td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: row.status === 'approved' ? 'var(--color-success-light)' : 'var(--color-warning-light)', color: row.status === 'approved' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                    {row.status === 'approved' ? t('txn.petty.statusApproved') : t('txn.petty.statusPending')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
