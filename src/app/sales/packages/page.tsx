'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, Search, Plus, Star, Clock, Check, Users, MoreVertical, Edit, Trash2, ShoppingCart, CalendarPlus, X } from 'lucide-react';
import { useToast, DropdownMenu, SlideOver, Modal, Button, Input, Select } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

/* ─── Available Services Pool ─────────── */
const allServices = [
    'Hair Styling', 'Hair Coloring', 'Keratin Treatment', 'Deep Conditioning', 'Scalp Treatment', 'Blow Dry', 'Hair Trim',
    'Classic Facial', 'Facial', 'Basic Facial', 'Deep Tissue Massage', 'Swedish Massage', 'Hot Stone', 'Aromatherapy',
    'Manicure', 'Pedicure', 'Waxing', 'Lash Extensions', 'Eye Brow', 'Makeup',
    'Body Scrub', 'Body Wrap', 'Couples Massage', 'Private Room', 'Refreshments',
];

/* ─── Package Type ────────────────────── */
interface PackageData {
    id: number;
    name: string;
    price: number;
    oldPrice: number;
    sessions: number;
    sold: number;
    services: string[];
    status: 'active' | 'draft';
    validity: string;
    color: string;
}

const initialPackages: PackageData[] = [
    { id: 1, name: 'Bridal Glow Package', price: 2500, oldPrice: 3200, sessions: 8, sold: 34, services: ['Hair Styling', 'Facial', 'Manicure', 'Pedicure', 'Makeup', 'Waxing', 'Lash Extensions', 'Body Scrub'], status: 'active', validity: '60', color: '#F59E0B' },
    { id: 2, name: 'VIP Monthly Care', price: 1200, oldPrice: 1600, sessions: 6, sold: 67, services: ['Classic Facial', 'Swedish Massage', 'Manicure', 'Pedicure', 'Deep Conditioning', 'Eye Brow'], status: 'active', validity: '30', color: '#8B5CF6' },
    { id: 3, name: 'Relaxation Retreat', price: 800, oldPrice: 1050, sessions: 4, sold: 45, services: ['Deep Tissue Massage', 'Aromatherapy', 'Hot Stone', 'Body Wrap'], status: 'active', validity: '45', color: '#10B981' },
    { id: 4, name: 'Hair Transformation', price: 1500, oldPrice: 2000, sessions: 5, sold: 23, services: ['Keratin Treatment', 'Hair Coloring', 'Deep Conditioning', 'Scalp Treatment', 'Blow Dry'], status: 'active', validity: '30', color: '#3B82F6' },
    { id: 5, name: 'Teen Beauty Starter', price: 350, oldPrice: 500, sessions: 3, sold: 18, services: ['Basic Facial', 'Manicure', 'Hair Trim'], status: 'draft', validity: '30', color: '#EC4899' },
    { id: 6, name: 'Couples Spa Day', price: 1800, oldPrice: 2400, sessions: 6, sold: 12, services: ['Couples Massage', 'Facial', 'Pedicure', 'Refreshments', 'Private Room'], status: 'active', validity: '90', color: '#EF4444' },
];

const mockClients = [
    { value: '', label: '' },
    { value: 'Fatima Al-Said', label: 'Fatima Al-Said' },
    { value: 'Rania Mostafa', label: 'Rania Mostafa' },
    { value: 'Sarah Khaled', label: 'Sarah Khaled' },
    { value: 'Mona Ezz', label: 'Mona Ezz' },
    { value: 'Noura Adel', label: 'Noura Adel' },
];

const colors = ['#F59E0B', '#8B5CF6', '#10B981', '#3B82F6', '#EC4899', '#EF4444', '#6366F1', '#14B8A6'];

/* ─── Styles ──────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', paddingBottom: 0 },
    tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' as const },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 'var(--space-3)' },
    searchBox: { position: 'relative' as const, flex: '1', maxWidth: 320 },
    searchIcon: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, paddingRight: 16, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all var(--transition-fast)' },
    cardHeader: { padding: 'var(--space-5)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' },
    icon: { width: 48, height: 48, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    prices: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 4 },
    price: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    oldPrice: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textDecoration: 'line-through' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 'var(--font-semibold)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 6 },
    svcItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' },
    stat: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    cardActions: { display: 'flex', gap: 'var(--space-2)', padding: '0 var(--space-5) var(--space-4)' },
    svcSection: { border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', maxHeight: 220, overflowY: 'auto' as const },
    svcCheckRow: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '6px 8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 'var(--text-sm)', transition: 'background 0.15s' },
    svcTag: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-medium)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', border: '1px solid var(--color-primary-200)' },
    sellBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer', border: 'none', transition: 'opacity 0.15s' },
    bookBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-success-100)', color: 'var(--color-success-700)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer', border: '1px solid var(--color-success-200)', transition: 'opacity 0.15s' },
};

/* ─── Services Picker Component ─────── */
function ServicesPicker({ selected, onChange }: { selected: string[]; onChange: (svcs: string[]) => void }) {
    const { t } = useTranslation();
    const [svcSearch, setSvcSearch] = useState('');
    const filteredSvcs = allServices.filter(s => s.toLowerCase().includes(svcSearch.toLowerCase()));

    const toggle = (svc: string) => {
        onChange(selected.includes(svc) ? selected.filter(x => x !== svc) : [...selected, svc]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                {t('sales.lblIncludedServices')} ({selected.length})
            </label>
            {/* Selected tags */}
            {selected.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selected.map(svc => (
                        <span key={svc} style={s.svcTag}>
                            {svc}
                            <button onClick={() => toggle(svc)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-500)', padding: 0, display: 'flex' }}><X size={12} /></button>
                        </span>
                    ))}
                </div>
            )}
            {/* Search */}
            <input
                placeholder={t('sales.phSearchServices')}
                value={svcSearch}
                onChange={e => setSvcSearch(e.target.value)}
                style={{ width: '100%', height: 36, padding: '0 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            />
            {/* Checklist */}
            <div style={s.svcSection as React.CSSProperties}>
                {filteredSvcs.map(svc => {
                    const isChecked = selected.includes(svc);
                    return (
                        <div
                            key={svc}
                            style={{ ...s.svcCheckRow, background: isChecked ? 'var(--color-primary-50)' : 'transparent' }}
                            onClick={() => toggle(svc)}
                        >
                            <div style={{ width: 18, height: 18, borderRadius: 4, border: isChecked ? 'none' : '2px solid var(--border-color)', background: isChecked ? 'var(--color-primary-500)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                                {isChecked && <Check size={12} style={{ color: 'white' }} />}
                            </div>
                            <span style={{ color: isChecked ? 'var(--color-primary-700)' : 'var(--text-secondary)', fontWeight: isChecked ? 'var(--font-medium)' : 'var(--font-normal)' } as React.CSSProperties}>
                                {svc}
                            </span>
                        </div>
                    );
                })}
                {filteredSvcs.length === 0 && (
                    <div style={{ padding: 'var(--space-3)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                        {t('sales.noServicesFound')}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Main Component ──────────────────── */
export default function PackagesPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [packagesData, setPackagesData] = useState<PackageData[]>(initialPackages);
    const [search, setSearch] = useState('');

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSellOpen, setIsSellOpen] = useState(false);
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);

    // Form state for Add/Edit
    const emptyForm = { name: '', price: '', oldPrice: '', sessions: '', validity: '30', status: 'active' as 'active' | 'draft', services: [] as string[], color: colors[0] };
    const [form, setForm] = useState(emptyForm);

    // Sell form
    const [sellForm, setSellForm] = useState({ client: '', paymentMethod: 'cash', notes: '' });
    // Book form
    const [bookForm, setBookForm] = useState({ client: '', date: '', time: '10:00', stylist: '' });

    const filtered = useMemo(() => packagesData.filter(p => p.name.toLowerCase().includes(search.toLowerCase())), [packagesData, search]);

    const totalRevenue = packagesData.reduce((sum, p) => sum + p.price * p.sold, 0);
    const totalPackagesSold = packagesData.reduce((sum, p) => sum + p.sold, 0);

    // ── Add ──
    const openAdd = () => {
        setForm(emptyForm);
        setIsAddOpen(true);
    };
    const handleAdd = () => {
        if (!form.name || !form.price) return addToast('error', t('sales.errRequiredFields'));
        const newPkg: PackageData = {
            id: Date.now(),
            name: form.name,
            price: Number(form.price),
            oldPrice: Number(form.oldPrice) || Number(form.price),
            sessions: Number(form.sessions) || form.services.length,
            sold: 0,
            services: form.services,
            status: form.status,
            validity: form.validity,
            color: form.color,
        };
        setPackagesData(prev => [newPkg, ...prev]);
        setIsAddOpen(false);
        addToast('success', t('sales.msgPackageCreated'));
    };

    // ── Edit ──
    const openEdit = (pkg: PackageData) => {
        setSelectedPackage(pkg);
        setForm({
            name: pkg.name,
            price: pkg.price.toString(),
            oldPrice: pkg.oldPrice.toString(),
            sessions: pkg.sessions.toString(),
            validity: pkg.validity,
            status: pkg.status,
            services: [...pkg.services],
            color: pkg.color,
        });
        setIsEditOpen(true);
    };
    const handleEdit = () => {
        if (!form.name || !form.price || !selectedPackage) return;
        setPackagesData(prev => prev.map(p => p.id === selectedPackage.id ? {
            ...p,
            name: form.name,
            price: Number(form.price),
            oldPrice: Number(form.oldPrice) || Number(form.price),
            sessions: Number(form.sessions) || form.services.length,
            services: form.services,
            status: form.status,
            validity: form.validity,
            color: form.color,
        } : p));
        setIsEditOpen(false);
        setSelectedPackage(null);
        addToast('success', t('sales.msgPackageUpdated'));
    };

    // ── Delete ──
    const handleDelete = () => {
        if (!selectedPackage) return;
        setPackagesData(prev => prev.filter(p => p.id !== selectedPackage.id));
        setIsDeleteOpen(false);
        setSelectedPackage(null);
        addToast('success', t('sales.msgPackageDeleted'));
    };

    // ── Sell ──
    const openSell = (pkg: PackageData) => {
        setSelectedPackage(pkg);
        setSellForm({ client: '', paymentMethod: 'cash', notes: '' });
        setIsSellOpen(true);
    };
    const handleSell = () => {
        if (!sellForm.client) return addToast('error', t('sales.errSelectClient'));
        setPackagesData(prev => prev.map(p => p.id === selectedPackage?.id ? { ...p, sold: p.sold + 1 } : p));
        setIsSellOpen(false);
        setSelectedPackage(null);
        addToast('success', t('sales.msgPackageSold'));
    };

    // ── Book ──
    const openBook = (pkg: PackageData) => {
        setSelectedPackage(pkg);
        setBookForm({ client: '', date: new Date().toISOString().split('T')[0], time: '10:00', stylist: '' });
        setIsBookOpen(true);
    };
    const handleBook = () => {
        if (!bookForm.client || !bookForm.date) return addToast('error', t('sales.errBookingFields'));
        setIsSellOpen(false);
        setIsBookOpen(false);
        setSelectedPackage(null);
        addToast('success', t('sales.msgBookingCreated'));
    };

    /* ─── Form Fields (shared for Add & Edit) ─────── */
    const renderFormFields = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input label={t('mkt.lblPackageName')} placeholder={t('sales.phPackageName')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Input label={t('mkt.lblPrice')} type="number" placeholder="0.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <Input label={t('sales.lblRegularPrice')} type="number" placeholder="0.00" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <Input label={t('sales.lblSessionsIncluded')} type="number" placeholder="0" value={form.sessions} onChange={e => setForm({ ...form, sessions: e.target.value })} />
                <Select label={t('sales.lblValidity')} value={form.validity} onChange={e => setForm({ ...form, validity: e.target.value })} options={[{ label: `30 ${t('sales.lblDays')}`, value: '30' }, { label: `45 ${t('sales.lblDays')}`, value: '45' }, { label: `60 ${t('sales.lblDays')}`, value: '60' }, { label: `90 ${t('sales.lblDays')}`, value: '90' }]} />
            </div>
            <Select label={t('mkt.lblStatus')} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'draft' })} options={[{ label: t('mkt.lblActive'), value: 'active' }, { label: t('mkt.lblDraft'), value: 'draft' }]} />

            {/* Color Picker */}
            <div>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>{t('sales.lblColor')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    {colors.map(c => (
                        <button key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer', outline: form.color === c ? '2px solid var(--color-primary-200)' : 'none', transition: 'all 0.15s' }} />
                    ))}
                </div>
            </div>

            {/* Services Picker */}
            <ServicesPicker selected={form.services} onChange={svcs => setForm({ ...form, services: svcs })} />
        </div>
    );

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabs}>
                <Link href="/sales" style={s.tab}><ShoppingBag size={16} /> {t('sales.lblServices')}</Link>
                <Link href="/sales/packages" style={{ ...s.tab, ...s.tabActive }}><Package size={16} /> {t('sales.lblPackages')}</Link>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} /></div>
                    <div><div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{packagesData.length}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('sales.kpiTotalPackages')}</div></div>
                </div>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-success-100)', color: 'var(--color-success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingCart size={20} /></div>
                    <div><div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{totalPackagesSold}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('sales.kpiTotalSold')}</div></div>
                </div>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-warning-100)', color: 'var(--color-warning-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={20} /></div>
                    <div><div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }} dir="ltr">{(totalRevenue / 1000).toFixed(0)}K</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('sales.kpiRevenue')}</div></div>
                </div>
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-purple-100)', color: 'var(--color-purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={20} /></div>
                    <div><div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{packagesData.filter(p => p.status === 'active').length}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('sales.kpiActivePackages')}</div></div>
                </div>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input style={{ ...s.searchInput, paddingLeft: lang === 'ar' ? 16 : 40, paddingRight: lang === 'ar' ? 40 : 16 }} placeholder={t('sales.phSearchPackages')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Button onClick={openAdd}><Plus size={16} /> {t('mkt.btnNewPackage')}</Button>
            </div>

            <div style={s.grid}>
                {filtered.map(pkg => (
                    <div key={pkg.id} style={s.card}>
                        <div style={s.cardHeader}>
                            <div style={{ ...s.icon, background: pkg.color }}><Package size={22} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <div style={s.name}>{pkg.name}</div>
                                    <span style={{ ...s.badge, background: pkg.status === 'active' ? 'var(--color-success-light)' : 'var(--color-gray-100)', color: pkg.status === 'active' ? 'var(--color-success)' : 'var(--color-gray-500)' }}>
                                        {pkg.status === 'active' ? t('mkt.lblActive') : t('mkt.lblDraft')}
                                    </span>
                                </div>
                                <div style={s.prices}>
                                    <span style={s.price} dir="ltr">{pkg.price.toLocaleString()} {t('mkt.lblEGP')}</span>
                                    <span style={s.oldPrice} dir="ltr">{pkg.oldPrice.toLocaleString()} {t('mkt.lblEGP')}</span>
                                    <span style={{ ...s.badge, background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                                        -{Math.round((1 - pkg.price / pkg.oldPrice) * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div style={{ marginLeft: lang === 'ar' ? undefined : 'auto', marginRight: lang === 'ar' ? 'auto' : undefined }}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: t('mkt.lblEditPackage'), icon: <Edit size={14} />, onClick: () => openEdit(pkg) },
                                        { label: t('sales.lblSellPackage'), icon: <ShoppingCart size={14} />, onClick: () => openSell(pkg) },
                                        { label: t('sales.lblBookPackage'), icon: <CalendarPlus size={14} />, onClick: () => openBook(pkg) },
                                        { label: t('mkt.lblDeletePackage'), destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedPackage(pkg); setIsDeleteOpen(true); } }
                                    ]}
                                />
                            </div>
                        </div>

                        <div style={s.services as React.CSSProperties}>
                            {pkg.services.map((svc, i) => (
                                <div key={i} style={s.svcItem}><Check size={14} style={{ color: 'var(--color-success)' }} /> {svc}</div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={s.cardActions}>
                            <button style={s.sellBtn} onClick={() => openSell(pkg)}>
                                <ShoppingCart size={14} /> {t('sales.lblSellPackage')}
                            </button>
                            <button style={s.bookBtn} onClick={() => openBook(pkg)}>
                                <CalendarPlus size={14} /> {t('sales.lblBookPackage')}
                            </button>
                        </div>

                        <div style={s.footer}>
                            <div style={s.stat}><Users size={13} /> {pkg.sold} {t('mkt.lblSold')}</div>
                            <div style={s.stat}><Clock size={13} /> {pkg.validity} {t('sales.lblDays')}</div>
                            <div style={s.stat}><Star size={13} /> {pkg.sessions} {t('sales.lblSessions')}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Add Package SlideOver ─── */}
            <SlideOver open={isAddOpen} onClose={() => setIsAddOpen(false)} title={t('mkt.lblCreateNewPackage')} footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                    <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('rtn.btnBack')}</Button>
                    <Button onClick={handleAdd}>{t('mkt.btnSavePackage')}</Button>
                </div>
            }>
                {renderFormFields()}
            </SlideOver>

            {/* ─── Edit Package SlideOver ─── */}
            <SlideOver open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedPackage(null); }} title={t('mkt.lblEditPackage')} footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                    <Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('rtn.btnBack')}</Button>
                    <Button onClick={handleEdit}>{t('settings.saveChanges')}</Button>
                </div>
            }>
                {renderFormFields()}
            </SlideOver>

            {/* ─── Sell Package Modal ─── */}
            <Modal
                open={isSellOpen}
                onClose={() => { setIsSellOpen(false); setSelectedPackage(null); }}
                title={t('sales.sellModalTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsSellOpen(false)}>{t('rtn.btnBack')}</Button>
                        <Button onClick={handleSell}><ShoppingCart size={16} /> {t('sales.btnConfirmSale')}</Button>
                    </div>
                }
            >
                {selectedPackage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {/* Package summary */}
                        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{ ...s.icon, background: selectedPackage.color, width: 40, height: 40 }}><Package size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)' } as React.CSSProperties}>{selectedPackage.name}</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-600)', fontWeight: 'var(--font-bold)' } as React.CSSProperties} dir="ltr">{selectedPackage.price.toLocaleString()} {t('mkt.lblEGP')}</div>
                                </div>
                            </div>
                        </div>
                        <Select
                            label={t('sales.lblClient')}
                            value={sellForm.client}
                            onChange={e => setSellForm({ ...sellForm, client: e.target.value })}
                            options={[{ value: '', label: t('sales.phSelectClient') }, ...mockClients.filter(c => c.value)]}
                        />
                        <Select
                            label={t('sales.lblPaymentMethod')}
                            value={sellForm.paymentMethod}
                            onChange={e => setSellForm({ ...sellForm, paymentMethod: e.target.value })}
                            options={[
                                { label: t('sales.lblCash'), value: 'cash' },
                                { label: t('sales.lblCard'), value: 'card' },
                                { label: t('sales.lblBankTransfer'), value: 'bank' },
                            ]}
                        />
                        <Input label={t('sales.lblNotes')} placeholder={t('sales.phSaleNotes')} value={sellForm.notes} onChange={e => setSellForm({ ...sellForm, notes: e.target.value })} />
                    </div>
                )}
            </Modal>

            {/* ─── Book Package Modal ─── */}
            <Modal
                open={isBookOpen}
                onClose={() => { setIsBookOpen(false); setSelectedPackage(null); }}
                title={t('sales.bookModalTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsBookOpen(false)}>{t('rtn.btnBack')}</Button>
                        <Button onClick={handleBook}><CalendarPlus size={16} /> {t('sales.btnConfirmBooking')}</Button>
                    </div>
                }
            >
                {selectedPackage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {/* Package summary */}
                        <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{ ...s.icon, background: selectedPackage.color, width: 40, height: 40 }}><Package size={18} /></div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-base)' } as React.CSSProperties}>{selectedPackage.name}</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selectedPackage.services.length} {t('sales.lblServices').toLowerCase()} · {selectedPackage.sessions} {t('sales.lblSessions')}</div>
                                </div>
                            </div>
                        </div>
                        <Select
                            label={t('sales.lblClient')}
                            value={bookForm.client}
                            onChange={e => setBookForm({ ...bookForm, client: e.target.value })}
                            options={[{ value: '', label: t('sales.phSelectClient') }, ...mockClients.filter(c => c.value)]}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <Input label={t('sales.lblDate')} type="date" value={bookForm.date} onChange={e => setBookForm({ ...bookForm, date: e.target.value })} />
                            <Input label={t('sales.lblTime')} type="time" value={bookForm.time} onChange={e => setBookForm({ ...bookForm, time: e.target.value })} />
                        </div>
                        <Select
                            label={t('sales.lblStylist')}
                            value={bookForm.stylist}
                            onChange={e => setBookForm({ ...bookForm, stylist: e.target.value })}
                            options={[
                                { value: '', label: t('sales.phSelectStylist') },
                                { value: 'Sara Ahmed', label: 'Sara Ahmed' },
                                { value: 'Nora Ali', label: 'Nora Ali' },
                                { value: 'Layla Hassan', label: 'Layla Hassan' },
                            ]}
                        />
                    </div>
                )}
            </Modal>

            {/* ─── Delete Confirmation Modal ─── */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedPackage(null); }}
                title={t('mkt.lblDeletePackage')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('rtn.btnBack')}</Button>
                        <Button variant="destructive" onClick={handleDelete}>{t('mkt.lblDeletePackage')}</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('mkt.msgDeletePackageConfirm')} <strong>{selectedPackage?.name}</strong>
                    </p>
                </div>
            </Modal>
        </div>
    );
}
