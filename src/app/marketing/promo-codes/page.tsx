'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Copy, Tag, Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { useToast, DropdownMenu, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';

// Mock client usage data per promo code
const clientUsageData: Record<number, Array<{ name: string; phone: string; usedAt: string; orderAmount: number; discount: number }>> = {
    1: [
        { name: 'Fatima Ali', phone: '+201012345678', usedAt: '2026-02-15 10:00', orderAmount: 450, discount: 50 },
        { name: 'Noura Ahmed', phone: '+201087654321', usedAt: '2026-02-14 14:30', orderAmount: 380, discount: 50 },
        { name: 'Huda Saleh', phone: '+201055667788', usedAt: '2026-02-12 11:00', orderAmount: 600, discount: 50 },
        { name: 'Rania Khalil', phone: '+201099887766', usedAt: '2026-02-10 16:20', orderAmount: 280, discount: 50 },
        { name: 'Sara Mahmoud', phone: '+201011223344', usedAt: '2026-02-08 09:45', orderAmount: 520, discount: 50 },
    ],
    2: [
        { name: 'Layla Hassan', phone: '+201077889900', usedAt: '2026-02-18 11:30', orderAmount: 450, discount: 113 },
        { name: 'Mona Tarek', phone: '+201044556677', usedAt: '2026-02-17 15:00', orderAmount: 380, discount: 95 },
        { name: 'Hana Ali', phone: '+201033445566', usedAt: '2026-02-16 10:00', orderAmount: 520, discount: 130 },
    ],
    3: [
        { name: 'Fatima Ali', phone: '+201012345678', usedAt: '2026-03-01 09:00', orderAmount: 200, discount: 20 },
        { name: 'Noura Ahmed', phone: '+201087654321', usedAt: '2026-03-02 14:00', orderAmount: 350, discount: 35 },
    ],
    4: [
        { name: 'Huda Saleh', phone: '+201055667788', usedAt: '2026-02-07 10:00', orderAmount: 300, discount: 120 },
        { name: 'Rania Khalil', phone: '+201099887766', usedAt: '2026-02-07 11:00', orderAmount: 400, discount: 160 },
        { name: 'Sara Mahmoud', phone: '+201011223344', usedAt: '2026-02-07 12:30', orderAmount: 250, discount: 100 },
        { name: 'Layla Hassan', phone: '+201077889900', usedAt: '2026-02-07 14:00', orderAmount: 500, discount: 200 },
    ],
    5: [
        { name: 'Mona Tarek', phone: '+201044556677', usedAt: '2026-03-10 16:00', orderAmount: 300, discount: 60 },
        { name: 'Hana Ali', phone: '+201033445566', usedAt: '2026-03-15 10:00', orderAmount: 200, discount: 40 },
    ],
};

const initialCodes = [
    { id: 1, code: 'WELCOME50', discount: 50, type: 'fixed', uses: 67, limit: 200, minOrder: 200, expires: '2026-12-31', status: 'active', createdAt: '2026-01-01', description: 'Welcome offer for new clients on their first booking.' },
    { id: 2, code: 'EID25', discount: 25, type: 'percentage', uses: 34, limit: 50, minOrder: 300, expires: '2026-02-20', status: 'active', createdAt: '2026-02-01', description: 'Special Eid discount for all services above minimum order.' },
    { id: 3, code: 'VIP10', discount: 10, type: 'percentage', uses: 120, limit: 500, minOrder: 0, expires: '2026-06-30', status: 'active', createdAt: '2026-01-15', description: 'Exclusive VIP discount. No minimum order required.' },
    { id: 4, code: 'FRIDAY40', discount: 40, type: 'percentage', uses: 30, limit: 30, minOrder: 250, expires: '2026-02-07', status: 'exhausted', createdAt: '2026-02-06', description: 'Flash Friday deal — 40% off all services. Limited to 30 uses.' },
    { id: 5, code: 'REFER20', discount: 20, type: 'percentage', uses: 15, limit: 100, minOrder: 150, expires: '2026-04-30', status: 'active', createdAt: '2026-01-20', description: 'Referral program discount. Share with friends!' },
    { id: 6, code: 'SUMMER100', discount: 100, type: 'fixed', uses: 0, limit: 50, minOrder: 500, expires: '2026-06-01', status: 'scheduled', createdAt: '2026-02-15', description: 'Summer launch promo. 100 EGP off orders above 500 EGP.' },
];

const statusBadge: Record<string, 'success' | 'info' | 'error' | 'neutral'> = { active: 'success', scheduled: 'info', exhausted: 'error' };

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    code: { fontFamily: 'monospace', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', letterSpacing: '0.05em', display: 'inline-flex', alignItems: 'center', gap: 6 },
    copyBtn: { cursor: 'pointer', color: 'var(--text-tertiary)' },
    progress: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', width: 60 },
    progressFill: { height: '100%', borderRadius: 3 },
    detailSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    infoCard: { background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' },
    infoLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' },
    infoValue: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    sectionTitle: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    progressLg: { height: 10, borderRadius: 5, background: 'var(--bg-tertiary)', overflow: 'hidden' },
    progressFillLg: { height: '100%', borderRadius: 5, transition: 'width 0.5s ease' },
    // Client usage
    usageItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', borderTop: '1px solid var(--border-color)' },
    userAvatar: { width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', flexShrink: 0 },
};

export default function PromoCodesPage() {
    const { addToast } = useToast();
    const [codes, setCodes] = useState(initialCodes);
    const [search, setSearch] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [clientSearch, setClientSearch] = useState('');

    const { t } = useTranslation();

    const openDetail = (c: any) => { setSelected(c); setIsDetailOpen(true); setClientSearch(''); };
    const openEdit = (c: any) => { setSelected(c); setIsDetailOpen(false); setIsEditOpen(true); };
    const openDelete = (c: any) => { setSelected(c); setIsDetailOpen(false); setIsDeleteOpen(true); };

    const handleDelete = () => {
        setCodes(prev => prev.filter(c => c.id !== selected?.id));
        setIsDeleteOpen(false);
        setSelected(null);
        addToast('success', t('mkt.lblDeletePromoCode'));
    };

    const handleCopy = (code: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        addToast('success', `Copied ${code} to clipboard`);
    };

    const filtered = codes.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    const filteredClients = useMemo(() => {
        if (!selected) return [];
        const list = clientUsageData[selected.id] || [];
        if (!clientSearch) return list;
        return list.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));
    }, [selected, clientSearch]);

    const totalSaved = useMemo(() => {
        if (!selected) return 0;
        return (clientUsageData[selected.id] || []).reduce((a, c) => a + c.discount, 0);
    }, [selected]);

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}><Search size={16} style={s.searchIcon as React.CSSProperties} /><input style={s.searchInput} placeholder={t('mkt.phSearchCodes')} value={search} onChange={e => setSearch(e.target.value)} /></div>
                <button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> {t('mkt.btnGenerateCode')}</button>
            </div>
            <table style={s.table}>
                <thead><tr>{[t('mkt.lblCode'), t('mkt.lblDiscount'), t('mkt.lblUsage'), '', t('mkt.lblMinOrder'), t('mkt.lblExpires'), t('mkt.lblStatus'), ''].map((h, i) => <th key={i} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {filtered.map(c => (
                        <tr key={c.id} style={{ cursor: 'pointer' }} className="hoverRow" onClick={() => openDetail(c)}>
                            <td style={s.td}><span style={s.code}><Tag size={12} /> {c.code} <Copy size={12} style={s.copyBtn} onClick={e => handleCopy(c.code, e)} /></span></td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>{c.type === 'percentage जीता' ? `${c.discount}%` : `${c.discount} ${t('mkt.lblEGP')}`}</td>
                            <td style={s.td}>{c.uses}/{c.limit}</td>
                            <td style={s.td}><div style={s.progress}><div style={{ ...s.progressFill, width: `${c.uses / c.limit * 100}%`, background: c.uses >= c.limit ? 'var(--color-error)' : 'var(--color-primary-500)' }} /></div></td>
                            <td style={s.td}>{c.minOrder > 0 ? `${c.minOrder} ${t('mkt.lblEGP')}` : '—'}</td>
                            <td style={s.td}>{c.expires}</td>
                            <td style={s.td}><Badge color={statusBadge[c.status]} size="sm">{t(`mkt.lbl${c.status.charAt(0).toUpperCase() + c.status.slice(1)}`)}</Badge></td>
                            <td style={{ ...s.td, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: t('mkt.lblPromoCodeDetails'), icon: <Eye size={14} />, onClick: () => openDetail(c) },
                                        { label: t('mkt.lblEditCode'), icon: <Edit size={14} />, onClick: () => openEdit(c) },
                                        { label: t('mkt.lblDeletePromoCode'), destructive: true, icon: <Trash2 size={14} />, onClick: () => openDelete(c) }
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Detail SlideOver */}
            <SlideOver open={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelected(null); }} title={t('mkt.lblPromoCodeDetails')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selected)}><Trash2 size={14} /> {t('mkt.lblDeletePromoCode')}</Button>
                        <Button onClick={() => openEdit(selected)}><Edit size={14} /> {t('mkt.lblEditCode')}</Button>
                    </div>
                }
            >
                {selected && (
                    <div style={s.detailSection as React.CSSProperties}>
                        {/* Big Code Display */}
                        <div style={{ textAlign: 'center', padding: 'var(--space-5)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', letterSpacing: '0.1em', color: 'var(--color-primary-600)', marginBottom: 'var(--space-2)' }}>{selected.code}</div>
                            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(selected.code); addToast('success', t('mkt.lblCopyCode')); }}><Copy size={14} /> {t('mkt.lblCopyCode')}</Button>
                            <div style={{ marginTop: 'var(--space-2)' }}><Badge color={statusBadge[selected.status]}>{t(`mkt.lbl${selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}`)}</Badge></div>
                        </div>

                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.description}</div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblDiscount')}</div>
                                <div style={{ ...s.infoValue, fontSize: 'var(--text-xl)', color: 'var(--color-primary-600)' }}>{selected.type === 'percentage' ? `${selected.discount}%` : `${selected.discount} ${t('mkt.lblEGP')}`}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblDiscountType')}</div>
                                <div style={s.infoValue}>{selected.type === 'percentage' ? t('mkt.lblPercentage') : t('mkt.lblFixedAmount')}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblMinOrder')}</div>
                                <div style={s.infoValue}>{selected.minOrder > 0 ? `${selected.minOrder} ${t('mkt.lblEGP')}` : '—'}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblExpires')}</div>
                                <div style={s.infoValue}>{selected.expires}</div>
                            </div>
                        </div>

                        {/* Usage Progress */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>{t('mkt.lblUsage')}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{selected.uses} / {selected.limit} {t('mkt.lblUsed')}</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{Math.round(selected.uses / selected.limit * 100)}%</span>
                            </div>
                            <div style={s.progressLg}>
                                <div style={{ ...s.progressFillLg, width: `${Math.min(selected.uses / selected.limit * 100, 100)}%`, background: selected.uses >= selected.limit ? 'var(--color-error)' : 'var(--color-primary-500)' }} />
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>{selected.limit - selected.uses} {t('mkt.lblRemaining')}</div>
                        </div>

                        {/* Client Usage List */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                <div style={s.sectionTitle as React.CSSProperties}>{t('mkt.lblClientsWhoUsed')} ({(clientUsageData[selected.id] || []).length})</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('mkt.lblTotalSaved')} {totalSaved} {t('mkt.lblEGP')}</div>
                            </div>

                            {/* Search clients */}
                            <div style={{ position: 'relative' as const, marginBottom: 'var(--space-3)' }}>
                                <Search size={14} style={{ position: 'absolute' as const, left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    style={{ width: '100%', height: 36, paddingLeft: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                                    placeholder={t('mkt.phSearchClients')}
                                    value={clientSearch}
                                    onChange={e => setClientSearch(e.target.value)}
                                />
                            </div>

                            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
                                {filteredClients.length === 0 ? (
                                    <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                        {clientUsageData[selected.id] ? t('mkt.msgNoClientsMatch') : t('mkt.msgNoUsageData')}
                                    </div>
                                ) : (
                                    filteredClients.map((c, i) => (
                                        <div key={i} style={{ ...s.usageItem, borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                                <div style={s.userAvatar}>{getInitials(c.name)}</div>
                                                <div>
                                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{c.name}</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{c.phone}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                                                    {t('mkt.lblOrder')} {c.orderAmount} {t('mkt.lblEGP')}
                                                </div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 'var(--font-medium)' }}>
                                                    {t('mkt.lblSaved')} {c.discount} {t('mkt.lblEGP')}
                                                </div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                    {c.usedAt}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={s.infoCard}>
                            <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblCreated')}</div>
                            <div style={s.infoValue}>{selected.createdAt}</div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Promo Modal */}
            <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title={t('mkt.lblGeneratePromoCode')}
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('rtn.btnBack')}</Button><Button onClick={() => { setIsAddOpen(false); addToast('success', t('mkt.btnGenerateCode')); }}>{t('mkt.btnGenerateCode')}</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}><div style={{ flex: 1 }}><Input label={t('mkt.lblCode')} placeholder="e.g. WELCOME10" /></div><div style={{ flex: 1 }}><Select label={t('mkt.lblDiscountType')} options={[{ label: t('mkt.lblPercentage'), value: 'percentage' }, { label: t('mkt.lblFixedAmount'), value: 'fixed' }]} /></div></div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}><div style={{ flex: 1 }}><Input label={t('mkt.lblDiscountValue')} type="number" placeholder="0" /></div><div style={{ flex: 1 }}><Input label={t('mkt.lblUsageLimit')} type="number" placeholder="No Limit" /></div></div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}><div style={{ flex: 1 }}><Input label={t('mkt.lblMinOrderValue')} type="number" placeholder="0" /></div><div style={{ flex: 1 }}><Input label={t('mkt.lblExpirationDate')} type="date" /></div></div>
                    <Input label={t('mkt.lblDescription')} placeholder="Brief description of this promo code" />
                    <Select label={t('mkt.lblStatus')} options={[{ label: t('mkt.lblActive'), value: 'active' }, { label: t('mkt.lblScheduled'), value: 'scheduled' }]} />
                </div>
            </Modal>

            {/* Edit Promo Modal */}
            <Modal open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelected(null); }} title={t('mkt.lblEditCode')}
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('rtn.btnBack')}</Button><Button onClick={() => { setIsEditOpen(false); addToast('success', t('mkt.lblEditCode')); }}>{t('mkt.lblEditCode')}</Button></div>}
            >
                {selected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}><div style={{ flex: 1 }}><Input label={t('mkt.lblCode')} defaultValue={selected.code} /></div><div style={{ flex: 1 }}><Select label={t('mkt.lblDiscountType')} defaultValue={selected.type} options={[{ label: t('mkt.lblPercentage'), value: 'percentage' }, { label: t('mkt.lblFixedAmount'), value: 'fixed' }]} /></div></div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}><div style={{ flex: 1 }}><Input label={t('mkt.lblDiscountValue')} type="number" defaultValue={selected.discount} /></div><div style={{ flex: 1 }}><Input label={t('mkt.lblUsageLimit')} type="number" defaultValue={selected.limit} /></div></div>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}><div style={{ flex: 1 }}><Input label={t('mkt.lblMinOrderValue')} type="number" defaultValue={selected.minOrder} /></div><div style={{ flex: 1 }}><Input label={t('mkt.lblExpirationDate')} type="date" defaultValue={selected.expires} /></div></div>
                        <Input label={t('mkt.lblDescription')} defaultValue={selected.description} />
                        <Select label={t('mkt.lblStatus')} defaultValue={selected.status} options={[{ label: t('mkt.lblActive'), value: 'active' }, { label: t('mkt.lblScheduled'), value: 'scheduled' }, { label: t('mkt.lblExhausted'), value: 'exhausted' }]} />
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelected(null); }} title={t('mkt.lblDeletePromoCode')}
                footer={<div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}><Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('rtn.btnBack')}</Button><Button variant="destructive" onClick={handleDelete}>{t('mkt.lblDeletePromoCode')}</Button></div>}
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('mkt.msgDeletePromoCodeConfirm')} <strong>{selected?.code}</strong></p>
            </Modal>

            <style>{`.hoverRow:hover { background-color: var(--bg-secondary); }`}</style>
        </div >
    );
}
