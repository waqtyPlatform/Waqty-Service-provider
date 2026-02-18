'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, AlertTriangle } from 'lucide-react';

const tabs = [
    { label: 'Returns List', href: '/returns' },
    { label: 'Cash Refund', href: '/returns/cash-refund' },
    { label: 'Petty Cash Refund', href: '/returns/petty-cash-refund' },
    { label: 'Cancel Down Payment', href: '/returns/cancel-down-payment' },
];

const bookings = [
    { id: 'BK-1042', client: 'Fatima Ali', service: 'Bridal Glow Package', date: '2026-04-17', paid: 1000, total: 2500 },
    { id: 'BK-1038', client: 'Noura Ahmed', service: 'Keratin + Color', date: '2026-03-10', paid: 600, total: 1200 },
    { id: 'BK-1030', client: 'Huda Saleh', service: 'Relaxation Retreat', date: '2026-03-01', paid: 400, total: 800 },
    { id: 'BK-1028', client: 'Maryam Ibrahim', service: 'Deep Tissue x3', date: '2026-02-28', paid: 200, total: 600 },
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
    warning: { display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-warning-light)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    submitBtn: { padding: 'var(--space-3) var(--space-6)', background: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)' },
};

export default function CancelDownPaymentPage() {
    const [selected, setSelected] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const filtered = bookings.filter(b => b.client.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/returns/cancel-down-payment' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div><div style={s.title}>Cancel Down Payment</div><div style={s.desc}>Select a booking with an advance payment to process cancellation.</div></div>

            {selected === null ? (
                <>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input style={s.searchInput} placeholder="Search by booking ID or client..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {filtered.map((bk, i) => (
                            <div key={bk.id} style={s.card} onClick={() => setSelected(i)}>
                                <div>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' }}>{bk.id}</div>
                                    <div style={{ fontWeight: 'var(--font-medium)' }}>{bk.client}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{bk.service} · Scheduled: {bk.date}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-warning)' }}>{bk.paid} EGP paid</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>of {bk.total} EGP total</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div style={s.form}>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>Cancel: {bookings[selected].id}</div>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                        <div><strong>Client:</strong> {bookings[selected].client}</div>
                        <div><strong>Service:</strong> {bookings[selected].service}</div>
                        <div><strong>Scheduled:</strong> {bookings[selected].date}</div>
                        <div><strong>Down Payment:</strong> {bookings[selected].paid} EGP</div>
                    </div>
                    <div style={s.warning}>
                        <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
                        <div>This will cancel the booking and refund {bookings[selected].paid} EGP to the client. This action cannot be undone.</div>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>Cancellation Reason</label>
                        <select style={s.select}><option>Client Request</option><option>Schedule Conflict</option><option>Service Unavailable</option><option>Other</option></select>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>Notes</label>
                        <textarea style={s.textarea as React.CSSProperties} placeholder="Additional notes..." />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button style={{ ...s.submitBtn, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={() => setSelected(null)}>← Back</button>
                        <button style={s.submitBtn}>Cancel & Refund {bookings[selected].paid} EGP</button>
                    </div>
                </div>
            )}
        </div>
    );
}
