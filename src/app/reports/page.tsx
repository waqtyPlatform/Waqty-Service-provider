'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    CalendarDays,
    Clock,
    Star,
    Download,
    Package,
    FileText,
    PieChart,
    Activity,
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

const tabItems = [
    { label: 'Overview', href: '/reports', icon: <BarChart3 size={16} /> },
    { label: 'Revenue', href: '/reports/revenue', icon: <DollarSign size={16} /> },
    { label: 'Bookings', href: '/reports/bookings', icon: <CalendarDays size={16} /> },
    { label: 'Clients', href: '/reports/clients', icon: <Users size={16} /> },
    { label: 'Employees', href: '/reports/employees', icon: <Star size={16} /> },
    { label: 'Services', href: '/reports/services', icon: <Package size={16} /> },
    { label: 'Inventory', href: '/reports/inventory', icon: <FileText size={16} /> },
    { label: 'Custom', href: '/reports/custom', icon: <Activity size={16} /> },
];

const cs: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    h1: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' },
    sub: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' },
    tabs: { display: 'flex', gap: 'var(--space-1)', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' },
    tab: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-tertiary)', borderBottom: '2px solid transparent', marginBottom: '-2px', textDecoration: 'none', whiteSpace: 'nowrap' as const },
    tabA: { color: 'var(--color-primary-500)', borderBottomColor: 'var(--color-primary-500)' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' },
    kpi: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
    kpiIcon: { width: 48, height: 48, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    kpiV: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiL: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    chartsRow: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' },
    btn: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' },
};

export default function ReportsPage() {
    return (
        <div style={cs.page}>
            <div style={cs.header}>
                <div>
                    <h1 style={cs.h1}>Reports</h1>
                    <p style={cs.sub}>Analyze business performance and trends.</p>
                </div>
                <button style={cs.btn}><Download size={16} /> Export All</button>
            </div>

            <div style={cs.tabs}>
                {tabItems.map((t) => (
                    <Link key={t.href} href={t.href} style={t.href === '/reports' ? { ...cs.tab, ...cs.tabA } : cs.tab}>
                        {t.icon} {t.label}
                    </Link>
                ))}
            </div>

            {/* KPIs */}
            <div style={cs.kpiGrid}>
                <div style={cs.kpi}>
                    <div style={{ ...cs.kpiIcon, background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}><DollarSign size={22} /></div>
                    <div><div style={cs.kpiV}>58,000 EGP</div><div style={cs.kpiL}>Revenue (Feb)</div></div>
                </div>
                <div style={cs.kpi}>
                    <div style={{ ...cs.kpiIcon, background: 'var(--color-info-light)', color: 'var(--color-info)' }}><CalendarDays size={22} /></div>
                    <div><div style={cs.kpiV}>270</div><div style={cs.kpiL}>Bookings (Feb)</div></div>
                </div>
                <div style={cs.kpi}>
                    <div style={{ ...cs.kpiIcon, background: '#EDE9FE', color: '#7C3AED' }}><Users size={22} /></div>
                    <div><div style={cs.kpiV}>389</div><div style={cs.kpiL}>Active Clients</div></div>
                </div>
                <div style={cs.kpi}>
                    <div style={{ ...cs.kpiIcon, background: '#FEF3C7', color: '#B45309' }}><TrendingUp size={22} /></div>
                    <div><div style={{ ...cs.kpiV, color: 'var(--color-success)' }}>+12.5%</div><div style={cs.kpiL}>Growth MoM</div></div>
                </div>
            </div>

            {/* Charts Row 1: Revenue + Service Breakdown */}
            <div style={cs.chartsRow}>
                <div style={cs.card}>
                    <div style={cs.cardTitle}>Revenue vs Expenses (6 Months)</div>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
                                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickFormatter={(v: number) => `${v / 1000}K`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary-500)" fill="var(--color-primary-100)" strokeWidth={2} name="Revenue" />
                                <Area type="monotone" dataKey="expenses" stroke="var(--color-error)" fill="var(--color-error-light)" strokeWidth={2} name="Expenses" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={cs.card}>
                    <div style={cs.cardTitle}>Revenue by Service</div>
                    <div style={{ height: 200, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RPieChart>
                                <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                                    {serviceBreakdown.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RPieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-3)', justifyContent: 'center' }}>
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
            <div style={cs.card}>
                <div style={cs.cardTitle}>Bookings by Day of Week</div>
                <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyBookings}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} />
                            <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} name="Bookings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
