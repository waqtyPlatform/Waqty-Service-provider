'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useEffect } from 'react';
import { DropdownMenu, useToast, SlideOver, Modal, Input, Select, Button, EmptyState } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
    Search,
    Plus,
    Megaphone,
    Tag,
    MessageSquare,
    Gift,
    Calendar,
    Eye,
    ShoppingCart,
    MoreVertical,
    Zap,
    TrendingUp,
    Send,
    Trash2,
} from 'lucide-react';
import styles from './marketing.module.css';
import { useTranslation } from '@/hooks/useTranslation';

// ─── CAMPAIGNS DATA ──────────────────────────────────────────────────
type Campaign = {
    id: string;
    name: string;
    type: 'email' | 'sms' | 'push';
    audience: string;
    status: 'active' | 'scheduled' | 'draft' | 'completed';
    recipients: number;
    date: string;
};
const initialCampaigns: Campaign[] = [
    {
        id: 'CMP-001',
        name: 'Spring Sale Campaign',
        type: 'email',
        audience: 'All Clients',
        status: 'active',
        recipients: 245,
        date: 'Mar 25, 2026',
    },
    {
        id: 'CMP-002',
        name: 'VIP Birthday Blast',
        type: 'sms',
        audience: 'Birthdays This Month',
        status: 'scheduled',
        recipients: 12,
        date: 'Apr 1, 2026',
    },
    {
        id: 'CMP-003',
        name: 'Win-back Inactive Clients',
        type: 'email',
        audience: 'No visit 60+ days',
        status: 'draft',
        recipients: 88,
        date: '—',
    },
    {
        id: 'CMP-004',
        name: 'Ramadan Offers',
        type: 'push',
        audience: 'All Clients',
        status: 'completed',
        recipients: 530,
        date: 'Mar 1, 2026',
    },
];

// ─── OFFERS DATA ─────────────────────────────────────────────────────
type Offer = {
    id: string;
    name: string;
    desc: string;
    discount: string;
    bg: string;
    status: string;
    validUntil: string;
    uses: number;
    views: number;
};

const offerGradients = [
    'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
    'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
    'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
];

const initialOffers: Offer[] = [
    {
        id: 'OF-001',
        name: "Valentine's Special",
        desc: 'Buy any facial treatment and get 50% off a massage.',
        discount: '50% OFF',
        bg: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        status: 'active',
        validUntil: 'Mar 20, 2026',
        uses: 42,
        views: 320,
    },
    {
        id: 'OF-002',
        name: 'New Client Welcome',
        desc: 'First-time clients get 25% off any service.',
        discount: '25% OFF',
        bg: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        status: 'active',
        validUntil: 'Mar 20, 2026',
        uses: 87,
        views: 560,
    },
    {
        id: 'OF-003',
        name: 'Summer Hair Bundle',
        desc: 'Haircut + Keratin + Styling for a fixed price.',
        discount: 'BUNDLE',
        bg: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        status: 'draft',
        validUntil: 'Mar 14, 2026',
        uses: 0,
        views: 0,
    },
    {
        id: 'OF-004',
        name: 'Loyalty Reward',
        desc: 'Every 10th visit gets a free classic manicure.',
        discount: 'FREE',
        bg: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
        status: 'active',
        validUntil: 'Mar 26, 2026',
        uses: 15,
        views: 210,
    },
    {
        id: 'OF-005',
        name: 'Flash Friday',
        desc: '30% off all skin services — Fridays only.',
        discount: '30% OFF',
        bg: 'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
        status: 'scheduled',
        validUntil: 'Mar 15, 2026',
        uses: 0,
        views: 0,
    },
    {
        id: 'OF-006',
        name: 'Eid Celebration',
        desc: 'Special full-body pampering package at 40% off.',
        discount: '40% OFF',
        bg: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
        status: 'expired',
        validUntil: 'Mar 23, 2026',
        uses: 63,
        views: 480,
    },
];

// ─── PROMO CODES ─────────────────────────────────────────────────────
type PromoCode = {
    code: string;
    type: string;
    value: string;
    minSpend: number;
    maxUses: number;
    used: number;
    status: string;
    expires: string;
};

const initialPromoCodes: PromoCode[] = [
    {
        code: 'WELCOME25',
        type: 'Percentage',
        value: '25%',
        minSpend: 200,
        maxUses: 100,
        used: 87,
        status: 'active',
        expires: 'Mar 13, 2026',
    },
    {
        code: 'VALENTINE50',
        type: 'Percentage',
        value: '50%',
        minSpend: 300,
        maxUses: 50,
        used: 42,
        status: 'active',
        expires: 'Mar 25, 2026',
    },
    {
        code: 'EID100',
        type: 'Fixed',
        value: `100 ${egpLabel()}`,
        minSpend: 500,
        maxUses: 200,
        used: 63,
        status: 'expired',
        expires: 'Mar 25, 2026',
    },
    {
        code: 'FLASH30',
        type: 'Percentage',
        value: '30%',
        minSpend: 150,
        maxUses: 80,
        used: 0,
        status: 'scheduled',
        expires: 'Mar 25, 2026',
    },
    {
        code: 'VIP2026',
        type: 'Fixed',
        value: `200 ${egpLabel()}`,
        minSpend: 1000,
        maxUses: 30,
        used: 12,
        status: 'active',
        expires: 'Mar 21, 2026',
    },
];

// ─── MESSAGE TEMPLATES ───────────────────────────────────────────────
type MessageTemplate = {
    id: string;
    name: string;
    body: string;
    enabled: boolean;
    channels: string[];
};

const initialMessageTemplates: MessageTemplate[] = [
    {
        id: 'M01',
        name: 'Booking Confirmation',
        body: 'Hi {name}, your booking for {service} on {date} at {time} is confirmed.',
        enabled: true,
        channels: ['sms', 'whatsapp'],
    },
    {
        id: 'M02',
        name: 'Booking Reminder (24h)',
        body: 'Reminder: Your appointment is tomorrow at {time}. See you soon!',
        enabled: true,
        channels: ['sms', 'whatsapp'],
    },
    {
        id: 'M03',
        name: 'Booking Reminder (1h)',
        body: 'Your appointment starts in 1 hour at {time}. Get ready!',
        enabled: true,
        channels: ['whatsapp'],
    },
    {
        id: 'M04',
        name: 'Booking Cancelled',
        body: 'Your booking for {service} on {date} has been cancelled.',
        enabled: true,
        channels: ['sms'],
    },
    {
        id: 'M05',
        name: 'Thank You After Visit',
        body: 'Thank you for visiting {branch}! How was your experience? Rate us: {link}',
        enabled: true,
        channels: ['sms', 'whatsapp', 'email'],
    },
    {
        id: 'M06',
        name: 'Birthday Greeting',
        body: 'Happy Birthday {name}! 🎂 Enjoy a special {discount}% off your next visit!',
        enabled: true,
        channels: ['whatsapp', 'email'],
    },
    {
        id: 'M07',
        name: 'Missed Visit (14 days)',
        body: 'We miss you {name}! Come back and enjoy 15% off.',
        enabled: false,
        channels: ['sms'],
    },
    {
        id: 'M08',
        name: 'Payment Receipt',
        body: 'Payment received: {amount} EGP for {service}. Thank you!',
        enabled: true,
        channels: ['sms', 'email'],
    },
    {
        id: 'M09',
        name: 'New Offer Alert',
        body: '🎉 New offer: {offer_name} — {discount} until {expires}!',
        enabled: true,
        channels: ['whatsapp', 'email'],
    },
];

const statusClass: Record<string, string> = {
    active: styles.statusActive,
    draft: styles.statusDraft,
    expired: styles.statusExpired,
    scheduled: styles.statusScheduled,
};

const channelClass: Record<string, string> = {
    sms: styles.channelSMS,
    whatsapp: styles.channelWhatsApp,
    email: styles.channelEmail,
};

// Convert a human label like "Mar 20, 2026" (or any parseable date) to an
// <input type="date"> value (yyyy-mm-dd). Falls back to '' when unparseable.
function toInputDate(label: string): string {
    const d = new Date(label);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
}

// Convert an <input type="date"> value (yyyy-mm-dd) back to the short display
// label used across the cards/table (e.g. "Mar 20, 2026").
function fromInputDate(value: string): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type TabKey = 'offers' | 'promos' | 'messages' | 'campaigns';

export default function MarketingPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabKey>('offers');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { t, lang } = useTranslation();
    const { user } = useAuth();
    const isNewWorkspace = user?.isNewWorkspace;

    // Local data lists (optimistically updated by the forms below).
    const [offers, setOffers] = useState<Offer[]>(initialOffers);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
    const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(initialMessageTemplates);
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

    // CRUD State
    const [isOfferAddOpen, setIsOfferAddOpen] = useState(false);
    const [isOfferEditOpen, setIsOfferEditOpen] = useState(false);
    const [isOfferDeleteOpen, setIsOfferDeleteOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const [isPromoAddOpen, setIsPromoAddOpen] = useState(false);
    const [isPromoEditOpen, setIsPromoEditOpen] = useState(false);
    const [isPromoDeleteOpen, setIsPromoDeleteOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);

    const [isMsgAddOpen, setIsMsgAddOpen] = useState(false);
    const [isMsgEditOpen, setIsMsgEditOpen] = useState(false);
    const [isMsgDeleteOpen, setIsMsgDeleteOpen] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState<MessageTemplate | null>(null);

    const [isCampAddOpen, setIsCampAddOpen] = useState(false);
    const [isCampEditOpen, setIsCampEditOpen] = useState(false);
    const [isCampDeleteOpen, setIsCampDeleteOpen] = useState(false);
    const [selectedCamp, setSelectedCamp] = useState<Campaign | null>(null);

    // ─── Offer form state ────────────────────────────────────────────
    const [offerForm, setOfferForm] = useState({
        name: '',
        desc: '',
        discount: '',
        validUntil: '',
        status: 'active',
    });
    // ─── Promo form state ────────────────────────────────────────────
    const [promoForm, setPromoForm] = useState({
        code: '',
        type: 'Percentage',
        value: '',
        minSpend: '',
        maxUses: '',
        expires: '',
        status: 'active',
    });
    // ─── Message template form state ─────────────────────────────────
    const [msgForm, setMsgForm] = useState({
        name: '',
        body: '',
        sms: false,
        whatsapp: false,
        email: false,
        enabled: true,
    });
    // ─── Campaign form state ─────────────────────────────────────────
    const [campForm, setCampForm] = useState<{
        name: string;
        type: Campaign['type'];
        audience: string;
        recipients: string;
        status: Campaign['status'];
    }>({
        name: '',
        type: 'email',
        audience: '',
        recipients: '',
        status: 'draft',
    });

    // Keep the offer form in sync with the open SlideOver (reset for new, prefill for edit).
    useEffect(() => {
        if (!isOfferAddOpen && !isOfferEditOpen) return;
        if (isOfferEditOpen && selectedOffer) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill form when edit modal opens
            setOfferForm({
                name: selectedOffer.name,
                desc: selectedOffer.desc,
                discount: selectedOffer.discount,
                validUntil: selectedOffer.validUntil ? toInputDate(selectedOffer.validUntil) : '',
                status: selectedOffer.status,
            });
        } else {
            setOfferForm({ name: '', desc: '', discount: '', validUntil: '', status: 'active' });
        }
    }, [isOfferAddOpen, isOfferEditOpen, selectedOffer]);

    useEffect(() => {
        if (!isPromoAddOpen && !isPromoEditOpen) return;
        if (isPromoEditOpen && selectedPromo) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill form when edit modal opens
            setPromoForm({
                code: selectedPromo.code,
                type: selectedPromo.type,
                value: selectedPromo.value,
                minSpend: String(selectedPromo.minSpend),
                maxUses: String(selectedPromo.maxUses),
                expires: selectedPromo.expires ? toInputDate(selectedPromo.expires) : '',
                status: selectedPromo.status,
            });
        } else {
            setPromoForm({
                code: '',
                type: 'Percentage',
                value: '',
                minSpend: '',
                maxUses: '',
                expires: '',
                status: 'active',
            });
        }
    }, [isPromoAddOpen, isPromoEditOpen, selectedPromo]);

    useEffect(() => {
        if (!isMsgAddOpen && !isMsgEditOpen) return;
        if (isMsgEditOpen && selectedMsg) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill form when edit modal opens
            setMsgForm({
                name: selectedMsg.name,
                body: selectedMsg.body,
                sms: selectedMsg.channels.includes('sms'),
                whatsapp: selectedMsg.channels.includes('whatsapp'),
                email: selectedMsg.channels.includes('email'),
                enabled: selectedMsg.enabled,
            });
        } else {
            setMsgForm({ name: '', body: '', sms: false, whatsapp: false, email: false, enabled: true });
        }
    }, [isMsgAddOpen, isMsgEditOpen, selectedMsg]);

    // ─── Submit handlers (validate → optimistic local update → toast) ──
    const handleSaveOffer = () => {
        const name = offerForm.name.trim();
        if (!name) {
            addToast('error', t('marketing.toastOfferNameRequired'));
            return;
        }
        const validUntilLabel = offerForm.validUntil ? fromInputDate(offerForm.validUntil) : '—';
        if (isOfferEditOpen && selectedOffer) {
            const target = selectedOffer;
            setOffers(prev =>
                prev.map(o =>
                    o.id === target.id
                        ? {
                              ...o,
                              name,
                              desc: offerForm.desc.trim(),
                              discount: offerForm.discount.trim() || o.discount,
                              status: offerForm.status,
                              validUntil: validUntilLabel,
                          }
                        : o
                )
            );
            addToast('success', t('marketing.toastOfferUpdated'));
        } else {
            const newOffer: Offer = {
                id: `OF-${Date.now()}`,
                name,
                desc: offerForm.desc.trim(),
                discount: offerForm.discount.trim() || 'OFFER',
                bg: offerGradients[offers.length % offerGradients.length],
                status: offerForm.status,
                validUntil: validUntilLabel,
                uses: 0,
                views: 0,
            };
            setOffers(prev => [newOffer, ...prev]);
            addToast('success', t('marketing.toastOfferCreated'));
        }
        setIsOfferAddOpen(false);
        setIsOfferEditOpen(false);
        setSelectedOffer(null);
    };

    const handleSavePromo = () => {
        const code = promoForm.code.trim().toUpperCase();
        const value = promoForm.value.trim();
        if (!code || !value) {
            addToast('error', t('marketing.toastPromoRequired'));
            return;
        }
        const expiresLabel = promoForm.expires ? fromInputDate(promoForm.expires) : '—';
        if (isPromoEditOpen && selectedPromo) {
            const target = selectedPromo;
            setPromoCodes(prev =>
                prev.map(p =>
                    p.code === target.code
                        ? {
                              ...p,
                              code,
                              type: promoForm.type,
                              value,
                              minSpend: Number(promoForm.minSpend) || 0,
                              maxUses: Number(promoForm.maxUses) || 0,
                              status: promoForm.status,
                              expires: expiresLabel,
                          }
                        : p
                )
            );
            addToast('success', t('marketing.toastPromoUpdated'));
        } else {
            const newPromo: PromoCode = {
                code,
                type: promoForm.type,
                value,
                minSpend: Number(promoForm.minSpend) || 0,
                maxUses: Number(promoForm.maxUses) || 0,
                used: 0,
                status: promoForm.status,
                expires: expiresLabel,
            };
            setPromoCodes(prev => [newPromo, ...prev]);
            addToast('success', t('marketing.toastPromoCreated'));
        }
        setIsPromoAddOpen(false);
        setIsPromoEditOpen(false);
        setSelectedPromo(null);
    };

    const handleSaveMsg = () => {
        const name = msgForm.name.trim();
        if (!name) {
            addToast('error', t('marketing.toastMsgNameRequired'));
            return;
        }
        const channels: string[] = [];
        if (msgForm.sms) channels.push('sms');
        if (msgForm.whatsapp) channels.push('whatsapp');
        if (msgForm.email) channels.push('email');
        if (isMsgEditOpen && selectedMsg) {
            const target = selectedMsg;
            setMessageTemplates(prev =>
                prev.map(m =>
                    m.id === target.id ? { ...m, name, body: msgForm.body, enabled: msgForm.enabled, channels } : m
                )
            );
            addToast('success', t('marketing.toastTemplateUpdated'));
        } else {
            const newMsg: MessageTemplate = {
                id: `M-${Date.now()}`,
                name,
                body: msgForm.body,
                enabled: msgForm.enabled,
                channels,
            };
            setMessageTemplates(prev => [newMsg, ...prev]);
            addToast('success', t('marketing.toastTemplateCreated'));
        }
        setIsMsgAddOpen(false);
        setIsMsgEditOpen(false);
        setSelectedMsg(null);
    };

    // Keep the campaign form in sync with the open SlideOver (reset for new, prefill for edit).
    useEffect(() => {
        if (!isCampAddOpen && !isCampEditOpen) return;
        if (isCampEditOpen && selectedCamp) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill form when edit modal opens
            setCampForm({
                name: selectedCamp.name,
                type: selectedCamp.type,
                audience: selectedCamp.audience,
                recipients: String(selectedCamp.recipients),
                status: selectedCamp.status,
            });
        } else {
            setCampForm({ name: '', type: 'email', audience: '', recipients: '', status: 'draft' });
        }
    }, [isCampAddOpen, isCampEditOpen, selectedCamp]);

    const handleSaveCampaign = () => {
        const name = campForm.name.trim();
        if (!name) {
            addToast('error', t('marketing.toastCampNameRequired'));
            return;
        }
        const recipients = Number(campForm.recipients) || 0;
        if (isCampEditOpen && selectedCamp) {
            const target = selectedCamp;
            setCampaigns(prev =>
                prev.map(c =>
                    c.id === target.id
                        ? {
                              ...c,
                              name,
                              type: campForm.type,
                              audience: campForm.audience.trim() || c.audience,
                              recipients,
                              status: campForm.status,
                          }
                        : c
                )
            );
            addToast('success', t('marketing.toastCampUpdated'));
        } else {
            const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const newCamp: Campaign = {
                id: `CMP-${Date.now()}`,
                name,
                type: campForm.type,
                audience: campForm.audience.trim() || 'All Clients',
                status: campForm.status,
                recipients,
                date: campForm.status === 'draft' ? '—' : today,
            };
            setCampaigns(prev => [newCamp, ...prev]);
            addToast('success', t('marketing.toastCampCreated'));
        }
        setIsCampAddOpen(false);
        setIsCampEditOpen(false);
        setSelectedCamp(null);
    };

    const handleDeleteCampaign = () => {
        if (selectedCamp) {
            const id = selectedCamp.id;
            setCampaigns(prev => prev.filter(c => c.id !== id));
            addToast('success', t('marketing.toastCampDeleted'));
        }
        setIsCampDeleteOpen(false);
        setSelectedCamp(null);
    };

    return (
        <div className={styles.marketingPage} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>{t('marketing.title')}</h1>
                    <p>{t('marketing.desc')}</p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.btnPrimary}
                        onClick={() => {
                            if (activeTab === 'offers') setIsOfferAddOpen(true);
                            if (activeTab === 'promos') setIsPromoAddOpen(true);
                            if (activeTab === 'messages') setIsMsgAddOpen(true);
                        }}
                    >
                        <Plus size={16} />
                        {activeTab === 'offers'
                            ? t('marketing.newOffer')
                            : activeTab === 'promos'
                              ? t('marketing.newPromo')
                              : activeTab === 'messages'
                                ? t('marketing.newMsg')
                                : t('marketing.newCamp')}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'offers' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('offers')}
                >
                    <Gift size={16} /> {t('marketing.tabOffers')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'promos' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('promos')}
                >
                    <Tag size={16} /> {t('marketing.tabPromos')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'messages' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    <MessageSquare size={16} /> {t('marketing.tabMsg')}
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'campaigns' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('campaigns')}
                >
                    <Megaphone size={16} /> {t('marketing.tabCamp')}
                </button>
            </div>

            {/* KPIs */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: '#FEF3C7', color: '#B45309' }}>
                        <Gift size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{offers.filter(o => o.status === 'active').length}</div>
                        <div className={styles.kpiLabel}>{t('marketing.activeOffers')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                    >
                        <Tag size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{promoCodes.filter(p => p.status === 'active').length}</div>
                        <div className={styles.kpiLabel}>{t('marketing.activeCodes')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}
                    >
                        <ShoppingCart size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>207</div>
                        <div className={styles.kpiLabel}>{t('marketing.redemptions')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIcon}
                        style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}
                    >
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>
                            +18.3%
                        </div>
                        <div className={styles.kpiLabel}>{t('marketing.convRate')}</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder={
                            activeTab === 'offers'
                                ? t('marketing.searchOffers')
                                : activeTab === 'promos'
                                  ? t('marketing.searchPromos')
                                  : activeTab === 'messages'
                                    ? t('marketing.searchMessages')
                                    : t('marketing.searchCampaigns')
                        }
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.selectFilter}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t('marketing.filterAll')}</option>
                    <option value="active">{t('marketing.filterActive')}</option>
                    <option value="draft">{t('marketing.filterDraft')}</option>
                    <option value="scheduled">{t('marketing.filterScheduled')}</option>
                    <option value="expired">{t('marketing.filterExpired')}</option>
                </select>
            </div>

            {/* ─── Offers Tab ──────────────────────────────────────── */}
            {activeTab === 'offers' &&
                (isNewWorkspace ? (
                    <div
                        style={{
                            padding: 'var(--space-12) 0',
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--border-color)',
                            marginTop: 'var(--space-6)',
                        }}
                    >
                        <EmptyState
                            icon={<Gift size={48} color="var(--color-primary-500)" />}
                            title={t('marketing.emptyOffersTitle')}
                            description={t('marketing.emptyOffersDesc')}
                            action={
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => setIsOfferAddOpen(true)}
                                    style={{ margin: '0 auto', display: 'flex', marginTop: 'var(--space-4)' }}
                                >
                                    <Plus size={16} style={{ marginInlineEnd: 'var(--space-1)' }} />{' '}
                                    {t('marketing.createOffer')}
                                </button>
                            }
                        />
                    </div>
                ) : (
                    <div className={styles.cardGrid}>
                        {offers
                            .filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
                            .filter(o => statusFilter === 'all' || o.status === statusFilter)
                            .map(offer => (
                                <div key={offer.id} className={styles.offerCard}>
                                    <div className={styles.offerBanner} style={{ background: offer.bg }}>
                                        <span className={styles.bannerText}>{offer.discount}</span>
                                    </div>
                                    <div className={styles.offerBody}>
                                        <div className={styles.offerTitle}>{offer.name}</div>
                                        <div className={styles.offerDesc}>{offer.desc}</div>
                                        <div className={styles.offerMeta}>
                                            <span className={styles.metaItem}>
                                                <Calendar size={12} /> {t('marketing.until')} {offer.validUntil}
                                            </span>
                                            <span className={styles.metaItem}>
                                                <Eye size={12} /> {offer.views} {t('marketing.views')}
                                            </span>
                                            <span className={styles.metaItem}>
                                                <ShoppingCart size={12} /> {offer.uses} {t('marketing.used')}
                                            </span>
                                        </div>
                                        <div className={styles.offerFooter}>
                                            <span className={`${styles.statusBadge} ${statusClass[offer.status]}`}>
                                                {offer.status === 'active' && <Zap size={10} />}
                                                {offer.status === 'active'
                                                    ? t('marketing.filterActive')
                                                    : offer.status === 'draft'
                                                      ? t('marketing.filterDraft')
                                                      : offer.status === 'scheduled'
                                                        ? t('marketing.filterScheduled')
                                                        : t('marketing.filterExpired')}
                                            </span>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                                            >
                                                <span className={styles.statChip}>
                                                    <strong>{offer.uses}</strong> / ∞ {t('marketing.uses')}
                                                </span>
                                                <DropdownMenu
                                                    trigger={
                                                        <button
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: 'var(--text-tertiary)',
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    }
                                                    items={[
                                                        {
                                                            label: t('marketing.editOffer'),
                                                            icon: <Gift size={14} />,
                                                            onClick: () => {
                                                                setSelectedOffer(offer);
                                                                setIsOfferEditOpen(true);
                                                            },
                                                        },
                                                        {
                                                            label: t('marketing.deleteOffer'),
                                                            destructive: true,
                                                            icon: <Trash2 size={14} />,
                                                            onClick: () => {
                                                                setSelectedOffer(offer);
                                                                setIsOfferDeleteOpen(true);
                                                            },
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}

            {/* ─── Promo Codes Tab ─────────────────────────────────── */}
            {activeTab === 'promos' && (
                <div className={styles.tableCard}>
                    <div className={styles.tableScroll}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colCode')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colType')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colValue')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colMinSpend')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colUsage')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colStatus')}</th>
                                    <th style={{ textAlign: 'start' }}>{t('marketing.colExpires')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {promoCodes
                                    .filter(p => p.code.toLowerCase().includes(search.toLowerCase()))
                                    .filter(p => statusFilter === 'all' || p.status === statusFilter)
                                    .map(p => {
                                        const pct = (p.used / p.maxUses) * 100;
                                        return (
                                            <tr key={p.code}>
                                                <td>
                                                    <span className={styles.codeChip}>{p.code}</span>
                                                </td>
                                                <td>{p.type}</td>
                                                <td style={{ fontWeight: 'var(--font-semibold)' }}>{p.value}</td>
                                                <td>
                                                    {p.minSpend} {egpLabel()}
                                                </td>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-2)',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: 'var(--text-sm)',
                                                                fontWeight: 'var(--font-medium)',
                                                                minWidth: 50,
                                                            }}
                                                        >
                                                            {p.used}/{p.maxUses}
                                                        </span>
                                                        <div className={styles.progressBar}>
                                                            <div
                                                                className={styles.progressFill}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${statusClass[p.status]}`}>
                                                        {p.status === 'active'
                                                            ? t('marketing.filterActive')
                                                            : p.status === 'draft'
                                                              ? t('marketing.filterDraft')
                                                              : p.status === 'scheduled'
                                                                ? t('marketing.filterScheduled')
                                                                : t('marketing.filterExpired')}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        color: 'var(--text-tertiary)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    {p.expires}
                                                </td>
                                                <td>
                                                    <DropdownMenu
                                                        trigger={
                                                            <button
                                                                className={styles.actionBtn}
                                                                aria-label={t('common.moreOptions')}
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        }
                                                        items={[
                                                            {
                                                                label: t('marketing.editCode'),
                                                                icon: <Tag size={14} />,
                                                                onClick: () => {
                                                                    setSelectedPromo(p);
                                                                    setIsPromoEditOpen(true);
                                                                },
                                                            },
                                                            {
                                                                label: t('marketing.delete'),
                                                                destructive: true,
                                                                icon: <Trash2 size={14} />,
                                                                onClick: () => {
                                                                    setSelectedPromo(p);
                                                                    setIsPromoDeleteOpen(true);
                                                                },
                                                            },
                                                        ]}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ─── Messages Tab ────────────────────────────────────── */}
            {activeTab === 'messages' && (
                <div className={styles.messageGrid}>
                    {messageTemplates
                        .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                        .map(msg => (
                            <MessageCard
                                key={msg.id}
                                msg={msg}
                                onEdit={() => {
                                    setSelectedMsg(msg);
                                    setIsMsgEditOpen(true);
                                }}
                                onDelete={() => {
                                    setSelectedMsg(msg);
                                    setIsMsgDeleteOpen(true);
                                }}
                            />
                        ))}
                </div>
            )}

            {/* ─── Campaigns Tab ───────────────────────────────────── */}
            {activeTab === 'campaigns' &&
                (() => {
                    const typeLabel: Record<string, string> = {
                        email: t('marketing.campTypeEmail'),
                        sms: t('marketing.campTypeSms'),
                        push: t('marketing.campTypePush'),
                    };
                    const statusLabel: Record<string, string> = {
                        active: t('marketing.campStatusActive'),
                        scheduled: t('marketing.campStatusScheduled'),
                        draft: t('marketing.campStatusDraft'),
                        completed: t('marketing.campStatusCompleted'),
                    };
                    const statusColor: Record<string, string> = {
                        active: 'var(--color-success)',
                        scheduled: 'var(--color-info)',
                        draft: 'var(--text-tertiary)',
                        completed: 'var(--color-primary-600)',
                    };
                    return (
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--space-4)',
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 'var(--font-semibold)',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {t('marketing.campaignsTitle')}
                                </h3>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => {
                                        setSelectedCamp(null);
                                        setIsCampAddOpen(true);
                                    }}
                                >
                                    <Plus size={16} style={{ marginInlineEnd: 'var(--space-1)' }} />{' '}
                                    {t('marketing.newCampaign')}
                                </button>
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                    gap: 'var(--space-4)',
                                }}
                            >
                                {campaigns.map(c => (
                                    <div
                                        key={c.id}
                                        style={{
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-xl)',
                                            padding: 'var(--space-5)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                gap: 'var(--space-2)',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 'var(--font-semibold)',
                                                    color: 'var(--text-primary)',
                                                }}
                                            >
                                                {c.name}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-2)',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        fontWeight: 'var(--font-semibold)',
                                                        padding: '2px var(--space-2)',
                                                        borderRadius: 'var(--radius-full)',
                                                        color: statusColor[c.status],
                                                        background: 'var(--bg-tertiary)',
                                                    }}
                                                >
                                                    {statusLabel[c.status]}
                                                </span>
                                                <DropdownMenu
                                                    trigger={
                                                        <button
                                                            aria-label={t('common.moreOptions')}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                padding: 'var(--space-1)',
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                color: 'var(--text-tertiary)',
                                                            }}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    }
                                                    items={[
                                                        {
                                                            label: t('common.edit'),
                                                            onClick: () => {
                                                                setSelectedCamp(c);
                                                                setIsCampEditOpen(true);
                                                            },
                                                        },
                                                        {
                                                            label: t('common.delete'),
                                                            icon: <Trash2 size={14} />,
                                                            onClick: () => {
                                                                setSelectedCamp(c);
                                                                setIsCampDeleteOpen(true);
                                                            },
                                                            destructive: true,
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 'var(--space-2)',
                                                marginTop: 'var(--space-2)',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 'var(--font-medium)',
                                                    padding: '2px var(--space-2)',
                                                    borderRadius: 'var(--radius-md)',
                                                    background: 'var(--color-info-light)',
                                                    color: 'var(--color-info)',
                                                }}
                                            >
                                                {typeLabel[c.type]}
                                            </span>
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {c.audience}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: 'var(--space-3)',
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-1)',
                                                }}
                                            >
                                                <Send size={13} /> {c.recipients} {t('marketing.campRecipients')}
                                            </span>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--space-1)',
                                                }}
                                            >
                                                <Calendar size={13} /> {c.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            {/* ─── OFFER MODALS ─── */}
            <SlideOver
                open={isOfferAddOpen || isOfferEditOpen}
                onClose={() => {
                    setIsOfferAddOpen(false);
                    setIsOfferEditOpen(false);
                    setSelectedOffer(null);
                }}
                title={isOfferEditOpen ? t('marketing.modal.editOffer') : t('marketing.modal.newOffer')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button
                            variant="outline"
                            style={{ flex: 1 }}
                            onClick={() => {
                                setIsOfferAddOpen(false);
                                setIsOfferEditOpen(false);
                            }}
                        >
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button style={{ flex: 1 }} onClick={handleSaveOffer}>
                            {isOfferEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('marketing.modal.offerName')}
                        value={offerForm.name}
                        onChange={e => setOfferForm(f => ({ ...f, name: e.target.value }))}
                        placeholder={t('marketing.modal.offerNamePh')}
                    />
                    <Input
                        label={t('marketing.modal.desc')}
                        value={offerForm.desc}
                        onChange={e => setOfferForm(f => ({ ...f, desc: e.target.value }))}
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Input
                            label={t('marketing.modal.discount')}
                            value={offerForm.discount}
                            onChange={e => setOfferForm(f => ({ ...f, discount: e.target.value }))}
                            style={{ flex: 1 }}
                            dir="ltr"
                        />
                        <Input
                            type="date"
                            label={t('marketing.modal.validUntil')}
                            value={offerForm.validUntil}
                            onChange={e => setOfferForm(f => ({ ...f, validUntil: e.target.value }))}
                            style={{ flex: 1 }}
                        />
                    </div>
                    <Select
                        label={t('marketing.modal.status')}
                        value={offerForm.status}
                        onChange={e => setOfferForm(f => ({ ...f, status: e.target.value }))}
                        options={[
                            { label: t('marketing.filterActive'), value: 'active' },
                            { label: t('marketing.filterDraft'), value: 'draft' },
                            { label: t('marketing.filterScheduled'), value: 'scheduled' },
                            { label: t('marketing.filterExpired'), value: 'expired' },
                        ]}
                    />
                </div>
            </SlideOver>

            <Modal
                open={isOfferDeleteOpen}
                onClose={() => setIsOfferDeleteOpen(false)}
                title={t('marketing.modal.deleteOfferTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsOfferDeleteOpen(false)}>
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedOffer) {
                                    const id = selectedOffer.id;
                                    setOffers(prev => prev.filter(o => o.id !== id));
                                }
                                setIsOfferDeleteOpen(false);
                                setSelectedOffer(null);
                                addToast('error', t('marketing.toastOfferDeleted'));
                            }}
                        >
                            {t('marketing.delete')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('marketing.modal.deleteOfferConfirm').replace('{name}', selectedOffer?.name || '')}
                </p>
            </Modal>

            {/* ─── PROMO CODE MODALS ─── */}
            <SlideOver
                open={isPromoAddOpen || isPromoEditOpen}
                onClose={() => {
                    setIsPromoAddOpen(false);
                    setIsPromoEditOpen(false);
                    setSelectedPromo(null);
                }}
                title={isPromoEditOpen ? t('marketing.modal.editPromo') : t('marketing.modal.newPromo')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button
                            variant="outline"
                            style={{ flex: 1 }}
                            onClick={() => {
                                setIsPromoAddOpen(false);
                                setIsPromoEditOpen(false);
                            }}
                        >
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button style={{ flex: 1 }} onClick={handleSavePromo}>
                            {isPromoEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('marketing.modal.promoCode')}
                        value={promoForm.code}
                        onChange={e => setPromoForm(f => ({ ...f, code: e.target.value }))}
                        placeholder="e.g. SUMMER20"
                        style={{ textTransform: 'uppercase' }}
                        dir="ltr"
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Select
                            label={t('marketing.modal.type')}
                            value={promoForm.type}
                            onChange={e => setPromoForm(f => ({ ...f, type: e.target.value }))}
                            style={{ flex: 1 }}
                            options={[
                                { label: t('marketing.modal.typePct'), value: 'Percentage' },
                                { label: t('marketing.modal.typeFixed'), value: 'Fixed' },
                            ]}
                        />
                        <Input
                            label={t('marketing.modal.value')}
                            value={promoForm.value}
                            onChange={e => setPromoForm(f => ({ ...f, value: e.target.value }))}
                            style={{ flex: 1 }}
                            dir="ltr"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Input
                            label={t('marketing.modal.minSpend')}
                            type="number"
                            value={promoForm.minSpend}
                            onChange={e => setPromoForm(f => ({ ...f, minSpend: e.target.value }))}
                            style={{ flex: 1 }}
                            dir="ltr"
                        />
                        <Input
                            label={t('marketing.modal.maxUses')}
                            type="number"
                            value={promoForm.maxUses}
                            onChange={e => setPromoForm(f => ({ ...f, maxUses: e.target.value }))}
                            style={{ flex: 1 }}
                            dir="ltr"
                        />
                    </div>
                    <Input
                        type="date"
                        label={t('marketing.modal.expiryDate')}
                        value={promoForm.expires}
                        onChange={e => setPromoForm(f => ({ ...f, expires: e.target.value }))}
                    />
                    <Select
                        label={t('marketing.modal.status')}
                        value={promoForm.status}
                        onChange={e => setPromoForm(f => ({ ...f, status: e.target.value }))}
                        options={[
                            { label: t('marketing.filterActive'), value: 'active' },
                            { label: t('marketing.filterScheduled'), value: 'scheduled' },
                            { label: t('marketing.filterExpired'), value: 'expired' },
                        ]}
                    />
                </div>
            </SlideOver>

            <Modal
                open={isPromoDeleteOpen}
                onClose={() => setIsPromoDeleteOpen(false)}
                title={t('marketing.modal.deletePromoTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsPromoDeleteOpen(false)}>
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedPromo) {
                                    const code = selectedPromo.code;
                                    setPromoCodes(prev => prev.filter(p => p.code !== code));
                                }
                                setIsPromoDeleteOpen(false);
                                setSelectedPromo(null);
                                addToast('error', t('marketing.toastPromoDeleted'));
                            }}
                        >
                            {t('marketing.delete')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('marketing.modal.deletePromoConfirm').replace('{code}', selectedPromo?.code || '')}
                </p>
            </Modal>

            {/* ─── MESSAGE TEMPLATE MODALS ─── */}
            <SlideOver
                open={isMsgAddOpen || isMsgEditOpen}
                onClose={() => {
                    setIsMsgAddOpen(false);
                    setIsMsgEditOpen(false);
                    setSelectedMsg(null);
                }}
                title={isMsgEditOpen ? t('marketing.modal.editMsg') : t('marketing.modal.newMsg')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button
                            variant="outline"
                            style={{ flex: 1 }}
                            onClick={() => {
                                setIsMsgAddOpen(false);
                                setIsMsgEditOpen(false);
                            }}
                        >
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button style={{ flex: 1 }} onClick={handleSaveMsg}>
                            {isMsgEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('marketing.modal.msgName')}
                        value={msgForm.name}
                        onChange={e => setMsgForm(f => ({ ...f, name: e.target.value }))}
                        placeholder={t('marketing.modal.msgNamePh')}
                    />
                    <div>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                marginBottom: 'var(--space-1)',
                                display: 'block',
                            }}
                        >
                            {t('marketing.modal.msgBody')}
                        </label>
                        <textarea
                            value={msgForm.body}
                            onChange={e => setMsgForm(f => ({ ...f, body: e.target.value }))}
                            style={{
                                width: '100%',
                                minHeight: 120,
                                padding: 'var(--space-3)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                                resize: 'vertical',
                            }}
                            placeholder={t('marketing.modal.msgBodyPh')}
                            dir="auto"
                        />
                    </div>
                    <div>
                        <label
                            style={{
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-medium)',
                                marginBottom: 'var(--space-2)',
                                display: 'block',
                            }}
                        >
                            {t('marketing.modal.channels')}
                        </label>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={msgForm.sms}
                                    onChange={e => setMsgForm(f => ({ ...f, sms: e.target.checked }))}
                                />{' '}
                                SMS
                            </label>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={msgForm.whatsapp}
                                    onChange={e => setMsgForm(f => ({ ...f, whatsapp: e.target.checked }))}
                                />{' '}
                                WhatsApp
                            </label>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={msgForm.email}
                                    onChange={e => setMsgForm(f => ({ ...f, email: e.target.checked }))}
                                />{' '}
                                Email
                            </label>
                        </div>
                    </div>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-medium)',
                            marginTop: 'var(--space-2)',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={msgForm.enabled}
                            onChange={e => setMsgForm(f => ({ ...f, enabled: e.target.checked }))}
                        />{' '}
                        {t('marketing.modal.templateEnabled')}
                    </label>
                </div>
            </SlideOver>

            <Modal
                open={isMsgDeleteOpen}
                onClose={() => setIsMsgDeleteOpen(false)}
                title={t('marketing.modal.deleteMsgTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsMsgDeleteOpen(false)}>
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedMsg) {
                                    const id = selectedMsg.id;
                                    setMessageTemplates(prev => prev.filter(m => m.id !== id));
                                }
                                setIsMsgDeleteOpen(false);
                                setSelectedMsg(null);
                                addToast('error', t('marketing.toastTemplateDeleted'));
                            }}
                        >
                            {t('marketing.delete')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('marketing.modal.deleteMsgConfirm')}</p>
            </Modal>

            {/* ─── Campaign SlideOver (create / edit) ─── */}
            <SlideOver
                open={isCampAddOpen || isCampEditOpen}
                onClose={() => {
                    setIsCampAddOpen(false);
                    setIsCampEditOpen(false);
                    setSelectedCamp(null);
                }}
                title={isCampEditOpen ? t('marketing.modal.editCampaign') : t('marketing.modal.newCampaign')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button
                            variant="outline"
                            style={{ flex: 1 }}
                            onClick={() => {
                                setIsCampAddOpen(false);
                                setIsCampEditOpen(false);
                            }}
                        >
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button style={{ flex: 1 }} onClick={handleSaveCampaign}>
                            {isCampEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('marketing.modal.campName')}
                        value={campForm.name}
                        onChange={e => setCampForm(f => ({ ...f, name: e.target.value }))}
                    />
                    <Select
                        label={t('marketing.modal.campType')}
                        value={campForm.type}
                        onChange={e => setCampForm(f => ({ ...f, type: e.target.value as Campaign['type'] }))}
                        options={[
                            { label: t('marketing.campTypeEmail'), value: 'email' },
                            { label: t('marketing.campTypeSms'), value: 'sms' },
                            { label: t('marketing.campTypePush'), value: 'push' },
                        ]}
                    />
                    <Input
                        label={t('marketing.modal.campAudience')}
                        value={campForm.audience}
                        onChange={e => setCampForm(f => ({ ...f, audience: e.target.value }))}
                    />
                    <Input
                        label={t('marketing.modal.campRecipients')}
                        type="number"
                        value={campForm.recipients}
                        onChange={e => setCampForm(f => ({ ...f, recipients: e.target.value }))}
                    />
                    <Select
                        label={t('marketing.modal.campStatus')}
                        value={campForm.status}
                        onChange={e => setCampForm(f => ({ ...f, status: e.target.value as Campaign['status'] }))}
                        options={[
                            { label: t('marketing.campStatusDraft'), value: 'draft' },
                            { label: t('marketing.campStatusScheduled'), value: 'scheduled' },
                            { label: t('marketing.campStatusActive'), value: 'active' },
                            { label: t('marketing.campStatusCompleted'), value: 'completed' },
                        ]}
                    />
                </div>
            </SlideOver>

            {/* ─── Campaign delete confirm ─── */}
            <Modal
                open={isCampDeleteOpen}
                onClose={() => {
                    setIsCampDeleteOpen(false);
                    setSelectedCamp(null);
                }}
                title={t('marketing.modal.deleteCampaignTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsCampDeleteOpen(false)}>
                            {t('marketing.modal.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteCampaign}>
                            {t('marketing.delete')}
                        </Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>
                    {t('marketing.modal.deleteCampaignConfirm').replace('{name}', selectedCamp?.name || '')}
                </p>
            </Modal>
        </div>
    );
}

function MessageCard({ msg, onEdit, onDelete }: { msg: MessageTemplate; onEdit: () => void; onDelete: () => void }) {
    const [enabled, setEnabled] = useState(msg.enabled);
    const { t } = useTranslation();
    return (
        <div className={styles.messageCard}>
            <div className={styles.messageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <DropdownMenu
                        trigger={
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-tertiary)',
                                    padding: 0,
                                }}
                            >
                                <MoreVertical size={16} />
                            </button>
                        }
                        items={[
                            { label: t('marketing.editTemplate'), icon: <MessageSquare size={14} />, onClick: onEdit },
                            {
                                label: t('marketing.deleteTemplate'),
                                destructive: true,
                                icon: <Trash2 size={14} />,
                                onClick: onDelete,
                            },
                        ]}
                    />
                    <div className={styles.messageTitle}>{msg.name}</div>
                </div>
                <div
                    className={styles.toggleSwitch}
                    style={{ background: enabled ? 'var(--color-primary-500)' : 'var(--color-gray-300)' }}
                    onClick={() => setEnabled(!enabled)}
                >
                    <div className={styles.toggleDot} style={{ insetInlineStart: enabled ? 23 : 3 }} />
                </div>
            </div>
            <div className={styles.messageBody}>{msg.body}</div>
            <div>
                {msg.channels.map(ch => (
                    <span key={ch} className={`${styles.channelBadge} ${channelClass[ch]}`}>
                        {ch === 'sms' ? 'SMS' : ch === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </span>
                ))}
            </div>
        </div>
    );
}
