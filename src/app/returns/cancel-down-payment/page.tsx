'use client';

import { egpLabel } from '@/lib/money';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { returnApi, type Return } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackBookings = [
    {
        id: 'BK-1042',
        client: 'Fatima Ali',
        service: 'Bridal Glow Package',
        date: '2026-03-17',
        paid: 1000,
        total: 2500,
    },
    { id: 'BK-1038', client: 'Noura Ahmed', service: 'Keratin + Color', date: '2026-03-13', paid: 600, total: 1200 },
    { id: 'BK-1030', client: 'Huda Saleh', service: 'Relaxation Retreat', date: '2026-03-16', paid: 400, total: 800 },
    { id: 'BK-1028', client: 'Maryam Ibrahim', service: 'Deep Tissue x3', date: '2026-03-22', paid: 200, total: 600 },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabBar: {
        display: 'flex',
        gap: 'var(--space-1)',
        borderBottom: '2px solid var(--border-color)',
        overflowX: 'auto',
    },
    tab: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        color: 'var(--text-tertiary)',
        borderBottom: '2px solid transparent',
        marginBottom: '-2px',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
    },
    tabActive: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    desc: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
    searchBox: { position: 'relative', maxWidth: 400 },
    searchIcon: {
        position: 'absolute',
        insetInlineStart: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
    },
    searchInput: {
        width: '100%',
        height: 42,
        paddingInlineStart: 40,
        paddingInlineEnd: 'var(--space-3)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    form: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        maxWidth: 500,
    },
    label: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        marginBottom: 'var(--space-2)',
        display: 'block',
    },
    select: {
        width: '100%',
        height: 42,
        padding: '0 var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
    },
    textarea: {
        width: '100%',
        minHeight: 80,
        padding: 'var(--space-3) var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        resize: 'vertical',
    },
    warning: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: 'var(--color-warning-light)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
    submitBtn: {
        padding: 'var(--space-3) var(--space-6)',
        background: 'var(--color-error)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-sm)',
        marginTop: 'var(--space-4)',
    },
};

export default function CancelDownPaymentPage() {
    const { t, lang } = useTranslation();
    const [selected, setSelected] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // API: fetch returns of type cancel_down_payment
    const {
        data: apiReturns,
        loading: returnsLoading,
        error: returnsError,
        refetch: refetchReturns,
    } = useApiQuery<Return[]>(() => returnApi.getReturns({ type: 'cancel_down_payment' }) as never, [], {
        fallbackData: fallbackBookings as never,
    });

    const bookings = fallbackBookings;
    const filtered = bookings.filter(
        b => b.client.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleCancelRefund = async () => {
        if (selected === null) return;
        setSubmitting(true);
        try {
            await returnApi.createReturn({
                type: 'cancel_down_payment',
                booking_id: bookings[selected].id,
                amount: bookings[selected].paid,
                reason: 'Client request',
            });
            refetchReturns();
            setSelected(null);
        } catch {
            setSelected(null);
        } finally {
            setSubmitting(false);
        }
    };

    const translatedTabs = [
        { label: t('rtn.tabList'), href: '/returns' },
        { label: t('rtn.tabCash'), href: '/returns/cash-refund' },
        { label: t('rtn.tabPetty'), href: '/returns/petty-cash-refund' },
        { label: t('rtn.tabCancelAdvance'), href: '/returns/cancel-down-payment' },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {translatedTabs.map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{ ...s.tab, ...(tab.href === '/returns/cancel-down-payment' ? s.tabActive : {}) }}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            <div>
                <div style={s.title}>{t('rtn.cancelTitle')}</div>
                <div style={s.desc}>{t('rtn.cancelDesc')}</div>
            </div>

            {selected === null ? (
                <>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input
                            style={s.searchInput}
                            placeholder={t('rtn.searchBkClient')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <DataGuard
                        loading={returnsLoading}
                        error={returnsError}
                        data={filtered}
                        emptyIcon={<Search size={48} />}
                        emptyTitle={t('rtn.cancelTitle')}
                        emptyDescription={t('rtn.noBookingsFound')}
                        onRetry={refetchReturns}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {filtered.map((bk, i) => (
                                <div key={bk.id} style={s.card} onClick={() => setSelected(i)}>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--color-primary-600)',
                                            }}
                                        >
                                            {bk.id}
                                        </div>
                                        <div style={{ fontWeight: 'var(--font-medium)' }}>{bk.client}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {bk.service} · {t('rtn.lblScheduled')}: {bk.date}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'end' }}>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 'var(--font-bold)',
                                                color: 'var(--color-warning)',
                                            }}
                                            dir="ltr"
                                        >
                                            {bk.paid} {egpLabel()} {t('rtn.lblPaid')}
                                        </div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {t('rtn.lblOfTotal').replace('{total}', `${bk.total} ${egpLabel()}`)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DataGuard>
                </>
            ) : (
                <div style={s.form}>
                    <div
                        style={{
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-semibold)',
                            marginBottom: 'var(--space-4)',
                        }}
                    >
                        {t('rtn.tabCancelAdvance')}: {bookings[selected].id}
                    </div>
                    <div
                        style={{
                            padding: 'var(--space-3)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-4)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        <div>
                            <strong>{t('rtn.thClient')}:</strong> {bookings[selected].client}
                        </div>
                        <div>
                            <strong>{t('rtn.lblService')}:</strong> {bookings[selected].service}
                        </div>
                        <div>
                            <strong>{t('rtn.lblScheduled')}:</strong> {bookings[selected].date}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                            <strong>{t('rtn.lblDownPayment')}:</strong>{' '}
                            <span dir="ltr">
                                {bookings[selected].paid} {egpLabel()}
                            </span>
                        </div>
                    </div>
                    <div style={s.warning}>
                        <AlertTriangle
                            size={18}
                            style={{
                                color: 'var(--color-warning)',
                                flexShrink: 0,
                                marginTop: 2,
                                marginInlineEnd: 'var(--space-3)',
                            }}
                        />
                        <div>
                            {t('rtn.warnCancel1')}{' '}
                            <span dir="ltr">
                                {bookings[selected].paid} {egpLabel()}
                            </span>{' '}
                            {t('rtn.warnCancel2')}
                        </div>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>{t('rtn.lblCancelReason')}</label>
                        <select style={s.select}>
                            <option>{t('rtn.optClientReq')}</option>
                            <option>{t('rtn.optConflict')}</option>
                            <option>{t('rtn.optUnavail')}</option>
                            <option>{t('rtn.optOther')}</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>{t('rtn.lblNotes')}</label>
                        <textarea style={s.textarea as React.CSSProperties} placeholder={t('rtn.phNotes')} />
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button
                            style={{ ...s.submitBtn, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                            onClick={() => setSelected(null)}
                        >
                            {lang === 'ar' ? '→' : '←'} {t('rtn.btnBack')}
                        </button>
                        <button style={s.submitBtn} disabled={submitting} onClick={handleCancelRefund}>
                            {t('rtn.btnCancelRefund')}{' '}
                            <span dir="ltr">
                                {bookings[selected].paid} {egpLabel()}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
