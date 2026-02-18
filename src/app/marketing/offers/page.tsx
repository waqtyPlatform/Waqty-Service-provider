'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Calendar, Tag, Percent, Edit, Trash2 } from 'lucide-react';

const tabs = [
    { label: 'Offers', href: '/marketing/offers' },
    { label: 'Packages', href: '/marketing/packages' },
    { label: 'Notifications', href: '/marketing/notifications' },
    { label: 'Promo Codes', href: '/marketing/promo-codes' },
    { label: 'Messages', href: '/marketing/messages' },
    { label: 'Service Groups', href: '/marketing/service-groups' },
];

const offers = [
    { id: 1, name: 'Spring Beauty Festival', discount: 30, type: 'percentage', services: ['Hair Coloring', 'HydraFacial', 'Manicure'], startDate: '2026-03-01', endDate: '2026-03-15', status: 'scheduled', color: '#EC4899', uses: 0, limit: 100 },
    { id: 2, name: 'Eid Special Bundle', discount: 25, type: 'percentage', services: ['Full Body Massage', 'Facial', 'Pedicure'], startDate: '2026-02-10', endDate: '2026-02-20', status: 'active', color: '#F59E0B', uses: 34, limit: 50 },
    { id: 3, name: 'Valentines Day Offer', discount: 200, type: 'fixed', services: ['Couples Massage', 'Facial x2'], startDate: '2026-02-14', endDate: '2026-02-14', status: 'active', color: '#EF4444', uses: 8, limit: 20 },
    { id: 4, name: 'New Client Welcome', discount: 50, type: 'fixed', services: ['Any single service'], startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', color: '#10B981', uses: 67, limit: 500 },
    { id: 5, name: 'Flash Friday', discount: 40, type: 'percentage', services: ['All Services'], startDate: '2026-02-07', endDate: '2026-02-07', status: 'expired', color: '#8B5CF6', uses: 22, limit: 30 },
];

const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    scheduled: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    expired: { bg: 'var(--color-gray-100)', color: 'var(--color-gray-500)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    discount: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 6 },
    svcChip: { padding: '2px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' },
    stat: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
};

export default function OffersPage() {
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/marketing/offers' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div style={s.toolbar}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{offers.filter(o => o.status === 'active').length} active offers</div>
                <button style={s.addBtn}><Plus size={16} /> New Offer</button>
            </div>

            <div style={s.grid}>
                {offers.map(offer => (
                    <div key={offer.id} style={{ ...s.card, opacity: offer.status === 'expired' ? 0.6 : 1 }}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: offer.color }}><Tag size={20} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                    <div style={s.name}>{offer.name}</div>
                                    <span style={{ ...s.badge, ...statusColors[offer.status] }}>{offer.status}</span>
                                </div>
                                <div style={s.discount}>
                                    {offer.type === 'percentage' ? `${offer.discount}% OFF` : `-${offer.discount} EGP`}
                                </div>
                            </div>
                        </div>
                        <div style={s.services as React.CSSProperties}>
                            {offer.services.map(svc => <span key={svc} style={s.svcChip}>{svc}</span>)}
                        </div>
                        <div style={s.footer}>
                            <div style={s.stat}><Calendar size={12} /> {offer.startDate} → {offer.endDate}</div>
                            <div style={s.stat}>{offer.uses}/{offer.limit} used</div>
                            <div style={s.actions}><button style={s.btnIcon}><Edit size={12} /></button><button style={{ ...s.btnIcon, color: 'var(--color-error)' }}><Trash2 size={12} /></button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
