'use client';

import { egpLabel } from '@/lib/money';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Users } from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { transactionApi } from '@/lib/api';
import { DataGuard } from '@/components/DataGuard';

const tabs = [
    { labelKey: 'txn.tabLog', href: '/transactions' },
    { labelKey: 'txn.tabCashSales', href: '/transactions/cash-sales' },
    { labelKey: 'txn.tabAdvance', href: '/transactions/advance-payments' },
    { labelKey: 'txn.tabPettyCash', href: '/transactions/petty-cash' },
    { labelKey: 'txn.tabTransfers', href: '/transactions/transfers' },
    { labelKey: 'txn.tabSafeBalances', href: '/transactions/safe-balances' },
    { labelKey: 'txn.tabShifts', href: '/transactions/shifts' },
    { labelKey: 'txn.tabDailies', href: '/transactions/dailies' },
    { labelKey: 'txn.tabBestSales', href: '/transactions/best-sales' },
    { labelKey: 'txn.tabClientSales', href: '/transactions/client-sales' },
    { labelKey: 'txn.tabPackageSales', href: '/transactions/package-sales' },
];

interface ClientSalesRecord {
    id: number;
    name: string;
    group: string;
    visits: number;
    totalSpend: number;
    avgTicket: number;
    lastVisit: string;
    topService: string;
}

const fallbackData: ClientSalesRecord[] = [
    {
        id: 1,
        name: 'Fatima Ali',
        group: 'VIP',
        visits: 47,
        totalSpend: 12400,
        avgTicket: 264,
        lastVisit: '2026-03-12',
        topService: 'Hair Coloring',
    },
    {
        id: 2,
        name: 'Rania Khalil',
        group: 'VIP',
        visits: 38,
        totalSpend: 9800,
        avgTicket: 258,
        lastVisit: '2026-03-13',
        topService: 'Keratin Treatment',
    },
    {
        id: 3,
        name: 'Noura Ahmed',
        group: 'Regular',
        visits: 32,
        totalSpend: 8200,
        avgTicket: 256,
        lastVisit: '2026-03-26',
        topService: 'Swedish Massage',
    },
    {
        id: 4,
        name: 'Huda Saleh',
        group: 'VIP',
        visits: 28,
        totalSpend: 7500,
        avgTicket: 268,
        lastVisit: '2026-03-22',
        topService: 'HydraFacial',
    },
    {
        id: 5,
        name: 'Maryam Ibrahim',
        group: 'Regular',
        visits: 24,
        totalSpend: 5400,
        avgTicket: 225,
        lastVisit: '2026-03-15',
        topService: 'Classic Facial',
    },
    {
        id: 6,
        name: 'Sama Latif',
        group: 'Regular',
        visits: 19,
        totalSpend: 4200,
        avgTicket: 221,
        lastVisit: '2026-03-25',
        topService: 'Gel Manicure',
    },
    {
        id: 7,
        name: 'Dana Faris',
        group: 'New',
        visits: 8,
        totalSpend: 2100,
        avgTicket: 263,
        lastVisit: '2026-03-20',
        topService: 'Deep Tissue',
    },
    {
        id: 8,
        name: 'Lina Qasim',
        group: 'Regular',
        visits: 15,
        totalSpend: 3600,
        avgTicket: 240,
        lastVisit: '2026-03-24',
        topService: 'Pedicure',
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
    badge: {
        display: 'inline-flex',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
    },
    bar: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', width: 80 },
    barFill: { height: '100%', borderRadius: 3, background: 'var(--color-primary-500)' },
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

const groupColors: Record<string, { bg: string; color: string }> = {
    VIP: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    Regular: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
    New: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
};

export default function ClientSalesPage() {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState('');

    const {
        data: clientSalesData,
        loading,
        error,
        refetch,
    } = useApiQuery<ClientSalesRecord[]>(() => transactionApi.getClientSales() as never, [], {
        fallbackData: fallbackData,
    });

    const data = (clientSalesData ?? []) as ClientSalesRecord[];
    const maxSpend = data[0]?.totalSpend ?? 1;
    const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{ ...s.tab, ...(tab.href === '/transactions/client-sales' ? s.tabActive : {}) }}
                    >
                        {t(tab.labelKey)}
                    </Link>
                ))}
            </div>

            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input
                        style={s.searchInput}
                        placeholder={t('txn.client.search')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button style={s.exportBtn}>
                    <Download size={16} /> {t('txn.export')}
                </button>
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={filtered}
                onRetry={refetch}
                emptyIcon={<Users size={48} />}
                emptyTitle={t('txn.client.emptyTitle') || 'No client sales'}
                emptyDescription={t('txn.client.emptyDesc') || 'Client sales data will appear here.'}
            >
                <table style={s.table}>
                    <thead>
                        <tr>
                            {[
                                'txn.thClient',
                                'txn.client.thGroup',
                                'txn.client.thVisits',
                                'txn.client.thTotalSpend',
                                '',
                                'txn.client.thAvgTicket',
                                'txn.client.thTopService',
                                'txn.client.thLastVisit',
                            ].map((h, i) => (
                                <th key={i} style={s.th as React.CSSProperties}>
                                    {h ? t(h) : ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(row => (
                            <tr key={row.id}>
                                <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.name}</td>
                                <td style={s.td}>
                                    <span style={{ ...s.badge, ...groupColors[row.group] }}>{row.group}</span>
                                </td>
                                <td style={s.td} dir="ltr">
                                    {row.visits}
                                </td>
                                <td
                                    style={{
                                        ...s.td,
                                        fontWeight: 'var(--font-bold)',
                                        color: 'var(--color-primary-600)',
                                    }}
                                    dir="ltr"
                                >
                                    {row.totalSpend.toLocaleString()} {egpLabel()}
                                </td>
                                <td style={s.td}>
                                    <div style={{ ...s.bar, transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
                                        <div style={{ ...s.barFill, width: `${(row.totalSpend / maxSpend) * 100}%` }} />
                                    </div>
                                </td>
                                <td style={s.td} dir="ltr">
                                    {row.avgTicket} {egpLabel()}
                                </td>
                                <td style={s.td}>{row.topService}</td>
                                <td style={s.td} dir="ltr">
                                    {row.lastVisit}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataGuard>
        </div>
    );
}
