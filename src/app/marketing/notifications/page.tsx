'use client';

import React, { useState } from 'react';
import { Plus, Bell, Send, Smartphone, Mail, MessageSquare, Edit, Trash2, MoreVertical, Eye, RefreshCw } from 'lucide-react';
import { useToast, DropdownMenu, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

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
    // Detail styles
    detailSection: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' },
    infoCard: { background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' },
    infoLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' },
    infoValue: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    sectionTitle: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' },
    progressContainer: { height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s ease' },
};

export default function NotificationsPage() {
    const { addToast } = useToast();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const openDetail = (n: any) => { setSelected(n); setIsDetailOpen(true); };
    const openEdit = (n: any) => { setSelected(n); setIsDetailOpen(false); setIsEditOpen(true); };
    const openDelete = (n: any) => { setSelected(n); setIsDetailOpen(false); setIsDeleteOpen(true); };

    const handleDelete = () => {
        setNotifications(prev => prev.filter(n => n.id !== selected?.id));
        setIsDeleteOpen(false);
        setSelected(null);
        addToast('success', 'Notification deleted');
    };

    const totalSent = notifications.reduce((a, n) => a + n.sent, 0);
    const totalOpened = notifications.reduce((a, n) => a + n.opened, 0);

    return (
        <div style={s.page}>
            <MarketingTabs />

            <div style={s.kpis}>
                <div style={s.kpi}><div style={s.kpiVal}>{totalSent}</div><div style={s.kpiLbl}>Total Sent</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{totalOpened}</div><div style={s.kpiLbl}>Total Opened</div></div>
                <div style={s.kpi}><div style={s.kpiVal}>{totalSent > 0 ? Math.round(totalOpened / totalSent * 100) : 0}%</div><div style={s.kpiLbl}>Open Rate</div></div>
            </div>

            <div style={s.toolbar}><button style={s.addBtn} onClick={() => setIsAddOpen(true)}><Plus size={16} /> Compose</button></div>

            <table style={s.table}>
                <thead><tr>{['Title', 'Channel', 'Audience', 'Sent', 'Opened', 'Date', 'Status', ''].map((h, i) => <th key={i} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {notifications.map(n => (
                        <tr key={n.id} style={{ cursor: 'pointer' }} className="hoverRow" onClick={() => openDetail(n)}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{n.title}</td>
                            <td style={s.td}><Badge color={channelBadge[n.channel]} size="sm">{n.channel}</Badge></td>
                            <td style={s.td}>{n.audience}</td>
                            <td style={s.td}>{n.sent}</td>
                            <td style={{ ...s.td, color: 'var(--color-primary-600)', fontWeight: 'var(--font-medium)' }}>{n.opened}</td>
                            <td style={s.td}>{n.date}</td>
                            <td style={s.td}><Badge color={statusBadge[n.status]} size="sm">{n.status}</Badge></td>
                            <td style={{ ...s.td, textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                                <DropdownMenu
                                    trigger={<button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><MoreVertical size={16} /></button>}
                                    items={[
                                        { label: 'View Details', icon: <Eye size={14} />, onClick: () => openDetail(n) },
                                        { label: 'Edit', icon: <Edit size={14} />, onClick: () => openEdit(n) },
                                        { label: 'Delete', destructive: true, icon: <Trash2 size={14} />, onClick: () => openDelete(n) }
                                    ]}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Detail SlideOver */}
            <SlideOver open={isDetailOpen} onClose={() => { setIsDetailOpen(false); setSelected(null); }} title="Notification Details"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => openDelete(selected)}><Trash2 size={14} /> Delete</Button>
                        <Button variant="ghost" onClick={() => { addToast('success', 'Notification resent'); setIsDetailOpen(false); }}><RefreshCw size={14} /> Resend</Button>
                        <Button onClick={() => openEdit(selected)}><Edit size={14} /> Edit</Button>
                    </div>
                }
            >
                {selected && (
                    <div style={s.detailSection as React.CSSProperties}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' }}>{selected.title}</span>
                                <Badge color={statusBadge[selected.status]}>{selected.status}</Badge>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Badge color={channelBadge[selected.channel]} size="sm">{channelIcons[selected.channel]} {selected.channel}</Badge>
                                <Badge color="neutral" size="sm">{selected.audience}</Badge>
                            </div>
                        </div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Total Sent</div>
                                <div style={{ ...s.infoValue, fontSize: 'var(--text-2xl)' }}>{selected.sent}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Total Opened</div>
                                <div style={{ ...s.infoValue, fontSize: 'var(--text-2xl)', color: 'var(--color-primary-600)' }}>{selected.opened}</div>
                            </div>
                        </div>

                        {/* Open Rate Progress */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>Open Rate</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{selected.opened} / {selected.sent} opened</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selected.sent > 0 ? Math.round(selected.opened / selected.sent * 100) : 0}%</span>
                            </div>
                            <div style={s.progressContainer}>
                                <div style={{ ...s.progressFill, width: `${selected.sent > 0 ? Math.min(selected.opened / selected.sent * 100, 100) : 0}%`, background: 'var(--color-primary-500)' }} />
                            </div>
                        </div>

                        <div style={s.infoGrid as React.CSSProperties}>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Date</div>
                                <div style={s.infoValue}>{selected.date}</div>
                            </div>
                            <div style={s.infoCard}>
                                <div style={s.infoLabel as React.CSSProperties}>Click Rate</div>
                                <div style={s.infoValue}>{selected.sent > 0 ? Math.round(selected.opened / selected.sent * 70) : 0}%</div>
                            </div>
                        </div>

                        {/* Message Preview */}
                        <div>
                            <div style={{ ...s.sectionTitle as React.CSSProperties, marginBottom: 'var(--space-3)' }}>Message Content</div>
                            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                {selected.message}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Notification SlideOver */}
            <SlideOver open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Compose Notification"
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={() => { setIsAddOpen(false); addToast('success', 'Notification scheduled'); }}>Schedule Notification</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Campaign Title" placeholder="e.g. End of Summer Sale" />
                    <Select label="Channel" options={[{ label: 'SMS', value: 'SMS' }, { label: 'Email', value: 'Email' }, { label: 'Push', value: 'Push' }, { label: 'WhatsApp', value: 'WhatsApp' }]} />
                    <Select label="Target Audience" options={[{ label: 'All Clients', value: 'All Clients' }, { label: 'VIP Group', value: 'VIP Group' }, { label: 'Inactive > 30 days', value: 'Inactive > 30 days' }]} />
                    <Input label="Send Date" type="date" />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Message Content</label>
                        <textarea style={{ width: '100%', minHeight: 120, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} placeholder="Type your message here..." />
                    </div>
                </div>
            </SlideOver>

            {/* Edit Notification SlideOver */}
            <SlideOver open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelected(null); }} title="Edit Notification"
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={() => { setIsEditOpen(false); addToast('success', 'Notification updated'); }}>Save Changes</Button></div>}
            >
                {selected && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Campaign Title" defaultValue={selected.title} />
                        <Select label="Channel" defaultValue={selected.channel} options={[{ label: 'SMS', value: 'SMS' }, { label: 'Email', value: 'Email' }, { label: 'Push', value: 'Push' }, { label: 'WhatsApp', value: 'WhatsApp' }]} />
                        <Select label="Target Audience" defaultValue={selected.audience} options={[{ label: 'All Clients', value: 'All Clients' }, { label: 'VIP Group', value: 'VIP Group' }, { label: 'Inactive > 30 days', value: 'Inactive > 30 days' }, { label: 'Booked Clients', value: 'Booked Clients' }, { label: 'Birthday Today', value: 'Birthday Today' }]} />
                        <Input label="Send Date" type="date" defaultValue={selected.date} />
                        <Select label="Status" defaultValue={selected.status} options={[{ label: 'Draft', value: 'draft' }, { label: 'Scheduled', value: 'scheduled' }, { label: 'Sent', value: 'sent' }]} />
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Message Content</label>
                            <textarea style={{ width: '100%', minHeight: 120, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} defaultValue={selected.message} />
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Delete Confirmation Modal */}
            <Modal open={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelected(null); }} title="Delete Notification"
                footer={<div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}><Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Confirm Delete</Button></div>}
            >
                <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete the <strong>{selected?.title}</strong> campaign?</p>
            </Modal>

            <style>{`.hoverRow:hover { background-color: var(--bg-secondary); }`}</style>
        </div >
    );
}
