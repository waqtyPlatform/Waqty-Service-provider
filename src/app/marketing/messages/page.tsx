'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
    Plus,
    Send,
    Search,
    MessageSquare,
    Users,
    Edit,
    Trash2,
    Smartphone,
    Mail,
    Bell,
    Check,
    X,
    ChevronDown,
} from 'lucide-react';
import { useToast, SlideOver, Modal, Input, Button, Select, Badge } from '@/components/ui';

import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { marketingApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const initialPlaceholders = [
    { key: '{name}', label: 'Client Name', description: 'Full name of the client' },
    { key: '{first_name}', label: 'First Name', description: 'Client first name only' },
    { key: '{date}', label: 'Date', description: 'Appointment or event date' },
    { key: '{time}', label: 'Time', description: 'Appointment time' },
    { key: '{service}', label: 'Service', description: 'Booked service name' },
    { key: '{discount}', label: 'Discount', description: 'Discount percentage or amount' },
    { key: '{amount}', label: 'Amount', description: 'Balance or order amount' },
    { key: '{branch}', label: 'Branch', description: 'Branch name or location' },
    { key: '{link}', label: 'Link', description: 'Booking or review link' },
];

const fallbackTemplates = [
    {
        id: 1,
        name: 'Appointment Reminder',
        channel: 'WhatsApp',
        body: 'Hi {name}, this is a reminder for your appointment on {date} at {time}. Reply YES to confirm.',
        lastUsed: '2026-03-25',
        usageCount: 156,
    },
    {
        id: 2,
        name: 'Thank You Follow-up',
        channel: 'SMS',
        body: 'Thank you {name} for visiting us! We hope you enjoyed your {service}. See you again soon! ✨',
        lastUsed: '2026-03-13',
        usageCount: 89,
    },
    {
        id: 3,
        name: 'Birthday Greeting',
        channel: 'WhatsApp',
        body: 'Happy Birthday {name}! 🎂 Enjoy a special {discount}% off on any service today!',
        lastUsed: '2026-03-14',
        usageCount: 42,
    },
    {
        id: 4,
        name: 'Payment Due Reminder',
        channel: 'SMS',
        body: 'Hi {name}, you have an outstanding balance of {amount} EGP. Please settle at your convenience.',
        lastUsed: '2026-03-14',
        usageCount: 67,
    },
];

const fallbackHistory = [
    {
        id: 1,
        template: 'Appointment Reminder',
        recipients: ['Fatima Ali', 'Rania Khalil', 'Sara Mahmoud'],
        channel: 'WhatsApp',
        date: '2026-03-15 10:00',
        status: 'delivered',
        message: 'Hi {name}, this is a reminder for your appointment on Feb 18 at 10:00 AM. Reply YES to confirm.',
    },
    {
        id: 2,
        template: 'Thank You Follow-up',
        recipients: ['Noura Ahmed'],
        channel: 'SMS',
        date: '2026-03-19 18:30',
        status: 'delivered',
        message: 'Thank you Noura for visiting us! We hope you enjoyed your HydraFacial. See you again soon! ✨',
    },
    {
        id: 3,
        template: 'Birthday Greeting',
        recipients: ['Huda Saleh', 'Layla Hassan'],
        channel: 'WhatsApp',
        date: '2026-03-22 09:00',
        status: 'read',
        message: 'Happy Birthday {name}! 🎂 Enjoy a special 20% off on any service today!',
    },
    {
        id: 4,
        template: 'Payment Due Reminder',
        recipients: ['Hana Ali'],
        channel: 'SMS',
        date: '2026-03-12 14:00',
        status: 'delivered',
        message: 'Hi Hana, you have an outstanding balance of 350 EGP. Please settle at your convenience.',
    },
    {
        id: 5,
        template: 'Appointment Reminder',
        recipients: ['Mona Tarek', 'Huda Saleh'],
        channel: 'WhatsApp',
        date: '2026-03-16 11:00',
        status: 'delivered',
        message: 'Hi {name}, this is a reminder for your appointment on Feb 14 at 3:00 PM. Reply YES to confirm.',
    },
    {
        id: 6,
        template: 'Thank You Follow-up',
        recipients: ['Mona Tarek'],
        channel: 'SMS',
        date: '2026-03-23 16:30',
        status: 'delivered',
        message: 'Thank you Mona for visiting us! We hope you enjoyed your Gel Manicure. See you again soon! ✨',
    },
];

const recipients = [
    { name: 'Fatima Ali', phone: '+201012345678' },
    { name: 'Noura Ahmed', phone: '+201087654321' },
    { name: 'Huda Saleh', phone: '+201055667788' },
    { name: 'Rania Khalil', phone: '+201099887766' },
    { name: 'Hana Ali', phone: '+201033445566' },
    { name: 'Layla Hassan', phone: '+201077889900' },
    { name: 'Sara Mahmoud', phone: '+201011223344' },
    { name: 'Mona Tarek', phone: '+201044556677' },
];

const channelIcons: Record<string, React.ReactNode> = {
    SMS: <Smartphone size={14} />,
    WhatsApp: <MessageSquare size={14} />,
    Email: <Mail size={14} />,
    Push: <Bell size={14} />,
};
const channelBadge: Record<string, 'info' | 'success' | 'purple' | 'primary'> = {
    SMS: 'info',
    WhatsApp: 'success',
    Email: 'purple',
    Push: 'primary',
};
const statusBadge: Record<string, 'success' | 'info' | 'error'> = {
    delivered: 'success',
    read: 'info',
    failed: 'error',
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    section: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    sectionDesc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        transition: 'all 0.2s',
    },
    cardTitle: {
        fontWeight: 'var(--font-semibold)',
        marginBottom: 'var(--space-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardBody: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        background: 'var(--bg-secondary)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-3)',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
    },
    btnGroup: { display: 'flex', gap: 'var(--space-2)' },
    smallBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-1) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        fontSize: 12,
        fontWeight: 'var(--font-semibold)',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        background: 'transparent',
        color: 'var(--text-secondary)',
    },
    sendBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-1) var(--space-4)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        fontSize: 12,
        fontWeight: 'var(--font-semibold)',
        cursor: 'pointer',
        border: 'none',
    },
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'start',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
    },
    composePreview: {
        padding: 'var(--space-4)',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        color: 'var(--text-secondary)',
    },
    recipientChip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-1) var(--space-2)',
        background: 'var(--color-primary-50)',
        color: 'var(--color-primary-700)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-medium)',
        cursor: 'pointer',
    },
    // Placeholder dropdown
    phDropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 50,
        maxHeight: 220,
        overflowY: 'auto',
    },
    phItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-2) var(--space-3)',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        borderBottom: '1px solid var(--border-color)',
    },
    phKey: {
        fontFamily: 'monospace',
        fontSize: 'var(--text-xs)',
        padding: '2px var(--space-2)',
        background: 'var(--color-primary-50)',
        color: 'var(--color-primary-700)',
        borderRadius: 'var(--radius-md)',
    },
    // KPIs
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-3)' },
    kpi: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-3)',
        textAlign: 'center',
    },
    kpiVal: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 2 },
    filterBar: { display: 'flex', gap: 'var(--space-2)' },
    filterBtn: {
        padding: 'var(--space-1) var(--space-3)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
    },
    filterBtnActive: {
        background: 'var(--color-primary-500)',
        color: 'white',
        borderColor: 'var(--color-primary-500)',
    },
};

export default function MessagesPage() {
    const { addToast } = useToast();
    const {
        data: rawTemplates,
        loading: templatesLoading,
        error: templatesError,
        refetch: refetchTemplates,
    } = useApiQuery(() => marketingApi.getTemplates(), [], { fallbackData: fallbackTemplates as unknown });
    const apiTemplates = rawTemplates as typeof fallbackTemplates | null;
    const [templates, setTemplates] = useState(fallbackTemplates);
    const {
        data: rawMessages,
        loading: messagesLoading,
        error: messagesError,
        refetch: refetchMessages,
    } = useApiQuery(() => marketingApi.getMessages(), [], { fallbackData: fallbackHistory as unknown });
    const apiMessages = rawMessages as typeof fallbackHistory | null;
    const [history, setHistory] = useState(fallbackHistory);

    // Sync API data into local state when available
    React.useEffect(() => {
        if (apiTemplates && apiTemplates.length > 0) {
            setTemplates(apiTemplates);
        }
    }, [apiTemplates]);

    React.useEffect(() => {
        if (apiMessages && apiMessages.length > 0) {
            setHistory(apiMessages);
        }
    }, [apiMessages]);
    const [historySearch, setHistorySearch] = useState('');
    const [historyStatusFilter, setHistoryStatusFilter] = useState<'all' | 'delivered' | 'read' | 'failed'>('all');

    const { t } = useTranslation();

    const placeholders = [
        {
            key: '{name}',
            label: t('custProfile.lblClientName') || 'Client Name',
            description: t('custProfile.lblFullNameDesc') || 'Full name of the client',
        },
        {
            key: '{first_name}',
            label: t('custProfile.lblFirstName') || 'First Name',
            description: t('custProfile.lblFirstNameDesc') || 'Client first name only',
        },
        { key: '{date}', label: t('mkt.lblDate') || 'Date', description: t('mkt.phDescDate') },
        { key: '{time}', label: t('mkt.lblTime') || 'Time', description: t('mkt.phDescTime') },
        { key: '{service}', label: t('mkt.lblService') || 'Service', description: t('mkt.phDescService') },
        { key: '{discount}', label: t('mkt.lblDiscount') || 'Discount', description: t('mkt.phDescDiscount') },
        { key: '{amount}', label: t('mkt.lblAmount') || 'Amount', description: t('mkt.phDescAmount') },
        { key: '{branch}', label: t('mkt.lblBranch') || 'Branch', description: t('mkt.phDescBranch') },
        { key: '{link}', label: t('mkt.lblLink') || 'Link', description: t('mkt.phDescLink') },
    ];

    // Template CRUD
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<(typeof fallbackTemplates)[0] | null>(null);

    // Template form state
    const [formName, setFormName] = useState('');
    const [formChannel, setFormChannel] = useState('WhatsApp');
    const [formBody, setFormBody] = useState('');
    const [showPlaceholders, setShowPlaceholders] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Compose flow
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeTemplate, setComposeTemplate] = useState<(typeof fallbackTemplates)[0] | null>(null);
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [recipientSearch, setRecipientSearch] = useState('');

    // Message detail
    const [isMessageDetailOpen, setIsMessageDetailOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<(typeof fallbackHistory)[0] | null>(null);

    const openMessageDetail = (m: (typeof fallbackHistory)[0]) => {
        setSelectedMessage(m);
        setIsMessageDetailOpen(true);
    };

    const openAdd = () => {
        setFormName('');
        setFormChannel('WhatsApp');
        setFormBody('');
        setIsAddOpen(true);
    };

    const openEdit = (t_item: (typeof fallbackTemplates)[0]) => {
        setSelectedTemplate(t_item);
        setFormName(t_item.name);
        setFormChannel(t_item.channel);
        setFormBody(t_item.body);
        setIsEditOpen(true);
    };

    const insertPlaceholder = (key: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newBody = formBody.slice(0, start) + key + formBody.slice(end);
            setFormBody(newBody);
            setShowPlaceholders(false);
            // Set cursor after placeholder
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + key.length, start + key.length);
            }, 0);
        } else {
            setFormBody(prev => prev + key);
            setShowPlaceholders(false);
        }
    };

    const openCompose = (t_item: (typeof fallbackTemplates)[0]) => {
        setComposeTemplate(t_item);
        setSelectedRecipients([]);
        setRecipientSearch('');
        setIsComposeOpen(true);
    };

    const toggleRecipient = (name: string) => {
        setSelectedRecipients(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));
    };

    const handleSend = () => {
        const newEntry = {
            id: Date.now(),
            template: composeTemplate!.name,
            recipients: [...selectedRecipients],
            channel: composeTemplate!.channel,
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status: 'delivered' as const,
            message: composeTemplate!.body,
        };
        setHistory(prev => [newEntry, ...prev]);
        setIsComposeOpen(false);
        addToast('success', t('mkt.msgMessageSent').replace('{count}', String(selectedRecipients.length)));
    };

    const handleAddTemplate = () => {
        if (!formName.trim()) {
            addToast('error', t('mkt.msgTemplateNameRequired'));
            return;
        }
        setTemplates(prev => [
            ...prev,
            {
                id: Date.now(),
                name: formName,
                channel: formChannel,
                body: formBody,
                lastUsed: t('mkt.lblNever'),
                usageCount: 0,
            },
        ]);
        setIsAddOpen(false);
        addToast('success', t('mkt.btnSaveTemplate'));
    };

    const handleEditTemplate = () => {
        if (!formName.trim()) {
            addToast('error', t('mkt.msgTemplateNameRequired'));
            return;
        }
        setTemplates(prev =>
            prev.map(t =>
                t.id === selectedTemplate!.id ? { ...t, name: formName, channel: formChannel, body: formBody } : t
            )
        );
        setIsEditOpen(false);
        setSelectedTemplate(null);
        addToast('success', t('mkt.btnSaveTemplate'));
    };

    const handleDeleteTemplate = async () => {
        try {
            if (selectedTemplate?.id && typeof selectedTemplate.id === 'string') {
                await marketingApi.deleteTemplate(selectedTemplate.id);
                refetchTemplates();
            }
        } catch {
            /* fallback to local removal */
        }
        setTemplates(prev => prev.filter(t => t.id !== selectedTemplate?.id));
        setIsDeleteOpen(false);
        setSelectedTemplate(null);
        addToast('success', t('mkt.lblDeleteTemplate'));
    };

    const filteredHistory = useMemo(() => {
        let result = history;
        if (historySearch) {
            result = result.filter(
                m =>
                    m.recipients.some(r => r.toLowerCase().includes(historySearch.toLowerCase())) ||
                    m.template.toLowerCase().includes(historySearch.toLowerCase())
            );
        }
        if (historyStatusFilter !== 'all') {
            result = result.filter(m => m.status === historyStatusFilter);
        }
        return result;
    }, [history, historySearch, historyStatusFilter]);

    const filteredRecipients = useMemo(() => {
        if (!recipientSearch) return recipients;
        return recipients.filter(
            r => r.name.toLowerCase().includes(recipientSearch.toLowerCase()) || r.phone.includes(recipientSearch)
        );
    }, [recipientSearch]);

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

    const stats = useMemo(() => {
        const total = history.reduce((a, m) => a + m.recipients.length, 0);
        const delivered = history.filter(m => m.status === 'delivered').reduce((a, m) => a + m.recipients.length, 0);
        const read = history.filter(m => m.status === 'read').reduce((a, m) => a + m.recipients.length, 0);
        const failed = history.filter(m => m.status === 'failed').reduce((a, m) => a + m.recipients.length, 0);
        return { total, delivered, read, failed };
    }, [history]);

    const renderPlaceholderDropdown = () => (
        <div style={{ position: 'relative' as const }}>
            <button
                type="button"
                style={{ ...s.smallBtn, marginBottom: 'var(--space-2)' }}
                onClick={() => setShowPlaceholders(!showPlaceholders)}
            >
                <ChevronDown size={12} /> {t('mkt.btnInsertPlaceholder')}
            </button>
            {showPlaceholders && (
                <div style={s.phDropdown as React.CSSProperties}>
                    {placeholders.map(p => (
                        <div
                            key={p.key}
                            style={s.phItem}
                            onClick={() => insertPlaceholder(p.key)}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <div>
                                <div style={{ fontWeight: 'var(--font-medium)' }}>{p.label}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                    {p.description}
                                </div>
                            </div>
                            <span style={s.phKey as React.CSSProperties}>{p.key}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderBodyEditor = () => (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2)',
                }}
            >
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                    {t('mkt.lblMessageBody')}
                </label>
                {renderPlaceholderDropdown()}
            </div>
            <textarea
                ref={textareaRef}
                style={{
                    width: '100%',
                    minHeight: 120,
                    padding: 'var(--space-3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6,
                }}
                placeholder={t('mkt.phTypeMessage')}
                value={formBody}
                onChange={e => setFormBody(e.target.value)}
            />
        </div>
    );

    return (
        <div style={s.page}>
            <MarketingTabs />

            {/* ─── Step 1: Message Templates ─── */}
            <div>
                <div style={{ ...s.sectionHeader, marginBottom: 'var(--space-3)' }}>
                    <div>
                        <div style={s.section}>{t('mkt.lblMessageTemplates')}</div>
                        <div style={s.sectionDesc}>{t('mkt.msgTemplatesDesc')}</div>
                    </div>
                    <Button onClick={openAdd}>
                        <Plus size={16} /> {t('mkt.btnNewTemplate')}
                    </Button>
                </div>
                <DataGuard
                    loading={templatesLoading}
                    error={templatesError}
                    data={templates}
                    emptyIcon={<MessageSquare size={48} />}
                    emptyTitle={t('mkt.lblNoTemplates') || 'No Templates'}
                    emptyDescription={t('mkt.msgNoTemplatesDesc') || 'Create your first message template.'}
                    onRetry={refetchTemplates}
                >
                    <div style={s.grid}>
                        {templates.map(tmpl => (
                            <div key={tmpl.id} style={s.card}>
                                <div style={s.cardTitle}>
                                    <span>{tmpl.name}</span>
                                    <Badge color={channelBadge[tmpl.channel]} size="sm">
                                        {channelIcons[tmpl.channel]} {tmpl.channel}
                                    </Badge>
                                </div>
                                <div style={s.cardBody}>{tmpl.body}</div>
                                <div style={s.cardFooter}>
                                    <span>
                                        {t('mkt.lblUsedTimes').replace('{count}', String(tmpl.usageCount))} ·{' '}
                                        {t('mkt.lblLast')} {tmpl.lastUsed}
                                    </span>
                                    <div style={s.btnGroup}>
                                        <button style={s.smallBtn} onClick={() => openEdit(tmpl)}>
                                            <Edit size={12} />
                                        </button>
                                        <button
                                            style={{
                                                ...s.smallBtn,
                                                color: 'var(--color-error)',
                                                borderColor: 'var(--color-error-light)',
                                            }}
                                            onClick={() => {
                                                setSelectedTemplate(tmpl);
                                                setIsDeleteOpen(true);
                                            }}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                        <button style={s.sendBtn} onClick={() => openCompose(tmpl)}>
                                            <Send size={12} /> {t('mkt.btnUse')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DataGuard>
            </div>

            {/* ─── Message History ─── */}
            <div>
                <div style={{ ...s.sectionHeader, marginBottom: 'var(--space-3)' }}>
                    <div>
                        <div style={s.section}>{t('mkt.lblMessageHistory')}</div>
                        <div style={s.sectionDesc}>
                            {t('mkt.msgMessagesSent').replace('{count}', String(history.length))}
                        </div>
                    </div>
                </div>

                {/* KPIs */}
                <div style={{ ...(s.kpis as React.CSSProperties), marginBottom: 'var(--space-4)' }}>
                    <div style={s.kpi}>
                        <div style={s.kpiVal}>{stats.total}</div>
                        <div style={s.kpiLbl}>{t('mkt.lblTotal')}</div>
                    </div>
                    <div style={s.kpi}>
                        <div style={{ ...s.kpiVal, color: 'var(--color-success)' }}>{stats.delivered}</div>
                        <div style={s.kpiLbl}>{t('mkt.lblDelivered')}</div>
                    </div>
                    <div style={s.kpi}>
                        <div style={{ ...s.kpiVal, color: 'var(--color-info)' }}>{stats.read}</div>
                        <div style={s.kpiLbl}>{t('mkt.lblRead')}</div>
                    </div>
                    <div style={s.kpi}>
                        <div style={{ ...s.kpiVal, color: 'var(--color-error)' }}>{stats.failed}</div>
                        <div style={s.kpiLbl}>{t('mkt.lblFailed')}</div>
                    </div>
                </div>

                {/* Filters */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-3)',
                        gap: 'var(--space-3)',
                    }}
                >
                    <div style={s.filterBar as React.CSSProperties}>
                        {[
                            { key: 'all' as const, label: t('mkt.lblAll') },
                            { key: 'delivered' as const, label: t('mkt.lblDelivered') },
                            { key: 'read' as const, label: t('mkt.lblRead') },
                            { key: 'failed' as const, label: t('mkt.lblFailed') },
                        ].map(f => (
                            <button
                                key={f.key}
                                style={{ ...s.filterBtn, ...(historyStatusFilter === f.key ? s.filterBtnActive : {}) }}
                                onClick={() => setHistoryStatusFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative' as const, maxWidth: 260 }}>
                        <Search
                            size={14}
                            style={{
                                position: 'absolute' as const,
                                insetInlineStart: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)',
                            }}
                        />
                        <input
                            style={{
                                width: '100%',
                                height: 36,
                                paddingInlineStart: 32,
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-lg)',
                                background: 'var(--bg-primary)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-primary)',
                            }}
                            placeholder={t('mkt.phSearchMessages')}
                            value={historySearch}
                            onChange={e => setHistorySearch(e.target.value)}
                        />
                    </div>
                </div>

                <table style={s.table}>
                    <thead>
                        <tr>
                            {[
                                t('mkt.lblTemplate'),
                                t('mkt.lblRecipients'),
                                t('mkt.lblChannel'),
                                t('mkt.lblDate'),
                                t('mkt.lblStatus'),
                            ].map(h => (
                                <th key={h} style={s.th as React.CSSProperties}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        ...s.td,
                                        textAlign: 'center',
                                        color: 'var(--text-tertiary)',
                                        padding: 'var(--space-5)',
                                    }}
                                >
                                    {t('mkt.msgNoMessagesMatch')}
                                </td>
                            </tr>
                        ) : (
                            filteredHistory.map(m => (
                                <tr
                                    key={m.id}
                                    className="hoverRow"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => openMessageDetail(m)}
                                >
                                    <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{m.template}</td>
                                    <td style={s.td}>
                                        {m.recipients.length === 1 ? (
                                            m.recipients[0]
                                        ) : (
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-1)',
                                                }}
                                            >
                                                <Users size={13} />{' '}
                                                {t('mkt.lblRecipientsCount').replace(
                                                    '{count}',
                                                    String(m.recipients.length)
                                                )}
                                            </span>
                                        )}
                                    </td>
                                    <td style={s.td}>
                                        <Badge color={channelBadge[m.channel]} size="sm">
                                            {m.channel}
                                        </Badge>
                                    </td>
                                    <td style={s.td}>{m.date}</td>
                                    <td style={s.td}>
                                        <Badge color={statusBadge[m.status]} size="sm">
                                            {t(`mkt.lbl${m.status.charAt(0).toUpperCase() + m.status.slice(1)}`)}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ─── Message Detail SlideOver ─── */}
            <SlideOver
                open={isMessageDetailOpen}
                onClose={() => {
                    setIsMessageDetailOpen(false);
                    setSelectedMessage(null);
                }}
                title={t('mkt.lblMessageDetails')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsMessageDetailOpen(false);
                                setSelectedMessage(null);
                            }}
                        >
                            {t('rtn.btnBack')}
                        </Button>
                        <Button
                            onClick={() => {
                                addToast('success', t('mkt.msgMessageResent'));
                                setIsMessageDetailOpen(false);
                            }}
                        >
                            <Send size={14} /> {t('mkt.btnResend')}
                        </Button>
                    </div>
                }
            >
                {selectedMessage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 'var(--font-bold)',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {selectedMessage.template}
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Badge color={channelBadge[selectedMessage.channel]} size="sm">
                                    {channelIcons[selectedMessage.channel]} {selectedMessage.channel}
                                </Badge>
                                <Badge color={statusBadge[selectedMessage.status]} size="sm">
                                    {t(
                                        `mkt.lbl${selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}`
                                    )}
                                </Badge>
                            </div>
                        </div>

                        <div
                            style={{
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--space-4)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 'var(--space-1)',
                                }}
                            >
                                {t('mkt.lblSentAt')}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                                {selectedMessage.date}
                            </div>
                        </div>

                        {/* Recipients List */}
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                {t('mkt.lblRecipients')} ({selectedMessage.recipients.length})
                            </div>
                            <div
                                style={{
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                }}
                            >
                                {selectedMessage.recipients.map((name: string, i: number) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3)',
                                            borderTop: i === 0 ? 'none' : '1px solid var(--border-color)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-700)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 'var(--font-bold)',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {getInitials(name)}
                                        </div>
                                        <div>
                                            <div
                                                style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}
                                            >
                                                {name}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {recipients.find(r => r.name === name)?.phone || ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 'var(--font-semibold)',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 'var(--space-3)',
                                }}
                            >
                                {t('mkt.lblMessageContent')}
                            </div>
                            <div
                                style={{
                                    padding: 'var(--space-4)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.7,
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {selectedMessage.message || t('mkt.msgNoMessageContent')}
                            </div>
                        </div>
                    </div>
                )}
            </SlideOver>

            {/* ─── Compose SlideOver ─── */}
            <SlideOver
                open={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                title={t('mkt.lblComposeSend')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                            {selectedRecipients.length} {t('mkt.lblSelected')}
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="ghost" onClick={() => setIsComposeOpen(false)}>
                                {t('rtn.btnBack')}
                            </Button>
                            <Button onClick={handleSend} disabled={selectedRecipients.length === 0}>
                                <Send size={14} /> {t('mkt.btnSendNow')}
                            </Button>
                        </div>
                    </div>
                }
            >
                {composeTemplate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t('mkt.lblTemplate')}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <span style={{ fontWeight: 'var(--font-semibold)' }}>{composeTemplate.name}</span>
                                <Badge color={channelBadge[composeTemplate.channel]} size="sm">
                                    {composeTemplate.channel}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t('mkt.lblMessagePreview')}
                            </div>
                            <div style={s.composePreview as React.CSSProperties}>{composeTemplate.body}</div>
                        </div>

                        {/* Select Recipients */}
                        <div>
                            <div
                                style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--text-tertiary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: 'var(--space-2)',
                                }}
                            >
                                {t('mkt.lblSelectRecipients')}
                            </div>

                            {selectedRecipients.length > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 'var(--space-2)',
                                        marginBottom: 'var(--space-3)',
                                    }}
                                >
                                    {selectedRecipients.map(name => (
                                        <span
                                            key={name}
                                            style={s.recipientChip as React.CSSProperties}
                                            onClick={() => toggleRecipient(name)}
                                        >
                                            {name} <X size={12} />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Search recipients */}
                            <div style={{ position: 'relative' as const, marginBottom: 'var(--space-2)' }}>
                                <Search
                                    size={14}
                                    style={{
                                        position: 'absolute' as const,
                                        insetInlineStart: 10,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                />
                                <input
                                    style={{
                                        width: '100%',
                                        height: 36,
                                        paddingInlineStart: 32,
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--bg-primary)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--text-primary)',
                                    }}
                                    placeholder={t('mkt.phSearchRecipients')}
                                    value={recipientSearch}
                                    onChange={e => setRecipientSearch(e.target.value)}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0,
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    maxHeight: 280,
                                    overflowY: 'auto',
                                }}
                            >
                                <div
                                    style={{
                                        padding: 'var(--space-2) var(--space-3)',
                                        background: 'var(--bg-secondary)',
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--text-tertiary)',
                                        fontWeight: 'var(--font-semibold)',
                                    }}
                                >
                                    <button
                                        style={{ ...s.smallBtn, marginBottom: 0 }}
                                        onClick={() => {
                                            const visible = filteredRecipients.map(r => r.name);
                                            if (visible.every(n => selectedRecipients.includes(n))) {
                                                setSelectedRecipients(prev => prev.filter(n => !visible.includes(n)));
                                            } else {
                                                setSelectedRecipients(prev => [...new Set([...prev, ...visible])]);
                                            }
                                        }}
                                    >
                                        {filteredRecipients.every(r => selectedRecipients.includes(r.name))
                                            ? t('mkt.btnDeselectAll')
                                            : t('mkt.btnSelectAll')}
                                    </button>
                                </div>
                                {filteredRecipients.map(r => {
                                    const isSelected = selectedRecipients.includes(r.name);
                                    return (
                                        <div
                                            key={r.name}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: 'var(--space-3)',
                                                cursor: 'pointer',
                                                background: isSelected
                                                    ? 'var(--color-primary-50)'
                                                    : 'var(--bg-primary)',
                                                borderTop: '1px solid var(--border-color)',
                                            }}
                                            onClick={() => toggleRecipient(r.name)}
                                        >
                                            <div
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: `1px solid ${isSelected ? 'var(--color-primary-600)' : 'var(--border-color)'}`,
                                                    background: isSelected ? 'var(--color-primary-600)' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    marginInlineEnd: 'var(--space-3)',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {isSelected && <Check size={14} />}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-sm)',
                                                        fontWeight: 'var(--font-medium)',
                                                    }}
                                                >
                                                    {r.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {r.phone}
                                                </div>
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
            <Modal
                open={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    setShowPlaceholders(false);
                }}
                title={t('mkt.lblCreateNewTemplate')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                            {t('rtn.btnBack')}
                        </Button>
                        <Button onClick={handleAddTemplate}>{t('mkt.btnSaveTemplate')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('mkt.lblTemplateName')}
                        placeholder={t('mkt.phTemplateName')}
                        value={formName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
                    />
                    <Select
                        label={t('mkt.lblChannel')}
                        value={formChannel}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormChannel(e.target.value)}
                        options={[
                            { label: 'SMS', value: 'SMS' },
                            { label: 'WhatsApp', value: 'WhatsApp' },
                            { label: 'Email', value: 'Email' },
                        ]}
                    />
                    {renderBodyEditor()}
                </div>
            </Modal>

            {/* Edit Template Modal */}
            <Modal
                open={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedTemplate(null);
                    setShowPlaceholders(false);
                }}
                title={t('mkt.lblEditTemplate')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                            {t('rtn.btnBack')}
                        </Button>
                        <Button onClick={handleEditTemplate}>{t('settings.saveChanges')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('mkt.lblTemplateName')}
                        value={formName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)}
                    />
                    <Select
                        label={t('mkt.lblChannel')}
                        value={formChannel}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormChannel(e.target.value)}
                        options={[
                            { label: 'SMS', value: 'SMS' },
                            { label: 'WhatsApp', value: 'WhatsApp' },
                            { label: 'Email', value: 'Email' },
                        ]}
                    />
                    {renderBodyEditor()}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedTemplate(null);
                }}
                title={t('mkt.lblDeleteTemplate')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('rtn.btnBack')}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTemplate}>
                            {t('mkt.lblDeleteTemplate')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('mkt.msgDeleteTemplateConfirm')} <strong>{selectedTemplate?.name}</strong>
                </p>
            </Modal>

            <style>{`.hoverRow:hover { background-color: var(--bg-secondary); }`}</style>
        </div>
    );
}
