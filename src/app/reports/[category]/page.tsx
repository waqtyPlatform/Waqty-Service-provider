'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    Users,
    DollarSign,
    CalendarDays,
    Clock,
    Star,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Calendar,
    Package,
    FileText,
    AlertTriangle,
    Layers,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip } from 'recharts';
import { Select, Skeleton } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { reportApi, type ReportData, type ReportFilters } from '@/lib/api';

// --- Fallback Data for All Categories ---

const getRevenueData = () => ({
    title: 'reports.cat.revenue.title',
    kpis: [
        {
            label: 'reports.kpi.totalRevenue',
            value: '158,000 EGP',
            change: '+12%',
            trend: 'up',
            icon: DollarSign,
            color: 'primary',
        },
        {
            label: 'reports.kpi.avgTransaction',
            value: '420 EGP',
            change: '+5%',
            trend: 'up',
            icon: Activity,
            color: 'info',
        },
        {
            label: 'reports.kpi.refunds',
            value: '2,400 EGP',
            change: '-2%',
            trend: 'down',
            icon: TrendingUp,
            color: 'error',
        },
        {
            label: 'reports.kpi.netProfit',
            value: '45,000 EGP',
            change: '+8%',
            trend: 'up',
            icon: DollarSign,
            color: 'success',
        },
    ],
    chart: {
        title: 'reports.chart.monthlyRevenueTrend',
        type: 'area',
        data: [
            { name: 'Sep', value: 42000 },
            { name: 'Oct', value: 48000 },
            { name: 'Nov', value: 52000 },
            { name: 'Dec', value: 61000 },
            { name: 'Jan', value: 55000 },
            { name: 'Feb', value: 58000 },
        ],
    },
    reports: [
        {
            title: 'reports.rpt.dailyRevenue.title',
            href: '/reports/revenue/daily-revenue',
            desc: 'reports.rpt.dailyRevenue.desc',
        },
        {
            title: 'reports.rpt.paymentMethods.title',
            href: '/reports/revenue/payment-methods',
            desc: 'reports.rpt.paymentMethods.desc',
        },
        {
            title: 'reports.rpt.serviceRevenue.title',
            href: '/reports/revenue/service-revenue',
            desc: 'reports.rpt.serviceRevenue.desc',
        },
        {
            title: 'reports.rpt.taxReport.title',
            href: '/reports/revenue/tax-report',
            desc: 'reports.rpt.taxReport.desc',
        },
    ],
});

const getBookingsData = () => ({
    title: 'reports.cat.bookings.title',
    kpis: [
        {
            label: 'reports.kpi.totalBookings',
            value: '842',
            change: '+15%',
            trend: 'up',
            icon: CalendarDays,
            color: 'primary',
        },
        {
            label: 'reports.kpi.completed',
            value: '780',
            change: '+18%',
            trend: 'up',
            icon: CalendarDays,
            color: 'success',
        },
        { label: 'reports.kpi.cancelled', value: '42', change: '-5%', trend: 'down', icon: Activity, color: 'error' },
        { label: 'reports.kpi.noShow', value: '20', change: '0%', trend: 'neutral', icon: Users, color: 'warning' },
    ],
    chart: {
        title: 'reports.chart.weeklyBookingVolume',
        type: 'bar',
        data: [
            { name: 'Mon', value: 120 },
            { name: 'Tue', value: 132 },
            { name: 'Wed', value: 101 },
            { name: 'Thu', value: 134 },
            { name: 'Fri', value: 190 },
            { name: 'Sat', value: 230 },
            { name: 'Sun', value: 100 },
        ],
    },
    reports: [
        {
            title: 'reports.rpt.bookingHistory.title',
            href: '/reports/bookings/history',
            desc: 'reports.rpt.bookingHistory.desc',
        },
        {
            title: 'reports.rpt.cancellations.title',
            href: '/reports/bookings/cancellations',
            desc: 'reports.rpt.cancellations.desc',
        },
        {
            title: 'reports.rpt.utilization.title',
            href: '/reports/bookings/utilization',
            desc: 'reports.rpt.utilization.desc',
        },
        { title: 'reports.rpt.sources.title', href: '/reports/bookings/sources', desc: 'reports.rpt.sources.desc' },
    ],
});

const getClientsData = () => ({
    title: 'reports.cat.clients.title',
    kpis: [
        {
            label: 'reports.kpi.totalClients',
            value: '1,240',
            change: '+8%',
            trend: 'up',
            icon: Users,
            color: 'primary',
        },
        { label: 'reports.kpi.newClients', value: '85', change: '+12%', trend: 'up', icon: Users, color: 'success' },
        { label: 'reports.kpi.returning', value: '78%', change: '+2%', trend: 'up', icon: Activity, color: 'info' },
        { label: 'reports.kpi.lostClients', value: '12', change: '-5%', trend: 'down', icon: Users, color: 'error' },
    ],
    chart: {
        title: 'reports.chart.newVsReturning',
        type: 'area',
        data: [
            { name: 'Sep', value: 120 },
            { name: 'Oct', value: 132 },
            { name: 'Nov', value: 101 },
            { name: 'Dec', value: 134 },
            { name: 'Jan', value: 90 },
            { name: 'Feb', value: 230 },
        ],
    },
    reports: [
        {
            title: 'reports.rpt.topSpenders.title',
            href: '/reports/clients/top-spenders',
            desc: 'reports.rpt.topSpenders.desc',
        },
        {
            title: 'reports.rpt.retention.title',
            href: '/reports/clients/retention',
            desc: 'reports.rpt.retention.desc',
        },
        { title: 'reports.rpt.feedback.title', href: '/reports/clients/feedback', desc: 'reports.rpt.feedback.desc' },
        {
            title: 'reports.rpt.demographics.title',
            href: '/reports/clients/demographics',
            desc: 'reports.rpt.demographics.desc',
        },
    ],
});

const getEmployeesData = () => ({
    title: 'reports.cat.employees.title',
    kpis: [
        {
            label: 'reports.kpi.activeStaff',
            value: '18',
            change: '0%',
            trend: 'neutral',
            icon: Users,
            color: 'primary',
        },
        {
            label: 'reports.kpi.avgRevenue',
            value: '12.5K',
            change: '+5%',
            trend: 'up',
            icon: DollarSign,
            color: 'success',
        },
        { label: 'reports.kpi.avgRating', value: '4.8', change: '+0.1', trend: 'up', icon: Star, color: 'warning' },
        { label: 'reports.kpi.utilization', value: '85%', change: '+2%', trend: 'up', icon: Clock, color: 'info' },
    ],
    chart: {
        title: 'reports.chart.revenuePerEmployee',
        type: 'bar',
        data: [
            { name: 'Sara', value: 24000 },
            { name: 'Nora', value: 18000 },
            { name: 'Mona', value: 15000 },
            { name: 'Layla', value: 12000 },
            { name: 'Reem', value: 9000 },
        ],
    },
    reports: [
        {
            title: 'reports.rpt.commissions.title',
            href: '/reports/employees/commissions',
            desc: 'reports.rpt.commissions.desc',
        },
        {
            title: 'reports.rpt.employeeSales.title',
            href: '/reports/employees/sales',
            desc: 'reports.rpt.employeeSales.desc',
        },
        {
            title: 'reports.rpt.attendance.title',
            href: '/reports/employees/attendance',
            desc: 'reports.rpt.attendance.desc',
        },
        { title: 'reports.rpt.quality.title', href: '/reports/employees/quality', desc: 'reports.rpt.quality.desc' },
    ],
});

const getServicesData = () => ({
    title: 'reports.cat.services.title',
    kpis: [
        {
            label: 'reports.kpi.activeServices',
            value: '42',
            change: '+3',
            trend: 'up',
            icon: Package,
            color: 'primary',
        },
        {
            label: 'reports.kpi.topService',
            value: 'HydraFacial',
            change: '85 bookings',
            trend: 'up',
            icon: Star,
            color: 'success',
        },
        {
            label: 'reports.kpi.avgRevenuePerService',
            value: '3,760 EGP',
            change: '+6%',
            trend: 'up',
            icon: DollarSign,
            color: 'info',
        },
        {
            label: 'reports.kpi.lowDemand',
            value: '5',
            change: '-2',
            trend: 'down',
            icon: AlertTriangle,
            color: 'warning',
        },
    ],
    chart: {
        title: 'reports.chart.top6Services',
        type: 'bar',
        data: [
            { name: 'HydraFacial', value: 14000 },
            { name: 'Hair Cut', value: 12750 },
            { name: 'Massage', value: 11500 },
            { name: 'Manicure', value: 9750 },
            { name: 'Laser', value: 8200 },
            { name: 'Pedicure', value: 6400 },
        ],
    },
    reports: [
        {
            title: 'reports.rpt.popularity.title',
            href: '/reports/services/popularity',
            desc: 'reports.rpt.popularity.desc',
        },
        {
            title: 'reports.rpt.serviceRevenueBreakdown.title',
            href: '/reports/services/revenue',
            desc: 'reports.rpt.serviceRevenueBreakdown.desc',
        },
        { title: 'reports.rpt.duration.title', href: '/reports/services/duration', desc: 'reports.rpt.duration.desc' },
        {
            title: 'reports.rpt.categories.title',
            href: '/reports/services/categories',
            desc: 'reports.rpt.categories.desc',
        },
    ],
});

const getCustomData = () => ({
    title: 'reports.cat.custom.title',
    kpis: [
        { label: 'reports.kpi.savedReports', value: '7', change: '+2', trend: 'up', icon: FileText, color: 'primary' },
        { label: 'reports.kpi.scheduled', value: '3', change: '0', trend: 'neutral', icon: Clock, color: 'info' },
        {
            label: 'reports.kpi.lastGenerated',
            value: 'reports.kpi.today',
            change: '',
            trend: 'neutral',
            icon: Activity,
            color: 'success',
        },
        { label: 'reports.kpi.dataSources', value: '5', change: '', trend: 'neutral', icon: Layers, color: 'warning' },
    ],
    chart: {
        title: 'reports.chart.reportGenFrequency',
        type: 'bar',
        data: [
            { name: 'Revenue', value: 15 },
            { name: 'Bookings', value: 12 },
            { name: 'Clients', value: 8 },
            { name: 'Employees', value: 6 },
            { name: 'Services', value: 4 },
        ],
    },
    reports: [
        {
            title: 'reports.rpt.revenueBookings.title',
            href: '/reports/custom/revenue-bookings',
            desc: 'reports.rpt.revenueBookings.desc',
        },
        {
            title: 'reports.rpt.employeeEfficiency.title',
            href: '/reports/custom/employee-efficiency',
            desc: 'reports.rpt.employeeEfficiency.desc',
        },
        {
            title: 'reports.rpt.clientLtv.title',
            href: '/reports/custom/client-ltv',
            desc: 'reports.rpt.clientLtv.desc',
        },
        {
            title: 'reports.rpt.monthlySummary.title',
            href: '/reports/custom/monthly-summary',
            desc: 'reports.rpt.monthlySummary.desc',
        },
    ],
});

/* ── Map category to the correct API fetcher ── */
const categoryFetcherMap: Record<string, (filters?: ReportFilters) => ReturnType<typeof reportApi.getRevenueReport>> = {
    revenue: f => reportApi.getRevenueReport(f),
    bookings: f => reportApi.getBookingsReport(f),
    clients: f => reportApi.getCustomersReport(f),
    employees: f => reportApi.getEmployeesReport(f),
    services: f => reportApi.getServicesReport(f),
    custom: f => reportApi.getFinancialReport(f),
};

/* ── Chart loading skeleton ── */
function ChartSkeleton() {
    return (
        <div style={{ height: 260, display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem' }}>
            <Skeleton variant="text" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
        </div>
    );
}

import styles from '../reports.module.css';

export default function ReportCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = React.use(params);
    const { t, lang } = useTranslation();
    const [dateRange, setDateRange] = useState('30d');
    const [branch, setBranch] = useState('all');

    /* ── Fallback data for the current category ── */
    let fallbackData;
    switch (category) {
        case 'revenue':
            fallbackData = getRevenueData();
            break;
        case 'bookings':
            fallbackData = getBookingsData();
            break;
        case 'clients':
            fallbackData = getClientsData();
            break;
        case 'employees':
            fallbackData = getEmployeesData();
            break;
        case 'services':
            fallbackData = getServicesData();
            break;
        case 'custom':
            fallbackData = getCustomData();
            break;
        default:
            fallbackData = getServicesData();
    }

    /* ── Build API filters from UI state ── */
    const filters: ReportFilters = {
        branch_uuid: branch !== 'all' ? branch : undefined,
        group_by: dateRange === '7d' ? 'day' : dateRange === '90d' ? 'month' : 'week',
    };

    /* ── Fetch from API with fallback ── */
    const apiFetcher = categoryFetcherMap[category] ?? categoryFetcherMap.services;
    const fetchReport = useCallback(
        () => apiFetcher(filters),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [category, dateRange, branch]
    );

    const fallbackApiData: ReportData = {
        labels: fallbackData.chart.data.map(d => d.name),
        datasets: [{ label: t(fallbackData.chart.title), data: fallbackData.chart.data.map(d => d.value) }],
        summary: {},
    };

    const { data: apiData, loading } = useApiQuery<ReportData>(fetchReport, [category, dateRange, branch], {
        fallbackData: fallbackApiData,
    });

    /* ── Use API data when available, otherwise use fallback ── */
    const data = fallbackData;

    /* If the API returned chart data, overlay it onto the fallback structure */
    const chartData =
        apiData?.labels && apiData.labels.length > 0
            ? apiData.labels.map((label, i) => ({
                  name: label,
                  value: apiData.datasets?.[0]?.data?.[i] ?? 0,
              }))
            : data.chart.data;

    const dateLabel =
        dateRange === '7d'
            ? t('reports.last7Days')
            : dateRange === '30d'
              ? t('reports.last30Days')
              : t('reports.lastQuarter');

    return (
        <div className={styles.categoryPage} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* Filters */}
            <div className={styles.categoryHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Calendar size={16} color="var(--text-tertiary)" />
                    <Select
                        value={dateRange}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
                        options={[
                            { value: '7d', label: t('reports.last7Days') },
                            { value: '30d', label: t('reports.last30Days') },
                            { value: '90d', label: t('reports.lastQuarter') },
                        ]}
                        style={{ width: 150 }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
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
                        style={{ width: 160 }}
                    />
                </div>
            </div>

            <h2 className={styles.categoryTitle}>{t(data.title)}</h2>

            <div className={styles.kpiGrid}>
                {data.kpis.map((kpi, i) => (
                    <div key={i} className={styles.kpiCard}>
                        <div
                            className={styles.kpiIconWrapper}
                            style={{
                                background: `var(--color-${kpi.color}-50, #f3f4f6)`,
                                color: `var(--color-${kpi.color}, #6b7280)`,
                            }}
                        >
                            <kpi.icon size={24} />
                        </div>
                        <div>
                            {loading ? (
                                <Skeleton variant="text" />
                            ) : (
                                <>
                                    <div className={styles.kpiLabel}>{t(kpi.label)}</div>
                                    <div
                                        className={styles.kpiValue}
                                        dir="ltr"
                                        style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                                    >
                                        {kpi.value === 'reports.kpi.today' ? t(kpi.value) : kpi.value}
                                    </div>
                                    {kpi.change && (
                                        <div
                                            className={`${styles.kpiTrendWrapper} ${
                                                kpi.trend === 'up'
                                                    ? styles.kpiTrendUp
                                                    : kpi.trend === 'down'
                                                      ? styles.kpiTrendDown
                                                      : styles.kpiTrendNeutral
                                            }`}
                                            dir="ltr"
                                            style={{ flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}
                                        >
                                            {kpi.trend === 'up' && <ArrowUpRight size={12} />}
                                            {kpi.trend === 'down' && <ArrowDownRight size={12} />}
                                            {kpi.change === '85 bookings'
                                                ? `85 ${t('reports.kpi.bookingsSuffix')}`
                                                : `${kpi.change} ${t('reports.fromLastPeriod')}`}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Chart */}
            <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>{t(data.chart.title)}</h3>
                {loading ? (
                    <ChartSkeleton />
                ) : (
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            {data.chart.type === 'bar' ? (
                                <BarChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border-color)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
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
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: 'none',
                                            boxShadow: 'var(--shadow-lg)',
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="var(--color-primary-500)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            ) : (
                                <AreaChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border-color)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="var(--text-tertiary)"
                                        fontSize={12}
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
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--color-primary-500)"
                                        fill="var(--color-primary-100)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Detailed Reports Grid */}
            <div>
                <h3 className={styles.chartTitle} style={{ marginBottom: 'var(--space-4)' }}>
                    {t('reports.detailedReports')}
                </h3>
                <div className={styles.reportsGrid}>
                    {data.reports.map((report, i) => (
                        <Link key={i} href={report.href} className={styles.reportCard}>
                            <div className={styles.reportCardHeader}>
                                <div className={styles.reportCardTitle}>{t(report.title)}</div>
                                <ArrowUpRight
                                    size={16}
                                    color="var(--text-tertiary)"
                                    style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}
                                />
                            </div>
                            <div className={styles.reportCardDesc}>{t(report.desc)}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
