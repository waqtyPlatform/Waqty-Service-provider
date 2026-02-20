'use client';

import React from 'react';
import {
    TrendingUp,
    Users,
    DollarSign,
    CalendarDays,
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

import styles from './reports.module.css';

const revenueData = [
    { month: 'Sep', revenue: 42000, expenses: 28000 },
    { month: 'Oct', revenue: 48000, expenses: 30000 },
    { month: 'Nov', revenue: 52000, expenses: 32000 },
    { month: 'Dec', revenue: 61000, expenses: 35000 },
    { month: 'Jan', revenue: 55000, expenses: 33000 },
    { month: 'Feb', revenue: 58000, expenses: 31000 },
];

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

export default function ReportsPage() {
    return (
        <div className={styles.categoryPage}>
            {/* KPIs */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}><DollarSign size={22} /></div>
                    <div><div className={styles.kpiValue}>58,000 EGP</div><div className={styles.kpiLabel}>Revenue (Feb)</div></div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}><CalendarDays size={22} /></div>
                    <div><div className={styles.kpiValue}>270</div><div className={styles.kpiLabel}>Bookings (Feb)</div></div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: '#EDE9FE', color: '#7C3AED' }}><Users size={22} /></div>
                    <div><div className={styles.kpiValue}>389</div><div className={styles.kpiLabel}>Active Clients</div></div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiIconWrapper} style={{ background: '#FEF3C7', color: '#B45309' }}><TrendingUp size={22} /></div>
                    <div><div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>+12.5%</div><div className={styles.kpiLabel}>Growth MoM</div></div>
                </div>
            </div>

            {/* Charts Row 1: Revenue + Service Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.chartCard} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={styles.chartTitle}>Revenue vs Expenses (6 Months)</div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={(v: number) => `${v / 1000}K`} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-lg)' }} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '3 3' }} />
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
                        {serviceBreakdown.map((s) => (
                            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                                {s.name} ({s.value}%)
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Weekly Bookings */}
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
