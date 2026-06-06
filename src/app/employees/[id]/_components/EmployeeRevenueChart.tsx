'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';
import { egpLabel } from '@/lib/money';

interface EmployeeRevenueChartProps {
    revenueData: Array<{ month: string; revenue: number; appointments: number }>;
    t: (key: string) => string;
    lang: 'en' | 'ar';
}

export default function EmployeeRevenueChart({ revenueData, t, lang }: EmployeeRevenueChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                />
                <YAxis
                    orientation={lang === 'ar' ? 'right' : 'left'}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                    tickFormatter={val => `${val / 1000}k`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <RechartsTooltip
                    contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                    formatter={value => [`${value || 0} ${egpLabel()}`, t('empProfile.revenueTooltip')]}
                />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-primary-500)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
