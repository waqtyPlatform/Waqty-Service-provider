'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, Search, Plus, Star, Clock, Check, Users } from 'lucide-react';

const packages = [
    { id: 1, name: 'Bridal Glow Package', price: 2500, oldPrice: 3200, sessions: 8, sold: 34, services: ['Hair Styling', 'Facial', 'Manicure', 'Pedicure', 'Makeup', 'Waxing', 'Lash Extensions', 'Body Scrub'], status: 'active', validity: '60 days', color: '#F59E0B' },
    { id: 2, name: 'VIP Monthly Care', price: 1200, oldPrice: 1600, sessions: 6, sold: 67, services: ['Classic Facial', 'Swedish Massage', 'Manicure', 'Pedicure', 'Hair Treatment', 'Eye Brow'], status: 'active', validity: '30 days', color: '#8B5CF6' },
    { id: 3, name: 'Relaxation Retreat', price: 800, oldPrice: 1050, sessions: 4, sold: 45, services: ['Deep Tissue Massage', 'Aromatherapy', 'Hot Stone', 'Body Wrap'], status: 'active', validity: '45 days', color: '#10B981' },
    { id: 4, name: 'Hair Transformation', price: 1500, oldPrice: 2000, sessions: 5, sold: 23, services: ['Keratin Treatment', 'Hair Coloring', 'Deep Conditioning', 'Scalp Treatment', 'Blow Dry'], status: 'active', validity: '30 days', color: '#3B82F6' },
    { id: 5, name: 'Teen Beauty Starter', price: 350, oldPrice: 500, sessions: 3, sold: 18, services: ['Basic Facial', 'Manicure', 'Hair Trim'], status: 'draft', validity: '30 days', color: '#EC4899' },
    { id: 6, name: 'Couples Spa Day', price: 1800, oldPrice: 2400, sessions: 6, sold: 12, services: ['Couples Massage', 'Facial x2', 'Pedicure x2', 'Refreshments', 'Private Room'], status: 'active', validity: '90 days', color: '#EF4444' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', paddingBottom: 0 },
    tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' as const },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 'var(--space-3)' },
    searchBox: { position: 'relative' as const, flex: '1', maxWidth: 320 },
    searchIcon: { position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, paddingRight: 16, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
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
};

export default function PackagesPage() {
    const [search, setSearch] = useState('');
    const filtered = packages.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={s.page}>
            <div style={s.tabs}>
                <Link href="/sales" style={s.tab}><ShoppingBag size={16} /> Services</Link>
                <Link href="/sales/packages" style={{ ...s.tab, ...s.tabActive }}><Package size={16} /> Packages</Link>
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input style={s.searchInput} placeholder="Search packages..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button style={s.addBtn}><Plus size={16} /> New Package</button>
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
                                        {pkg.status}
                                    </span>
                                </div>
                                <div style={s.prices}>
                                    <span style={s.price}>{pkg.price} EGP</span>
                                    <span style={s.oldPrice}>{pkg.oldPrice} EGP</span>
                                    <span style={{ ...s.badge, background: 'var(--color-error-light)', color: 'var(--color-error)' }}>
                                        -{Math.round((1 - pkg.price / pkg.oldPrice) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={s.services as React.CSSProperties}>
                            {pkg.services.map((svc, i) => (
                                <div key={i} style={s.svcItem}><Check size={14} style={{ color: 'var(--color-success)' }} /> {svc}</div>
                            ))}
                        </div>

                        <div style={s.footer}>
                            <div style={s.stat}><Users size={13} /> {pkg.sold} sold</div>
                            <div style={s.stat}><Clock size={13} /> {pkg.validity}</div>
                            <div style={s.stat}><Star size={13} /> {pkg.sessions} sessions</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
