'use client';

import { egpLabel } from '@/lib/money';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { providerApi, type Customer } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const fallbackData = [
    {
        id: 1,
        client: 'Fatima Ali',
        group: 'VIP',
        opening: 0,
        credits: 2500,
        debits: 2180,
        closing: 320,
        lastTxn: '2026-03-21',
    },
    {
        id: 2,
        client: 'Rania Khalil',
        group: 'VIP',
        opening: 150,
        credits: 1200,
        debits: 1350,
        closing: 0,
        lastTxn: '2026-03-14',
    },
    {
        id: 3,
        client: 'Noura Ahmed',
        group: 'Regular',
        opening: 0,
        credits: 800,
        debits: 400,
        closing: 400,
        lastTxn: '2026-03-14',
    },
    {
        id: 4,
        client: 'Huda Saleh',
        group: 'VIP',
        opening: 200,
        credits: 600,
        debits: 800,
        closing: 0,
        lastTxn: '2026-03-23',
    },
    {
        id: 5,
        client: 'Maryam Ibrahim',
        group: 'Regular',
        opening: 0,
        credits: 350,
        debits: 200,
        closing: 150,
        lastTxn: '2026-03-24',
    },
    {
        id: 6,
        client: 'Sama Latif',
        group: 'Regular',
        opening: 0,
        credits: 520,
        debits: 520,
        closing: 0,
        lastTxn: '2026-03-25',
    },
    {
        id: 7,
        client: 'Dana Faris',
        group: 'New',
        opening: 0,
        credits: 1500,
        debits: 1000,
        closing: 500,
        lastTxn: '2026-03-23',
    },
    {
        id: 8,
        client: 'Lina Qasim',
        group: 'Regular',
        opening: 100,
        credits: 300,
        debits: 250,
        closing: 150,
        lastTxn: '2026-03-26',
    },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)' },
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
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
    },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
    },
    searchBox: { position: 'relative', flex: 1, maxWidth: 320 },
    searchIcon: {
        position: 'absolute',
        insetInlineStart: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
    },
    searchInput: {
        width: '100%',
        height: 40,
        paddingInlineStart: 40,
        paddingInlineEnd: 'var(--space-3)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
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
    exportBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2) var(--space-4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        background: 'var(--bg-primary)',
    },
};

export default function StatementsPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');

    const {
        data: apiCustomers,
        loading,
        error,
        refetch,
    } = useApiQuery<Customer[]>(
        // Live source: `/clients/statements` (per-client visits + charged/paid).
        () =>
            providerApi.getClientStatements().then(res => ({
                ...res,
                data: res.data?.map(
                    (srow): Customer => ({
                        uuid: srow.uuid,
                        name: srow.name,
                        email: srow.email,
                        phone: srow.phone ?? '',
                        group_uuid: null,
                        vip: false,
                        notes: null,
                        allergies: null,
                        medical_conditions: null,
                        medications: null,
                        total_visits: srow.total_bookings,
                        total_spent: srow.total_paid,
                        last_visit: srow.last_booking_date,
                        created_at: '',
                        updated_at: '',
                    })
                ),
            })),
        [],
        { fallbackData: fallbackData as never }
    );

    // Map API customers to statement shape, or use fallback
    const data =
        apiCustomers && apiCustomers.length > 0
            ? apiCustomers.map((c, i) => ({
                  id: i + 1,
                  client: c.name,
                  group: c.group?.name ?? 'Regular',
                  opening: 0,
                  credits: c.total_spent,
                  debits: c.total_spent,
                  closing: 0,
                  lastTxn: c.last_visit ?? '-',
              }))
            : fallbackData;

    const filtered = data.filter(d => d.client.toLowerCase().includes(search.toLowerCase()));
    const totalClosing = data.reduce((a, d) => a + d.closing, 0);

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' } as React.CSSProperties}>
            <div style={s.tabs as React.CSSProperties}>
                <Link href="/customers" style={s.tab as React.CSSProperties}>
                    {t('custGroups.tabClients')}
                </Link>
                <Link href="/customers/groups" style={s.tab as React.CSSProperties}>
                    {t('custGroups.tabGroups')}
                </Link>
                <Link href="/customers/statements" style={{ ...s.tab, ...s.tabActive } as React.CSSProperties}>
                    {t('custGroups.tabStatements')}
                </Link>
                <Link href="/customers/last-visits" style={s.tab as React.CSSProperties}>
                    {t('custGroups.tabLastVisits')}
                </Link>
            </div>

            <div style={s.kpis as React.CSSProperties}>
                <div style={s.kpi as React.CSSProperties}>
                    <div style={s.kpiVal as React.CSSProperties}>
                        {totalClosing.toLocaleString()} {egpLabel()}
                    </div>
                    <div style={s.kpiLbl as React.CSSProperties}>{t('custStmts.totalOut')}</div>
                </div>
                <div style={s.kpi as React.CSSProperties}>
                    <div style={s.kpiVal as React.CSSProperties}>{data.filter(d => d.closing > 0).length}</div>
                    <div style={s.kpiLbl as React.CSSProperties}>{t('custStmts.clientsBal')}</div>
                </div>
                <div style={s.kpi as React.CSSProperties}>
                    <div style={s.kpiVal as React.CSSProperties}>
                        {data.reduce((a, d) => a + d.credits, 0).toLocaleString()} {egpLabel()}
                    </div>
                    <div style={s.kpiLbl as React.CSSProperties}>{t('custStmts.totalCredits')}</div>
                </div>
            </div>

            <div style={s.toolbar as React.CSSProperties}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input
                        style={s.searchInput as React.CSSProperties}
                        placeholder={t('custStmts.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button style={s.exportBtn as React.CSSProperties}>
                    <Download size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} /> {t('custStmts.export')}
                </button>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={data}
                onRetry={refetch}
                emptyIcon={<FileText size={48} />}
                emptyTitle={t('custStmts.noStatements') || 'No statements found'}
                emptyDescription={
                    t('custStmts.noStatementsDesc') ||
                    'Customer financial statements will appear here as transactions occur.'
                }
                skeletonCount={5}
            >
                <table style={s.table as React.CSSProperties}>
                    <thead>
                        <tr>
                            {[
                                t('custStmts.colClient'),
                                t('custStmts.colGroup'),
                                t('custStmts.colOpening'),
                                t('custStmts.colCredits'),
                                t('custStmts.colDebits'),
                                t('custStmts.colClosing'),
                                t('custStmts.colLastTxn'),
                            ].map(h => (
                                <th key={h} style={s.th as React.CSSProperties}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(row => (
                            <tr key={row.id}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' } as React.CSSProperties}>
                                    {row.client}
                                </td>
                                <td style={s.td as React.CSSProperties}>{row.group}</td>
                                <td style={s.td as React.CSSProperties}>
                                    {row.opening} {egpLabel()}
                                </td>
                                <td style={{ ...s.td, color: 'var(--color-success)' } as React.CSSProperties} dir="ltr">
                                    +{row.credits} {egpLabel()}
                                </td>
                                <td style={{ ...s.td, color: 'var(--color-error)' } as React.CSSProperties} dir="ltr">
                                    -{row.debits} {egpLabel()}
                                </td>
                                <td
                                    style={
                                        {
                                            ...s.td,
                                            fontWeight: 'var(--font-bold)',
                                            color: row.closing > 0 ? 'var(--color-warning)' : 'var(--color-success)',
                                        } as React.CSSProperties
                                    }
                                    dir="ltr"
                                >
                                    {row.closing} {egpLabel()}
                                </td>
                                <td style={s.td as React.CSSProperties}>{row.lastTxn}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataGuard>
        </div>
    );
}
