'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const positions = [
    { id: 1, title: 'Senior Stylist', level: 'Senior', department: 'Hair Styling', employees: 2, minSalary: 6000, maxSalary: 10000 },
    { id: 2, title: 'Junior Stylist', level: 'Junior', department: 'Hair Styling', employees: 2, minSalary: 3000, maxSalary: 5000 },
    { id: 3, title: 'Skin Specialist', level: 'Senior', department: 'Skin Care', employees: 2, minSalary: 5500, maxSalary: 9000 },
    { id: 4, title: 'Esthetician', level: 'Mid', department: 'Skin Care', employees: 1, minSalary: 4000, maxSalary: 6500 },
    { id: 5, title: 'Senior Therapist', level: 'Senior', department: 'Massage & Body', employees: 1, minSalary: 5000, maxSalary: 8000 },
    { id: 6, title: 'Massage Therapist', level: 'Mid', department: 'Massage & Body', employees: 1, minSalary: 3500, maxSalary: 5500 },
    { id: 7, title: 'Nail Technician', level: 'Mid', department: 'Nails', employees: 2, minSalary: 3000, maxSalary: 5000 },
    { id: 8, title: 'Receptionist', level: 'Entry', department: 'Reception', employees: 2, minSalary: 2500, maxSalary: 4000 },
    { id: 9, title: 'Branch Manager', level: 'Management', department: 'Administration', employees: 1, minSalary: 8000, maxSalary: 15000 },
];

const levelColors: Record<string, { bg: string; color: string }> = {
    Senior: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Mid: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    Junior: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    Entry: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
    Management: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

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
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function PositionsPage() {
    const [search, setSearch] = useState('');
    const filtered = positions.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Positions</div>
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search positions..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.addBtn}><Plus size={16} /> New Position</button>
            </div>
            <table style={s.table}>
                <thead><tr>{['Title', 'Level', 'Department', 'Employees', 'Salary Range', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(p => (
                        <tr key={p.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{p.title}</td>
                            <td style={s.td}><span style={{ ...s.badge, ...levelColors[p.level] }}>{p.level}</span></td>
                            <td style={s.td}>{p.department}</td>
                            <td style={s.td}>{p.employees}</td>
                            <td style={s.td}>{p.minSalary.toLocaleString()} – {p.maxSalary.toLocaleString()} EGP</td>
                            <td style={s.td}><div style={s.actions}><button style={s.btnIcon}><Edit size={14} /></button><button style={{ ...s.btnIcon, color: 'var(--color-error)' }}><Trash2 size={14} /></button></div></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
