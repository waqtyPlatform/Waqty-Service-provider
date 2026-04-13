'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, TrendingUp, Award } from 'lucide-react';

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

interface BestSalesData {
    topServices: { rank: number; name: string; category: string; revenue: number; count: number; avg: number }[];
    topEmployees: { rank: number; name: string; role: string; revenue: number; bookings: number; color: string }[];
}

const fallbackTopServices = [
    { rank: 1, name: 'Hair Coloring', category: 'Hair', revenue: 12400, count: 31, avg: 400 },
    { rank: 2, name: 'Keratin Treatment', category: 'Hair', revenue: 9600, count: 12, avg: 800 },
    { rank: 3, name: 'HydraFacial', category: 'Skin', revenue: 7800, count: 15, avg: 520 },
    { rank: 4, name: 'Bridal Styling', category: 'Hair', revenue: 6000, count: 5, avg: 1200 },
    { rank: 5, name: 'Swedish Massage', category: 'Body', revenue: 5250, count: 15, avg: 350 },
    { rank: 6, name: 'Classic Facial', category: 'Skin', revenue: 4200, count: 15, avg: 280 },
    { rank: 7, name: 'Gel Manicure', category: 'Nails', revenue: 3600, count: 24, avg: 150 },
    { rank: 8, name: 'Deep Tissue Massage', category: 'Body', revenue: 3000, count: 10, avg: 300 },
];

const fallbackTopEmployees = [
    { rank: 1, name: 'Sara Ahmed', role: 'Senior Stylist', revenue: 18500, bookings: 42, color: '#F59E0B' },
    { rank: 2, name: 'Nora Ali', role: 'Skin Specialist', revenue: 14200, bookings: 35, color: '#8B5CF6' },
    { rank: 3, name: 'Layla Hassan', role: 'Senior Therapist', revenue: 11800, bookings: 28, color: '#10B981' },
    { rank: 4, name: 'Reem Mohamed', role: 'Massage Therapist', revenue: 8400, bookings: 24, color: '#EC4899' },
    { rank: 5, name: 'Hana Youssef', role: 'Nail Technician', revenue: 6200, bookings: 38, color: '#3B82F6' },
];

const fallbackBestSales: BestSalesData = { topServices: fallbackTopServices, topEmployees: fallbackTopEmployees };

// maxRev is computed dynamically below

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
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    cardTitle: {
        padding: 'var(--space-4) var(--space-5)',
        fontWeight: 'var(--font-semibold)',
        fontSize: 'var(--text-base)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-3) var(--space-5)',
        borderBottom: '1px solid var(--border-color)',
        gap: 'var(--space-3)',
    },
    rank: {
        width: 24,
        height: 24,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 'var(--font-bold)',
        flexShrink: 0,
    },
    bar: { height: 6, borderRadius: 3, background: 'var(--bg-tertiary)', flex: 1 },
    barFill: { height: '100%', borderRadius: 3, background: 'var(--color-primary-500)' },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-bold)',
        flexShrink: 0,
    },
};

const rankColors = ['#F59E0B', '#9CA3AF', '#CD7F32'];

export default function BestSalesPage() {
    const { t, lang } = useTranslation();

    const {
        data: bestSalesData,
        loading,
        error,
        refetch,
    } = useApiQuery<BestSalesData>(() => transactionApi.getBestSales() as never, [], {
        fallbackData: fallbackBestSales,
    });

    const topServices = (bestSalesData as BestSalesData)?.topServices ?? fallbackTopServices;
    const topEmployees = (bestSalesData as BestSalesData)?.topEmployees ?? fallbackTopEmployees;
    const maxRev = topServices[0]?.revenue ?? 1;

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={s.tabBar}>
                {tabs.map(tab => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{ ...s.tab, ...(tab.href === '/transactions/best-sales' ? s.tabActive : {}) }}
                    >
                        {t(tab.labelKey)}
                    </Link>
                ))}
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={topServices}
                onRetry={refetch}
                emptyIcon={<Award size={48} />}
                emptyTitle={t('txn.best.emptyTitle') || 'No sales data'}
                emptyDescription={t('txn.best.emptyDesc') || 'Best sales data will appear here.'}
            >
                <div style={s.grid}>
                    <div style={s.card}>
                        <div style={s.cardTitle}>
                            <Trophy size={18} style={{ color: '#F59E0B' }} /> {t('txn.best.topServices')}
                        </div>
                        {topServices.map(svc => (
                            <div key={svc.rank} style={s.row}>
                                <div
                                    style={{
                                        ...s.rank,
                                        background: rankColors[svc.rank - 1] || 'var(--bg-tertiary)',
                                        color: svc.rank <= 3 ? 'white' : 'var(--text-secondary)',
                                    }}
                                >
                                    {svc.rank}
                                </div>
                                <div style={{ flex: '0 0 140px' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                        {svc.name}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                        {svc.category} ·{' '}
                                        {t('txn.best.salesCount').replace('{count}', svc.count.toString())}
                                    </div>
                                </div>
                                <div style={s.bar}>
                                    <div style={{ ...s.barFill, width: `${(svc.revenue / maxRev) * 100}%` }} />
                                </div>
                                <div
                                    style={{
                                        fontWeight: 'var(--font-semibold)',
                                        fontSize: 'var(--text-sm)',
                                        whiteSpace: 'nowrap',
                                    }}
                                    dir="ltr"
                                >
                                    {svc.revenue.toLocaleString()} EGP
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={s.card}>
                        <div style={s.cardTitle}>
                            <TrendingUp size={18} style={{ color: 'var(--color-primary-500)' }} />{' '}
                            {t('txn.best.topEmployees')}
                        </div>
                        {topEmployees.map(emp => (
                            <div key={emp.rank} style={s.row}>
                                <div
                                    style={{
                                        ...s.rank,
                                        background: rankColors[emp.rank - 1] || 'var(--bg-tertiary)',
                                        color: emp.rank <= 3 ? 'white' : 'var(--text-secondary)',
                                    }}
                                >
                                    {emp.rank}
                                </div>
                                <div style={{ ...s.avatar, background: emp.color }}>{emp.name.charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>
                                        {emp.name}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                        {emp.role} ·{' '}
                                        {t('txn.best.bookingsCount').replace('{count}', emp.bookings.toString())}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontWeight: 'var(--font-semibold)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-primary-600)',
                                    }}
                                    dir="ltr"
                                >
                                    {emp.revenue.toLocaleString()} EGP
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DataGuard>
        </div>
    );
}
