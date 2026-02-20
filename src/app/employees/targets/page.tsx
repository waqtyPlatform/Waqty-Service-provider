'use client';

import React from 'react';
import EmployeesTabs from '@/components/EmployeesTabs';
import { Target, TrendingUp } from 'lucide-react';

const targets = [
    { id: 1, employee: 'Nora Ali', period: 'Feb 2026', current: 12500, target: 15000, type: 'Sales' },
    { id: 2, employee: 'Sara Ahmed', period: 'Feb 2026', current: 9800, target: 12000, type: 'Sales' },
    { id: 3, employee: 'Hoda Hassan', period: 'Feb 2026', current: 45, target: 60, type: 'Services Count' },
    { id: 4, employee: 'Laila Mahmoud', period: 'Feb 2026', current: 5400, target: 5000, type: 'Retail Sales' },
];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' },
    card: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)' },
    cardHead: { display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' },
    empName: { fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' },
    meta: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    progressContainer: { height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', marginBottom: 'var(--space-2)' },
    bar: { height: '100%', background: 'var(--color-primary-500)', transition: 'width 0.5s ease' },
    stats: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' },
    current: { fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    target: { color: 'var(--text-tertiary)' },
};

export default function EmployeeTargetsPage() {
    return (
        <div style={s.page}>
            <div>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Monthly Targets</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>Set and track employee goals.</p>
            </div>

            <EmployeesTabs />

            <div style={s.grid}>
                {targets.map(t => {
                    const percent = Math.min((t.current / t.target) * 100, 100);
                    return (
                        <div key={t.id} style={s.card}>
                            <div style={s.cardHead}>
                                <div>
                                    <div style={s.empName}>{t.employee}</div>
                                    <div style={s.meta}>{t.type} · {t.period}</div>
                                </div>
                                <div style={{ width: 40, height: 40, background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Target size={20} />
                                </div>
                            </div>

                            <div style={s.progressContainer}>
                                <div style={{ ...s.bar, width: `${percent}%` }} />
                            </div>

                            <div style={s.stats}>
                                <span style={s.current}>{t.current.toLocaleString()}</span>
                                <span style={s.target}>Goal: {t.target.toLocaleString()}</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', marginTop: 4, color: percent >= 100 ? 'var(--color-success)' : 'var(--text-tertiary)' }}>
                                {percent.toFixed(0)}% achieved
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
