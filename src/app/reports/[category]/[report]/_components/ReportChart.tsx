'use client';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart as ReLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

interface ReportChartProps {
    chartType: 'bar' | 'line' | 'none';
    chartData: Array<{ name: string; value: number }>;
}

export default function ReportChart({ chartType, chartData }: ReportChartProps) {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                    <ReLineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="var(--text-tertiary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                boxShadow: 'var(--shadow-lg)',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-primary-500)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'var(--color-primary-500)' }}
                        />
                    </ReLineChart>
                ) : (
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
                        <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
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
                )}
            </ResponsiveContainer>
        </div>
    );
}
