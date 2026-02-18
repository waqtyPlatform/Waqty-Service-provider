'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    RotateCcw,
    Receipt,
    Wallet,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';

const returns = [
    { id: 'RTN-301', date: 'Feb 17, 2026', time: '10:30', type: 'service', originalTxn: 'TXN-2045', client: 'Huda Saleh', item: 'Gel Manicure', reason: 'Client dissatisfied with result', amount: 150, method: 'Cash', status: 'approved', employee: 'Hana Youssef' },
    { id: 'RTN-300', date: 'Feb 16, 2026', time: '15:00', type: 'product', originalTxn: 'TXN-2031', client: 'Sama Latif', item: 'Olaplex No.3 Hair Perfector', reason: 'Allergic reaction', amount: 250, method: 'Card', status: 'approved', employee: 'Sara Ahmed' },
    { id: 'RTN-299', date: 'Feb 15, 2026', time: '11:45', type: 'service', originalTxn: 'TXN-2028', client: 'Noura Ahmed', item: 'Swedish Massage', reason: 'Service not completed – emergency', amount: 300, method: 'Cash', status: 'pending', employee: 'Reem Mohamed' },
    { id: 'RTN-298', date: 'Feb 14, 2026', time: '13:00', type: 'advance', originalTxn: 'TXN-2025', client: 'Rania Khalil', item: 'Bridal Package Down Payment', reason: 'Wedding postponed', amount: 1000, method: 'Card', status: 'approved', employee: 'Nora Ali' },
    { id: 'RTN-297', date: 'Feb 12, 2026', time: '09:15', type: 'product', originalTxn: 'TXN-2020', client: 'Dana Faris', item: 'Facial Masks (x3)', reason: 'Wrong product delivered', amount: 180, method: 'Cash', status: 'approved', employee: 'Layla Hassan' },
    { id: 'RTN-296', date: 'Feb 10, 2026', time: '16:30', type: 'petty', originalTxn: 'TXN-2015', client: '—', item: 'Petty Cash Refund – Supplier Overcharge', reason: 'Vendor corrected invoice', amount: 120, method: 'Internal', status: 'approved', employee: 'Admin' },
    { id: 'RTN-295', date: 'Feb 8, 2026', time: '12:00', type: 'service', originalTxn: 'TXN-2010', client: 'Maryam Ibrahim', item: 'HydraFacial', reason: 'Double booking – service cancelled', amount: 450, method: 'Card', status: 'rejected', employee: 'Nora Ali' },
];

const typeConfig: Record<string, { bg: string; color: string; label: string }> = {
    service: { bg: 'var(--color-info-light)', color: 'var(--color-info)', label: 'Service' },
    product: { bg: '#EDE9FE', color: '#7C3AED', label: 'Product' },
    advance: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Advance' },
    petty: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)', label: 'Petty Cash' },
};

const statusConfig: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    approved: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Approved', icon: <CheckCircle2 size={12} /> },
    pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Pending', icon: <Clock size={12} /> },
    rejected: { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: 'Rejected', icon: <XCircle size={12} /> },
};

const tabItems = [
    { label: 'All Returns', key: 'all', icon: <RotateCcw size={16} /> },
    { label: 'Service Refunds', key: 'service', icon: <Receipt size={16} /> },
    { label: 'Product Returns', key: 'product', icon: <AlertCircle size={16} /> },
    { label: 'Advance Cancellations', key: 'advance', icon: <CreditCard size={16} /> },
    { label: 'Petty Cash Refunds', key: 'petty', icon: <Wallet size={16} /> },
];

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    sub: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', cursor: 'pointer', whiteSpace: 'nowrap' as const },
    tabA: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
    kpiL: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    kpiV: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginTop: 'var(--space-1)' },
    ctrl: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' as const, alignItems: 'center' },
    sw: { position: 'relative' as const, flex: '1', minWidth: 200, maxWidth: 320 },
    si: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' as const },
    inp: { width: '100%', height: 40, padding: '0 var(--space-4) 0 36px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    btnP: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { textAlign: 'left' as const, padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' as const },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' as const },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' },
    pag: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--border-color)' },
};

export default function ReturnsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = returns.filter((r) => {
        const matchSearch = r.client.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toLowerCase().includes(search.toLowerCase()) ||
            r.item.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'all' || r.type === activeTab;
        return matchSearch && matchTab;
    });

    const totalRefunded = returns.filter(r => r.status === 'approved').reduce((s, r) => s + r.amount, 0);
    const pendingCount = returns.filter(r => r.status === 'pending').length;

    return (
        <div style={cs.page}>
            <div style={cs.header}>
                <div>
                    <h1 style={cs.h1}>Returns & Refunds</h1>
                    <p style={cs.sub}>Manage refunds, product returns, and advance cancellations.</p>
                </div>
                <button style={cs.btnP}><Plus size={16} /> New Return</button>
            </div>

            <div style={cs.tabs}>
                {tabItems.map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} style={activeTab === t.key ? { ...cs.tab, ...cs.tabA } : cs.tab}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div style={cs.kpiRow}>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Total Returns</div>
                    <div style={cs.kpiV}>{returns.length}</div>
                </div>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Total Refunded</div>
                    <div style={{ ...cs.kpiV, color: 'var(--color-error)' }}>{totalRefunded.toLocaleString()} EGP</div>
                </div>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Pending Approval</div>
                    <div style={{ ...cs.kpiV, color: 'var(--color-warning)' }}>{pendingCount}</div>
                </div>
                <div style={cs.kpi}>
                    <div style={cs.kpiL}>Avg Refund Time</div>
                    <div style={cs.kpiV}>1.2 days</div>
                </div>
            </div>

            <div style={cs.ctrl}>
                <div style={cs.sw}>
                    <Search size={16} style={cs.si} />
                    <input style={cs.inp} placeholder="Search returns..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>

            <div style={cs.card}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={cs.th}>Return #</th>
                            <th style={cs.th}>Date</th>
                            <th style={cs.th}>Type</th>
                            <th style={cs.th}>Client</th>
                            <th style={cs.th}>Item</th>
                            <th style={cs.th}>Reason</th>
                            <th style={{ ...cs.th, textAlign: 'right' }}>Amount</th>
                            <th style={cs.th}>Status</th>
                            <th style={cs.th}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r) => {
                            const tp = typeConfig[r.type];
                            const st = statusConfig[r.status];
                            return (
                                <tr key={r.id} style={{ transition: 'background var(--transition-fast)' }}>
                                    <td style={{ ...cs.td, color: 'var(--color-primary-500)', fontWeight: 'var(--font-medium)', cursor: 'pointer' }}>{r.id}</td>
                                    <td style={cs.td}>
                                        <div style={{ fontWeight: 'var(--font-medium)' }}>{r.date}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{r.time}</div>
                                    </td>
                                    <td style={cs.td}>
                                        <span style={{ ...cs.badge, background: tp.bg, color: tp.color }}>{tp.label}</span>
                                    </td>
                                    <td style={{ ...cs.td, fontWeight: r.client !== '—' ? 'var(--font-medium)' : undefined }}>
                                        {r.client}
                                    </td>
                                    <td style={{ ...cs.td, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.item}</td>
                                    <td style={{ ...cs.td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>{r.reason}</td>
                                    <td style={{ ...cs.td, textAlign: 'right', fontWeight: 'var(--font-semibold)', color: 'var(--color-error)' }}>
                                        -{r.amount.toLocaleString()} EGP
                                    </td>
                                    <td style={cs.td}>
                                        <span style={{ ...cs.badge, background: st.bg, color: st.color }}>
                                            {st.icon} {st.label}
                                        </span>
                                    </td>
                                    <td style={cs.td}>
                                        <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', color: 'var(--text-tertiary)' }}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={cs.pag}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Showing {filtered.length} of {returns.length}</span>
                </div>
            </div>
        </div>
    );
}
