'use client';

import React from 'react';
import { Wallet, TrendingUp, Receipt, Scissors } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { formatMoney } from '@/lib/money';
import { payouts, platformCommissions, summary } from '@/mocks/finance';
import type { PayoutStatus } from '@/lib/contract';

const statusColor: Record<PayoutStatus, 'success' | 'info' | 'neutral' | 'error'> = {
    paid: 'success',
    pending: 'info',
    processing: 'neutral',
    failed: 'error',
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    head: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    hero: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        padding: 'var(--space-5)',
        background: 'var(--color-primary-500)',
        borderRadius: 'var(--radius-xl)',
        color: 'white',
    },
    heroLabel: { fontSize: 'var(--text-xs)', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' },
    heroValue: { fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginTop: 4 },
    statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    statCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-4)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
    },
    statLabel: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    statValue: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    sectionTitle: { fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
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

function statusLabel(t: (k: string) => string, status: PayoutStatus): string {
    return t(`settle.status${status.charAt(0).toUpperCase()}${status.slice(1)}`);
}

export default function SettlementPage() {
    const { t } = useTranslation();
    const latest = payouts[0] ?? null;
    const hasData = platformCommissions.length > 0;

    const stats = [
        { icon: <TrendingUp size={18} />, label: t('settle.grossBookings'), value: summary.gross_bookings },
        { icon: <Scissors size={18} />, label: t('settle.commission'), value: summary.commission_total },
        { icon: <Receipt size={18} />, label: t('settle.fees'), value: summary.transaction_fees_total },
        { icon: <Wallet size={18} />, label: t('settle.yourNet'), value: summary.provider_net_total },
    ];

    return (
        <div style={s.page}>
            <div style={s.head}>
                <span style={s.title}>{t('settle.title')}</span>
                <span style={s.subtitle}>{t('settle.subtitle')}</span>
            </div>

            {!hasData ? (
                <div style={s.empty}>
                    <Wallet size={48} style={{ opacity: 0.4 }} />
                    <div
                        style={{
                            fontWeight: 'var(--font-semibold)',
                            marginTop: 'var(--space-3)',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        {t('settle.empty')}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>
                        {t('settle.emptyDesc')}
                    </div>
                </div>
            ) : (
                <>
                    {latest && (
                        <div style={s.hero}>
                            <div>
                                <div style={s.heroLabel}>
                                    {t('settle.netThisPeriod')} · {latest.period_start.slice(0, 7)}
                                </div>
                                <div style={s.heroValue}>{formatMoney(latest.net_payable)}</div>
                            </div>
                            <Badge color={statusColor[latest.status]}>{statusLabel(t, latest.status)}</Badge>
                        </div>
                    )}

                    <div style={s.statGrid}>
                        {stats.map(st => (
                            <div key={st.label} style={s.statCard}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-2)',
                                        color: 'var(--text-tertiary)',
                                    }}
                                >
                                    {st.icon}
                                    <span style={s.statLabel as React.CSSProperties}>{st.label}</span>
                                </div>
                                <span style={s.statValue}>{formatMoney(st.value)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Payouts per period */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <span style={s.sectionTitle}>{t('settle.payouts')}</span>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    {[
                                        t('settle.period'),
                                        t('settle.gross'),
                                        t('settle.commission'),
                                        t('settle.fees'),
                                        t('settle.netPayable'),
                                        t('settle.status'),
                                    ].map((h, i) => (
                                        <th key={i} style={s.th as React.CSSProperties}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map(p => (
                                    <tr key={p.uuid}>
                                        <td style={s.td}>{p.period_start.slice(0, 7)}</td>
                                        <td style={s.td}>{formatMoney(p.gross)}</td>
                                        <td style={{ ...s.td, color: 'var(--color-error)' }}>
                                            −{formatMoney(p.commission_total)}
                                        </td>
                                        <td style={{ ...s.td, color: 'var(--color-error)' }}>
                                            −{formatMoney(p.fees_total)}
                                        </td>
                                        <td
                                            style={{
                                                ...s.td,
                                                fontWeight: 'var(--font-bold)',
                                                color: 'var(--color-primary-600)',
                                            }}
                                        >
                                            {formatMoney(p.net_payable)}
                                        </td>
                                        <td style={s.td}>
                                            <Badge color={statusColor[p.status]} size="sm">
                                                {statusLabel(t, p.status)}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Per-booking commission ledger */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <span style={s.sectionTitle}>{t('settle.ledger')}</span>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    {[
                                        t('settle.visit'),
                                        t('settle.date'),
                                        t('settle.gross'),
                                        t('settle.rate'),
                                        t('settle.commissionCol'),
                                        t('settle.yourNet'),
                                    ].map((h, i) => (
                                        <th key={i} style={s.th as React.CSSProperties}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {platformCommissions.map(c => (
                                    <tr key={c.uuid}>
                                        <td style={{ ...s.td, fontFamily: 'monospace' }}>{c.visit_uuid}</td>
                                        <td style={s.td}>{c.period}</td>
                                        <td style={s.td}>{formatMoney(c.gross_amount)}</td>
                                        <td style={s.td}>{Math.round(c.commission_rate * 100)}%</td>
                                        <td style={{ ...s.td, color: 'var(--color-error)' }}>
                                            −{formatMoney(c.commission_amount)}
                                        </td>
                                        <td
                                            style={{
                                                ...s.td,
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--color-primary-600)',
                                            }}
                                        >
                                            {formatMoney(c.provider_net)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
