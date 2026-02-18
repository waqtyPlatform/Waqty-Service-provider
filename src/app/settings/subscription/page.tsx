'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Crown, Zap, Star } from 'lucide-react';

const tabs = [
    { label: 'General', href: '/settings' },
    { label: 'Branches', href: '/settings/branches' },
    { label: 'Services', href: '/settings/services' },
    { label: 'Invoice', href: '/settings/invoice' },
    { label: 'Devices', href: '/settings/devices' },
    { label: 'Integrations', href: '/settings/integrations' },
    { label: 'Roles', href: '/settings/roles' },
    { label: 'Audit Log', href: '/settings/audit-log' },
    { label: 'Subscription', href: '/settings/subscription' },
];

const plans = [
    {
        name: 'Starter', price: 499, period: '/mo', current: false, color: 'var(--color-gray-400)',
        features: ['1 Branch', 'Up to 5 Employees', 'Basic Reports', 'SMS Notifications', 'Email Support'],
    },
    {
        name: 'Professional', price: 999, period: '/mo', current: true, color: 'var(--color-primary-500)',
        features: ['3 Branches', 'Up to 15 Employees', 'Advanced Reports', 'SMS + WhatsApp', 'Priority Support', 'Marketing Tools', 'Integrations'],
    },
    {
        name: 'Enterprise', price: 1999, period: '/mo', current: false, color: '#F59E0B',
        features: ['Unlimited Branches', 'Unlimited Employees', 'Custom Reports', 'All Channels', '24/7 Support', 'Full Marketing Suite', 'All Integrations', 'API Access', 'Dedicated Account Manager'],
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    currentPlan: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', textAlign: 'center' as const },
    cardCurrent: { border: '2px solid var(--color-primary-500)', boxShadow: '0 0 0 4px rgba(99,102,241,0.1)' },
    planName: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' },
    price: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    period: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    features: { textAlign: 'left' as const, marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column' as const, gap: 'var(--space-2)' },
    feature: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
    btn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 'var(--space-3)', marginTop: 'var(--space-5)', borderRadius: 'var(--radius-lg)', fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' },
    btnPrimary: { background: 'var(--color-primary-500)', color: 'white' },
    btnOutline: { border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' },
    badge: { display: 'inline-flex', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)', background: 'var(--color-primary-500)', color: 'white', marginLeft: 'var(--space-2)' },
};

export default function SubscriptionPage() {
    return (
        <div style={s.page}>
            <div style={s.tabBar}>
                {tabs.map(t => <Link key={t.href} href={t.href} style={{ ...s.tab, ...(t.href === '/settings/subscription' ? s.tabActive : {}) }}>{t.label}</Link>)}
            </div>

            <div style={s.currentPlan}>
                <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Current Plan</div>
                    <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>Professional</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Renews on March 17, 2026</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>999 EGP/mo</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Billed monthly</div>
                </div>
            </div>

            <div style={s.grid}>
                {plans.map(plan => (
                    <div key={plan.name} style={{ ...s.card, ...(plan.current ? s.cardCurrent : {}) }}>
                        <div style={{ ...s.planName, color: plan.color }}>{plan.name} {plan.current && <span style={s.badge}>Current</span>}</div>
                        <div style={s.price}>{plan.price} <span style={s.period}>EGP{plan.period}</span></div>
                        <div style={s.features}>
                            {plan.features.map(f => <div key={f} style={s.feature}><Check size={16} style={{ color: 'var(--color-success)', flexShrink: 0 }} /> {f}</div>)}
                        </div>
                        <button style={{ ...s.btn, ...(plan.current ? s.btnOutline : s.btnPrimary) }}>
                            {plan.current ? 'Current Plan' : 'Upgrade'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
