'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Bell, Smartphone, Mail, MessageSquare, Edit, Trash2, MoreVertical, Eye, RefreshCw, Search, Check, X } from 'lucide-react';
import { useToast, DropdownMenu, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';

// Mock recipient data per notification
const recipientData: Record<number, Array<{ name: string; phone: string; opened: boolean; openedAt?: string }>> = {
    1: [
        { name: 'Fatima Ali', phone: '+201012345678', opened: true, openedAt: '2026-02-10 10:15' },
        { name: 'Noura Ahmed', phone: '+201087654321', opened: true, openedAt: '2026-02-10 10:22' },
        { name: 'Huda Saleh', phone: '+201055667788', opened: true, openedAt: '2026-02-10 11:05' },
        { name: 'Rania Khalil', phone: '+201099887766', opened: false },
        { name: 'Hana Ali', phone: '+201033445566', opened: true, openedAt: '2026-02-10 12:30' },
        { name: 'Layla Hassan', phone: '+201077889900', opened: false },
        { name: 'Sara Mahmoud', phone: '+201011223344', opened: true, openedAt: '2026-02-10 14:00' },
        { name: 'Mona Tarek', phone: '+201044556677', opened: false },
    ],
    2: [
        { name: 'Fatima Ali', phone: '+201012345678', opened: true, openedAt: '2026-02-17 09:05' },
        { name: 'Noura Ahmed', phone: '+201087654321', opened: true, openedAt: '2026-02-17 09:10' },
        { name: 'Huda Saleh', phone: '+201055667788', opened: true, openedAt: '2026-02-17 09:30' },
        { name: 'Rania Khalil', phone: '+201099887766', opened: false },
    ],
    4: [
        { name: 'Layla Hassan', phone: '+201077889900', opened: true, openedAt: '2026-02-05 10:00' },
        { name: 'Sara Mahmoud', phone: '+201011223344', opened: false },
        { name: 'Mona Tarek', phone: '+201044556677', opened: true, openedAt: '2026-02-05 15:15' },
        { name: 'Hana Ali', phone: '+201033445566', opened: false },
    ],
    5: [
        { name: 'Fatima Ali', phone: '+201012345678', opened: true, openedAt: '2026-02-16 14:10' },
        { name: 'Noura Ahmed', phone: '+201087654321', opened: true, openedAt: '2026-02-16 14:45' },
        { name: 'Huda Saleh', phone: '+201055667788', opened: false },
    ],
    6: [
        { name: 'Rania Khalil', phone: '+201099887766', opened: true, openedAt: '2026-02-17 08:00' },
        { name: 'Hana Ali', phone: '+201033445566', opened: true, openedAt: '2026-02-17 09:00' },
        { name: 'Layla Hassan', phone: '+201077889900', opened: true, openedAt: '2026-02-17 10:30' },
    ],
};

const initialNotifications = [
    { id: 1, title: 'Eid Special Offer!', channel: 'SMS', audience: 'All Clients', sent: 142, opened: 98, date: '2026-02-10', status: 'sent', message: 'Celebrate Eid with us! Get 25% off on all services from Feb 10-20. Book now on our app or call us. Limited spots available! ✨🎉' },
    { id: 2, title: 'Your appointment is tomorrow', channel: 'Push', audience: 'Booked Clients', sent: 28, opened: 25, date: '2026-02-17', status: 'sent', message: 'Hi {name}, just a friendly reminder that your {service} appointment is scheduled for tomorrow at {time}. See you soon! 💇‍♀️' },
    { id: 3, title: 'Spring Sale – 30% Off!', channel: 'Email', audience: 'VIP Group', sent: 0, opened: 0, date: '2026-03-01', status: 'scheduled', message: 'Dear {name}, as a VIP client, you get exclusive early access to our Spring Sale! Enjoy 30% off on all premium services. Valid March 1-15.' },
    { id: 4, title: 'We miss you! Come back for 20% off', channel: 'WhatsApp', audience: 'Inactive > 30 days', sent: 38, opened: 15, date: '2026-02-05', status: 'sent', message: 'Hi {name}, it\'s been a while! We\'d love to see you again. Here\'s 20% off your next visit as a welcome back gift. Book now! 💕' },
    { id: 5, title: 'Rate your experience', channel: 'SMS', audience: 'Today\'s Completed', sent: 12, opened: 8, date: '2026-02-16', status: 'sent', message: 'Thank you for visiting us today! We\'d love your feedback. Rate your experience: ⭐⭐⭐⭐⭐ Reply with 1-5.' },
    { id: 6, title: 'Happy Birthday! Gift inside', channel: 'Push', audience: 'Birthday Today', sent: 3, opened: 3, date: '2026-02-17', status: 'sent', message: 'Happy Birthday {name}! 🎂🎁 As our gift to you, enjoy a FREE express facial on your next visit. Valid for 7 days.' },
];

const channelIcons: Record<string, React.ReactNode> = {
    SMS: <Smartphone size={14} />, Push: <Bell size={14} />, Email: <Mail size={14} />, WhatsApp: <MessageSquare size={14} />,
};
const channelBadge: Record<string, 'info' | 'primary' | 'purple' | 'success'> = { SMS: 'info', Push: 'primary', Email: 'purple', WhatsApp: 'success' };
const statusBadge: Record<string, 'success' | 'info' | 'neutral'> = { sent: 'success', scheduled: 'info', draft: 'neutral' };

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    addBtn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-5)', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    detailSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    infoCard: { background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' },
    infoLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' },
    infoValue: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    sectionTitle: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    progressContainer: { height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
    // Recipient list
    filterBar: { display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' },
    filterBtn: { padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-secondary)' },
    filterBtnActive: { background: 'var(--color-primary-500)', color: 'white', borderColor: 'var(--color-primary-500)' },
    recipientItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', borderTop: '1px solid var(--border-color)' },
    recipientInfo: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    recipientAvatar: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'white', flexShrink: 0 },
};

export default function NotificationsPage() {
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selected, setSelected] = useState<typeof initialNotifications[0] | null>(null);
    const [recipientFilter, setRecipientFilter] = useState<'all' | 'opened' | 'not_opened'>('all');
    const [recipientSearch, setRecipientSearch] = useState('');

    const openDetail = (n: typeof initialNotifications[0]) => { setSelected(n); setIsDetailOpen(true); setRecipientFilter('all'); setRecipientSearch(''); };
    const openEdit = (n: typeof initialNotifications[0]) => { setSelected(n); setIsDetailOpen(false); setIsEditOpen(true); };
    const openDelete = (n: typeof initialNotifications[0]) => { setSelected(n); setIsDetailOpen(false); setIsDeleteOpen(true); };

    const handleDelete = () => {
        setNotifications(prev => prev.filter(n => n.id !== selected?.id));
        setIsDeleteOpen(false);
        setSelected(null);
        addToast('success', t('mkt.lblDeleteNotification'));
    };

    const totalSent = notifications.reduce((a, n) => a + n.sent, 0);
    const totalOpened = notifications.reduce((a, n) => a + n.opened, 0);

    const filteredRecipients = useMemo(() => {
        if (!selected) return [];
        const list = recipientData[selected.id] || [];
        let filtered = list;
        if (recipientFilter === 'opened') filtered = list.filter(r => r.opened);
        if (recipientFilter === 'not_opened') filtered = list.filter(r => !r.opened);
        if (recipientSearch) filtered = filtered.filter(r => r.name.toLowerCase().includes(recipientSearch.toLowerCase()));
        return filtered;
    }, [selected, recipientFilter, recipientSearch]);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div style={s.page}>
            <MarketingTabs />

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalSent}</div><div style={s.kpiLbl}>{t('mkt.lblTotalSent')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{totalOpened}</div><div style={s.kpiLbl}>{t('mkt.lblTotalOpened')}</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{totalSent > 0 ? Math.round(totalOpened / totalSent * 100) : 0}%</div><div style={s.kpiLbl}>{t('mkt.lblOpenRate')}</div></div>
            </div>

            <div style={s.toolbar}><button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> {t('mkt.btnCompose')}</button></div>

            <table style={s.table}>
                <thead><tr>{[t('mkt.lblTitle'), t('mkt.lblChannel'), t('mkt.lblAudience'), t('mkt.lblTotalSent'), t('mkt.lblOpened'), t('mkt.lblDate'), t('mkt.lblStatus'), ''].map((h, i) => <th key={i} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {notifications.map(n => (
                        <tr key={n.id} style={{ cursor: 'pointer' }} className="hoverRow" onClick={() => openDetail(n)}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{n.title}</td>
                            <td style={s.td}><Badge color={channelBadge[n.channel]} size="sm">{n.channel}</Badge></td>
                            <td style={s.td}>{n.audience}</td>
                            <td style={s.td}>{n.sent}</td>
                            <td style={{ ...s.td, color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' }}>{n.opened}</td>
                            <td style={s.td}>{n.date}</td>
                            <td style={s.td}><Badge color={statusBadge[n.status]} size="sm">{t(`mkt.lbl${n.status.charAt(0).toUpperCase() + n.status.slice(1)}`) || n.status}</Badge></td>
                            <td style={{ ...s.td, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: t('bk.actionView'), icon: <Eye size={14} />, onClick: () => openDetail(n) },
                                        { label: t('mkt.lblEditNotification'), icon: <Edit size={14} />, onClick: () => openEdit(n) },
                                        { label: t('mkt.lblDeleteNotification'), destructive: true, icon: <Trash2 size={14} />, onClick: () => openDelete(n) }
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Detail SlideOver */}
            <SlideOver open={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelected(null); }} title={t('mkt.lblNotificationDetails')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selected!)}><Trash2 size={14} /> {t('mkt.lblDeleteNotification')}</Button>
                        <Button variant="ghost" onClick={() => { addToast('success', 'Notification resent'); setIsDetailOpen(false); }}><RefreshCw size={14} /> {t('mkt.btnResend')}</Button>
                        <Button onClick={() => openEdit(selected!)}><Edit size={14} /> {t('bk.btnEdit')}</Button>
                    </div>
                }
            >
                {selected && (
                    <div style={s.detailSection as React.CSSProperties}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{selected.title}</span>
                                <Badge color={statusBadge[selected.status]}>{t(`mkt.lbl${selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}`) || selected.status}</Badge>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Badge color={channelBadge[selected.channel]} size="sm">{channelIcons[selected.channel]} {selected.channel}</Badge>
                                <Badge color="neutral" size="sm">{selected.audience}</Badge>
                            </div>
                        </div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblTotalSent')}</div>
                                <div style={{ ...s.infoValue, fontSize: 'var(--text-2xl)' }}>{selected.sent}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>{t('mkt.lblTotalOpened')}</div>
                                <div style={{ ...s.infoValue, fontSize: 'var(--text-2xl)', color: 'var(--color-primary-600)' }}>{selected.opened}</div>
                            </div>
                        </div>

                        {/* Open Rate Progress */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>{t('mkt.lblOpenRate')}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{selected.opened} / {selected.sent} {t('mkt.lblOpened').toLowerCase()}</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selected.sent > 0 ? Math.round(selected.opened / selected.sent * 100) : 0}%</span>
                            </div>
                            <div style={s.progressContainer}>
                                <div style={{ ...s.progressFill, width: `${selected.sent > 0 ? Math.min(selected.opened / selected.sent * 100, 100) : 0}%`, background: 'var(--color-primary-500)' }} />
                            </div>
                        </div>

                        {/* Recipient List with Filter */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>{t('mkt.lblRecipients')}</div>

                            {/* Filter tabs */}
                            <div style={s.filterBar as React.CSSProperties}>
                                {[
                                    { key: 'all' as const, label: t('mkt.lblAll'), count: recipientData[selected.id]?.length || 0 },
                                    { key: 'opened' as const, label: t('mkt.lblOpened'), count: recipientData[selected.id]?.filter(r => r.opened).length || 0 },
                                    { key: 'not_opened' as const, label: t('mkt.lblNotOpened'), count: recipientData[selected.id]?.filter(r => !r.opened).length || 0 },
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        style={{ ...s.filterBtn, ...(recipientFilter === f.key ? s.filterBtnActive : {}) }}
                                        onClick={() => setRecipientFilter(f.key)}
                                    >
                                        {f.label} ({f.count})
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div style={{ position: 'relative' as const, marginBottom: 'var(--space-3)' }}>
                                <Search size={14} style={{ position: 'absolute' as const, left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    style={{ width: '100%', height: 36, paddingLeft: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                                    placeholder={t('mkt.phSearchRecipients')}
                                    value={recipientSearch}
                                    onChange={e => setRecipientSearch(e.target.value)}
                                />
                            </div>

                            {/* Recipient list */}
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxHeight: 300, overflowY: 'auto' }}>
                                {filteredRecipients.length === 0 ? (
                                    <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                                        {recipientData[selected.id] ? t('mkt.msgNoRecipientsMatch') : 'No recipient data available'}
                                    </div>
                                ) : (
                                    filteredRecipients.map((r, i) => (
                                        <div key={i} style={{ ...s.recipientItem, borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}>
                                            <div style={s.recipientInfo as React.CSSProperties}>
                                                <div style={{ ...s.recipientAvatar, background: r.opened ? 'var(--color-success)' : 'var(--color-gray-400)' }}>
                                                    {getInitials(r.name)}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{r.name}</div>
                                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{r.phone}</div>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                {r.opened ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}><Check size={12} /> {t('mkt.lblOpened')}</div>
                                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{r.openedAt}</div>
                                                    </>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gray-400)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}><X size={12} /> {t('mkt.lblNotOpened')}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Message Preview */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>{t('mkt.lblMessageContent')}</div>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                {selected.message}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Notification SlideOver */}
            <SlideOver open={isAddOpen} onClose={() => setIsAddOpen(false)} title={t('mkt.lblComposeNotification')}
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('rtn.btnBack')}</Button><Button onClick={() => { setIsAddOpen(false); addToast('success', 'Notification scheduled'); }}>{t('mkt.btnScheduleNotification')}</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('mkt.lblCampaignTitle')} placeholder="e.g. End of Summer Sale" />
                    <Select label={t('mkt.lblChannel')} options={[{ label: 'SMS', value: 'SMS' }, { label: 'Email', value: 'Email' }, { label: 'Push', value: 'Push' }, { label: 'WhatsApp', value: 'WhatsApp' }]} />
                    <Select label={t('mkt.lblAudience')} options={[{ label: 'All Clients', value: 'All Clients' }, { label: 'VIP Group', value: 'VIP Group' }, { label: 'Inactive > 30 days', value: 'Inactive > 30 days' }]} />
                    <Input label={t('mkt.lblSendDate')} type="date" />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('mkt.lblMessageContent')}</label>
                        <textarea style={{ width: '100%', minHeight: 120, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} placeholder={t('mkt.phTypeMessage')} />
                    </div>
                </div>
            </SlideOver>

            {/* Edit Notification SlideOver */}
            <SlideOver open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelected(null); }} title={t('mkt.lblEditNotification')}
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsEditOpen(false)}>{t('rtn.btnBack')}</Button><Button onClick={() => { setIsEditOpen(false); addToast('success', 'Notification updated'); }}>{t('settings.saveChanges')}</Button></div>}
            >
                {selected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label={t('mkt.lblCampaignTitle')} defaultValue={selected.title} />
                        <Select label={t('mkt.lblChannel')} defaultValue={selected.channel} options={[{ label: 'SMS', value: 'SMS' }, { label: 'Email', value: 'Email' }, { label: 'Push', value: 'Push' }, { label: 'WhatsApp', value: 'WhatsApp' }]} />
                        <Select label={t('mkt.lblAudience')} defaultValue={selected.audience} options={[{ label: 'All Clients', value: 'All Clients' }, { label: 'VIP Group', value: 'VIP Group' }, { label: 'Inactive > 30 days', value: 'Inactive > 30 days' }, { label: 'Booked Clients', value: 'Booked Clients' }, { label: 'Birthday Today', value: 'Birthday Today' }]} />
                        <Input label={t('mkt.lblSendDate')} type="date" defaultValue={selected.date} />
                        <Select label={t('mkt.lblStatus')} defaultValue={selected.status} options={[{ label: t('mkt.lblDraft'), value: 'draft' }, { label: t('mkt.lblScheduled'), value: 'scheduled' }, { label: t('mkt.lblSentAt') /* Using Sent At since we don't have just Sent */, value: 'sent' }]} />
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>{t('mkt.lblMessageContent')}</label>
                            <textarea style={{ width: '100%', minHeight: 120, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} defaultValue={selected.message} />
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal open={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelected(null); }} title={t('mkt.lblDeleteNotification')}
                footer={<div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}><Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>{t('rtn.btnBack')}</Button><Button variant="destructive" onClick={handleDelete}>{t('mkt.lblDeleteNotification')}</Button></div>}
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('mkt.msgDeleteNotificationConfirm')} <strong>{selected?.title}</strong></p>
            </Modal>

            <style>{`.hoverRow:hover { background-color: var(--bg-secondary); }`}</style>
        </div >
    );
}
