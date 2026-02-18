'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';

const tabs = [
    { label: 'Returns List', href: '/returns' },
    { label: 'Cash Refund', href: '/returns/cash-refund' },
    { label: 'Petty Cash Refund', href: '/returns/petty-cash-refund' },
    { label: 'Cancel Down Payment', href: '/returns/cancel-down-payment' },
];

const entries = [
    { id: 'PC-001', date: '2026-02-17', category: 'Cleaning Supplies', description: 'Towels & Disinfectant', vendor: 'CleanCo', amount: 180 },
    { id: 'PC-002', date: '2026-02-17', category: 'Office Supplies', description: 'Paper, Ink Cartridge', vendor: 'OfficeMax', amount: 95 },
    { id: 'PC-004', date: '2026-02-16', category: 'Maintenance', description: 'AC Filter Replacement', vendor: 'CoolTech', amount: 350 },
    { id: 'PC-005', date: '2026-02-16', category: 'Beauty Products', description: 'Hair Color Tubes x10', vendor: "L'Oreal Pro", amount: 450 },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    desc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 },
    searchBox: { position: 'relative', maxWidth: 400 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 42, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
    form: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', maxWidth: 500 },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 6, display: 'block' },
    select: { width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)' },
    textarea: { width: '100%', minHeight: 80, padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', resize: 'vertical' },
    submitBtn: { padding: 'var(--space-3) var(--space-6)', background: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)' },
};

export default function PettyCashRefundPage() {
    const [selected, setSelected] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const filtered = entries.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/returns/petty-cash-refund' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div><div style={s.title}>Petty Cash Refund</div><div style={s.desc}>Search for a petty cash entry to process a refund.</div></div>

            {selected === null ? (
                <>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input style={s.searchInput} placeholder="Search by ID or description..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {filtered.map((entry, i) => (
                            <div key={entry.id} style={s.card} onClick={() => setSelected(i)}>
                                <div>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{entry.id}</div>
                                    <div style={{ fontWeight: 'var(--font-medium)' }}>{entry.description}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{entry.date} · {entry.category} · {entry.vendor}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>{entry.amount} EGP</div>
                                    <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={s.form}>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>Refund: {entries[selected].description}</div>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                        <div><strong>ID:</strong> {entries[selected].id}</div>
                        <div><strong>Category:</strong> {entries[selected].category}</div>
                        <div><strong>Vendor:</strong> {entries[selected].vendor}</div>
                        <div><strong>Amount:</strong> {entries[selected].amount} EGP</div>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>Reason for Refund</label>
                        <select style={s.select}><option>Item Returned</option><option>Duplicate Entry</option><option>Wrong Amount</option><option>Other</option></select>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>Notes</label>
                        <textarea style={s.textarea as React.CSSProperties} placeholder="Additional notes..." />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button style={{ ...s.submitBtn, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={() => setSelected(null)}>← Back</button>
                        <button style={s.submitBtn}>Process Refund</button>
                    </div>
                </div>
            )}
        </div>
    );
}
