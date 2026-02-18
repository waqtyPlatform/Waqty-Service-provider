'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RotateCcw, Search, ChevronRight } from 'lucide-react';

const tabs = [
    { label: 'Returns List', href: '/returns' },
    { label: 'Cash Refund', href: '/returns/cash-refund' },
    { label: 'Petty Cash Refund', href: '/returns/petty-cash-refund' },
    { label: 'Cancel Down Payment', href: '/returns/cancel-down-payment' },
];

const transactions = [
    { id: 'TXN-2041', date: '2026-02-17', client: 'Fatima Ali', items: ['Haircut - 120 EGP', 'Blow Dry - 80 EGP', 'Product: Shampoo - 120 EGP'], total: 320, method: 'Cash' },
    { id: 'TXN-2042', date: '2026-02-17', client: 'Rania Khalil', items: ['Hair Coloring - 450 EGP'], total: 450, method: 'Cash' },
    { id: 'TXN-2039', date: '2026-02-16', client: 'Sama Latif', items: ['HydraFacial - 520 EGP'], total: 520, method: 'Cash' },
    { id: 'TXN-2038', date: '2026-02-16', client: 'Noura Ahmed', items: ['Keratin Treatment - 800 EGP'], total: 800, method: 'Cash' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    desc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 },
    steps: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' },
    step: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' },
    stepNum: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'var(--font-bold)' },
    stepActive: { background: 'var(--color-primary-500)', color: 'white' },
    stepPending: { background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' },
    stepDone: { background: 'var(--color-success)', color: 'white' },
    connector: { width: 24, height: 2, background: 'var(--border-color)' },
    searchBox: { position: 'relative', maxWidth: 400 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 42, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all var(--transition-fast)' },
    cardLeft: { display: 'flex', flexDirection: 'column', gap: 4 },
    cardId: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-primary-600)' },
    cardClient: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)' },
    cardMeta: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    cardAmount: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    form: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', marginBottom: 6, display: 'block' },
    select: { width: '100%', height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)' },
    textarea: { width: '100%', minHeight: 80, padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', resize: 'vertical' },
    submitBtn: { padding: 'var(--space-3) var(--space-6)', background: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' },
};

export default function CashRefundPage() {
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const filtered = transactions.filter(t => t.client.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/returns/cash-refund' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div><div style={s.title}>Process Cash Refund</div><div style={s.desc}>Select the original transaction and choose items to refund.</div></div>

            <div style={s.steps}>
                {['Select Transaction', 'Choose Items', 'Confirm Refund'].map((label, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <div style={{ ...s.connector, background: i <= step ? 'var(--color-success)' : 'var(--border-color)' }} />}
                        <div style={s.step}>
                            <div style={{ ...s.stepNum, ...(i < step ? s.stepDone : i === step ? s.stepActive : s.stepPending) }}>{i < step ? '✓' : i + 1}</div>
                            <span style={{ color: i === step ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: i === step ? 'var(--font-medium)' : 'var(--font-normal)' }}>{label}</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {step === 0 && (
                <>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input style={s.searchInput} placeholder="Search by transaction ID or client name..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {filtered.map((txn, i) => (
                            <div key={txn.id} style={{ ...s.card, borderColor: selected === i ? 'var(--color-primary-500)' : 'var(--border-color)' }} onClick={() => setSelected(i)}>
                                <div style={s.cardLeft as React.CSSProperties}>
                                    <div style={s.cardId}>{txn.id}</div>
                                    <div style={s.cardClient}>{txn.client}</div>
                                    <div style={s.cardMeta}>{txn.date} · {txn.method} · {txn.items.length} items</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div style={s.cardAmount}>{txn.total} EGP</div>
                                    <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {selected !== null && <button style={s.submitBtn} onClick={() => setStep(1)}>Continue →</button>}
                </>
            )}

            {step === 1 && selected !== null && (
                <div style={s.form}>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>Select items to refund from {transactions[selected].id}</div>
                    {transactions[selected].items.map((item, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: 'var(--color-primary-500)' }} /> {item}
                        </label>
                    ))}
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                        <button style={{ ...s.submitBtn, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={() => setStep(0)}>← Back</button>
                        <button style={s.submitBtn} onClick={() => setStep(2)}>Continue →</button>
                    </div>
                </div>
            )}

            {step === 2 && selected !== null && (
                <div style={s.form}>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>Confirm Refund Details</div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>Reason for Refund</label>
                        <select style={s.select}><option>Client Request</option><option>Service Issue</option><option>Product Defect</option><option>Double Charge</option><option>Other</option></select>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>Notes</label>
                        <textarea style={s.textarea as React.CSSProperties} placeholder="Additional notes..." />
                    </div>
                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-error-light)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Refund Amount</div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-error)' }}>-{transactions[selected].total} EGP</div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button style={{ ...s.submitBtn, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} onClick={() => setStep(1)}>← Back</button>
                        <button style={s.submitBtn}>Process Refund</button>
                    </div>
                </div>
            )}
        </div>
    );
}
