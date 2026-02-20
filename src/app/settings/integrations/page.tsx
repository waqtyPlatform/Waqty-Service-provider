'use client';

import React from 'react';
import Link from 'next/link';
import SettingsTabs from '@/components/SettingsTabs';
import { ExternalLink, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const integrations = [
    { id: 1, name: 'WhatsApp Business', desc: 'Send automated messages and appointment reminders', status: 'connected', color: '#25D366' },
    { id: 2, name: 'Paymob', desc: 'Accept card payments and digital wallets', status: 'connected', color: '#0070E0' },
    { id: 3, name: 'Google Calendar', desc: 'Sync bookings with Google calendars', status: 'connected', color: '#4285F4' },
    { id: 4, name: 'Mailchimp', desc: 'Email marketing campaigns and newsletters', status: 'disconnected', color: '#FFE01B' },
    { id: 5, name: 'Zapier', desc: 'Connect with 5,000+ apps and automate workflows', status: 'disconnected', color: '#FF4A00' },
    { id: 6, name: 'Instagram Business', desc: 'Book appointments directly from Instagram', status: 'connected', color: '#E1306C' },
    { id: 7, name: 'Google Maps', desc: 'Show your location and collect reviews', status: 'connected', color: '#34A853' },
    { id: 8, name: 'Twilio SMS', desc: 'Send SMS notifications and OTP codes', status: 'disconnected', color: '#F22F46' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' },
    icon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, fontSize: 18, fontWeight: 'var(--font-bold)' },
    name: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' },
    desc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    statusRow: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
    connectBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', cursor: 'pointer', fontSize: 12, color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' },
};

export default function IntegrationsPage() {
    return (
        <div style={s.page}>
            <SettingsTabs />
            <div style={s.grid}>
                {integrations.map(i => (
                    <div key={i.id} style={s.card}>
                        <div style={{ ...s.icon, background: i.color }}>{i.name.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                            <div style={s.name}>{i.name}</div>
                            <div style={s.desc}>{i.desc}</div>
                            <div style={s.statusRow}>
                                {i.status === 'connected' ? (
                                    <span style={{ ...s.badge, background: 'var(--color-success-light)', color: 'var(--color-success)' }}><CheckCircle size={12} /> Connected</span>
                                ) : (
                                    <button style={s.connectBtn}><Zap size={12} /> Connect</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
