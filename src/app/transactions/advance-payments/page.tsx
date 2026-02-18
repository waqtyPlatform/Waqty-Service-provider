'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download } from 'lucide-react';

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
    { id: 'ADV-001', date: '2026-02-17', client: 'Fatima Ali', booking: 'BK-1042', service: 'Bridal Package', total: 2500, paid: 1000, balance: 1500, status: 'partial' },
    { id: 'ADV-002', date: '2026-02-16', client: 'Noura Ahmed', booking: 'BK-1038', service: 'Keratin + Color', total: 1200, paid: 600, balance: 600, status: 'partial' },
    { id: 'ADV-003', date: '2026-02-15', client: 'Rania Khalil', booking: 'BK-1035', service: 'VIP Monthly', total: 1200, paid: 1200, balance: 0, status: 'paid' },
    { id: 'ADV-004', date: '2026-02-14', client: 'Huda Saleh', booking: 'BK-1030', service: 'Relaxation Retreat', total: 800, paid: 400, balance: 400, status: 'partial' },
    { id: 'ADV-005', date: '2026-02-13', client: 'Maryam Ibrahim', booking: 'BK-1028', service: 'Deep Tissue x3', total: 600, paid: 200, balance: 400, status: 'partial' },
    { id: 'ADV-006', date: '2026-02-12', client: 'Sama Latif', booking: 'BK-1025', service: 'Hair Transformation', total: 1500, paid: 1500, balance: 0, status: 'paid' },
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
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
};

export default function AdvancePaymentsPage() {
    const [search, setSearch] = useState('');
    const filtered = data.filter(d => d.client.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/transactions/advance-payments' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{data.reduce((a, d) => a + d.paid, 0).toLocaleString()} EGP</div><div style={s.kpiLbl}>Total Collected</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.reduce((a, d) => a + d.balance, 0).toLocaleString()} EGP</div><div style={s.kpiLbl}>Outstanding Balance</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.filter(d => d.status === 'partial').length}</div><div style={s.kpiLbl}>Pending Collection</div></div>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search advance payments..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.exportBtn}><Download size={16} /> Export</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['ID', 'Date', 'Client', 'Booking', 'Service', 'Total', 'Paid', 'Balance', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td><td style={s.td}>{row.date}</td><td style={s.td}>{row.client}</td>
                            <td style={s.td}>{row.booking}</td><td style={s.td}>{row.service}</td>
                            <td style={s.td}>{row.total} EGP</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{row.paid} EGP</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: row.balance > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>{row.balance} EGP</td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, background: row.status === 'paid' ? 'var(--color-success-light)' : 'var(--color-warning-light)', color: row.status === 'paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>{row.status === 'paid' ? '✓ Paid' : '◐ Partial'}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
