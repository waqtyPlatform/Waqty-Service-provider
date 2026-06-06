'use client';

import { egpLabel } from '@/lib/money';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { returnApi, type Return } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackEntries = [
    {
        id: 'PC-001',
        date: '2026-03-20',
        category: 'Cleaning Supplies',
        description: 'Towels & Disinfectant',
        vendor: 'CleanCo',
        amount: 180,
    },
    {
        id: 'PC-002',
        date: '2026-03-26',
        category: 'Office Supplies',
        description: 'Paper, Ink Cartridge',
        vendor: 'OfficeMax',
        amount: 95,
    },
    {
        id: 'PC-004',
        date: '2026-03-13',
        category: 'Maintenance',
        description: 'AC Filter Replacement',
        vendor: 'CoolTech',
        amount: 350,
    },
    {
        id: 'PC-005',
        date: '2026-03-22',
        category: 'Beauty Products',
        description: 'Hair Color Tubes x10',
        vendor: "L'Oreal Pro",
        amount: 450,
    },
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

export default function PettyCashRefundPage() {
    const { t, lang } = useTranslation();
    const [selected, setSelected] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // API: fetch returns of type petty_cash_refund
    const {
        data: apiReturns,
        loading: returnsLoading,
        error: returnsError,
        refetch: refetchReturns,
    } = useApiQuery<Return[]>(() => returnApi.getReturns({ type: 'petty_cash_refund' }) as never, [], {
        fallbackData: fallbackEntries as never,
    });

    const entries = fallbackEntries;
    const filtered = entries.filter(
        e =>
            e.description.toLowerCase().includes(search.toLowerCase()) ||
            e.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleProcessRefund = async () => {
        if (selected === null) return;
        setSubmitting(true);
        try {
            await returnApi.createReturn({
                type: 'petty_cash_refund',
                entry_id: entries[selected].id,
                amount: entries[selected].amount,
                reason: 'Item returned',
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
                        style={{ ...s.tab, ...(tab.href === '/returns/petty-cash-refund' ? s.tabActive : {}) }}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            <div>
                <div style={s.title}>{t('rtn.pettyTitle')}</div>
                <div style={s.desc}>{t('rtn.pettyDesc')}</div>
            </div>

            {selected === null ? (
                <>
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input
                            style={s.searchInput}
                            placeholder={t('rtn.searchIdDesc')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <DataGuard
                        loading={returnsLoading}
                        error={returnsError}
                        data={filtered}
                        emptyIcon={<Search size={48} />}
                        emptyTitle={t('rtn.pettyTitle')}
                        emptyDescription={t('rtn.noPettyEntriesFound')}
                        onRetry={refetchReturns}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {filtered.map((entry, i) => (
                                <div key={entry.id} style={s.card} onClick={() => setSelected(i)}>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-semibold)',
                                                color: 'var(--color-primary-600)',
                                            }}
                                        >
                                            {entry.id}
                                        </div>
                                        <div style={{ fontWeight: 'var(--font-medium)' }}>{entry.description}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {entry.date} · {entry.category} · {entry.vendor}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <div
                                            style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}
                                            dir="ltr"
                                        >
                                            {entry.amount} {egpLabel()}
                                        </div>
                                        <ChevronRight
                                            size={18}
                                            style={{
                                                color: 'var(--text-tertiary)',
                                                transform: lang === 'ar' ? 'scaleX(-1)' : 'none',
                                            }}
                                        />
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
                        {t('rtn.tabPetty')}: {entries[selected].description}
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
                            <strong>{t('rtn.lblID')}:</strong> {entries[selected].id}
                        </div>
                        <div>
                            <strong>{t('rtn.lblCategory')}:</strong> {entries[selected].category}
                        </div>
                        <div>
                            <strong>{t('rtn.lblVendor')}:</strong> {entries[selected].vendor}
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                            <strong>{t('rtn.thAmount')}:</strong>{' '}
                            <span dir="ltr">
                                {entries[selected].amount} {egpLabel()}
                            </span>
                        </div>
                    </div>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={s.label}>{t('rtn.lblReasonRefund')}</label>
                        <select style={s.select}>
                            <option>{t('rtn.optItemReturned')}</option>
                            <option>{t('rtn.optDupEntry')}</option>
                            <option>{t('rtn.optWrongAmount')}</option>
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
                        <button style={s.submitBtn} disabled={submitting} onClick={handleProcessRefund}>
                            {t('rtn.btnProcessRefund')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
