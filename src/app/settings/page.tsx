'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Building2,
    Clock,
    Palette,
    Bell,
    Shield,
    Globe,
    CreditCard,
    FileText,
    Webhook,
    Database,
    Save,
    Check,
} from 'lucide-react';

const tabItems = [
    { label: 'General', href: '/settings', icon: <Building2 size={16} />, key: 'general' },
    { label: 'Working Hours', href: '/settings/hours', icon: <Clock size={16} />, key: 'hours' },
    { label: 'Appearance', href: '/settings/appearance', icon: <Palette size={16} />, key: 'appearance' },
    { label: 'Notifications', href: '/settings/notifications', icon: <Bell size={16} />, key: 'notifications' },
    { label: 'Security', href: '/settings/security', icon: <Shield size={16} />, key: 'security' },
    { label: 'Localization', href: '/settings/localization', icon: <Globe size={16} />, key: 'localization' },
    { label: 'Payment Methods', href: '/settings/payment', icon: <CreditCard size={16} />, key: 'payment' },
    { label: 'Invoice Template', href: '/settings/invoice', icon: <FileText size={16} />, key: 'invoice' },
    { label: 'Integrations', href: '/settings/integrations', icon: <Webhook size={16} />, key: 'integrations' },
    { label: 'Data & Backup', href: '/settings/data', icon: <Database size={16} />, key: 'data' },
];

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    sub: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
    layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-6)' },
    nav: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    navItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all var(--transition-fast)' },
    navActive: { background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    content: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' },
    cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-5)' },
    field: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' },
    label: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' },
    input: { height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%', maxWidth: 400 },
    select: { height: 42, padding: '0 var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%', maxWidth: 400, cursor: 'pointer' },
    textarea: { padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', width: '100%', maxWidth: 400, minHeight: 80, resize: 'vertical' as const },
    toggle: { width: 52, height: 28, borderRadius: 14, position: 'relative' as const, cursor: 'pointer', transition: 'background var(--transition-fast)' },
    toggleDot: { width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute' as const, top: 3, transition: 'left var(--transition-fast)', boxShadow: 'var(--shadow-sm)' },
    btnSave: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-6)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', transition: 'all var(--transition-fast)', marginTop: 'var(--space-2)' },
    fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', maxWidth: 400 },
    hint: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
};

function ToggleSwitch({ on, label }: { on: boolean; label: string }) {
    const [active, setActive] = useState(on);
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{label}</span>
            <div
                style={{ ...cs.toggle, background: active ? 'var(--color-primary-500)' : 'var(--color-gray-300)' }}
                onClick={() => setActive(!active)}
            >
                <div style={{ ...cs.toggleDot, left: active ? 27 : 3 }} />
            </div>
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div style={cs.page}>
            <div style={cs.header}>
                <div>
                    <h1 style={cs.h1}>Settings</h1>
                    <p style={cs.sub}>Configure your business, preferences, and integrations.</p>
                </div>
            </div>

            <div style={cs.layout}>
                {/* Side Nav */}
                <nav style={cs.nav}>
                    {tabItems.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            style={activeTab === t.key ? { ...cs.navItem, ...cs.navActive } : cs.navItem}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div style={cs.content}>
                    {activeTab === 'general' && (
                        <>
                            <div style={cs.card}>
                                <div style={cs.cardTitle}>Business Information</div>
                                <div style={cs.cardDesc}>Basic details about your salon or spa.</div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Business Name</label>
                                    <input style={cs.input} defaultValue="Hagzy Beauty Salon" />
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Legal Name</label>
                                    <input style={cs.input} defaultValue="Hagzy Beauty Services LLC" />
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Commercial Registration</label>
                                    <input style={cs.input} defaultValue="CR-2024-12345" />
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Tax ID / VAT Number</label>
                                    <input style={cs.input} defaultValue="300-456-789" />
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Address</label>
                                    <textarea style={cs.textarea} defaultValue="12 El-Nozha St, Heliopolis, Cairo, Egypt" />
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Phone</label>
                                    <input style={cs.input} defaultValue="+20 2 1234 5678" />
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Email</label>
                                    <input style={cs.input} type="email" defaultValue="info@hagzy.com" />
                                </div>
                            </div>

                            <div style={cs.card}>
                                <div style={cs.cardTitle}>Booking Preferences</div>
                                <div style={cs.cardDesc}>Control how bookings work in your system.</div>
                                <ToggleSwitch on={true} label="Allow online booking" />
                                <ToggleSwitch on={true} label="Allow walk-in customers" />
                                <ToggleSwitch on={false} label="Require deposit for bookings" />
                                <ToggleSwitch on={true} label="Send SMS reminders" />
                                <ToggleSwitch on={true} label="Auto-confirm bookings" />
                                <div style={{ ...cs.field, marginTop: 'var(--space-4)' }}>
                                    <label style={cs.label}>Default Booking Gap (minutes)</label>
                                    <input style={cs.input} type="number" defaultValue={15} />
                                    <span style={cs.hint}>Buffer time between appointments.</span>
                                </div>
                                <div style={cs.field}>
                                    <label style={cs.label}>Cancellation Window (hours)</label>
                                    <input style={cs.input} type="number" defaultValue={24} />
                                    <span style={cs.hint}>Minimum notice required for cancellations.</span>
                                </div>
                            </div>

                            <button style={cs.btnSave} onClick={handleSave}>
                                {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                            </button>
                        </>
                    )}

                    {activeTab === 'appearance' && (
                        <div style={cs.card}>
                            <div style={cs.cardTitle}>Appearance</div>
                            <div style={cs.cardDesc}>Customize the look and feel of your dashboard.</div>
                            <div style={cs.field}>
                                <label style={cs.label}>Theme</label>
                                <select style={cs.select} defaultValue="light">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                            <div style={cs.field}>
                                <label style={cs.label}>Brand Color</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <input type="color" defaultValue="#00B166" style={{ width: 42, height: 42, border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} />
                                    <input style={{ ...cs.input, maxWidth: 120 }} defaultValue="#00B166" />
                                </div>
                            </div>
                            <div style={cs.field}>
                                <label style={cs.label}>Language</label>
                                <select style={cs.select} defaultValue="en">
                                    <option value="en">English</option>
                                    <option value="ar">العربية</option>
                                </select>
                            </div>
                            <ToggleSwitch on={false} label="Compact sidebar" />
                            <ToggleSwitch on={true} label="Show animations" />
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div style={cs.card}>
                            <div style={cs.cardTitle}>Notification Preferences</div>
                            <div style={cs.cardDesc}>Choose what notifications you receive.</div>
                            <ToggleSwitch on={true} label="New booking alerts" />
                            <ToggleSwitch on={true} label="Booking cancellation alerts" />
                            <ToggleSwitch on={true} label="Payment received" />
                            <ToggleSwitch on={false} label="Daily summary email" />
                            <ToggleSwitch on={true} label="Low stock warnings" />
                            <ToggleSwitch on={false} label="Employee clock-in alerts" />
                            <ToggleSwitch on={true} label="Client birthday reminders" />
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={cs.card}>
                            <div style={cs.cardTitle}>Security Settings</div>
                            <div style={cs.cardDesc}>Protect your account and data.</div>
                            <ToggleSwitch on={true} label="Two-factor authentication" />
                            <ToggleSwitch on={false} label="Require password change every 90 days" />
                            <ToggleSwitch on={true} label="Lock after 3 failed login attempts" />
                            <div style={{ ...cs.field, marginTop: 'var(--space-4)' }}>
                                <label style={cs.label}>Session Timeout (minutes)</label>
                                <input style={cs.input} type="number" defaultValue={30} />
                            </div>
                        </div>
                    )}

                    {/* Fallback for other tabs */}
                    {!['general', 'appearance', 'notifications', 'security'].includes(activeTab) && (
                        <div style={cs.card}>
                            <div style={cs.cardTitle}>{tabItems.find(t => t.key === activeTab)?.label}</div>
                            <div style={cs.cardDesc}>This section is coming soon. Configure {tabItems.find(t => t.key === activeTab)?.label.toLowerCase()} settings here.</div>
                            <div style={{ padding: 'var(--space-10) 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <Building2 size={48} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
                                <p style={{ fontSize: 'var(--text-sm)' }}>Settings for this section will be available in the next update.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
