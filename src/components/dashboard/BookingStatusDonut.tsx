'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

interface DatumWithColor {
    name: string;
    value: number;
    color: string;
}

/**
 * Donut chart used in the dashboard's "Booking Status" card. Extracted so the
 * Recharts dependency (and its `ResponsiveContainer` layout reads) can be
 * lazy-loaded via `next/dynamic`, keeping it off the dashboard's critical path.
 */
export default function BookingStatusDonut({ data }: { data: DatumWithColor[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map(entry => (
                        <Cell key={entry.name} fill={entry.color} />
                    ))}
                </Pie>
                <RechartsTooltip
                    contentStyle={{
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                    formatter={val => [`${val ?? ''}`, '']}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
