'use client';

import React, { useState, useCallback } from 'react';
import { TrendingUp, Users, DollarSign, CalendarDays, Filter, Calendar } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    Tooltip,
    PieChart as RPieChart,
    Pie,
    Cell,
} from 'recharts';
import { Select, Skeleton } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { reportApi, type ReportData, type ReportFilters } from '@/lib/api';

import styles from './reports.module.css';

/* ── Fallback mock data (used until API responds or on error) ── */

const fallbackRevenueData: Record<string, Array<{ month: string; revenue: number; expenses: number }>> = {
    '6m': [
        { month: 'Sep', revenue: 42000, expenses: 28000 },
        { month: 'Oct', revenue: 48000, expenses: 30000 },
        { month: 'Nov', revenue: 52000, expenses: 32000 },
        { month: 'Dec', revenue: 61000, expenses: 35000 },
        { month: 'Jan', revenue: 55000, expenses: 33000 },
        { month: 'Feb', revenue: 58000, expenses: 31000 },
    ],
    '3m': [
        { month: 'Dec', revenue: 61000, expenses: 35000 },
        { month: 'Jan', revenue: 55000, expenses: 33000 },
        { month: 'Feb', revenue: 58000, expenses: 31000 },
    ],
    '1m': [
        { month: 'Week 1', revenue: 13000, expenses: 7000 },
        { month: 'Week 2', revenue: 15000, expenses: 8000 },
        { month: 'Week 3', revenue: 14500, expenses: 8500 },
        { month: 'Week 4', revenue: 15500, expenses: 7500 },
    ],
};

const fallbackBranchData: Record<
    string,
    { revenue: number; bookings: number; clients: number; growth: string; overrideRevenue: number }
> = {
    all: { revenue: 58000, bookings: 270, clients: 389, growth: '+12.5%', overrideRevenue: 8240 },
    main: { revenue: 38000, bookings: 180, clients: 260, growth: '+14.2%', overrideRevenue: 5640 },
    branch2: { revenue: 20000, bookings: 90, clients: 129, growth: '+9.1%', overrideRevenue: 2600 },
};

const fallbackServiceBreakdown = [
    { name: 'Hair', value: 35, color: '#8B5CF6' },
    { name: 'Skin', value: 25, color: '#EC4899' },
    { name: 'Nails', value: 18, color: '#F59E0B' },
    { name: 'Body', value: 14, color: '#10B981' },
    { name: 'Laser', value: 8, color: '#3B82F6' },
];

const fallbackWeeklyBookings = [
    { day: 'Mon', bookings: 34 },
    { day: 'Tue', bookings: 28 },
    { day: 'Wed', bookings: 42 },
    { day: 'Thu', bookings: 38 },
    { day: 'Fri', bookings: 51 },
    { day: 'Sat', bookings: 62 },
    { day: 'Sun', bookings: 15 },
];

const fallbackDashboard = {
    labels: [] as string[],
    datasets: [],
    summary: { revenue: 58000, bookings: 270, clients: 389, growth: 12.5, overrideRevenue: 8240 },
};

const s: Record<string, React.CSSProperties> = {
    filterBar: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
    filterItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
};

/* ── Chart loading skeleton ── */
function ChartSkeleton({ height = 260 }: { height?: number }) {
    return (
        <div style={{ height, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            <Skeleton variant="text" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
        </div>
    );
}

export default function ReportsPage() {
    const { t, lang } = useTranslation();
    const [dateRange, setDateRange] = useState('6m');
    const [branch, setBranch] = useState('all');

    /* ── Build API filters from UI state ── */
    const filters: ReportFilters = {
        branch_uuid: branch !== 'all' ? branch : undefined,
        group_by: dateRange === '1m' ? 'week' : 'month',
    };

    /* ── API call for the revenue/dashboard report ── */
    const fetchDashboard = useCallback(
        () => reportApi.getRevenueReport(filters),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dateRange, branch]
    );

    const { data: dashboardData, loading } = useApiQuery<ReportData>(fetchDashboard, [dateRange, branch], {
        fallbackData: fallbackDashboard,
    });

    /* ── Derive display values from API data, falling back to mock ── */
    const kpiData =
        !loading && dashboardData?.summary
            ? {
                  revenue: dashboardData.summary.revenue ?? fallbackBranchData[branch]?.revenue ?? 58000,
                  bookings: dashboardData.summary.bookings ?? fallbackBranchData[branch]?.bookings ?? 270,
                  clients: dashboardData.summary.clients ?? fallbackBranchData[branch]?.clients ?? 389,
                  growth:
                      dashboardData.summary.growth != null
                          ? `${dashboardData.summary.growth >= 0 ? '+' : ''}${dashboardData.summary.growth}%`
                          : (fallbackBranchData[branch]?.growth ?? '+12.5%'),
                  overrideRevenue:
                      dashboardData.summary.overrideRevenue ?? fallbackBranchData[branch]?.overrideRevenue ?? 8240,
              }
            : fallbackBranchData[branch] || fallbackBranchData.all;

    const revenueData = fallbackRevenueData[dateRange] || fallbackRevenueData['6m'];
    const serviceBreakdown = fallbackServiceBreakdown;
    const weeklyBookings = fallbackWeeklyBookings;

    const dateLabel =
        dateRange === '1m'
            ? t('reports.thisMonth')
            : dateRange === '3m'
              ? t('reports.last3Months')
              : t('reports.last6Months');

    return (
        <div className={styles.categoryPage} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Filters */}
            <div style={s.filterBar}>
                <div style={s.filterItem}>
                    <Calendar size={16} color="var(--text-tertiary)" />
                    <Select
                        value={dateRange}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
                        options={[
                            { value: '1m', label: t('reports.thisMonth') },
                            { value: '3m', label: t('reports.last3Months') },
                            { value: '6m', label: t('reports.last6Months') },
                        ]}
                        style={{ width: 160 }}
                    />
                </div>
                <div style={s.filterItem}>
                    <Filter size={16} color="var(--text-tertiary)" />
                    <Select
                        value={branch}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBranch(e.target.value)}
                        options={[
                            { value: 'all', label: t('reports.allBranches') },
                            { value: 'downtown', label: t('reports.downtown') },
                            { value: 'mall', label: t('reports.mall') },
                            { value: 'newcairo', label: t('reports.newCairo') },
                        ]}
                        style={{ width: 170 }}
                    />
                </div>
            </div>

            {/* KPIs */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIconWrapper}
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
                    >
                        <DollarSign size={22} />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <>
                                <div
                                    className={styles.kpiValue}
                                    dir="ltr"
                                    style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                                >
                                    {kpiData.revenue.toLocaleString()} EGP
                                </div>
                                <div className={styles.kpiLabel}>
                                    {t('reports.kpiRevenue')} ({dateLabel})
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIconWrapper}
                        style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}
                    >
                        <CalendarDays size={22} />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <>
                                <div className={styles.kpiValue}>{kpiData.bookings}</div>
                                <div className={styles.kpiLabel}>{t('reports.kpiBookings')}</div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                        <Users size={22} />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <>
                                <div className={styles.kpiValue}>{kpiData.clients}</div>
                                <div className={styles.kpiLabel}>{t('reports.kpiActiveClients')}</div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: '#FEF3C7', color: '#B45309' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <>
                                <div
                                    className={styles.kpiValue}
                                    style={{
                                        color: 'var(--color-success)',
                                        direction: 'ltr',
                                        textAlign: lang === 'ar' ? 'right' : 'left',
                                    }}
                                >
                                    {kpiData.growth}
                                </div>
                                <div className={styles.kpiLabel}>{t('reports.kpiGrowth')}</div>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div
                        className={styles.kpiIconWrapper}
                        style={{ background: 'var(--color-primary-50, #eff6ff)', color: 'var(--color-primary-600)' }}
                    >
                        <DollarSign size={22} />
                    </div>
                    <div>
                        {loading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <>
                                <div
                                    className={styles.kpiValue}
                                    dir="ltr"
                                    style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                                >
                                    {kpiData.overrideRevenue.toLocaleString()} EGP
                                </div>
                                <div className={styles.kpiLabel}>
                                    {lang === 'ar' ? 'إيرادات التسعير المخصص' : 'Override Pricing Revenue'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: 'var(--space-4)',
                }}
            >
                <div className={styles.chartCard} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.chartTitle}>
                        {t('reports.chartRevVsExp')} ({dateLabel})
                    </div>
                    {loading ? (
                        <ChartSkeleton />
                    ) : (
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border-color)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        tickFormatter={v => t(`reports.${v}`) || v}
                                    />
                                    <YAxis
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
                                        tickFormatter={(v: number) => `${v / 1000}K`}
                                        tickLine={false}
                                        axisLine={false}
                                        orientation={lang === 'ar' ? 'right' : 'left'}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: 'none',
                                            boxShadow: 'var(--shadow-lg)',
                                        }}
                                        formatter={(value, name) => [
                                            value as number,
                                            t(name === 'Revenue' ? 'reports.revenue' : 'reports.expenses'),
                                        ]}
                                        labelFormatter={label => t(`reports.${label}`) || label}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="var(--color-primary-500)"
                                        fill="var(--color-primary-100)"
                                        strokeWidth={3}
                                        name="Revenue"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="var(--color-error)"
                                        fill="var(--color-error-light)"
                                        strokeWidth={3}
                                        name="Expenses"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>{t('reports.chartRevByService')}</div>
                    {loading ? (
                        <ChartSkeleton height={200} />
                    ) : (
                        <>
                            <div style={{ height: 200, position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RPieChart>
                                        <Pie
                                            data={serviceBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {serviceBreakdown.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: 'none',
                                                boxShadow: 'var(--shadow-lg)',
                                            }}
                                            formatter={(value, name) => [`${value}%`, t(`reports.srv${name}`) || name]}
                                        />
                                    </RPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--space-3)',
                                    marginTop: 'var(--space-6)',
                                    justifyContent: 'center',
                                }}
                            >
                                {serviceBreakdown.map(sv => (
                                    <div
                                        key={sv.name}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-secondary)',
                                        }}
                                    >
                                        <span
                                            style={{ width: 10, height: 10, borderRadius: '50%', background: sv.color }}
                                        />
                                        {t(`reports.srv${sv.name}`) || sv.name} ({sv.value}%)
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className={styles.chartCard}>
                <div className={styles.chartTitle}>{t('reports.chartBookingsByDay')}</div>
                {loading ? (
                    <ChartSkeleton />
                ) : (
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyBookings}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    stroke="var(--text-tertiary)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    tickFormatter={v => t(`reports.day${v}`) || v}
                                />
                                <YAxis
                                    stroke="var(--text-tertiary)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    orientation={lang === 'ar' ? 'right' : 'left'}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-secondary)' }}
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }}
                                    formatter={value => [value as number, t('reports.kpiBookings')]}
                                    labelFormatter={label => t(`reports.day${label}`) || label}
                                />
                                <Bar
                                    dataKey="bookings"
                                    fill="var(--color-primary-500)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                    name="Bookings"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
