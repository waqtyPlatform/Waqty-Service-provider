'use client';

import { ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Tooltip } from 'recharts';

interface ServiceBreakdownChartProps {
    serviceBreakdown: Array<{ name: string; value: number; color: string }>;
    t: (key: string) => string;
}

export default function ServiceBreakdownChart({ serviceBreakdown, t }: ServiceBreakdownChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RPieChart>
                <Pie
                    data={serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                >
                    {serviceBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        boxShadow: 'var(--shadow-lg)',
                    }}
                    formatter={(value, name) => [`${value}%`, t(`reports.srv${name}`) || name]}
                />
            </RPieChart>
        </ResponsiveContainer>
    );
}
