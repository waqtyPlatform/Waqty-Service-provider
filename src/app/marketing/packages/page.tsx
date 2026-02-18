'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Package, Check, Users, Clock, Star } from 'lucide-react';

const tabs = [
    { label: 'Offers', href: '/marketing/offers' },
    { label: 'Packages', href: '/marketing/packages' },
    { label: 'Notifications', href: '/marketing/notifications' },
    { label: 'Promo Codes', href: '/marketing/promo-codes' },
    { label: 'Messages', href: '/marketing/messages' },
    { label: 'Service Groups', href: '/marketing/service-groups' },
];

const packages = [
    { id: 1, name: 'Summer Glow Campaign', price: 899, services: ['Body Scrub', 'Spray Tan', 'Gel Nails', 'Lash Lift'], target: 'New Clients', active: true, sold: 15, color: '#F59E0B' },
    { id: 2, name: 'Refer-a-Friend Bundle', price: 599, services: ['Any Facial', 'Classic Manicure', 'Blow Dry'], target: 'Referral Program', active: true, sold: 28, color: '#10B981' },
    { id: 3, name: 'Birthday Special', price: 750, services: ['Full Styling', 'Makeup', 'Nail Art', 'Photo Shoot'], target: 'Birthday Month', active: true, sold: 12, color: '#EC4899' },
    { id: 4, name: 'Corporate Wellness', price: 450, services: ['Chair Massage', 'Mini Facial', 'Express Mani'], target: 'Corporate Partners', active: false, sold: 0, color: '#3B82F6' },
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
    cardHead: { padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 },
    name: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    price: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' },
    target: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    services: { padding: '0 var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 6 },
    svcItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
};

export default function MarketingPackagesPage() {
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/marketing/packages' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>
            <div style={s.toolbar}><button style={s.addBtn}><Plus size={16} /> New Package</button></div>
            <div style={s.grid}>
                {packages.map(pkg => (
                    <div key={pkg.id} style={{ ...s.card, opacity: pkg.active ? 1 : 0.6 }}>
                        <div style={s.cardHead}>
                            <div style={{ ...s.icon, background: pkg.color }}><Package size={20} /></div>
                            <div>
                                <div style={s.name}>{pkg.name}</div>
                                <div style={s.price}>{pkg.price} EGP</div>
                                <div style={s.target}>Target: {pkg.target}</div>
                            </div>
                        </div>
                        <div style={s.services as React.CSSProperties}>
                            {pkg.services.map((svc, i) => <div key={i} style={s.svcItem}><Check size={14} style={{ color: 'var(--color-success)' }} /> {svc}</div>)}
                        </div>
                        <div style={s.footer}>
                            <span><Users size={12} style={{ display: 'inline', marginRight: 4 }} /> {pkg.sold} sold</span>
                            <span>{pkg.active ? '🟢 Active' : '⚪ Inactive'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
