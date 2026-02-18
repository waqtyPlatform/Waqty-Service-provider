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
    { id: 1, name: 'Fatima Ali', group: 'VIP', visits: 47, totalSpend: 12400, avgTicket: 264, lastVisit: '2026-02-17', topService: 'Hair Coloring' },
    { id: 2, name: 'Rania Khalil', group: 'VIP', visits: 38, totalSpend: 9800, avgTicket: 258, lastVisit: '2026-02-16', topService: 'Keratin Treatment' },
    { id: 3, name: 'Noura Ahmed', group: 'Regular', visits: 32, totalSpend: 8200, avgTicket: 256, lastVisit: '2026-02-15', topService: 'Swedish Massage' },
    { id: 4, name: 'Huda Saleh', group: 'VIP', visits: 28, totalSpend: 7500, avgTicket: 268, lastVisit: '2026-02-14', topService: 'HydraFacial' },
    { id: 5, name: 'Maryam Ibrahim', group: 'Regular', visits: 24, totalSpend: 5400, avgTicket: 225, lastVisit: '2026-02-13', topService: 'Classic Facial' },
    { id: 6, name: 'Sama Latif', group: 'Regular', visits: 19, totalSpend: 4200, avgTicket: 221, lastVisit: '2026-02-12', topService: 'Gel Manicure' },
    { id: 7, name: 'Dana Faris', group: 'New', visits: 8, totalSpend: 2100, avgTicket: 263, lastVisit: '2026-02-10', topService: 'Deep Tissue' },
    { id: 8, name: 'Lina Qasim', group: 'Regular', visits: 15, totalSpend: 3600, avgTicket: 240, lastVisit: '2026-02-11', topService: 'Pedicure' },
];

const maxSpend = data[0].totalSpend;

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    bar: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', width: 80 },
    barFill: { height: '100%', borderRadius: 3, background: 'var(--color-primary-500)' },
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
};

const groupColors: Record<string, { bg: string; color: string }> = {
    VIP: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Regular: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    New: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
};

export default function ClientSalesPage() {
    const [search, setSearch] = useState('');
    const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/transactions/client-sales' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.exportBtn}><Download size={16} /> Export</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['Client', 'Group', 'Visits', 'Total Spend', '', 'Avg Ticket', 'Top Service', 'Last Visit'].map((h, i) => <th key={i} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(row => (
                        <tr key={row.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.name}</td>
                            <td style={s.td}><span style={{ ...s.badge, ...groupColors[row.group] }}>{row.group}</span></td>
                            <td style={s.td}>{row.visits}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{row.totalSpend.toLocaleString()} EGP</td>
                            <td style={s.td}><div style={s.bar}><div style={{ ...s.barFill, width: `${row.totalSpend / maxSpend * 100}%` }} /></div></td>
                            <td style={s.td}>{row.avgTicket} EGP</td>
                            <td style={s.td}>{row.topService}</td>
                            <td style={s.td}>{row.lastVisit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
