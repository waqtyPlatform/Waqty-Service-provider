'use client';

import React from 'react';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';

const serviceRates = [
    { id: 1, service: 'Hair Coloring', category: 'Hair', rate: 10, minTarget: 5000, bonus: 500 },
    { id: 2, service: 'Keratin Treatment', category: 'Hair', rate: 12, minTarget: 4000, bonus: 400 },
    { id: 3, service: 'HydraFacial', category: 'Skin', rate: 10, minTarget: 3000, bonus: 300 },
    { id: 4, service: 'Classic Facial', category: 'Skin', rate: 8, minTarget: 2000, bonus: 200 },
    { id: 5, service: 'Swedish Massage', category: 'Body', rate: 10, minTarget: 3000, bonus: 300 },
    { id: 6, service: 'Deep Tissue Massage', category: 'Body', rate: 12, minTarget: 2500, bonus: 250 },
    { id: 7, service: 'Gel Manicure', category: 'Nails', rate: 8, minTarget: 1500, bonus: 150 },
    { id: 8, service: 'Pedicure', category: 'Nails', rate: 8, minTarget: 1500, bonus: 150 },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardTitle: { padding: 'var(--space-4) var(--space-5)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    table: { width: '100%' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    saveBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' },
};

export default function CommissionSettingsPage() {
    return (
        <div style={s.page}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Commission Settings</div>

            <div style={s.card}>
                <div style={s.cardTitle}>
                    <span>Commission Rates by Service</span>
                    <button style={s.addBtn}><Plus size={14} /> Add Rate</button>
                </div>
                <table style={s.table}>
                    <thead><tr>{['Service', 'Category', 'Rate %', 'Min Target (EGP)', 'Bonus (EGP)', 'Actions'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                    <tbody>
                        {serviceRates.map(r => (
                            <tr key={r.id}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{r.service}</td>
                                <td style={s.td}>{r.category}</td>
                                <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{r.rate}%</td>
                                <td style={s.td}>{r.minTarget.toLocaleString()}</td>
                                <td style={s.td}>{r.bonus.toLocaleString()}</td>
                                <td style={s.td}><div style={s.actions}><button style={s.btnIcon}><Edit size={14} /></button><button style={{ ...s.btnIcon, color: 'var(--color-error)' }}><Trash2 size={14} /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button style={s.saveBtn}><Save size={16} /> Save Settings</button>
        </div>
    );
}

