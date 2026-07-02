'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, CheckCircle, Clock, Building2 } from 'lucide-react';
import { Select, Button } from '@/components/ui';
import { DataGuard } from '@/components/DataGuard';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import { providerApi, extractStr, type EmployeeAvailabilityStatus, type Branch } from '@/lib/api';

const mockAvailability: EmployeeAvailabilityStatus[] = [
    {
        employee_uuid: 'e1',
        employee_name: 'Sara Ahmed',
        branch_uuid: 'b1',
        branch_name: 'Main Branch',
        is_available: true,
        next_available_at: null,
    },
    {
        employee_uuid: 'e2',
        employee_name: 'Nora Ali',
        branch_uuid: 'b1',
        branch_name: 'Main Branch',
        is_available: false,
        next_available_at: '2026-05-09T14:00:00Z',
    },
    {
        employee_uuid: 'e3',
        employee_name: 'Layla Hassan',
        branch_uuid: 'b2',
        branch_name: 'Branch – Maadi',
        is_available: true,
        next_available_at: null,
    },
    {
        employee_uuid: 'e4',
        employee_name: 'Hana Youssef',
        branch_uuid: 'b2',
        branch_name: 'Branch – Maadi',
        is_available: false,
        next_available_at: '2026-05-09T16:30:00Z',
    },
    {
        employee_uuid: 'e5',
        employee_name: 'Reem Mohamed',
        branch_uuid: 'b1',
        branch_name: 'Main Branch',
        is_available: true,
        next_available_at: null,
    },
];

const AVATAR_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
    },
    title: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    subtitle: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        flexWrap: 'wrap',
    },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    kpi: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--space-1)',
    },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' },
    card: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--space-3)',
        transition: 'box-shadow 0.15s, border-color 0.15s',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--font-bold)',
        fontSize: 'var(--text-sm)',
        color: '#fff',
        flexShrink: 0,
    },
    name: { fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' },
    branch: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        marginTop: 2,
    },
    statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-1) var(--space-3)',
        borderRadius: 999,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
    },
    nextTime: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
    },
};

function formatNextAvailable(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    return `Free at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function AvailabilityPage() {
    const { lang } = useTranslation();
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    const [branches, setBranches] = useState<Branch[]>([]);

    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        providerApi
            .getBranches()
            .then(r => {
                if (r.success && r.data) setBranches(r.data);
            })
            .catch(() => {});
    }, []);

    const {
        data: liveAvailability,
        loading,
        error,
        isFallback,
        refetch,
    } = useApiQuery<EmployeeAvailabilityStatus[]>(
        () =>
            providerApi.getAvailability({
                branch_uuid: branchFilter !== 'all' ? branchFilter : undefined,
            }),
        [branchFilter],
        { fallbackData: mockAvailability }
    );

    // The live API serializes availability as { uuid, name, availability_status,
    // branch: { uuid, name } } — a different shape than the grid's EmployeeAvailabilityStatus.
    // Map it onto the grid shape (data-only; no UI change). isFallback / empty / unknown
    // shape all fall back to the mock so the grid always renders.
    const availability: EmployeeAvailabilityStatus[] = (() => {
        const raw = liveAvailability as unknown as Array<Record<string, unknown>> | null;
        const first = raw?.[0];
        if (raw && raw.length > 0 && first && !isFallback) {
            // live API shape
            if (typeof first.uuid === 'string' && 'availability_status' in first) {
                return raw.map(r => {
                    const branch = (r.branch ?? {}) as { uuid?: string; name?: string };
                    return {
                        employee_uuid: String(r.uuid ?? ''),
                        employee_name: (r.name ?? '') as EmployeeAvailabilityStatus['employee_name'],
                        branch_uuid: branch.uuid ?? '',
                        branch_name: branch.name ?? '',
                        is_available: r.availability_status === 'available',
                        next_available_at: (r.availability_updated_at as string | null) ?? null,
                    } satisfies EmployeeAvailabilityStatus;
                });
            }
            // already the grid shape
            if (typeof first.employee_uuid === 'string') {
                return liveAvailability as EmployeeAvailabilityStatus[];
            }
        }
        return mockAvailability;
    })();

    const filtered = availability.filter(a => {
        if (statusFilter === 'available' && !a.is_available) return false;
        if (statusFilter === 'busy' && a.is_available) return false;
        if (search) {
            const q = search.toLowerCase();
            if (
                !extractStr(a.employee_name).toLowerCase().includes(q) &&
                !extractStr(a.branch_name).toLowerCase().includes(q)
            )
                return false;
        }
        return true;
    });

    const availableCount = availability.filter(a => a.is_available).length;
    const busyCount = availability.filter(a => !a.is_available).length;

    return (
        <div style={{ ...s.page, direction: dir }}>
            {/* Header */}
            <div style={s.header}>
                <div>
                    <h1 style={s.title}>Employee Availability</h1>
                    <p style={s.subtitle}>Real-time status for all employees across branches</p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw size={14} style={{ marginInlineEnd: 'var(--space-2)' }} /> Refresh
                </Button>
            </div>

            {/* KPIs */}
            <div style={s.kpis}>
                {[
                    {
                        label: 'Available Now',
                        value: String(availableCount),
                        color: 'var(--color-success)',
                        icon: <CheckCircle size={20} />,
                    },
                    {
                        label: 'Currently Busy',
                        value: String(busyCount),
                        color: 'var(--color-warning)',
                        icon: <Clock size={20} />,
                    },
                    {
                        label: 'Total Employees',
                        value: String(availability.length),
                        color: 'var(--color-primary)',
                        icon: <Users size={20} />,
                    },
                    {
                        label: 'Branches',
                        value: String(new Set(availability.map(a => a.branch_uuid)).size),
                        color: 'var(--color-info)',
                        icon: <Building2 size={20} />,
                    },
                ].map(k => (
                    <div key={k.label} style={s.kpi}>
                        <span style={{ color: k.color }}>{k.icon}</span>
                        <span style={s.kpiVal}>{k.value}</span>
                        <span style={s.kpiLbl}>{k.label}</span>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div style={s.toolbar}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                    <Search
                        size={14}
                        style={{
                            position: 'absolute',
                            insetInlineStart: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-tertiary)',
                        }}
                    />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search employees or branches..."
                        style={{
                            width: '100%',
                            paddingInlineStart: 32,
                            paddingInlineEnd: 'var(--space-3)',
                            height: 36,
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            fontSize: 'var(--text-sm)',
                            color: 'var(--text-primary)',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <Select
                    value={branchFilter}
                    onChange={e => setBranchFilter(e.target.value)}
                    options={[
                        { value: 'all', label: 'All Branches' },
                        ...branches.map(b => ({ value: b.uuid, label: extractStr(b.name) })),
                    ]}
                />
                <Select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    options={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'available', label: 'Available' },
                        { value: 'busy', label: 'Busy' },
                    ]}
                />
            </div>

            {/* Grid */}
            <DataGuard
                loading={loading}
                error={error}
                data={filtered.length > 0 ? filtered : null}
                emptyIcon={<Users size={40} />}
                emptyTitle="No employees found"
                emptyDescription="Try adjusting your filters."
            >
                <div style={s.grid}>
                    {filtered.map((a, i) => {
                        const initials = extractStr(a.employee_name)
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase();
                        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                        return (
                            <div
                                key={a.employee_uuid}
                                style={{
                                    ...s.card,
                                    borderColor: a.is_available
                                        ? 'var(--color-success-light, #bbf7d0)'
                                        : 'var(--border-color)',
                                }}
                            >
                                <div style={s.cardHeader}>
                                    <div style={{ ...s.avatar, background: color }}>{initials}</div>
                                    <div>
                                        <div style={s.name}>{extractStr(a.employee_name)}</div>
                                        <div style={s.branch}>
                                            <Building2 size={11} /> {extractStr(a.branch_name)}
                                        </div>
                                    </div>
                                </div>
                                <div style={s.statusRow}>
                                    <span
                                        style={{
                                            ...s.badge,
                                            background: a.is_available
                                                ? 'var(--color-success-light)'
                                                : 'var(--color-warning-light)',
                                            color: a.is_available ? 'var(--color-success)' : 'var(--color-warning)',
                                        }}
                                    >
                                        {a.is_available ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {a.is_available ? 'Available' : 'Busy'}
                                    </span>
                                    {!a.is_available && a.next_available_at && (
                                        <span style={s.nextTime}>
                                            <Clock size={11} /> {formatNextAvailable(a.next_available_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DataGuard>
        </div>
    );
}
