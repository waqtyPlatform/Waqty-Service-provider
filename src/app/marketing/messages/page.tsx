'use client';

import React, { useState } from 'react';
import { Plus, Send, Search, MessageSquare, Users, Edit, Trash2, Eye, Copy, Smartphone, Mail, Bell, Check, X } from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';

const initialTemplates = [
    { id: 1, name: 'Appointment Reminder', channel: 'WhatsApp', body: 'Hi {name}, this is a reminder for your appointment on {date} at {time}. Reply YES to confirm.', lastUsed: '2026-02-17', usageCount: 156 },
    { id: 2, name: 'Thank You Follow-up', channel: 'SMS', body: 'Thank you {name} for visiting us! We hope you enjoyed your {service}. See you again soon! ✨', lastUsed: '2026-02-16', usageCount: 89 },
    { id: 3, name: 'Birthday Greeting', channel: 'WhatsApp', body: 'Happy Birthday {name}! 🎂 Enjoy a special {discount}% off on any service today!', lastUsed: '2026-02-15', usageCount: 42 },
    { id: 4, name: 'Payment Due Reminder', channel: 'SMS', body: 'Hi {name}, you have an outstanding balance of {amount} EGP. Please settle at your convenience.', lastUsed: '2026-02-10', usageCount: 67 },
];

const initialHistory = [
    { id: 1, template: 'Appointment Reminder', recipient: 'Fatima Ali', channel: 'WhatsApp', date: '2026-02-17 10:00', status: 'delivered' },
    { id: 2, template: 'Thank You Follow-up', recipient: 'Noura Ahmed', channel: 'SMS', date: '2026-02-16 18:30', status: 'delivered' },
    { id: 3, template: 'Birthday Greeting', recipient: 'Huda Saleh', channel: 'WhatsApp', date: '2026-02-15 09:00', status: 'read' },
    { id: 4, template: 'Appointment Reminder', recipient: 'Rania Khalil', channel: 'WhatsApp', date: '2026-02-17 09:00', status: 'failed' },
    { id: 5, template: 'Payment Due Reminder', recipient: 'Hana Ali', channel: 'SMS', date: '2026-02-14 14:00', status: 'delivered' },
    { id: 6, template: 'Birthday Greeting', recipient: 'Layla Hassan', channel: 'WhatsApp', date: '2026-02-14 08:00', status: 'read' },
];

const recipients = [
    { name: 'Fatima Ali', phone: '+201012345678' },
    { name: 'Noura Ahmed', phone: '+201087654321' },
    { name: 'Huda Saleh', phone: '+201055667788' },
    { name: 'Rania Khalil', phone: '+201099887766' },
    { name: 'Hana Ali', phone: '+201033445566' },
    { name: 'Layla Hassan', phone: '+201077889900' },
];

const channelIcons: Record<string, React.ReactNode> = {
    SMS: <Smartphone size={14} />, WhatsApp: <MessageSquare size={14} />, Email: <Mail size={14} />, Push: <Bell size={14} />,
};
const channelBadge: Record<string, 'info' | 'success' | 'purple' | 'primary'> = { SMS: 'info', WhatsApp: 'success', Email: 'purple', Push: 'primary' };
const statusBadge: Record<string, 'success' | 'info' | 'error'> = { delivered: 'success', read: 'info', failed: 'error' };

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    section: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    sectionDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', cursor: 'pointer', transition: 'all 0.2s' },
    cardTitle: { fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    cardBody: { fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    btnGroup: { display: 'flex', gap: 'var(--space-2)' },
    smallBtn: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 14px', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 'var(--font-semibold)', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)' },
    sendBtn: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 14px', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 'var(--font-semibold)', cursor: 'pointer', border: 'none' },
    table: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)' },
    // Compose styles
    composePreview: { padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' },
    recipientChip: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--color-primary-50)', color: 'var(--color-primary-700)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', cursor: 'pointer' },
    searchBox: { position: 'relative' },
    searchIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
};

export default function MessagesPage() {
    const { addToast } = useToast();
    const [templates, setTemplates] = useState(initialTemplates);
    const [history, setHistory] = useState(initialHistory);
    const [historySearch, setHistorySearch] = useState('');

    // Template CRUD
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    // Compose flow
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeTemplate, setComposeTemplate] = useState<any>(null);
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

    const openCompose = (t: any) => {
        setComposeTemplate(t);
        setSelectedRecipients([]);
        setIsComposeOpen(true);
    };

    const toggleRecipient = (name: string) => {
        setSelectedRecipients(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    };

    const handleSend = () => {
        const newMessages = selectedRecipients.map((name, i) => ({
            id: Date.now() + i,
            template: composeTemplate.name,
            recipient: name,
            channel: composeTemplate.channel,
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: 'delivered' as const,
        }));
        setHistory(prev => [...newMessages, ...prev]);
        setIsComposeOpen(false);
        addToast('success', `Message sent to ${selectedRecipients.length} recipient(s)`);
    };

    const handleDeleteTemplate = () => {
        setTemplates(prev => prev.filter(t => t.id !== selectedTemplate?.id));
        setIsDeleteOpen(false);
        setSelectedTemplate(null);
        addToast('success', 'Template deleted');
    };

    const filteredHistory = history.filter(m =>
        m.recipient.toLowerCase().includes(historySearch.toLowerCase()) ||
        m.template.toLowerCase().includes(historySearch.toLowerCase())
    );

    return (
        <div style={s.page}>
            <MarketingTabs />

            {/* ─── Step 1: Message Templates ─── */}
            <div>
                <div style={{ ...s.sectionHeader, marginBottom: 'var(--space-3)' }}>
                    <div>
                        <div style={s.section}>Message Templates</div>
                        <div style={s.sectionDesc}>Create reusable templates, then click &quot;Use&quot; to compose and send.</div>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> New Template</Button>
                </div>
                <div style={s.grid}>
                    {templates.map(t => (
                        <div key={t.id} style={s.card}>
                            <div style={s.cardTitle}>
                                <span>{t.name}</span>
                                <Badge color={channelBadge[t.channel]} size="sm">{channelIcons[t.channel]} {t.channel}</Badge>
                            </div>
                            <div style={s.cardBody}>{t.body}</div>
                            <div style={s.cardFooter}>
                                <span>Used {t.usageCount} times · Last: {t.lastUsed}</span>
                                <div style={s.btnGroup}>
                                    <button style={s.smallBtn} onClick={() => { setSelectedTemplate(t); setIsEditOpen(true); }}><Edit size={12} /></button>
                                    <button style={{ ...s.smallBtn, color: 'var(--color-error)', borderColor: 'var(--color-error-light)' }} onClick={() => { setSelectedTemplate(t); setIsDeleteOpen(true); }}><Trash2 size={12} /></button>
                                    <button style={s.sendBtn} onClick={() => openCompose(t)}><Send size={12} /> Use</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Step 3: Message History ─── */}
            <div>
                <div style={{ ...s.sectionHeader, marginBottom: 'var(--space-3)' }}>
                    <div>
                        <div style={s.section}>Message History</div>
                        <div style={s.sectionDesc}>{history.length} messages sent</div>
                    </div>
                    <div style={{ ...s.searchBox as React.CSSProperties, maxWidth: 260 }}>
                        <Search size={14} style={s.searchIcon as React.CSSProperties} />
                        <input
                            style={{ width: '100%', height: 36, paddingLeft: 32, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                            placeholder="Search history..."
                            value={historySearch}
                            onChange={e => setHistorySearch(e.target.value)}
                        />
                    </div>
                </div>
                <table style={s.table}>
                    <thead><tr>{['Template', 'Recipient', 'Channel', 'Date', 'Status'].map(h => <th key={h} style={s.th as React.CSSProperties}>{h}</th>)}</tr></thead>
                    <tbody>
                        {filteredHistory.map(m => (
                            <tr key={m.id} className="hoverRow">
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{m.template}</td>
                                <td style={s.td}>{m.recipient}</td>
                                <td style={s.td}><Badge color={channelBadge[m.channel]} size="sm">{m.channel}</Badge></td>
                                <td style={s.td}>{m.date}</td>
                                <td style={s.td}><Badge color={statusBadge[m.status]} size="sm">{m.status}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ─── Compose SlideOver (Step 2) ─── */}
            <SlideOver open={isComposeOpen} onClose={() => setIsComposeOpen(false)} title="Compose & Send"
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{selectedRecipients.length} selected</span>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="ghost" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                            <Button onClick={handleSend} disabled={selectedRecipients.length === 0}><Send size={14} /> Send Now</Button>
                        </div>
                    </div>
                }
            >
                {composeTemplate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        {/* Template info */}
                        <div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Template</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <span style={{ fontWeight: 'var(--font-semibold)' }}>{composeTemplate.name}</span>
                                <Badge color={channelBadge[composeTemplate.channel]} size="sm">{composeTemplate.channel}</Badge>
                            </div>
                        </div>

                        {/* Message Preview */}
                        <div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Message Preview</div>
                            <div style={s.composePreview as React.CSSProperties}>{composeTemplate.body}</div>
                        </div>

                        {/* Select Recipients */}
                        <div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Select Recipients</div>

                            {/* Selected chips */}
                            {selectedRecipients.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--space-3)' }}>
                                    {selectedRecipients.map(name => (
                                        <span key={name} style={s.recipientChip as React.CSSProperties} onClick={() => toggleRecipient(name)}>
                                            {name} <X size={12} />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Recipient list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-secondary)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 'var(--font-semibold)' }}>
                                    <button style={{ ...s.smallBtn, marginBottom: 0 }} onClick={() => {
                                        if (selectedRecipients.length === recipients.length) setSelectedRecipients([]);
                                        else setSelectedRecipients(recipients.map(r => r.name));
                                    }}>
                                        {selectedRecipients.length === recipients.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                {recipients.map(r => {
                                    const isSelected = selectedRecipients.includes(r.name);
                                    return (
                                        <div key={r.name}
                                            style={{ display: 'flex', alignItems: 'center', padding: 'var(--space-3)', cursor: 'pointer', background: isSelected ? 'var(--color-primary-50)' : 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}
                                            onClick={() => toggleRecipient(r.name)}
                                        >
                                            <div style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${isSelected ? 'var(--color-primary-600)' : 'var(--border-color)'}`, background: isSelected ? 'var(--color-primary-600)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: 'var(--space-3)', flexShrink: 0 }}>
                                                {isSelected && <Check size={14} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{r.name}</div>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{r.phone}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* Add Template Modal */}
            <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Template"
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button onClick={() => { setIsAddOpen(false); addToast('success', 'Template created'); }}>Save Template</Button></div>}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label="Template Name" placeholder="e.g. Birthday Greeting" />
                    <Select label="Channel" options={[{ label: 'SMS', value: 'SMS' }, { label: 'WhatsApp', value: 'WhatsApp' }, { label: 'Email', value: 'Email' }]} />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Message Body</label>
                        <textarea style={{ width: '100%', minHeight: 100, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} placeholder="Use {name}, {date}, {service} as placeholders..." />
                    </div>
                </div>
            </Modal>

            {/* Edit Template Modal */}
            <Modal open={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedTemplate(null); }} title="Edit Template"
                footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}><Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={() => { setIsEditOpen(false); addToast('success', 'Template updated'); }}>Save Changes</Button></div>}
            >
                {selectedTemplate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Input label="Template Name" defaultValue={selectedTemplate.name} />
                        <Select label="Channel" defaultValue={selectedTemplate.channel} options={[{ label: 'SMS', value: 'SMS' }, { label: 'WhatsApp', value: 'WhatsApp' }, { label: 'Email', value: 'Email' }]} />
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', display: 'block', marginBottom: 'var(--space-2)' }}>Message Body</label>
                            <textarea style={{ width: '100%', minHeight: 100, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} defaultValue={selectedTemplate.body} />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal open={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelectedTemplate(null); }} title="Delete Template"
                footer={<div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}><Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteTemplate}>Confirm Delete</Button></div>}
            >
                <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete the <strong>{selectedTemplate?.name}</strong> template?</p>
            </Modal>

            <style>{`.hoverRow:hover { background-color: var(--bg-secondary); }`}</style>
        </div >
    );
}
