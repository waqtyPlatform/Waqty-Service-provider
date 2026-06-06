'use client';

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip } from 'recharts';

interface CategoryChartProps {
    chartType: string;
    chartData: Array<{ name: string; value: number }>;
    lang: 'en' | 'ar';
}

export default function CategoryChart({ chartType, chartData, lang }: CategoryChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
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
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            boxShadow: 'var(--shadow-lg)',
                        }}
                    />
                    <Bar dataKey="value" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            ) : (
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
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
                            borderRadius: 'var(--radius-md)',
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
    );
}
