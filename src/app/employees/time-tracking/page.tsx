'use client';

import React, { useState, useMemo } from 'react';
import { Clock, Users, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { Select } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { employeeExtApi } from '@/lib/api';

/* ─── Mock Data ───────────────────────── */
interface TimeEntry {
    id: string;
    employee: string;
    avatar: string;
    color: string;
    date: string;
    clockIn: string;
    clockOut: string;
    totalHours: string;
    overtime: string;
    status: 'on_time' | 'late' | 'early_leave' | 'absent';
}

const timeData: TimeEntry[] = [
    {
        id: 'T001',
        employee: 'Sara Ahmed',
        avatar: 'SA',
        color: '#10b981',
        date: '2026-03-25',
        clockIn: '09:55',
        clockOut: '18:10',
        totalHours: '8h 15m',
        overtime: '10m',
        status: 'on_time',
    },
    {
        id: 'T002',
        employee: 'Nora Ali',
        avatar: 'NA',
        color: '#f59e0b',
        date: '2026-03-25',
        clockIn: '10:20',
        clockOut: '18:00',
        totalHours: '7h 40m',
        overtime: '-',
        status: 'late',
    },
    {
        id: 'T003',
        employee: 'Layla Hassan',
        avatar: 'LH',
        color: '#3b82f6',
        date: '2026-03-18',
        clockIn: '09:58',
        clockOut: '17:30',
        totalHours: '7h 32m',
        overtime: '-',
        status: 'early_leave',
    },
    {
        id: 'T004',
        employee: 'Hana Youssef',
        avatar: 'HY',
        color: '#8b5cf6',
        date: '2026-03-23',
        clockIn: '09:00',
        clockOut: '17:05',
        totalHours: '8h 05m',
        overtime: '5m',
        status: 'on_time',
    },
    {
        id: 'T005',
        employee: 'Reem Mohamed',
        avatar: 'RM',
        color: '#ec4899',
        date: '2026-03-26',
        clockIn: '-',
        clockOut: '-',
        totalHours: '-',
        overtime: '-',
        status: 'absent',
    },
    {
        id: 'T006',
        employee: 'Dina Kamal',
        avatar: 'DK',
        color: '#6366f1',
        date: '2026-03-21',
        clockIn: '09:50',
        clockOut: '18:30',
        totalHours: '8h 40m',
        overtime: '30m',
        status: 'on_time',
    },
    {
        id: 'T007',
        employee: 'Sara Ahmed',
        avatar: 'SA',
        color: '#10b981',
        date: '2026-03-21',
        clockIn: '09:58',
        clockOut: '18:05',
        totalHours: '8h 07m',
        overtime: '5m',
        status: 'on_time',
    },
    {
        id: 'T008',
        employee: 'Nora Ali',
        avatar: 'NA',
        color: '#f59e0b',
        date: '2026-03-20',
        clockIn: '09:55',
        clockOut: '18:00',
        totalHours: '8h 05m',
        overtime: '-',
        status: 'on_time',
    },
    {
        id: 'T009',
        employee: 'Layla Hassan',
        avatar: 'LH',
        color: '#3b82f6',
        date: '2026-03-14',
        clockIn: '10:15',
        clockOut: '18:00',
        totalHours: '7h 45m',
        overtime: '-',
        status: 'late',
    },
    {
        id: 'T010',
        employee: 'Hana Youssef',
        avatar: 'HY',
        color: '#8b5cf6',
        date: '2026-03-17',
        clockIn: '09:00',
        clockOut: '17:00',
        totalHours: '8h 00m',
        overtime: '-',
        status: 'on_time',
    },
];

/* ─── Styles ───────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' },
    kpiCard: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
    },
    kpiIcon: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    kpiVal: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)' },
    kpiLabel: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    searchBox: { position: 'relative', width: '100%', maxWidth: 280 },
    searchIcon: {
        position: 'absolute',
        insetInlineStart: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-tertiary)',
    },
    searchInput: {
        width: '100%',
        height: 40,
        paddingInlineStart: 40,
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-primary)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
    },
    tableWrapper: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'auto',
    },
    table: { width: '100%', minWidth: 800, borderCollapse: 'collapse' },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'start',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
    },
    td: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 'var(--font-bold)',
        color: '#fff',
        flexShrink: 0,
    },
    empCell: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    badge: {
        display: 'inline-flex',
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
    },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
    on_time: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    late: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    early_leave: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
    absent: { bg: 'var(--color-error-light)', color: 'var(--color-error)' },
};

/* ─── Component ─────────────────────────── */
export default function TimeTrackingPage() {
    const { t, lang } = useTranslation();

    // API: fetch time tracking entries (ready for backend)
    const {
        loading: timeLoading,
        error: timeError,
        refetch: refetchTime,
    } = useApiQuery(() => employeeExtApi.getTimeTracking() as never, [], { fallbackData: timeData });

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('2026-03-21');

    const statusLabels: Record<string, string> = {
        on_time: t('timeTrack.onTime'),
        late: t('timeTrack.late'),
        early_leave: t('timeTrack.earlyLeave'),
        absent: t('timeTrack.absent'),
    };

    const filtered = useMemo(() => {
        return timeData.filter(entry => {
            const matchesSearch = entry.employee.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
            const matchesDate = !dateFilter || entry.date === dateFilter;
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [search, statusFilter, dateFilter]);

    const todayEntries = timeData.filter(e => e.date === '2026-03-25');
    const clockedIn = todayEntries.filter(e => e.status !== 'absent').length;
    const lateToday = todayEntries.filter(e => e.status === 'late').length;
    const avgHours = '8h 05m';
    const weeklyOvertime = '1h 20m';

    const kpis = [
        {
            icon: <Clock size={20} />,
            bg: 'var(--color-primary-50)',
            color: 'var(--color-primary-600)',
            value: avgHours,
            label: t('timeTrack.kpiAvgHours'),
        },
        {
            icon: <Users size={20} />,
            bg: 'var(--color-success-100)',
            color: 'var(--color-success-600)',
            value: clockedIn,
            label: t('timeTrack.kpiClockedIn'),
        },
        {
            icon: <AlertTriangle size={20} />,
            bg: 'var(--color-warning-100)',
            color: 'var(--color-warning-600)',
            value: lateToday,
            label: t('timeTrack.kpiLate'),
        },
        {
            icon: <TrendingUp size={20} />,
            bg: 'var(--color-purple-100)',
            color: 'var(--color-purple-600)',
            value: weeklyOvertime,
            label: t('timeTrack.kpiOvertime'),
        },
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
                <div
                    style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}
                >
                    <div style={s.searchBox as React.CSSProperties}>
                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                        <input
                            style={s.searchInput}
                            placeholder={t('timeTrack.searchPlaceholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        options={[
                            { value: 'all', label: t('timeTrack.allStatuses') },
                            { value: 'on_time', label: t('timeTrack.onTime') },
                            { value: 'late', label: t('timeTrack.late') },
                            { value: 'early_leave', label: t('timeTrack.earlyLeave') },
                            { value: 'absent', label: t('timeTrack.absent') },
                        ]}
                        style={{ width: 160 }}
                    />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        style={{
                            height: 40,
                            padding: '0 var(--space-3)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--bg-primary)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                        }}
                    />
                </div>
            </div>

            {/* Time Tracking Table */}
            <div style={s.tableWrapper}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colEmployee')}</th>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colDate')}</th>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colClockIn')}</th>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colClockOut')}</th>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colTotalHours')}</th>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colOvertime')}</th>
                            <th style={s.th as React.CSSProperties}>{t('timeTrack.colStatus')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(entry => {
                            const sc = statusConfig[entry.status];
                            return (
                                <tr
                                    key={entry.id}
                                    style={{ transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                                >
                                    <td style={s.td}>
                                        <div style={s.empCell}>
                                            <div style={{ ...s.avatar, background: entry.color }}>{entry.avatar}</div>
                                            <span style={{ fontWeight: 'var(--font-medium)' }}>{entry.employee}</span>
                                        </div>
                                    </td>
                                    <td style={s.td}>{entry.date}</td>
                                    <td style={{ ...s.td, fontFamily: 'monospace' }}>{entry.clockIn}</td>
                                    <td style={{ ...s.td, fontFamily: 'monospace' }}>{entry.clockOut}</td>
                                    <td style={{ ...s.td, fontWeight: 'var(--font-semibold)' }}>{entry.totalHours}</td>
                                    <td
                                        style={{
                                            ...s.td,
                                            color:
                                                entry.overtime !== '-'
                                                    ? 'var(--color-warning)'
                                                    : 'var(--text-tertiary)',
                                        }}
                                    >
                                        {entry.overtime}
                                    </td>
                                    <td style={s.td}>
                                        <span style={{ ...s.badge, background: sc.bg, color: sc.color }}>
                                            {statusLabels[entry.status]}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
