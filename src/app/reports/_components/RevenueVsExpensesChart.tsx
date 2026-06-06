'use client';

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface RevenueVsExpensesChartProps {
    revenueData: Array<{ month: string; revenue: number; expenses: number }>;
    t: (key: string) => string;
    lang: 'en' | 'ar';
}

export default function RevenueVsExpensesChart({ revenueData, t, lang }: RevenueVsExpensesChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
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
                        borderRadius: 'var(--radius-md)',
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
    );
}
