'use client';

import React, { useState } from 'react';
import { DropdownMenu, useToast, SlideOver, Modal, Input, Select, Button } from '@/components/ui';
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

// ─── OFFERS DATA ─────────────────────────────────────────────────────
const offers = [
    {
        id: 'OF-001', name: 'Valentine\'s Special', desc: 'Buy any facial treatment and get 50% off a massage.',
        discount: '50% OFF', bg: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
        status: 'active', validUntil: 'Feb 28, 2026', uses: 42, views: 320,
    },
    {
        id: 'OF-002', name: 'New Client Welcome', desc: 'First-time clients get 25% off any service.',
        discount: '25% OFF', bg: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        status: 'active', validUntil: 'Mar 31, 2026', uses: 87, views: 560,
    },
    {
        id: 'OF-003', name: 'Summer Hair Bundle', desc: 'Haircut + Keratin + Styling for a fixed price.',
        discount: 'BUNDLE', bg: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        status: 'draft', validUntil: 'Jun 30, 2026', uses: 0, views: 0,
    },
    {
        id: 'OF-004', name: 'Loyalty Reward', desc: 'Every 10th visit gets a free classic manicure.',
        discount: 'FREE', bg: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
        status: 'active', validUntil: 'Dec 31, 2026', uses: 15, views: 210,
    },
    {
        id: 'OF-005', name: 'Flash Friday', desc: '30% off all skin services — Fridays only.',
        discount: '30% OFF', bg: 'linear-gradient(135deg, #14B8A6 0%, #6366F1 100%)',
        status: 'scheduled', validUntil: 'Mar 15, 2026', uses: 0, views: 0,
    },
    {
        id: 'OF-006', name: 'Eid Celebration', desc: 'Special full-body pampering package at 40% off.',
        discount: '40% OFF', bg: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
        status: 'expired', validUntil: 'Jan 15, 2026', uses: 63, views: 480,
    },
];

// ─── PROMO CODES ─────────────────────────────────────────────────────
const promoCodes = [
    { code: 'WELCOME25', type: 'Percentage', value: '25%', minSpend: 200, maxUses: 100, used: 87, status: 'active', expires: 'Mar 31, 2026' },
    { code: 'VALENTINE50', type: 'Percentage', value: '50%', minSpend: 300, maxUses: 50, used: 42, status: 'active', expires: 'Feb 28, 2026' },
    { code: 'EID100', type: 'Fixed', value: '100 EGP', minSpend: 500, maxUses: 200, used: 63, status: 'expired', expires: 'Jan 15, 2026' },
    { code: 'FLASH30', type: 'Percentage', value: '30%', minSpend: 150, maxUses: 80, used: 0, status: 'scheduled', expires: 'Mar 15, 2026' },
    { code: 'VIP2026', type: 'Fixed', value: '200 EGP', minSpend: 1000, maxUses: 30, used: 12, status: 'active', expires: 'Dec 31, 2026' },
];

// ─── MESSAGE TEMPLATES ───────────────────────────────────────────────
const messageTemplates = [
    { id: 'M01', name: 'Booking Confirmation', body: 'Hi {name}, your booking for {service} on {date} at {time} is confirmed.', enabled: true, channels: ['sms', 'whatsapp'] },
    { id: 'M02', name: 'Booking Reminder (24h)', body: 'Reminder: Your appointment is tomorrow at {time}. See you soon!', enabled: true, channels: ['sms', 'whatsapp'] },
    { id: 'M03', name: 'Booking Reminder (1h)', body: 'Your appointment starts in 1 hour at {time}. Get ready!', enabled: true, channels: ['whatsapp'] },
    { id: 'M04', name: 'Booking Cancelled', body: 'Your booking for {service} on {date} has been cancelled.', enabled: true, channels: ['sms'] },
    { id: 'M05', name: 'Thank You After Visit', body: 'Thank you for visiting {branch}! How was your experience? Rate us: {link}', enabled: true, channels: ['sms', 'whatsapp', 'email'] },
    { id: 'M06', name: 'Birthday Greeting', body: 'Happy Birthday {name}! 🎂 Enjoy a special {discount}% off your next visit!', enabled: true, channels: ['whatsapp', 'email'] },
    { id: 'M07', name: 'Missed Visit (14 days)', body: 'We miss you {name}! Come back and enjoy 15% off.', enabled: false, channels: ['sms'] },
    { id: 'M08', name: 'Payment Receipt', body: 'Payment received: {amount} EGP for {service}. Thank you!', enabled: true, channels: ['sms', 'email'] },
    { id: 'M09', name: 'New Offer Alert', body: '🎉 New offer: {offer_name} — {discount} until {expires}!', enabled: true, channels: ['whatsapp', 'email'] },
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

type TabKey = 'offers' | 'promos' | 'messages' | 'campaigns';

export default function MarketingPage() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabKey>('offers');
    const [search, setSearch] = useState('');
    const { t, lang } = useTranslation();

    // CRUD State
    const [isOfferAddOpen, setIsOfferAddOpen] = useState(false);
    const [isOfferEditOpen, setIsOfferEditOpen] = useState(false);
    const [isOfferDeleteOpen, setIsOfferDeleteOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);

    const [isPromoAddOpen, setIsPromoAddOpen] = useState(false);
    const [isPromoEditOpen, setIsPromoEditOpen] = useState(false);
    const [isPromoDeleteOpen, setIsPromoDeleteOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<any>(null);

    const [isMsgAddOpen, setIsMsgAddOpen] = useState(false);
    const [isMsgEditOpen, setIsMsgEditOpen] = useState(false);
    const [isMsgDeleteOpen, setIsMsgDeleteOpen] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState<any>(null);

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
                        {activeTab === 'offers' ? t('marketing.newOffer') : activeTab === 'promos' ? t('marketing.newPromo') : activeTab === 'messages' ? t('marketing.newMsg') : t('marketing.newCamp')}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'offers' ? styles.tabActive : ''}`} onClick={() => setActiveTab('offers')}>
                    <Gift size={16} /> {t('marketing.tabOffers')}
                </button>
                <button className={`${styles.tab} ${activeTab === 'promos' ? styles.tabActive : ''}`} onClick={() => setActiveTab('promos')}>
                    <Tag size={16} /> {t('marketing.tabPromos')}
                </button>
                <button className={`${styles.tab} ${activeTab === 'messages' ? styles.tabActive : ''}`} onClick={() => setActiveTab('messages')}>
                    <MessageSquare size={16} /> {t('marketing.tabMsg')}
                </button>
                <button className={`${styles.tab} ${activeTab === 'campaigns' ? styles.tabActive : ''}`} onClick={() => setActiveTab('campaigns')}>
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
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        <Tag size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{promoCodes.filter(p => p.status === 'active').length}</div>
                        <div className={styles.kpiLabel}>{t('marketing.activeCodes')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                        <ShoppingCart size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>207</div>
                        <div className={styles.kpiLabel}>{t('marketing.redemptions')}</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>+18.3%</div>
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
                        placeholder={activeTab === 'offers' ? t('marketing.searchOffers') : activeTab === 'promos' ? t('marketing.searchPromos') : activeTab === 'messages' ? t('marketing.searchMessages') : t('marketing.searchCampaigns')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className={styles.selectFilter}>
                    <option value="all">{t('marketing.filterAll')}</option>
                    <option value="active">{t('marketing.filterActive')}</option>
                    <option value="draft">{t('marketing.filterDraft')}</option>
                    <option value="scheduled">{t('marketing.filterScheduled')}</option>
                    <option value="expired">{t('marketing.filterExpired')}</option>
                </select>
            </div>

            {/* ─── Offers Tab ──────────────────────────────────────── */}
            {activeTab === 'offers' && (
                <div className={styles.cardGrid}>
                    {offers
                        .filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
                        .map((offer) => (
                            <div key={offer.id} className={styles.offerCard}>
                                <div className={styles.offerBanner} style={{ background: offer.bg }}>
                                    <span className={styles.bannerText}>{offer.discount}</span>
                                </div>
                                <div className={styles.offerBody}>
                                    <div className={styles.offerTitle}>{offer.name}</div>
                                    <div className={styles.offerDesc}>{offer.desc}</div>
                                    <div className={styles.offerMeta}>
                                        <span className={styles.metaItem}><Calendar size={12} /> {t('marketing.until')} {offer.validUntil}</span>
                                        <span className={styles.metaItem}><Eye size={12} /> {offer.views} {t('marketing.views')}</span>
                                        <span className={styles.metaItem}><ShoppingCart size={12} /> {offer.uses} {t('marketing.used')}</span>
                                    </div>
                                    <div className={styles.offerFooter}>
                                        <span className={`${styles.statusBadge} ${statusClass[offer.status]}`}>
                                            {offer.status === 'active' && <Zap size={10} />}
                                            {offer.status === 'active' ? t('marketing.filterActive') : offer.status === 'draft' ? t('marketing.filterDraft') : offer.status === 'scheduled' ? t('marketing.filterScheduled') : t('marketing.filterExpired')}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span className={styles.statChip}>
                                                <strong>{offer.uses}</strong> / ∞ {t('marketing.uses')}
                                            </span>
                                            <DropdownMenu
                                                trigger={
                                                    <button
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0 }}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                }
                                                items={[
                                                    { label: t('marketing.editOffer'), icon: <Gift size={14} />, onClick: () => { setSelectedOffer(offer); setIsOfferEditOpen(true); } },
                                                    { label: t('marketing.deleteOffer'), destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedOffer(offer); setIsOfferDeleteOpen(true); } }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* ─── Promo Codes Tab ─────────────────────────────────── */}
            {activeTab === 'promos' && (
                <div className={styles.tableCard}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colCode')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colType')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colValue')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colMinSpend')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colUsage')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colStatus')}</th>
                                <th style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{t('marketing.colExpires')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {promoCodes
                                .filter(p => p.code.toLowerCase().includes(search.toLowerCase()))
                                .map((p) => {
                                    const pct = (p.used / p.maxUses) * 100;
                                    return (
                                        <tr key={p.code}>
                                            <td><span className={styles.codeChip}>{p.code}</span></td>
                                            <td>{p.type}</td>
                                            <td style={{ fontWeight: 'var(--font-semibold)' }}>{p.value}</td>
                                            <td>{p.minSpend} EGP</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', minWidth: 50 }}>
                                                        {p.used}/{p.maxUses}
                                                    </span>
                                                    <div className={styles.progressBar}>
                                                        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusBadge} ${statusClass[p.status]}`}>
                                                    {p.status === 'active' ? t('marketing.filterActive') : p.status === 'draft' ? t('marketing.filterDraft') : p.status === 'scheduled' ? t('marketing.filterScheduled') : t('marketing.filterExpired')}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{p.expires}</td>
                                            <td>
                                                <DropdownMenu
                                                    trigger={
                                                        <button
                                                            className={styles.actionBtn}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    }
                                                    items={[
                                                        { label: t('marketing.editCode'), icon: <Tag size={14} />, onClick: () => { setSelectedPromo(p); setIsPromoEditOpen(true); } },
                                                        { label: t('marketing.delete'), destructive: true, icon: <Trash2 size={14} />, onClick: () => { setSelectedPromo(p); setIsPromoDeleteOpen(true); } },
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ─── Messages Tab ────────────────────────────────────── */}
            {activeTab === 'messages' && (
                <div className={styles.messageGrid}>
                    {messageTemplates
                        .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                        .map((msg) => (
                            <MessageCard
                                key={msg.id}
                                msg={msg}
                                onEdit={() => { setSelectedMsg(msg); setIsMsgEditOpen(true); }}
                                onDelete={() => { setSelectedMsg(msg); setIsMsgDeleteOpen(true); }}
                            />
                        ))}
                </div>
            )}

            {/* ─── Campaigns Tab ───────────────────────────────────── */}
            {activeTab === 'campaigns' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)', textAlign: 'center' }}>
                    <Send size={48} style={{ margin: '0 auto var(--space-4)', color: 'var(--text-tertiary)', opacity: 0.4 }} />
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                        {t('marketing.campaignBuilder')}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', maxWidth: 400, margin: '0 auto var(--space-4)' }}>
                        {t('marketing.campaignDesc')}
                    </div>
                    <button className={styles.btnPrimary} style={{ margin: '0 auto' }}>
                        <Zap size={16} style={{ marginInlineEnd: 4 }} /> {t('marketing.createFirstCamp')}
                    </button>
                </div>
            )}
            {/* ─── OFFER MODALS ─── */}
            <SlideOver
                open={isOfferAddOpen || isOfferEditOpen}
                onClose={() => { setIsOfferAddOpen(false); setIsOfferEditOpen(false); setSelectedOffer(null); }}
                title={isOfferEditOpen ? t('marketing.modal.editOffer') : t('marketing.modal.newOffer')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button variant="outline" style={{ flex: 1 }} onClick={() => { setIsOfferAddOpen(false); setIsOfferEditOpen(false); }}>{t('marketing.modal.cancel')}</Button>
                        <Button style={{ flex: 1 }} onClick={() => { setIsOfferAddOpen(false); setIsOfferEditOpen(false); addToast('success', isOfferEditOpen ? 'Offer updated successfully' : 'Offer created'); }}>
                            {isOfferEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('marketing.modal.offerName')} defaultValue={selectedOffer?.name} placeholder={t('marketing.modal.offerNamePh')} />
                    <Input label={t('marketing.modal.desc')} defaultValue={selectedOffer?.desc} />
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Input label={t('marketing.modal.discount')} defaultValue={selectedOffer?.discount} style={{ flex: 1 }} dir="ltr" />
                        <Input type="date" label={t('marketing.modal.validUntil')} defaultValue={selectedOffer?.validUntil ? new Date(selectedOffer.validUntil).toISOString().split('T')[0] : ''} style={{ flex: 1 }} />
                    </div>
                    <Select label={t('marketing.modal.status')} value={selectedOffer?.status || 'active'} options={[{ label: t('marketing.filterActive'), value: 'active' }, { label: t('marketing.filterDraft'), value: 'draft' }, { label: t('marketing.filterScheduled'), value: 'scheduled' }, { label: t('marketing.filterExpired'), value: 'expired' }]} />
                </div>
            </SlideOver>

            <Modal
                open={isOfferDeleteOpen}
                onClose={() => setIsOfferDeleteOpen(false)}
                title={t('marketing.modal.deleteOfferTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsOfferDeleteOpen(false)}>{t('marketing.modal.cancel')}</Button>
                        <Button variant="destructive" onClick={() => { setIsOfferDeleteOpen(false); addToast('error', 'Offer deleted permanently'); }}>{t('marketing.delete')}</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('marketing.modal.deleteOfferConfirm').replace('{name}', selectedOffer?.name || '')}</p>
            </Modal>

            {/* ─── PROMO CODE MODALS ─── */}
            <SlideOver
                open={isPromoAddOpen || isPromoEditOpen}
                onClose={() => { setIsPromoAddOpen(false); setIsPromoEditOpen(false); setSelectedPromo(null); }}
                title={isPromoEditOpen ? t('marketing.modal.editPromo') : t('marketing.modal.newPromo')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button variant="outline" style={{ flex: 1 }} onClick={() => { setIsPromoAddOpen(false); setIsPromoEditOpen(false); }}>{t('marketing.modal.cancel')}</Button>
                        <Button style={{ flex: 1 }} onClick={() => { setIsPromoAddOpen(false); setIsPromoEditOpen(false); addToast('success', isPromoEditOpen ? 'Promo code updated' : 'Promo code created'); }}>
                            {isPromoEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('marketing.modal.promoCode')} defaultValue={selectedPromo?.code} placeholder="e.g. SUMMER20" style={{ textTransform: 'uppercase' }} dir="ltr" />
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Select label={t('marketing.modal.type')} value={selectedPromo?.type || 'Percentage'} style={{ flex: 1 }} options={[{ label: t('marketing.modal.typePct'), value: 'Percentage' }, { label: t('marketing.modal.typeFixed'), value: 'Fixed' }]} />
                        <Input label={t('marketing.modal.value')} defaultValue={selectedPromo?.value} style={{ flex: 1 }} dir="ltr" />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <Input label={t('marketing.modal.minSpend')} type="number" defaultValue={selectedPromo?.minSpend} style={{ flex: 1 }} dir="ltr" />
                        <Input label={t('marketing.modal.maxUses')} type="number" defaultValue={selectedPromo?.maxUses} style={{ flex: 1 }} dir="ltr" />
                    </div>
                    <Input type="date" label={t('marketing.modal.expiryDate')} defaultValue={selectedPromo?.expires ? new Date(selectedPromo.expires).toISOString().split('T')[0] : ''} />
                    <Select label={t('marketing.modal.status')} value={selectedPromo?.status || 'active'} options={[{ label: t('marketing.filterActive'), value: 'active' }, { label: t('marketing.filterScheduled'), value: 'scheduled' }, { label: t('marketing.filterExpired'), value: 'expired' }]} />
                </div>
            </SlideOver>

            <Modal
                open={isPromoDeleteOpen}
                onClose={() => setIsPromoDeleteOpen(false)}
                title={t('marketing.modal.deletePromoTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsPromoDeleteOpen(false)}>{t('marketing.modal.cancel')}</Button>
                        <Button variant="destructive" onClick={() => { setIsPromoDeleteOpen(false); addToast('error', 'Promo code deleted'); }}>{t('marketing.delete')}</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('marketing.modal.deletePromoConfirm').replace('{code}', selectedPromo?.code || '')}</p>
            </Modal>

            {/* ─── MESSAGE TEMPLATE MODALS ─── */}
            <SlideOver
                open={isMsgAddOpen || isMsgEditOpen}
                onClose={() => { setIsMsgAddOpen(false); setIsMsgEditOpen(false); setSelectedMsg(null); }}
                title={isMsgEditOpen ? t('marketing.modal.editMsg') : t('marketing.modal.newMsg')}
                footer={
                    <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                        <Button variant="outline" style={{ flex: 1 }} onClick={() => { setIsMsgAddOpen(false); setIsMsgEditOpen(false); }}>{t('marketing.modal.cancel')}</Button>
                        <Button style={{ flex: 1 }} onClick={() => { setIsMsgAddOpen(false); setIsMsgEditOpen(false); addToast('success', isMsgEditOpen ? 'Template updated' : 'Template created'); }}>
                            {isMsgEditOpen ? t('marketing.modal.update') : t('marketing.modal.create')}
                        </Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input label={t('marketing.modal.msgName')} defaultValue={selectedMsg?.name} placeholder={t('marketing.modal.msgNamePh')} />
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-1)', display: 'block' }}>{t('marketing.modal.msgBody')}</label>
                        <textarea
                            defaultValue={selectedMsg?.body}
                            style={{ width: '100%', minHeight: 120, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', resize: 'vertical' }}
                            placeholder={t('marketing.modal.msgBodyPh')}
                            dir="auto"
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)', display: 'block' }}>{t('marketing.modal.channels')}</label>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                <input type="checkbox" defaultChecked={selectedMsg?.channels.includes('sms')} /> SMS
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                <input type="checkbox" defaultChecked={selectedMsg?.channels.includes('whatsapp')} /> WhatsApp
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                <input type="checkbox" defaultChecked={selectedMsg?.channels.includes('email')} /> Email
                            </label>
                        </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginTop: 'var(--space-2)' }}>
                        <input type="checkbox" defaultChecked={selectedMsg?.enabled ?? true} /> {t('marketing.modal.templateEnabled')}
                    </label>
                </div>
            </SlideOver>

            <Modal
                open={isMsgDeleteOpen}
                onClose={() => setIsMsgDeleteOpen(false)}
                title={t('marketing.modal.deleteMsgTitle')}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsMsgDeleteOpen(false)}>{t('marketing.modal.cancel')}</Button>
                        <Button variant="destructive" onClick={() => { setIsMsgDeleteOpen(false); addToast('error', 'Template deleted'); }}>{t('marketing.delete')}</Button>
                    </div>
                }
            >
                <p style={{ color: 'var(--text-secondary)' }}>{t('marketing.modal.deleteMsgConfirm')}</p>
            </Modal>
        </div>
    );
}

function MessageCard({ msg, onEdit, onDelete }: { msg: typeof messageTemplates[0], onEdit: () => void, onDelete: () => void }) {
    const [enabled, setEnabled] = useState(msg.enabled);
    const { t } = useTranslation();
    return (
        <div className={styles.messageCard}>
            <div className={styles.messageHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <DropdownMenu
                        trigger={
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0 }}
                            >
                                <MoreVertical size={16} />
                            </button>
                        }
                        items={[
                            { label: t('marketing.editTemplate'), icon: <MessageSquare size={14} />, onClick: onEdit },
                            { label: t('marketing.deleteTemplate'), destructive: true, icon: <Trash2 size={14} />, onClick: onDelete }
                        ]}
                    />
                    <div className={styles.messageTitle}>{msg.name}</div>
                </div>
                <div
                    className={styles.toggleSwitch}
                    style={{ background: enabled ? 'var(--color-primary-500)' : 'var(--color-gray-300)' }}
                    onClick={() => setEnabled(!enabled)}
                >
                    <div className={styles.toggleDot} style={{ left: enabled ? 23 : 3 }} />
                </div>
            </div>
            <div className={styles.messageBody}>{msg.body}</div>
            <div>
                {msg.channels.map((ch) => (
                    <span key={ch} className={`${styles.channelBadge} ${channelClass[ch]}`}>
                        {ch === 'sms' ? 'SMS' : ch === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </span>
                ))}
            </div>
        </div>
    );
}
