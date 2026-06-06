'use client';

import { egpLabel } from '@/lib/money';
import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { transactionApi } from '@/lib/api';

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

interface PackageSaleRecord {
    id: string;
    date: string;
    client: string;
    package: string;
    price: number;
    sessionsTotal: number;
    sessionsUsed: number;
    expires: string;
    status: string;
}

const fallbackData: PackageSaleRecord[] = [
    {
        id: 'PKS-001',
        date: '2026-03-13',
        client: 'Fatima Ali',
        package: 'Bridal Glow Package',
        price: 2500,
        sessionsTotal: 8,
        sessionsUsed: 3,
        expires: '2026-03-20',
        status: 'active',
    },
    {
        id: 'PKS-002',
        date: '2026-03-17',
        client: 'Rania Khalil',
        package: 'VIP Monthly Care',
        price: 1200,
        sessionsTotal: 6,
        sessionsUsed: 2,
        expires: '2026-03-13',
        status: 'active',
    },
    {
        id: 'PKS-003',
        date: '2026-03-18',
        client: 'Noura Ahmed',
        package: 'Relaxation Retreat',
        price: 800,
        sessionsTotal: 4,
        sessionsUsed: 4,
        expires: '2026-03-13',
        status: 'completed',
    },
    {
        id: 'PKS-004',
        date: '2026-03-17',
        client: 'Huda Saleh',
        package: 'VIP Monthly Care',
        price: 1200,
        sessionsTotal: 6,
        sessionsUsed: 5,
        expires: '2026-03-12',
        status: 'active',
    },
    {
        id: 'PKS-005',
        date: '2026-03-13',
        client: 'Maryam Ibrahim',
        package: 'Hair Transformation',
        price: 1500,
        sessionsTotal: 5,
        sessionsUsed: 5,
        expires: '2026-03-26',
        status: 'completed',
    },
    {
        id: 'PKS-006',
        date: '2026-03-13',
        client: 'Sama Latif',
        package: 'Relaxation Retreat',
        price: 800,
        sessionsTotal: 4,
        sessionsUsed: 2,
        expires: '2026-03-19',
        status: 'expired',
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
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpi: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
    },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
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
    progress: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', width: 60 },
    progressFill: { height: '100%', borderRadius: 3 },
};

const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    completed: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    expired: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

export default function PackageSalesPage() {
    const { t, lang } = useTranslation();

    const {
        data: packageData,
        loading,
        error,
        refetch,
    } = useApiQuery<PackageSaleRecord[]>(() => transactionApi.getPackageSales() as never, [], {
        fallbackData: fallbackData,
    });

    const data = (packageData ?? []) as PackageSaleRecord[];
    const totalRev = data.reduce((a, d) => a + d.price, 0);
    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{ ...s.tab, ...(tab.href === '/transactions/package-sales' ? s.tabActive : {}) }}
                    >
                        {t(tab.labelKey)}
                    </Link>
                ))}
            </div>

            <div style={s.kpis}>
                <div style={s.kpi}>
                    <div style={s.kpiVal} dir="ltr">
                        {totalRev.toLocaleString()} {egpLabel()}
                    </div>
                    <div style={s.kpiLbl}>{t('txn.packages.revenue')}</div>
                </div>
                <div style={s.kpi}>
                    <div style={s.kpiVal} dir="ltr">
                        {data.length}
                    </div>
                    <div style={s.kpiLbl}>{t('txn.packages.sold')}</div>
                </div>
                <div style={s.kpi}>
                    <div style={s.kpiVal} dir="ltr">
                        {data.filter(d => d.status === 'active').length}
                    </div>
                    <div style={s.kpiLbl}>{t('txn.packages.active')}</div>
                </div>
            </div>

            <table style={s.table}>
                <thead>
                    <tr>
                        {[
                            'txn.petty.thID',
                            'txn.thDateTime',
                            'txn.thClient',
                            'txn.packages.thPackage',
                            'txn.packages.thPrice',
                            'txn.packages.thSessions',
                            'txn.packages.thProgress',
                            'txn.packages.thExpires',
                            'txn.thStatus',
                        ].map(h => (
                            <th key={h} style={s.th as React.CSSProperties}>
                                {t(h)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td style={s.td}>{row.id}</td>
                            <td style={s.td} dir="ltr">
                                {row.date}
                            </td>
                            <td style={s.td}>{row.client}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-medium)' }}>{row.package}</td>
                            <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }} dir="ltr">
                                {row.price.toLocaleString()} {egpLabel()}
                            </td>
                            <td style={s.td} dir="ltr">
                                {row.sessionsUsed}/{row.sessionsTotal}
                            </td>
                            <td style={s.td}>
                                <div style={s.progress}>
                                    <div
                                        style={{
                                            ...s.progressFill,
                                            width: `${(row.sessionsUsed / row.sessionsTotal) * 100}%`,
                                            background:
                                                row.sessionsUsed === row.sessionsTotal
                                                    ? 'var(--color-success)'
                                                    : 'var(--color-primary-500)',
                                        }}
                                    />
                                </div>
                            </td>
                            <td style={s.td} dir="ltr">
                                {row.expires}
                            </td>
                            <td style={s.td}>
                                <span style={{ ...s.badge, ...statusColors[row.status] }}>
                                    {t(
                                        `txn.packages.st${row.status.charAt(0).toUpperCase() + row.status.slice(1)}` as never
                                    )}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
