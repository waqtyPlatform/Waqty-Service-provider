'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Layers } from 'lucide-react';

const tabs = [
    { label: 'Offers', href: '/marketing/offers' },
    { label: 'Packages', href: '/marketing/packages' },
    { label: 'Notifications', href: '/marketing/notifications' },
    { label: 'Promo Codes', href: '/marketing/promo-codes' },
    { label: 'Messages', href: '/marketing/messages' },
    { label: 'Service Groups', href: '/marketing/service-groups' },
];

const groups = [
    { id: 1, name: 'Hair Services', services: ['Hair Cut', 'Hair Coloring', 'Keratin Treatment', 'Blow Dry', 'Hair Mask', 'Highlights'], color: '#F59E0B', active: true },
    { id: 2, name: 'Skin & Facial', services: ['Classic Facial', 'HydraFacial', 'Chemical Peel', 'Microdermabrasion', 'Acne Treatment'], color: '#EC4899', active: true },
    { id: 3, name: 'Body & Massage', services: ['Swedish Massage', 'Deep Tissue', 'Hot Stone', 'Full Body Scrub', 'Aromatherapy'], color: '#10B981', active: true },
    { id: 4, name: 'Nail Care', services: ['Gel Manicure', 'Pedicure', 'Nail Art', 'Paraffin Wax', 'French Tips'], color: '#3B82F6', active: true },
    { id: 5, name: 'Bridal Services', services: ['Bridal Makeup', 'Up Style', 'Henna', 'Full Body Treatment', 'Trial Session'], color: '#8B5CF6', active: false },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    cardHead: { padding: 'var(--space-4) var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' },
    nameArea: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 36, height: 36, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' },
    count: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', color: 'var(--text-secondary)' },
    serviceList: { padding: 'var(--space-4) var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 6 },
    svcChip: { padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' },
};

export default function ServiceGroupsPage() {
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/marketing/service-groups' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>
            <div style={s.toolbar}><button style={s.addBtn}><Plus size={16} /> New Group</button></div>
            <div style={s.grid}>
                {groups.map(g => (
                    <div key={g.id} style={{ ...s.card, opacity: g.active ? 1 : 0.6 }}>
                        <div style={s.cardHead}>
                            <div style={s.nameArea as React.CSSProperties}>
                                <div style={{ ...s.icon, background: g.color }}><Layers size={16} /></div>
                                <div>
                                    <div style={s.name}>{g.name}</div>
                                    <div style={s.count}>{g.services.length} services</div>
                                </div>
                            </div>
                            <div style={s.actions}>
                                <button style={s.btnIcon}><Edit size={12} /></button>
                                <button style={{ ...s.btnIcon, color: 'var(--color-error)' }}><Trash2 size={12} /></button>
                            </div>
                        </div>
                        <div style={s.serviceList as React.CSSProperties}>
                            {g.services.map(svc => <span key={svc} style={s.svcChip}>{svc}</span>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
