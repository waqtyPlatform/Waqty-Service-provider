'use client';

import React, { useState } from 'react';
import { Plus, Megaphone, Star, Search as SearchIcon, Pause, Play, Trash2 } from 'lucide-react';
import { Modal, Button, Select, Input, Badge, useToast } from '@/components/ui';
import MarketingTabs from '@/components/MarketingTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney, toMinor } from '@/lib/money';
import type { AdPlacement, AdType, AdStatus } from '@/lib/contract';
import { PROVIDER_UUID } from '@/mocks/visits';

// Platform rate card — what a provider pays for each placement (30-day cycle).
// `placement` strings match SuperAdmin's taxonomy so the purchase reconciles into
// the platform's "Ad Revenue" view. Prices are stored as canonical minor units.
interface RateOption {
    key: string;
    type: AdType;
    placement: string;
    priceMajor: number;
}
const RATE_CARD: RateOption[] = [
    { key: 'home_top', type: 'banner', placement: 'home_top', priceMajor: 15000 },
    { key: 'category', type: 'banner', placement: 'category:salon', priceMajor: 8000 },
    { key: 'featured', type: 'featured', placement: 'search_top', priceMajor: 25000 },
    { key: 'top_search', type: 'top_search', placement: 'search_top', priceMajor: 20000 },
];
const DURATION_DAYS = 30;

const statusColor: Record<AdStatus, 'success' | 'info' | 'neutral' | 'error'> = {
    active: 'success',
    scheduled: 'info',
    paused: 'neutral',
    ended: 'neutral',
};

const seedAds: AdPlacement[] = [
    {
        uuid: 'adp-1',
        provider_uuid: PROVIDER_UUID,
        type: 'banner',
        placement: 'home_top',
        start_date: '2026-05-01',
        end_date: '2026-05-31',
        price: 1500000,
        currency: 'EGP',
        status: 'active',
        created_at: '2026-04-28T10:00:00Z',
    },
    {
        uuid: 'adp-2',
        provider_uuid: PROVIDER_UUID,
        type: 'featured',
        placement: 'search_top',
        start_date: '2026-06-01',
        end_date: '2026-06-30',
        price: 2500000,
        currency: 'EGP',
        status: 'scheduled',
        created_at: '2026-05-20T10:00:00Z',
    },
    {
        uuid: 'adp-3',
        provider_uuid: PROVIDER_UUID,
        type: 'banner',
        placement: 'between_listings',
        start_date: '2026-03-01',
        end_date: '2026-03-31',
        price: 600000,
        currency: 'EGP',
        status: 'ended',
        created_at: '2026-02-25T10:00:00Z',
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    head: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' },
    headText: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    addBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-5)',
        background: 'var(--color-primary-500)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        padding: 'var(--space-4)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
    },
    kpiLabel: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    kpiValue: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'left',
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
    empty: {
        padding: 'var(--space-8)',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
    },
};

export default function AdsPage() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const [ads, setAds] = useState<AdPlacement[]>(seedAds);
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const [rateKey, setRateKey] = useState(RATE_CARD[0].key);
    const [startDate, setStartDate] = useState('');

    const typeLabel: Record<AdType, string> = {
        banner: t('mktAds.typeBanner'),
        featured: t('mktAds.typeFeatured'),
        top_search: t('mktAds.typeTopSearch'),
    };
    const statusLabel = (st: AdStatus) => t(`mktAds.status${st.charAt(0).toUpperCase()}${st.slice(1)}`);

    const selectedRate = RATE_CARD.find(r => r.key === rateKey) ?? RATE_CARD[0];

    const activeCount = ads.filter(a => a.status === 'active').length;
    const totalSpend = ads
        .filter(a => a.status === 'active' || a.status === 'scheduled')
        .reduce((sum, a) => sum + a.price, 0);

    const addDays = (iso: string, days: number) =>
        new Date(new Date(iso).getTime() + days * 86400000).toISOString().slice(0, 10);

    const handlePurchase = () => {
        const today = new Date().toISOString().slice(0, 10);
        const start = startDate || today;
        const status: AdStatus = start <= today ? 'active' : 'scheduled';
        const placement: AdPlacement = {
            uuid: `adp-${ads.length + 1}-${start}`,
            provider_uuid: PROVIDER_UUID,
            type: selectedRate.type,
            placement: selectedRate.placement,
            start_date: start,
            end_date: addDays(start, DURATION_DAYS),
            price: toMinor(selectedRate.priceMajor),
            currency: 'EGP',
            status,
            created_at: new Date().toISOString(),
        };
        setAds(prev => [placement, ...prev]);
        setIsBuyOpen(false);
        setStartDate('');
        addToast('success', t('mktAds.purchased'));
    };

    const toggleStatus = (uuid: string) => {
        setAds(prev =>
            prev.map(a =>
                a.uuid === uuid
                    ? { ...a, status: a.status === 'active' ? ('paused' as const) : ('active' as const) }
                    : a
            )
        );
    };
    const cancelAd = (uuid: string) => {
        setAds(prev => prev.map(a => (a.uuid === uuid ? { ...a, status: 'ended' as const } : a)));
    };

    return (
        <div style={s.page}>
            <MarketingTabs />
            <div style={s.head}>
                <div style={s.headText}>
                    <span style={s.title}>{t('mktAds.title')}</span>
                    <span style={s.subtitle}>{t('mktAds.subtitle')}</span>
                </div>
                <button style={s.addBtn} onClick={() => setIsBuyOpen(true)}>
                    <Plus size={16} /> {t('mktAds.buy')}
                </button>
            </div>

            <div style={s.kpiGrid}>
                <div style={s.kpiCard}>
                    <span style={s.kpiLabel as React.CSSProperties}>{t('mktAds.activePlacements')}</span>
                    <span style={s.kpiValue}>{activeCount}</span>
                </div>
                <div style={s.kpiCard}>
                    <span style={s.kpiLabel as React.CSSProperties}>{t('mktAds.totalSpend')}</span>
                    <span style={s.kpiValue}>{formatMoney(totalSpend)}</span>
                </div>
            </div>

            {ads.length === 0 ? (
                <div style={s.empty}>
                    <Megaphone size={48} style={{ opacity: 0.4 }} />
                    <div
                        style={{
                            fontWeight: 'var(--font-semibold)',
                            marginTop: 'var(--space-3)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        {t('mktAds.empty')}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                        {t('mktAds.emptyDesc')}
                    </div>
                </div>
            ) : (
                <table style={s.table}>
                    <thead>
                        <tr>
                            {[
                                t('mktAds.type'),
                                t('mktAds.placement'),
                                t('mktAds.period'),
                                t('mktAds.price'),
                                t('mktAds.status'),
                                '',
                            ].map((h, i) => (
                                <th key={i} style={s.th as React.CSSProperties}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ads.map(a => (
                            <tr key={a.uuid}>
                                <td style={s.td}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        {a.type === 'banner' ? (
                                            <Megaphone size={14} />
                                        ) : a.type === 'featured' ? (
                                            <Star size={14} />
                                        ) : (
                                            <SearchIcon size={14} />
                                        )}
                                        {typeLabel[a.type]}
                                    </span>
                                </td>
                                <td style={{ ...s.td, fontFamily: 'monospace' }}>{a.placement}</td>
                                <td style={s.td}>
                                    {a.start_date} → {a.end_date}
                                </td>
                                <td
                                    style={{
                                        ...s.td,
                                        fontWeight: 'var(--font-bold)',
                                        color: 'var(--color-primary-600)',
                                    }}
                                >
                                    {formatMoney(a.price)}
                                </td>
                                <td style={s.td}>
                                    <Badge color={statusColor[a.status]} size="sm">
                                        {statusLabel(a.status)}
                                    </Badge>
                                </td>
                                <td style={{ ...s.td, textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: 4 }}>
                                        {(a.status === 'active' || a.status === 'paused') && (
                                            <button
                                                title={a.status === 'active' ? t('mktAds.pause') : t('mktAds.resume')}
                                                onClick={() => toggleStatus(a.uuid)}
                                                style={{
                                                    padding: '4px 8px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 6,
                                                    background: 'var(--bg-primary)',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {a.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                        )}
                                        {a.status !== 'ended' && (
                                            <button
                                                title={t('mktAds.cancel')}
                                                onClick={() => cancelAd(a.uuid)}
                                                style={{
                                                    padding: '4px 8px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 6,
                                                    background: 'var(--bg-primary)',
                                                    color: 'var(--color-error)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal
                open={isBuyOpen}
                onClose={() => setIsBuyOpen(false)}
                title={t('mktAds.buy')}
                footer={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <span style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-primary-600)' }}>
                            {formatMoney(toMinor(selectedRate.priceMajor))} · {t('mktAds.30days')}
                        </span>
                        <Button onClick={handlePurchase}>{t('mktAds.purchase')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Select
                        label={t('mktAds.choosePlacement')}
                        value={rateKey}
                        onChange={e => setRateKey(e.target.value)}
                        options={RATE_CARD.map(r => ({
                            value: r.key,
                            label: `${typeLabel[r.type]} · ${r.placement} — ${formatMoney(toMinor(r.priceMajor))}`,
                        }))}
                    />
                    <Input
                        label={t('mktAds.startDate')}
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
}
