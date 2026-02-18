'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, Edit, Trash2, Percent } from 'lucide-react';

const groups = [
    { id: 1, name: 'VIP Clients', members: 24, discount: 15, color: '#F59E0B', description: 'High-value repeat clients with priority booking', status: 'active' },
    { id: 2, name: 'Regular Members', members: 86, discount: 5, color: '#3B82F6', description: 'Standard membership with basic benefits', status: 'active' },
    { id: 3, name: 'New Clients', members: 32, discount: 10, color: '#10B981', description: 'First-time visitors with welcome offer', status: 'active' },
    { id: 4, name: 'Corporate Partners', members: 15, discount: 20, color: '#8B5CF6', description: 'Company partnership program employees', status: 'active' },
    { id: 5, name: 'Student Discount', members: 18, discount: 25, color: '#EC4899', description: 'Verified students with valid ID', status: 'active' },
    { id: 6, name: 'Loyalty Platinum', members: 8, discount: 30, color: '#6B7280', description: 'Top-tier loyalty program members', status: 'draft' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    cardBody: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', gap: 'var(--space-5)' },
    stat: { textAlign: 'center' },
    statVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    statLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    cardFooter: { display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function CustomerGroupsPage() {
    const [search, setSearch] = useState('');
    const filtered = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabs}>
                <Link href="/customers" style={s.tab}>Clients</Link>
                <Link href="/customers/groups" style={{ ...s.tab, ...s.tabActive }}>Groups</Link>
                <Link href="/customers/statements" style={s.tab}>Statements</Link>
                <Link href="/customers/last-visits" style={s.tab}>Last Visits</Link>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input style={s.searchInput} placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button style={s.addBtn}><Plus size={16} /> New Group</button>
            </div>

            <div style={s.grid}>
                {filtered.map(g => (
                    <div key={g.id} style={s.card}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: g.color }}><Users size={20} /></div>
                            <div>
                                <div style={s.cardTitle}>{g.name}</div>
                                <div style={s.cardDesc}>{g.description}</div>
                            </div>
                        </div>
                        <div style={s.cardBody as React.CSSProperties}>
                            <div style={s.stat as React.CSSProperties}>
                                <div style={s.statVal}>{g.members}</div>
                                <div style={s.statLbl}>Members</div>
                            </div>
                            <div style={s.stat as React.CSSProperties}>
                                <div style={{ ...s.statVal, color: 'var(--color-primary-600)' }}>{g.discount}%</div>
                                <div style={s.statLbl}>Discount</div>
                            </div>
                        </div>
                        <div style={s.cardFooter}>
                            <button style={s.btnIcon}><Edit size={14} /></button>
                            <button style={{ ...s.btnIcon, color: 'var(--color-error)' }}><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
