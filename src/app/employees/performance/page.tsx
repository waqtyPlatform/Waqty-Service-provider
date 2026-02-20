'use client';

import React from 'react';
import EmployeesTabs from '@/components/EmployeesTabs';
import { KPICard, Button } from '@/components/ui';
import { TrendingUp, Users, Star, DollarSign, CalendarCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
    { name: 'Nora', sales: 12500, rating: 4.9 },
    { name: 'Sara', sales: 9800, rating: 4.7 },
    { name: 'Laila', sales: 5400, rating: 4.8 },
    { name: 'Hoda', sales: 8200, rating: 4.6 },
    { name: 'Mona', sales: 11000, rating: 4.9 },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' },
    charts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-5)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', minHeight: 400 },
    cardTitle: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-6)' },
};

export default function EmployeePerformancePage() {
    return (
        <div style={s.page}>
            <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Performance</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Track employee metrics and KPIs.</p>
            </div>

            <EmployeesTabs />

            <div style={s.kpis}>
                <KPICard
                    icon={<DollarSign size={20} />}
                    iconBg="var(--color-success-light)"
                    iconColor="var(--color-success)"
                    value="46,900 EGP"
                    label="Total Commission Sales"
                    trend={{ value: '12%', up: true }}
                />
                <KPICard
                    icon={<Star size={20} />}
                    iconBg="var(--color-warning-light)"
                    iconColor="var(--color-warning)"
                    value="4.8"
                    label="Avg. Staff Rating"
                    trend={{ value: '0.1', up: true }}
                />
                <KPICard
                    icon={<CalendarCheck size={20} />}
                    iconBg="var(--color-primary-100)"
                    iconColor="var(--color-primary-600)"
                    value="92%"
                    label="Booking Completion"
                    trend={{ value: '3%', up: false }}
                />
                <KPICard
                    icon={<Users size={20} />}
                    iconBg="var(--bg-tertiary)"
                    iconColor="var(--text-secondary)"
                    value="85%"
                    label="Client Retention"
                    trend={{ value: '5%', up: true }}
                />
            </div>

            <div style={s.charts}>
                <div style={s.card}>
                    <div style={s.cardTitle}>Sales by Employee (Feb)</div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                                <Tooltip cursor={{ fill: 'var(--bg-secondary)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                <Bar dataKey="sales" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={s.card}>
                    <div style={s.cardTitle}>Customer Ratings</div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis domain={[0, 5]} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'var(--bg-secondary)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                <Bar dataKey="rating" fill="var(--color-warning)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
