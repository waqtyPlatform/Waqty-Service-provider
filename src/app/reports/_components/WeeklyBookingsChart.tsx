'use client';

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface WeeklyBookingsChartProps {
    weeklyBookings: Array<{ day: string; bookings: number }>;
    t: (key: string) => string;
    lang: 'en' | 'ar';
}

export default function WeeklyBookingsChart({ weeklyBookings, t, lang }: WeeklyBookingsChartProps) {
    return (
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
                    contentStyle={{
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        boxShadow: 'var(--shadow-lg)',
                    }}
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
    );
}
