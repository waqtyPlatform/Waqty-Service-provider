'use client';

import { ResponsiveContainer, AreaChart, Area, Tooltip as RechartsTooltip } from 'recharts';

/**
 * Small area chart used inside KPI cards. Extracted so that Recharts (and the
 * forced-reflow hit from its `ResponsiveContainer` size detector) can be lazy-
 * loaded via `next/dynamic` and not block the dashboard's initial render.
 */
export default function KpiSparkline({ data }: { data: { v: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Area
                    type="monotone"
                    dataKey="v"
                    stroke="var(--color-primary-500)"
                    fill="var(--color-primary-500)"
                    strokeWidth={2}
                />
                <RechartsTooltip
                    contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '12px',
                        padding: '4px 8px',
                    }}
                    formatter={val => [`${val ?? ''}`, 'Value']}
                    labelFormatter={() => ''}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
