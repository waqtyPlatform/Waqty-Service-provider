'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, Star, TrendingUp, DollarSign, Users, Award, Search } from 'lucide-react';
import { Select, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

/* ─── Mock Data ───────────────────────── */
interface PerformanceRow {
    id: string;
    employee: string;
    avatar: string;
    color: string;
    rating: number;
    reviews: number;
    revenue: number;
    bookings: number;
    retention: number;
    score: number;
}

const performanceData: PerformanceRow[] = [
    { id: 'E001', employee: 'Sara Ahmed', avatar: 'SA', color: '#10b981', rating: 4.9, reviews: 52, revenue: 45200, bookings: 124, retention: 85, score: 95 },
    { id: 'E002', employee: 'Nora Ali', avatar: 'NA', color: '#f59e0b', rating: 4.8, reviews: 45, revenue: 38400, bookings: 102, retention: 82, score: 90 },
    { id: 'E003', employee: 'Layla Hassan', avatar: 'LH', color: '#3b82f6', rating: 4.7, reviews: 38, revenue: 32100, bookings: 88, retention: 78, score: 85 },
    { id: 'E004', employee: 'Hana Youssef', avatar: 'HY', color: '#8b5cf6', rating: 4.6, reviews: 30, revenue: 28500, bookings: 76, retention: 75, score: 80 },
    { id: 'E005', employee: 'Reem Mohamed', avatar: 'RM', color: '#ec4899', rating: 4.5, reviews: 25, revenue: 24800, bookings: 65, retention: 72, score: 75 },
    { id: 'E006', employee: 'Dina Kamal', avatar: 'DK', color: '#6366f1', rating: 4.3, reviews: 18, revenue: 18200, bookings: 48, retention: 68, score: 65 },
];

/* ─── Styles ───────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    kpiIcon: { width: 44, height: 44, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    kpiVal: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' },
    kpiLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' },
    searchBox: { position: 'relative', width: '100%', maxWidth: 280 },
    searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' },
    searchInput: { width: '100%', height: 40, paddingLeft: 40, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' },
    tableWrapper: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'auto' },
    table: { width: '100%', minWidth: 800, borderCollapse: 'collapse' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' },
    avatar: { width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'var(--font-bold)', color: '#fff', flexShrink: 0 },
    empCell: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    progressBg: { width: '100%', height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: 4, transition: 'width 0.4s ease' },
    rankBadge: { width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'var(--font-bold)', color: '#fff' },
};

/* ─── Component ─────────────────────────── */
export default function PerformancePage() {
    const { t, lang } = useTranslation();
    const [period, setPeriod] = useState('month');
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        let data = [...performanceData];
        if (search) {
            data = data.filter(r => r.employee.toLowerCase().includes(search.toLowerCase()));
        }
        return data.sort((a, b) => b.score - a.score);
    }, [search]);

    const avgRating = (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1);
    const topPerformer = filtered[0]?.employee || '-';
    const avgRevenue = Math.round(filtered.reduce((s, r) => s + r.revenue, 0) / filtered.length);
    const totalBookings = filtered.reduce((s, r) => s + r.bookings, 0);

    const getRankColor = (i: number) => {
        if (i === 0) return '#f59e0b';
        if (i === 1) return '#94a3b8';
        if (i === 2) return '#cd7f32';
        return 'var(--text-tertiary)';
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'var(--color-success)';
        if (score >= 70) return 'var(--color-primary-500)';
        if (score >= 50) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    const kpis = [
        { icon: <Star size={20} />, bg: 'var(--color-warning-100)', color: 'var(--color-warning-600)', value: avgRating, label: t('perf.kpiAvgRating') },
        { icon: <Award size={20} />, bg: 'var(--color-success-100)', color: 'var(--color-success-600)', value: topPerformer, label: t('perf.kpiTopPerformer') },
        { icon: <DollarSign size={20} />, bg: 'var(--color-primary-100)', color: 'var(--color-primary-600)', value: `${(avgRevenue / 1000).toFixed(1)}K`, label: t('perf.kpiAvgRevenue') },
        { icon: <Users size={20} />, bg: 'var(--color-purple-100)', color: 'var(--color-purple-600)', value: totalBookings, label: t('perf.kpiTotalBookings') },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {/* KPIs */}
            <div style={s.kpis}>
                {kpis.map((kpi, i) => (
                    <div key={i} style={s.kpiCard}>
                        <div style={{ ...s.kpiIcon, background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
                        <div>
                            <div style={s.kpiVal}>{kpi.value}</div>
                            <div style={s.kpiLabel}>{kpi.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={s.toolbar}>
                <div style={s.searchBox as React.CSSProperties}>
                    <Search size={16} style={s.searchIcon as React.CSSProperties} />
                    <input style={s.searchInput} placeholder={t('perf.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    options={[
                        { value: 'month', label: t('perf.thisMonth') },
                        { value: 'lastMonth', label: t('perf.lastMonth') },
                        { value: 'quarter', label: t('perf.quarter') },
                    ]}
                    style={{ width: 160 }}
                />
            </div>

            {/* Performance Table */}
            <div style={s.tableWrapper}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th as React.CSSProperties}>#</th>
                            <th style={s.th as React.CSSProperties}>{t('perf.colEmployee')}</th>
                            <th style={s.th as React.CSSProperties}>{t('perf.colRating')}</th>
                            <th style={s.th as React.CSSProperties}>{t('perf.colRevenue')}</th>
                            <th style={s.th as React.CSSProperties}>{t('perf.colBookings')}</th>
                            <th style={s.th as React.CSSProperties}>{t('perf.colRetention')}</th>
                            <th style={{ ...s.th, minWidth: 160 } as React.CSSProperties}>{t('perf.colScore')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row, i) => (
                            <tr key={row.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                <td style={s.td}>
                                    <div style={{ ...s.rankBadge, background: getRankColor(i) }}>{i + 1}</div>
                                </td>
                                <td style={s.td}>
                                    <div style={s.empCell}>
                                        <div style={{ ...s.avatar, background: row.color }}>{row.avatar}</div>
                                        <span style={{ fontWeight: 'var(--font-medium)' }}>{row.employee}</span>
                                    </div>
                                </td>
                                <td style={s.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                                        <span style={{ fontWeight: 'var(--font-semibold)' }}>{row.rating}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>({row.reviews})</span>
                                    </div>
                                </td>
                                <td style={{ ...s.td, fontWeight: 'var(--font-semibold)', color: 'var(--color-success)' }} dir="ltr">{(row.revenue / 1000).toFixed(1)}K EGP</td>
                                <td style={s.td}>{row.bookings}</td>
                                <td style={s.td}>{row.retention}%</td>
                                <td style={s.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <div style={s.progressBg}>
                                            <div style={{ ...s.progressBar, width: `${row.score}%`, background: getScoreColor(row.score) }} />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 'var(--font-bold)', color: getScoreColor(row.score), minWidth: 32 }}>{row.score}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
