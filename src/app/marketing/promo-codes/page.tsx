'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Copy, Tag, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useToast, DropdownMenu, Modal, Input, Button, Select } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

const codes = [
    { id: 1, code: 'WELCOME50', discount: 50, type: 'fixed', uses: 67, limit: 200, minOrder: 200, expires: '2026-12-31', status: 'active' },
    { id: 2, code: 'EID25', discount: 25, type: 'percentage', uses: 34, limit: 50, minOrder: 300, expires: '2026-02-20', status: 'active' },
    { id: 3, code: 'VIP10', discount: 10, type: 'percentage', uses: 120, limit: 500, minOrder: 0, expires: '2026-06-30', status: 'active' },
    { id: 4, code: 'FRIDAY40', discount: 40, type: 'percentage', uses: 30, limit: 30, minOrder: 250, expires: '2026-02-07', status: 'exhausted' },
    { id: 5, code: 'REFER20', discount: 20, type: 'percentage', uses: 15, limit: 100, minOrder: 150, expires: '2026-04-30', status: 'active' },
    { id: 6, code: 'SUMMER100', discount: 100, type: 'fixed', uses: 0, limit: 50, minOrder: 500, expires: '2026-06-01', status: 'scheduled' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    scheduled: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    exhausted: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    code: { fontFamily: 'monospace', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 6 },
    copyBtn: { cursor: 'pointer', color: 'var(--text-tertiary)' },
    progress: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', width: 60 },
    progressFill: { height: '100%', borderRadius: 3 },
};

export default function PromoCodesPage() {
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<any>(null);

    const filtered = codes.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder="Search codes..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> Generate Code</button>
            </div>
            <table style={s.table}>
                <thead><tr>{['Code', 'Discount', 'Usage', '', 'Min. Order', 'Expires', 'Status', ''].map((h, i) => <th key={i} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(c => (
                        <tr key={c.id}>
                            <td style={s.td}><span style={s.code}><Tag size={12} /> {c.code} <Copy size={12} style={s.copyBtn} /></span></td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{c.type === 'percentage' ? `${c.discount}%` : `${c.discount} EGP`}</td>
                            <td style={s.td}>{c.uses}/{c.limit}</td>
                            <td style={s.td}><div style={s.progress}><div style={{ ...s.progressFill, width: `${c.uses / c.limit * 100}%`, background: c.uses >= c.limit ? 'var(--color-error)' : 'var(--color-primary-500)' }} /></div></td>
                            <td style={s.td}>{c.minOrder > 0 ? `${c.minOrder} EGP` : '—'}</td>
                            <td style={s.td}>{c.expires}</td>
                            <td style={s.td}><span style={{ ...s.badge, ...statusColors[c.status] }}>{c.status}</span></td>
                            <td style={{ ...s.td, textAlign: 'right' }}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: 'Edit', icon: <Edit size={14} />, onClick: () => { setSelectedPromo(c); setIsEditOpen(true); } },
                                        { label: 'Delete', destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedPromo(c); setIsDeleteOpen(true); } }
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Promo Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Generate Promo Code"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Code generated successfully'); }}>Save Code</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <div style={{ flex: 1 }}><Input label="Promo Code" placeholder="e.g. WELCOME10" /></div>
                        <div style={{ flex: 1 }}><Select label="Discount Type" options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed Amount', value: 'fixed' }]} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <div style={{ flex: 1 }}><Input label="Discount Value" type="number" placeholder="0" /></div>
                        <div style={{ flex: 1 }}><Input label="Usage Limit" type="number" placeholder="No Limit" /></div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <div style={{ flex: 1 }}><Input label="Min. Order Value (EGP)" type="number" placeholder="0" /></div>
                        <div style={{ flex: 1 }}><Input label="Expiration Date" type="date" /></div>
                    </div>
                    <Select label="Status" options={[{ label: 'Active', value: 'active' }, { label: 'Scheduled', value: 'scheduled' }]} />
                </div>
            </Modal>

            {/* Edit Promo Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedPromo(null); }}
                title="Edit Promo Code"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Code updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedPromo && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <div style={{ flex: 1 }}><Input label="Promo Code" defaultValue={selectedPromo.code} /></div>
                            <div style={{ flex: 1 }}><Select label="Discount Type" defaultValue={selectedPromo.type} options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed Amount', value: 'fixed' }]} /></div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <div style={{ flex: 1 }}><Input label="Discount Value" type="number" defaultValue={selectedPromo.discount} /></div>
                            <div style={{ flex: 1 }}><Input label="Usage Limit" type="number" defaultValue={selectedPromo.limit} /></div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <div style={{ flex: 1 }}><Input label="Min. Order Value (EGP)" type="number" defaultValue={selectedPromo.minOrder} /></div>
                            <div style={{ flex: 1 }}><Input label="Expiration Date" type="date" defaultValue={selectedPromo.expires} /></div>
                        </div>
                        <Select label="Status" defaultValue={selectedPromo.status} options={[{ label: 'Active', value: 'active' }, { label: 'Scheduled', value: 'scheduled' }, { label: 'Exhausted', value: 'exhausted' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedPromo(null); }}
                title="Delete Promo Code"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Code deleted permanently'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedPromo?.code}</strong> promo code?
                    </p>
                </div>
            </Modal>
        </div >
    );
}
