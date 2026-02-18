'use client';

import React, { useState } from 'react';
import {
    Search,
    Plus,
    Megaphone,
    Tag,
    MessageSquare,
    Gift,
    Users,
    Percent,
    Calendar,
    Clock,
    Eye,
    ShoppingCart,
    MoreVertical,
    Zap,
    TrendingUp,
    Send,
} from 'lucide-react';
import styles from './marketing.module.css';

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
    const [activeTab, setActiveTab] = useState<TabKey>('offers');
    const [search, setSearch] = useState('');

    return (
        <div className={styles.marketingPage}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>Marketing</h1>
                    <p>Offers, promo codes, campaigns, and messaging.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnPrimary}>
                        <Plus size={16} />
                        {activeTab === 'offers' ? 'New Offer' : activeTab === 'promos' ? 'New Promo Code' : activeTab === 'messages' ? 'New Template' : 'New Campaign'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'offers' ? styles.tabActive : ''}`} onClick={() => setActiveTab('offers')}>
                    <Gift size={16} /> Offers
                </button>
                <button className={`${styles.tab} ${activeTab === 'promos' ? styles.tabActive : ''}`} onClick={() => setActiveTab('promos')}>
                    <Tag size={16} /> Promo Codes
                </button>
                <button className={`${styles.tab} ${activeTab === 'messages' ? styles.tabActive : ''}`} onClick={() => setActiveTab('messages')}>
                    <MessageSquare size={16} /> Messages
                </button>
                <button className={`${styles.tab} ${activeTab === 'campaigns' ? styles.tabActive : ''}`} onClick={() => setActiveTab('campaigns')}>
                    <Megaphone size={16} /> Campaigns
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
                        <div className={styles.kpiLabel}>Active Offers</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        <Tag size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>{promoCodes.filter(p => p.status === 'active').length}</div>
                        <div className={styles.kpiLabel}>Active Codes</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                        <ShoppingCart size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue}>207</div>
                        <div className={styles.kpiLabel}>Redemptions (Mo)</div>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIcon} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>+18.3%</div>
                        <div className={styles.kpiLabel}>Conversion Rate</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder={`Search ${activeTab}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className={styles.selectFilter}>
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="expired">Expired</option>
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
                                        <span className={styles.metaItem}><Calendar size={12} /> Until {offer.validUntil}</span>
                                        <span className={styles.metaItem}><Eye size={12} /> {offer.views} views</span>
                                        <span className={styles.metaItem}><ShoppingCart size={12} /> {offer.uses} used</span>
                                    </div>
                                    <div className={styles.offerFooter}>
                                        <span className={`${styles.statusBadge} ${statusClass[offer.status]}`}>
                                            {offer.status === 'active' && <Zap size={10} />}
                                            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                        </span>
                                        <span className={styles.statChip}>
                                            <strong>{offer.uses}</strong> / ∞ uses
                                        </span>
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
                                <th>Code</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Min Spend</th>
                                <th>Usage</th>
                                <th>Status</th>
                                <th>Expires</th>
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
                                                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{p.expires}</td>
                                            <td><button className={styles.actionBtn}><MoreVertical size={16} /></button></td>
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
                            <MessageCard key={msg.id} msg={msg} />
                        ))}
                </div>
            )}

            {/* ─── Campaigns Tab ───────────────────────────────────── */}
            {activeTab === 'campaigns' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)', textAlign: 'center' }}>
                    <Send size={48} style={{ margin: '0 auto var(--space-4)', color: 'var(--text-tertiary)', opacity: 0.4 }} />
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                        Campaign Builder
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', maxWidth: 400, margin: '0 auto var(--space-4)' }}>
                        Create targeted campaigns with audience segmentation, A/B testing, and performance tracking. Coming soon!
                    </div>
                    <button className={styles.btnPrimary} style={{ margin: '0 auto' }}>
                        <Zap size={16} /> Create First Campaign
                    </button>
                </div>
            )}
        </div>
    );
}

function MessageCard({ msg }: { msg: typeof messageTemplates[0] }) {
    const [enabled, setEnabled] = useState(msg.enabled);
    return (
        <div className={styles.messageCard}>
            <div className={styles.messageHeader}>
                <div className={styles.messageTitle}>{msg.name}</div>
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
