'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Send, Search, MessageSquare, Users, Edit, Trash2 } from 'lucide-react';
import { useToast, Modal, Input, Button, Select } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

const templates = [
    { id: 1, name: 'Appointment Reminder', channel: 'WhatsApp', body: 'Hi {name}, this is a reminder for your appointment on {date} at {time}. Reply YES to confirm.', lastUsed: '2026-02-17' },
    { id: 2, name: 'Thank You Follow-up', channel: 'SMS', body: 'Thank you {name} for visiting us! We hope you enjoyed your {service}. See you again soon! ✨', lastUsed: '2026-02-16' },
    { id: 3, name: 'Birthday Greeting', channel: 'WhatsApp', body: 'Happy Birthday {name}! 🎂 Enjoy a special {discount}% off on any service today!', lastUsed: '2026-02-15' },
    { id: 4, name: 'Payment Due Reminder', channel: 'SMS', body: 'Hi {name}, you have an outstanding balance of {amount} EGP. Please settle at your convenience.', lastUsed: '2026-02-10' },
];

const recentMessages = [
    { id: 1, template: 'Appointment Reminder', recipient: 'Fatima Ali', channel: 'WhatsApp', date: '2026-02-17 10:00', status: 'delivered' },
    { id: 2, template: 'Thank You Follow-up', recipient: 'Noura Ahmed', channel: 'SMS', date: '2026-02-16 18:30', status: 'delivered' },
    { id: 3, template: 'Birthday Greeting', recipient: 'Huda Saleh', channel: 'WhatsApp', date: '2026-02-15 09:00', status: 'read' },
    { id: 4, template: 'Appointment Reminder', recipient: 'Rania Khalil', channel: 'WhatsApp', date: '2026-02-17 09:00', status: 'failed' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
    delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    read: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    failed: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', whiteSpace: 'nowrap', textDecoration: 'none' },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    section: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' },
    cardTitle: { fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' },
    cardBody: { fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    sendBtn: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 14px', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    badge: { display: 'inline-flex', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 'var(--font-semibold)' },
};

export default function MessagesPage() {
    const { addToast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    return (
        <div style={s.page}>
            <MarketingTabs />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <div style={s.section}>Message Templates</div>
                <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Template</Button>
            </div>
            <div style={s.grid}>
                {templates.map(t => (
                    <div key={t.id} style={s.card}>
                        <div style={s.cardTitle}>{t.name}</div>
                        <div style={s.cardBody}>{t.body}</div>
                        <div style={s.cardFooter}>
                            <span>{t.channel} · Last used: {t.lastUsed}</span>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button style={{ ...s.sendBtn, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }} onClick={() => { setSelectedTemplate(t); setIsEditOpen(true); }}><Edit size={12} /></button>
                                <button style={{ ...s.sendBtn, background: 'transparent', color: 'var(--color-error)', border: '1px solid var(--color-error-light)' }} onClick={() => { setSelectedTemplate(t); setIsDeleteOpen(true); }}><Trash2 size={12} /></button>
                                <button style={s.sendBtn} onClick={() => addToast('success', 'Message sent successfully')}><Send size={12} /> Use</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={s.section}>Recent Messages</div>
            <table style={s.table}>
                <thead><tr>{['Template', 'Recipient', 'Channel', 'Date', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                <tbody>
                    {recentMessages.map(m => (
                        <tr key={m.id}>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{m.template}</td>
                            <td style={s.td}>{m.recipient}</td>
                            <td style={s.td}>{m.channel}</td>
                            <td style={s.td}>{m.date}</td>
                            <td style={s.td}><span style={{ ...s.badge, ...statusColors[m.status] }}>{m.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Template Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Template"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsAddOpen(false); addToast('success', 'Template created successfully'); }}>Save Template</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Template Name" placeholder="e.g. Birthday Greeting" />
                    <Select label="Channel" options={[{ label: 'SMS', value: 'SMS' }, { label: 'WhatsApp', value: 'WhatsApp' }, { label: 'Email', value: 'Email' }]} />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Message Body</label>
                        <textarea
                            style={{ width: '100%', minHeight: 100, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
                            placeholder="Type your message here. Use {name} for client name, {date} for date, etc."
                        />
                    </div>
                </div>
            </Modal>

            {/* Edit Template Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedTemplate(null); }}
                title="Edit Template"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setIsEditOpen(false); addToast('success', 'Template updated successfully'); }}>Save Changes</Button>
                    </div>
                }
            >
                {selectedTemplate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Template Name" defaultValue={selectedTemplate.name} />
                        <Select label="Channel" defaultValue={selectedTemplate.channel} options={[{ label: 'SMS', value: 'SMS' }, { label: 'WhatsApp', value: 'WhatsApp' }, { label: 'Email', value: 'Email' }]} />
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Message Body</label>
                            <textarea
                                style={{ width: '100%', minHeight: 100, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}
                                defaultValue={selectedTemplate.body}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setSelectedTemplate(null); }}
                title="Delete Template"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => { setIsDeleteOpen(false); addToast('error', 'Template deleted permanently'); }}>Confirm Delete</Button>
                    </div>
                }
            >
                <div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to delete the <strong>{selectedTemplate?.name}</strong> template?
                    </p>
                </div>
            </Modal>
        </div >
    );
}
