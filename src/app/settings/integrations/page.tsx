'use client';

import React from 'react';
import { useToast, Modal, Button, SlideOver, Input, Select, Switch } from '@/components/ui';
import {
    CheckCircle, XCircle, Zap, Settings,
    MessageCircle, CreditCard, CalendarDays, Mail, Workflow,
    Instagram, MapPin, Phone,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const CATEGORIES = [
    { key: 'communication', label: 'Communication' },
    { key: 'payment', label: 'Payments' },
    { key: 'scheduling', label: 'Scheduling & Calendar' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'automation', label: 'Automation' },
    { key: 'location', label: 'Location & Reviews' },
];

const initialIntegrations = [
    { id: 1, name: 'WhatsApp Business', desc: 'Send automated messages and appointment reminders via WhatsApp.', status: 'connected', color: '#25D366', icon: <MessageCircle size={20} />, category: 'communication' },
    { id: 2, name: 'Paymob', desc: 'Accept Visa, MasterCard, and digital wallet payments in-store and online.', status: 'connected', color: '#0070E0', icon: <CreditCard size={20} />, category: 'payment' },
    { id: 3, name: 'Google Calendar', desc: 'Auto-sync all bookings with team Google calendars for live availability.', status: 'connected', color: '#4285F4', icon: <CalendarDays size={20} />, category: 'scheduling' },
    { id: 4, name: 'Mailchimp', desc: 'Create and manage email marketing campaigns and automated newsletters.', status: 'disconnected', color: '#FFE01B', icon: <Mail size={20} />, category: 'marketing' },
    { id: 5, name: 'Zapier', desc: 'Connect with 5,000+ apps to automate repetitive tasks and workflows.', status: 'disconnected', color: '#FF4A00', icon: <Workflow size={20} />, category: 'automation' },
    { id: 6, name: 'Instagram Business', desc: 'Let clients book appointments directly from your Instagram profile.', status: 'connected', color: '#E1306C', icon: <Instagram size={20} />, category: 'marketing' },
    { id: 7, name: 'Google Maps', desc: 'Display your business location on Google Maps and collect client reviews.', status: 'connected', color: '#34A853', icon: <MapPin size={20} />, category: 'location' },
    { id: 8, name: 'Twilio SMS', desc: 'Send SMS notifications, appointment reminders, and OTP codes.', status: 'disconnected', color: '#F22F46', icon: <Phone size={20} />, category: 'communication' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' },
    statCard: {
        background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
    },
    statIcon: {
        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    categoryLabel: {
        fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)',
        color: 'var(--text-tertiary)', textTransform: 'uppercase' as const,
        letterSpacing: '0.08em', marginBottom: 'var(--space-3)',
        marginTop: 'var(--space-2)',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' },
    card: {
        background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)',
        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
    },
    icon: {
        width: 48, height: 48, borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', flexShrink: 0,
    },
    name: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' },
    desc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 1.5 },
    statusRow: {
        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        marginTop: 'var(--space-3)', flexWrap: 'wrap' as const,
    },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 10px', borderRadius: 'var(--radius-full)',
        fontSize: 11, fontWeight: 'var(--font-semibold)',
    },
    actionBtn: {
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '5px 14px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
        cursor: 'pointer', fontSize: 12, fontWeight: 'var(--font-medium)',
        transition: 'all 0.15s',
    },
};

export default function IntegrationsPage() {
    const { addToast } = useToast();
    const { t, lang } = useTranslation();
    const [integrations, setIntegrations] = React.useState(initialIntegrations);
    const [selectedIntegration, setSelectedIntegration] = React.useState<any>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    const connectedCount = integrations.filter(i => i.status === 'connected').length;
    const totalCount = integrations.length;

    const handleDisconnect = (integration: any) => {
        setSelectedIntegration(integration);
        setIsModalOpen(true);
    };

    const handleConnect = (integration: any) => {
        setSelectedIntegration(integration);
        setIsModalOpen(true);
    };

    const handleSettings = (integration: any) => {
        setSelectedIntegration(integration);
        setIsSettingsOpen(true);
    };

    const confirmAction = () => {
        const isConnecting = selectedIntegration.status === 'disconnected';
        setIntegrations(prev => prev.map(i =>
            i.id === selectedIntegration.id
                ? { ...i, status: isConnecting ? 'connected' : 'disconnected' }
                : i
        ));
        addToast(isConnecting ? 'success' : 'info', `${selectedIntegration.name} ${isConnecting ? 'connected' : 'disconnected'} successfully.`);
        setIsModalOpen(false);
        setSelectedIntegration(null);
    };

    return (
        <div style={s.page} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
{/* Stats */}
            <div style={s.statsRow}>
                <div style={s.statCard}>
                    <div style={{ ...s.statIcon, background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{connectedCount}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('settings.integrations.connected')}</div>
                    </div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statIcon, background: 'var(--color-gray-100)', color: 'var(--text-tertiary)' }}>
                        <XCircle size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{totalCount - connectedCount}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('settings.integrations.available')}</div>
                    </div>
                </div>
                <div style={s.statCard}>
                    <div style={{ ...s.statIcon, background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        <Zap size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{totalCount}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('settings.integrations.total')}</div>
                    </div>
                </div>
            </div>

            {/* Grouped by Category */}
            {CATEGORIES.map(cat => {
                const items = integrations.filter(i => i.category === cat.key);
                if (items.length === 0) return null;
                const catLabelKey: Record<string, string> = {
                    'communication': 'settings.integrations.catComm',
                    'payment': 'settings.integrations.catPay',
                    'scheduling': 'settings.integrations.catSched',
                    'marketing': 'settings.integrations.catMarket',
                    'automation': 'settings.integrations.catAuto',
                    'location': 'settings.integrations.catLoc'
                };
                return (
                    <div key={cat.key}>
                        <div style={s.categoryLabel}>{t(catLabelKey[cat.key] || cat.label)}</div>
                        <div style={s.grid}>
                            {items.map(i => (
                                <div key={i.id} style={{
                                    ...s.card,
                                    ...(i.status === 'connected' ? { borderColor: `${i.color}40` } : {}),
                                }}>
                                    <div style={{ ...s.icon, background: i.color }}>{i.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={s.name}>{i.name}</div>
                                        <div style={s.desc}>{i.desc}</div>
                                        <div style={s.statusRow}>
                                            {i.status === 'connected' ? (
                                                <>
                                                    <span style={{ ...s.badge, background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                                                        <CheckCircle size={12} /> {t('settings.integrations.connected')}
                                                    </span>
                                                    <button
                                                        onClick={() => handleSettings(i)}
                                                        style={{ ...s.actionBtn, color: 'var(--text-tertiary)' }}
                                                    >
                                                        <Settings size={12} style={{ marginInlineEnd: 4 }} /> {t('settings.integrations.settings')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDisconnect(i)}
                                                        style={{ ...s.actionBtn, color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                                    >
                                                        <XCircle size={12} style={{ marginInlineEnd: 4 }} /> {t('settings.integrations.disconnect')}
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleConnect(i)} style={{ ...s.actionBtn, color: 'var(--color-primary-600)', borderColor: 'var(--color-primary-400)' }}>
                                                    <Zap size={12} style={{ marginInlineEnd: 4 }} /> {t('settings.integrations.connect')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Connect/Disconnect Modal */}
            <Modal
                open={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedIntegration(null); }}
                title={`${selectedIntegration?.status === 'disconnected' ? t('settings.integrations.connect') : t('settings.integrations.disconnect')} ${selectedIntegration?.name}`}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>{t('settings.integrations.cancel')}</Button>
                        <Button
                            variant={selectedIntegration?.status === 'disconnected' ? 'primary' : 'destructive'}
                            onClick={confirmAction}
                        >
                            {selectedIntegration?.status === 'disconnected' ? t('settings.integrations.confirmConn') : t('settings.integrations.confirmDisconn')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {selectedIntegration?.status === 'disconnected' ? t('settings.integrations.connMsg1') : t('settings.integrations.disconnMsg1')}
                    <strong>{selectedIntegration?.name}</strong>
                    {selectedIntegration?.status === 'disconnected' ? t('settings.integrations.connMsg2') : t('settings.integrations.disconnMsg2')}
                </p>
            </Modal>

            {/* Integration Settings SlideOver */}
            <SlideOver
                open={isSettingsOpen}
                onClose={() => { setIsSettingsOpen(false); setSelectedIntegration(null); }}
                title={`${selectedIntegration?.name} ${t('settings.integrations.settings')}`}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsSettingsOpen(false)}>{t('settings.integrations.cancel')}</Button>
                        <Button onClick={() => { setIsSettingsOpen(false); addToast('success', `${selectedIntegration?.name} settings saved.`); }}>{t('settings.integrations.saveSettings')}</Button>
                    </div>
                }
            >
                {selectedIntegration && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        {/* Status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', background: 'var(--color-success-light)', borderRadius: 'var(--radius-lg)' }}>
                            <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                            <div>
                                <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{t('settings.integrations.activeStatus')}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{t('settings.integrations.lastSynced')}</div>
                            </div>
                        </div>

                        {/* API Key */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('settings.integrations.apiKey')}</label>
                            <div style={{
                                padding: 'var(--space-3)', background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)', fontFamily: 'monospace',
                                fontSize: 'var(--text-sm)', color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                            }} dir="ltr">
                                sk-••••••••••••••••{selectedIntegration.name.slice(0, 4).toUpperCase()}
                            </div>
                        </div>

                        {/* Webhook URL */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('settings.integrations.webhookUrl')}</label>
                            <Input
                                defaultValue={`https://api.hagzy.com/webhooks/${selectedIntegration.name.toLowerCase().replace(/\s/g, '-')}`}
                                dir="ltr"
                            />
                        </div>

                        {/* Sync Settings */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('settings.integrations.syncFreq')}</label>
                            <Select
                                options={[
                                    { label: t('settings.integrations.syncRealtime'), value: 'realtime' },
                                    { label: t('settings.integrations.sync5min'), value: '5min' },
                                    { label: t('settings.integrations.sync15min'), value: '15min' },
                                    { label: t('settings.integrations.sync1hr'), value: '1hr' },
                                    { label: t('settings.integrations.syncManual'), value: 'manual' },
                                ]}
                                defaultValue="realtime"
                            />
                        </div>

                        {/* Notifications */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('settings.integrations.notifications')}</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <Switch checked={true} label={t('settings.integrations.notifyError')} />
                                <Switch checked={true} label={t('settings.integrations.notifyDisconn')} />
                                <Switch checked={false} label={t('settings.integrations.notifySummary')} />
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div style={{
                            padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-error)', background: 'var(--color-error-light)',
                        }}>
                            <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)', color: 'var(--color-error)', marginBottom: 'var(--space-2)' }}>{t('settings.integrations.dangerZone')}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                {t('settings.integrations.dangerDesc')}
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setIsSettingsOpen(false);
                                    handleDisconnect(selectedIntegration);
                                }}
                            >
                                <XCircle size={14} style={{ marginInlineEnd: 8 }} /> {t('settings.integrations.disconnect')} {selectedIntegration.name}
                            </Button>
                        </div>
                    </div>
                )}
            </SlideOver>
        </div>
    );
}

