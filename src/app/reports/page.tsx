'use client';

import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    CalendarDays,
    Filter,
    Calendar,
} from 'lucide-react';
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
import { Select } from '@/components/ui';

import styles from './reports.module.css';

const allRevenueData: Record<string, Array<{ month: string; revenue: number; expenses: number }>> = {
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

const branchData: Record<string, { revenue: number; bookings: number; clients: number; growth: string }> = {
    all: { revenue: 58000, bookings: 270, clients: 389, growth: '+12.5%' },
    main: { revenue: 38000, bookings: 180, clients: 260, growth: '+14.2%' },
    branch2: { revenue: 20000, bookings: 90, clients: 129, growth: '+9.1%' },
};

const serviceBreakdown = [
    { name: 'Hair', value: 35, color: '#8B5CF6' },
    { name: 'Skin', value: 25, color: '#EC4899' },
    { name: 'Nails', value: 18, color: '#F59E0B' },
    { name: 'Body', value: 14, color: '#10B981' },
    { name: 'Laser', value: 8, color: '#3B82F6' },
];

const weeklyBookings = [
    { day: 'Mon', bookings: 34 },
    { day: 'Tue', bookings: 28 },
    { day: 'Wed', bookings: 42 },
    { day: 'Thu', bookings: 38 },
    { day: 'Fri', bookings: 51 },
    { day: 'Sat', bookings: 62 },
    { day: 'Sun', bookings: 15 },
];

const s: Record<string, React.CSSProperties> = {
    filterBar: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
    filterItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
};

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('6m');
    const [branch, setBranch] = useState('all');

    const kpiData = branchData[branch] || branchData.all;
    const revenueData = allRevenueData[dateRange] || allRevenueData['6m'];

    const dateLabel = dateRange === '1m' ? 'This Month' : dateRange === '3m' ? 'Last 3 Months' : 'Last 6 Months';

    return (
        <div className={styles.categoryPage}>
            {/* Filters */}
            <div style={s.filterBar}>
                <div style={s.filterItem}>
                    <Calendar size={16} color="var(--text-tertiary)" />
                    <Select
                        value={dateRange}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value)}
                        options={[
                            { value: '1m', label: 'This Month' },
                            { value: '3m', label: 'Last 3 Months' },
                            { value: '6m', label: 'Last 6 Months' },
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
                            { value: 'all', label: 'All Branches' },
                            { value: 'downtown', label: 'Downtown' },
                            { value: 'mall', label: 'Mall of Arabia' },
                            { value: 'newcairo', label: 'New Cairo' },
                        ]}
                        style={{ width: 170 }}
                    />
                </div>
            </div>

            {/* KPIs */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}><DollarSign size={22} /></div>
                    <div><div className={styles.kpiValue}>{kpiData.revenue.toLocaleString()} EGP</div><div className={styles.kpiLabel}>Revenue ({dateLabel})</div></div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}><CalendarDays size={22} /></div>
                    <div><div className={styles.kpiValue}>{kpiData.bookings}</div><div className={styles.kpiLabel}>Bookings</div></div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: '#EDE9FE', color: '#7C3AED' }}><Users size={22} /></div>
                    <div><div className={styles.kpiValue}>{kpiData.clients}</div><div className={styles.kpiLabel}>Active Clients</div></div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: '#FEF3C7', color: '#B45309' }}><TrendingUp size={22} /></div>
                    <div><div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>{kpiData.growth}</div><div className={styles.kpiLabel}>Growth MoM</div></div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.chartCard} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.chartTitle}>Revenue vs Expenses ({dateLabel})</div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={(v: number) => `${v / 1000}K`} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary-500)" fill="var(--color-primary-100)" strokeWidth={3} name="Revenue" />
                                <Area type="monotone" dataKey="expenses" stroke="var(--color-error)" fill="var(--color-error-light)" strokeWidth={3} name="Expenses" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartTitle}>Revenue by Service</div>
                    <div style={{ height: 200, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RPieChart>
                                <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                                    {serviceBreakdown.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                            </RPieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'center' }}>
                        {serviceBreakdown.map((sv) => (
                            <div key={sv.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: sv.color }} />
                                {sv.name} ({sv.value}%)
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Bookings by Day of Week</div>
                <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyBookings}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'var(--bg-secondary)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                            <Bar dataKey="bookings" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} name="Bookings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
