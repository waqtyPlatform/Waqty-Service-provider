'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Users, Briefcase } from 'lucide-react';

const departments = [
    { id: 1, name: 'Hair Styling', manager: 'Sara Ahmed', employees: 4, color: '#F59E0B', status: 'active' },
    { id: 2, name: 'Skin Care', manager: 'Nora Ali', employees: 3, color: '#EC4899', status: 'active' },
    { id: 3, name: 'Massage & Body', manager: 'Layla Hassan', employees: 2, color: '#10B981', status: 'active' },
    { id: 4, name: 'Nails', manager: 'Hana Youssef', employees: 2, color: '#3B82F6', status: 'active' },
    { id: 5, name: 'Reception', manager: 'Dina Nabil', employees: 2, color: '#8B5CF6', status: 'active' },
    { id: 6, name: 'Administration', manager: 'Sara Ahmed', employees: 1, color: '#6B7280', status: 'active' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    dot: { width: 10, height: 10, borderRadius: '50%', display: 'inline-block', marginRight: 8 },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function DepartmentsPage() {
    const [search, setSearch] = useState('');
    const filtered = departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Departments</div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search departments..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.addBtn}><Plus size={16} /> New Department</button>
            </div>

            <table style={s.table}>
                <thead><tr>{['Department', 'Manager', 'Employees', 'Status', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(d => (
                        <tr key={d.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}><span style={{ ...s.dot, background: d.color }} />{d.name}</td>
                            <td style={s.td}>{d.manager}</td>
                            <td style={s.td}><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} /> {d.employees}</div></td>
                            <td style={s.td}><span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>Active</span></td>
                            <td style={s.td}><div style={s.actions}><button style={s.btnIcon}><Edit size={14} /></button><button style={{ ...s.btnIcon, color: 'var(--color-error)' }}><Trash2 size={14} /></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
