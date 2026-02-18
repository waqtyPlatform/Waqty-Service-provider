'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download } from 'lucide-react';

const data = [
    { id: 1, client: 'Fatima Ali', group: 'VIP', opening: 0, credits: 2500, debits: 2180, closing: 320, lastTxn: '2026-02-17' },
    { id: 2, client: 'Rania Khalil', group: 'VIP', opening: 150, credits: 1200, debits: 1350, closing: 0, lastTxn: '2026-02-16' },
    { id: 3, client: 'Noura Ahmed', group: 'Regular', opening: 0, credits: 800, debits: 400, closing: 400, lastTxn: '2026-02-15' },
    { id: 4, client: 'Huda Saleh', group: 'VIP', opening: 200, credits: 600, debits: 800, closing: 0, lastTxn: '2026-02-14' },
    { id: 5, client: 'Maryam Ibrahim', group: 'Regular', opening: 0, credits: 350, debits: 200, closing: 150, lastTxn: '2026-02-13' },
    { id: 6, client: 'Sama Latif', group: 'Regular', opening: 0, credits: 520, debits: 520, closing: 0, lastTxn: '2026-02-12' },
    { id: 7, client: 'Dana Faris', group: 'New', opening: 0, credits: 1500, debits: 1000, closing: 500, lastTxn: '2026-02-10' },
    { id: 8, client: 'Lina Qasim', group: 'Regular', opening: 100, credits: 300, debits: 250, closing: 150, lastTxn: '2026-02-11' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)' },
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
    exportBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'var(--bg-primary)' },
};

export default function StatementsPage() {
    const [search, setSearch] = useState('');
    const filtered = data.filter(d => d.client.toLowerCase().includes(search.toLowerCase()));
    const totalClosing = data.reduce((a, d) => a + d.closing, 0);

    return (
        <div style={s.page}>
            <div style={s.tabs}>
                <Link href="/customers" style={s.tab}>Clients</Link>
                <Link href="/customers/groups" style={s.tab}>Groups</Link>
                <Link href="/customers/statements" style={{ ...s.tab, ...s.tabActive }}>Statements</Link>
                <Link href="/customers/last-visits" style={s.tab}>Last Visits</Link>
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalClosing.toLocaleString()} EGP</div><div style={s.kpiLbl}>Total Outstanding</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.filter(d => d.closing > 0).length}</div><div style={s.kpiLbl}>Clients with Balance</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{data.reduce((a, d) => a + d.credits, 0).toLocaleString()} EGP</div><div style={s.kpiLbl}>Total Credits</div></div>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.exportBtn}><Download size={16} /> Export</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['Client', 'Group', 'Opening', 'Credits', 'Debits', 'Closing', 'Last Transaction'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(row => (
                        <tr key={row.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.client}</td>
                            <td style={s.td}>{row.group}</td>
                            <td style={s.td}>{row.opening} EGP</td>
                            <td style={{ ...s.td, color: 'var(--color-success)' }}>+{row.credits} EGP</td>
                            <td style={{ ...s.td, color: 'var(--color-error)' }}>-{row.debits} EGP</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: row.closing > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>{row.closing} EGP</td>
                            <td style={s.td}>{row.lastTxn}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
