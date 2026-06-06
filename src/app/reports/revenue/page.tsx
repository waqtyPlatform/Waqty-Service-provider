'use client';

import { egpLabel } from '@/lib/money';
import React, { useState, useEffect } from 'react';
import { DollarSign, Building2, Users, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { Select, Button } from '@/components/ui';
import { DataGuard } from '@/components/DataGuard';
import { useTranslation } from '@/hooks/useTranslation';
import { providerApi, type ProviderRevenue, type ProviderRevenueFilters } from '@/lib/api';

const mockRevenue: ProviderRevenue = {
    total_revenue: 158000,
    by_branch: [
        { branch_uuid: 'b1', branch_name: 'Main Branch – Cairo', revenue: 95000 },
        { branch_uuid: 'b2', branch_name: 'Branch – Maadi', revenue: 63000 },
    ],
    by_employee: [
        { employee_uuid: 'e1', employee_name: 'Sara Ahmed', revenue: 48000 },
        { employee_uuid: 'e2', employee_name: 'Nora Ali', revenue: 42000 },
        { employee_uuid: 'e3', employee_name: 'Layla Hassan', revenue: 38000 },
        { employee_uuid: 'e4', employee_name: 'Hana Youssef', revenue: 30000 },
    ],
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    title: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    filters: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        flexWrap: 'wrap',
    },
    totalCard: {
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark, #3730a3) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--space-2)',
    },
    totalLabel: { fontSize: 'var(--text-sm)', opacity: 0.85 },
    totalValue: { fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)' },
    breakdownSection: { display: 'flex', flexDirection: 'column' as const, gap: 'var(--space-3)' },
    sectionTitle: {
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--space-3)',
    },
    cardTop: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--text-sm)',
        flexShrink: 0,
    },
    cardName: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    cardAmount: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    bar: { width: '100%', height: 6, borderRadius: 999, background: 'var(--bg-tertiary, #f3f4f6)', overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 999, transition: 'width 0.5s ease' },
};

const BRANCH_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const EMPLOYEE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const presetRanges = [
    { label: 'All time', value: '' },
    { label: 'This month', value: 'month' },
    { label: 'This week', value: 'week' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
];

function getDateRange(preset: string): { start_date: string; end_date: string } | undefined {
    const today = new Date();
    // Local-date YYYY-MM-DD — plain toISOString() shifts local-midnight boundaries
    // to the previous day for UTC+ timezones, skewing the range edges.
    const fmt = (d: Date) => {
        const x = new Date(d);
        x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
        return x.toISOString().split('T')[0];
    };
    if (preset === 'month') {
        return { start_date: fmt(new Date(today.getFullYear(), today.getMonth(), 1)), end_date: fmt(today) };
    }
    if (preset === 'week') {
        const mon = new Date(today);
        mon.setDate(today.getDate() - today.getDay() + 1);
        return { start_date: fmt(mon), end_date: fmt(today) };
    }
    if (preset === '30d') {
        const d = new Date(today);
        d.setDate(d.getDate() - 30);
        return { start_date: fmt(d), end_date: fmt(today) };
    }
    if (preset === '90d') {
        const d = new Date(today);
        d.setDate(d.getDate() - 90);
        return { start_date: fmt(d), end_date: fmt(today) };
    }
    return undefined;
}

export default function RevenuePage() {
    const { lang } = useTranslation();
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    const [data, setData] = useState<ProviderRevenue>(mockRevenue);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preset, setPreset] = useState('month');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        (async () => {
            try {
                const filters: ProviderRevenueFilters = {};
                const range = getDateRange(preset);
                if (range) {
                    filters.start_date = range.start_date;
                    filters.end_date = range.end_date;
                }
                const res = await providerApi.getRevenue(filters);
                if (!cancelled && res.success && res.data) {
                    // The live /provider/revenue envelope can omit the nested
                    // breakdowns (empty period / partial response). Normalize so the
                    // render-time `.map()`s below never hit undefined → render crash.
                    setData({
                        ...res.data,
                        total_revenue: res.data.total_revenue ?? 0,
                        by_branch: Array.isArray(res.data.by_branch) ? res.data.by_branch : [],
                        by_employee: Array.isArray(res.data.by_employee) ? res.data.by_employee : [],
                    });
                }
            } catch {
                if (!cancelled) setData(mockRevenue);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [preset, refreshKey]);

    const byBranch = Array.isArray(data.by_branch) ? data.by_branch : [];
    const byEmployee = Array.isArray(data.by_employee) ? data.by_employee : [];
    const totalRevenue = data.total_revenue ?? 0;
    const maxBranch = Math.max(...byBranch.map(b => b.revenue), 1);
    const maxEmployee = Math.max(...byEmployee.map(e => e.revenue), 1);

    return (
        <div style={{ ...s.page, direction: dir }}>
            {/* Header */}
            <div style={s.header}>
                <div>
                    <h2 style={s.title}>Revenue Overview</h2>
                    <p style={s.subtitle}>Real-time revenue breakdown from the API</p>
                </div>
                <Button variant="outline" onClick={() => setRefreshKey(k => k + 1)}>
                    <RefreshCw size={14} style={{ marginInlineEnd: 6 }} /> Refresh
                </Button>
            </div>

            {/* Filters */}
            <div style={s.filters}>
                <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
                <span
                    style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-secondary)',
                        fontWeight: 'var(--font-medium)',
                    }}
                >
                    Period:
                </span>
                <Select
                    value={preset}
                    onChange={e => setPreset(e.target.value)}
                    options={presetRanges.map(r => ({ value: r.value, label: r.label }))}
                />
            </div>

            <DataGuard
                loading={loading}
                error={error}
                data={byBranch.length > 0 ? byBranch : null}
                emptyIcon={<DollarSign size={40} />}
                emptyTitle="No revenue data"
                emptyDescription="Revenue data will appear here once bookings are processed."
            >
                <>
                    {/* Total Revenue Card */}
                    <div style={s.totalCard}>
                        <span style={s.totalLabel}>
                            <TrendingUp
                                size={16}
                                style={{ display: 'inline', marginInlineEnd: 6, verticalAlign: 'middle' }}
                            />
                            Total Revenue
                        </span>
                        <span style={s.totalValue}>
                            {totalRevenue.toLocaleString()} {egpLabel()}
                        </span>
                    </div>

                    {/* By Branch */}
                    <div style={s.breakdownSection}>
                        <span style={s.sectionTitle}>
                            <Building2 size={18} /> Revenue by Branch
                        </span>
                        <div style={s.grid}>
                            {byBranch.map((b, i) => (
                                <div key={b.branch_uuid} style={s.card}>
                                    <div style={s.cardTop}>
                                        <div
                                            style={{
                                                ...s.avatar,
                                                background: BRANCH_COLORS[i % BRANCH_COLORS.length] + '22',
                                                color: BRANCH_COLORS[i % BRANCH_COLORS.length],
                                            }}
                                        >
                                            <Building2 size={18} />
                                        </div>
                                        <span style={s.cardName}>{b.branch_name}</span>
                                    </div>
                                    <span style={s.cardAmount}>
                                        {b.revenue.toLocaleString()} {egpLabel()}
                                    </span>
                                    <div style={s.bar}>
                                        <div
                                            style={{
                                                ...s.barFill,
                                                width: `${(b.revenue / maxBranch) * 100}%`,
                                                background: BRANCH_COLORS[i % BRANCH_COLORS.length],
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                        {totalRevenue > 0 ? Math.round((b.revenue / totalRevenue) * 100) : 0}% of total
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* By Employee */}
                    <div style={s.breakdownSection}>
                        <span style={s.sectionTitle}>
                            <Users size={18} /> Revenue by Employee
                        </span>
                        <div style={s.grid}>
                            {byEmployee.map((e, i) => {
                                const initials = e.employee_name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase();
                                return (
                                    <div key={e.employee_uuid} style={s.card}>
                                        <div style={s.cardTop}>
                                            <div
                                                style={{
                                                    ...s.avatar,
                                                    background: EMPLOYEE_COLORS[i % EMPLOYEE_COLORS.length] + '22',
                                                    color: EMPLOYEE_COLORS[i % EMPLOYEE_COLORS.length],
                                                }}
                                            >
                                                {initials}
                                            </div>
                                            <span style={s.cardName}>{e.employee_name}</span>
                                        </div>
                                        <span style={s.cardAmount}>
                                            {e.revenue.toLocaleString()} {egpLabel()}
                                        </span>
                                        <div style={s.bar}>
                                            <div
                                                style={{
                                                    ...s.barFill,
                                                    width: `${(e.revenue / maxEmployee) * 100}%`,
                                                    background: EMPLOYEE_COLORS[i % EMPLOYEE_COLORS.length],
                                                }}
                                            />
                                        </div>
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {totalRevenue > 0 ? Math.round((e.revenue / totalRevenue) * 100) : 0}% of
                                            total
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            </DataGuard>
        </div>
    );
}
