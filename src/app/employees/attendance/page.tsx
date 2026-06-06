'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, Download, Clock, Plus, Edit, Trash2, Fingerprint, Settings, Smartphone } from 'lucide-react';
import { SlideOver, Modal, Input, Select, Button, useToast, EmptyState } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import SubTabs from '@/components/SubTabs';
// Lazy-load sibling tab panels — only the active tab's chunk is fetched (see payroll host).
const AttendMethodsPage = dynamic(() => import('@/app/employees/attend-methods/page'), {
    ssr: false,
    loading: () => <div style={{ minHeight: 320 }} />,
});
const AttendanceSettingsPage = dynamic(() => import('@/app/employees/attendance-settings/page'), {
    ssr: false,
    loading: () => <div style={{ minHeight: 320 }} />,
});
const FingerprintsPage = dynamic(() => import('@/app/employees/fingerprints/page'), {
    ssr: false,
    loading: () => <div style={{ minHeight: 320 }} />,
});
import { providerApi, type AttendanceRecord, type Employee as ApiEmployee } from '@/lib/api';

const initialData = [
    {
        id: 'AT-001',
        employee: 'Sara Ahmed',
        date: '2026-03-24',
        checkIn: '08:55',
        checkOut: '18:05',
        hours: '9h 10m',
        late: false,
        overtime: '10m',
        status: 'present',
    },
    {
        id: 'AT-002',
        employee: 'Nora Ali',
        date: '2026-03-23',
        checkIn: '09:10',
        checkOut: '18:00',
        hours: '8h 50m',
        late: true,
        overtime: '0m',
        status: 'late',
    },
    {
        id: 'AT-003',
        employee: 'Layla Hassan',
        date: '2026-03-25',
        checkIn: '08:50',
        checkOut: '18:30',
        hours: '9h 40m',
        late: false,
        overtime: '40m',
        status: 'present',
    },
    {
        id: 'AT-004',
        employee: 'Hana Youssef',
        date: '2026-03-26',
        checkIn: '09:00',
        checkOut: '18:00',
        hours: '9h 0m',
        late: false,
        overtime: '0m',
        status: 'present',
    },
    {
        id: 'AT-005',
        employee: 'Reem Mohamed',
        date: '2026-03-24',
        checkIn: '-',
        checkOut: '-',
        hours: '-',
        late: false,
        overtime: '-',
        status: 'absent',
    },
    {
        id: 'AT-006',
        employee: 'Dina Nabil',
        date: '2026-03-24',
        checkIn: '08:45',
        checkOut: '17:00',
        hours: '8h 15m',
        late: false,
        overtime: '0m',
        status: 'early_leave',
    },
    {
        id: 'AT-007',
        employee: 'Sara Ahmed',
        date: '2026-03-15',
        checkIn: '09:00',
        checkOut: '18:00',
        hours: '9h 0m',
        late: false,
        overtime: '0m',
        status: 'present',
    },
    {
        id: 'AT-008',
        employee: 'Nora Ali',
        date: '2026-03-21',
        checkIn: '08:58',
        checkOut: '18:15',
        hours: '9h 17m',
        late: false,
        overtime: '17m',
        status: 'present',
    },
];

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    present: { label: ' Present', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    late: { label: ' Late', bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    absent: { label: ' Absent', bg: 'var(--color-error-light)', color: 'var(--color-error)' },
    early_leave: { label: ' Early Leave', bg: 'var(--color-info-light)', color: 'var(--color-info)' },
};

const s: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' },
    kpis: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' },
    kpi: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    kpiVal: { fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' },
    kpiLbl: { fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 2 },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
    },
    filterGroup: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 },
    searchBox: { position: 'relative', width: '100%', maxWidth: 320 },
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
    table: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
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
    badge: {
        display: 'inline-flex',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-full)',
        fontSize: 11,
        fontWeight: 'var(--font-semibold)',
    },
    actions: { display: 'flex', gap: 'var(--space-2)' },
    btnIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-primary)',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
    },
};

export default function AttendancePage() {
    const { t, lang } = useTranslation();
    const [records, setRecords] = useState(initialData);
    const [apiEmployees, setApiEmployees] = useState<ApiEmployee[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState(''); // Default to empty so all show
    const { addToast } = useToast();

    // Fetch real attendance data from API
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const today = new Date();
                const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
                const todayStr = today.toISOString().split('T')[0];

                const [attRes, empRes] = await Promise.allSettled([
                    providerApi.getAttendance({ date_from: monthStart, date_to: todayStr, per_page: 100 }),
                    providerApi.getEmployees(),
                ]);

                if (cancelled) return;

                if (empRes.status === 'fulfilled' && empRes.value.success && empRes.value.data) {
                    setApiEmployees(empRes.value.data);
                }

                if (attRes.status === 'fulfilled' && attRes.value.success && attRes.value.data) {
                    const mapped = attRes.value.data.map((r: AttendanceRecord) => {
                        const checkInTime = r.check_in
                            ? new Date(r.check_in).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                            : '-';
                        const checkOutTime = r.check_out
                            ? new Date(r.check_out).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                            : '-';
                        const hrs = r.working_minutes
                            ? `${Math.floor(r.working_minutes / 60)}h ${r.working_minutes % 60}m`
                            : '-';
                        const overtime =
                            r.working_minutes && r.working_minutes > 540 ? `${r.working_minutes - 540}m` : '0m';
                        const isLate = checkInTime !== '-' && checkInTime > '09:00';
                        const isEarlyLeave = checkOutTime !== '-' && checkOutTime < '18:00' && checkOutTime !== '-';
                        const status = !r.check_in
                            ? 'absent'
                            : isLate
                              ? 'late'
                              : isEarlyLeave
                                ? 'early_leave'
                                : 'present';

                        return {
                            id: r.uuid,
                            employee: r.employee?.name ?? 'Unknown',
                            date: r.check_in ? r.check_in.split('T')[0] : r.created_at.split('T')[0],
                            checkIn: checkInTime,
                            checkOut: checkOutTime,
                            hours: hrs,
                            late: isLate,
                            overtime,
                            status,
                        };
                    });
                    if (mapped.length > 0) setRecords(mapped);
                }
            } catch {
                // Keep mock data as fallback
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const getTranslatedStatus = (status: string) => {
        if (status === 'present') return t('attendance.kpiPresent');
        if (status === 'late') return t('attendance.kpiLate');
        if (status === 'absent') return t('attendance.kpiAbsent');
        if (status === 'early_leave') return t('attendance.kpiEarlyLeave');
        return status;
    };

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<(typeof records)[0] | null>(null);

    const getTodayStr = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    // Form
    const [formData, setFormData] = useState({
        employee: '',
        date: getTodayStr(),
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'present',
    });

    const filtered = records.filter(r => {
        const matchesSearch = r.employee.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        const matchesDate = !dateFilter || r.date === dateFilter;
        return matchesSearch && matchesStatus && matchesDate;
    });

    // KPIs based on current date filter (or all if no date selected)
    const kpiData = records.filter(r => !dateFilter || r.date === dateFilter);

    // Helper to calculate hours and overtime
    const calculateTime = (inTime: string, outTime: string) => {
        if (!inTime || !outTime || inTime === '-' || outTime === '-') return { hours: '-', overtime: '-' };

        const [inH, inM] = inTime.split(':').map(Number);
        const [outH, outM] = outTime.split(':').map(Number);

        let diffMins = outH * 60 + outM - (inH * 60 + inM);
        if (diffMins < 0) diffMins += 24 * 60; // Handle cross-midnight (unlikely but safe)

        const h = Math.floor(diffMins / 60);
        const m = diffMins % 60;

        // Assume 9 hours is standard shift
        const standardMins = 9 * 60;
        let ot = '0m';
        if (diffMins > standardMins) {
            const otDiff = diffMins - standardMins;
            const oth = Math.floor(otDiff / 60);
            const otm = otDiff % 60;
            ot = oth > 0 ? `${oth}h ${otm}m` : `${otm}m`;
        }

        return { hours: `${h}h ${m}m`, overtime: ot };
    };

    const handleSaveAdd = () => {
        if (!formData.employee) return addToast('error', t('attendance.toastAddReqEmp'));
        if (!formData.date) return addToast('error', t('attendance.toastAddReqDate'));

        let calculated = { hours: '-', overtime: '-' };
        if (formData.status !== 'absent') {
            calculated = calculateTime(formData.checkIn, formData.checkOut);
        }

        const newRecord = {
            id: `AT-${Date.now().toString().slice(-4)}`,
            employee: formData.employee,
            date: formData.date,
            checkIn: formData.status === 'absent' ? '-' : formData.checkIn,
            checkOut: formData.status === 'absent' ? '-' : formData.checkOut,
            hours: calculated.hours,
            late: formData.status === 'late',
            overtime: calculated.overtime,
            status: formData.status,
        };

        setRecords([newRecord, ...records]);
        setIsAddOpen(false);
        setFormData({ employee: '', date: getTodayStr(), checkIn: '09:00', checkOut: '18:00', status: 'present' });
        addToast('success', t('attendance.toastAddSuccess'));
    };

    const handleSaveEdit = () => {
        if (!formData.employee) return addToast('error', t('attendance.toastAddReqEmp'));
        if (!selectedRecord) return; // Should not happen if edit modal is open

        let calculated = { hours: '-', overtime: '-' };
        if (formData.status !== 'absent') {
            calculated = calculateTime(formData.checkIn, formData.checkOut);
        }

        setRecords(
            records.map(r =>
                r.id === selectedRecord.id
                    ? {
                          ...r,
                          employee: formData.employee,
                          date: formData.date,
                          checkIn: formData.status === 'absent' ? '-' : formData.checkIn,
                          checkOut: formData.status === 'absent' ? '-' : formData.checkOut,
                          hours: calculated.hours,
                          late: formData.status === 'late',
                          overtime: calculated.overtime,
                          status: formData.status,
                      }
                    : r
            )
        );

        setIsEditOpen(false);
        setSelectedRecord(null);
        addToast('success', t('attendance.toastUpdateSuccess'));
    };

    const handleDelete = () => {
        setRecords(records.filter(r => r.id !== selectedRecord?.id));
        setIsDeleteOpen(false);
        setSelectedRecord(null);
        addToast('success', t('attendance.toastDeleteSuccess'));
    };

    const openEdit = (r: (typeof records)[0]) => {
        setSelectedRecord(r);
        setFormData({
            employee: r.employee,
            date: r.date,
            checkIn: r.checkIn === '-' ? '09:00' : r.checkIn,
            checkOut: r.checkOut === '-' ? '18:00' : r.checkOut,
            status: r.status,
        });
        setIsEditOpen(true);
    };

    const subTabs = [
        { key: 'attendance', label: t('empLayout.tabAttendance'), icon: <Clock size={14} /> },
        { key: 'attendMethods', label: t('empLayout.tabAttendMethods'), icon: <Smartphone size={14} /> },
        { key: 'attendSettings', label: t('empLayout.tabAttendSettings'), icon: <Settings size={14} /> },
        { key: 'fingerprints', label: t('empLayout.tabFingerprints'), icon: <Fingerprint size={14} /> },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            {}
            <SubTabs tabs={subTabs} defaultTab="attendance">
                {{
                    attendance: (
                        <>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>
                                {t('attendance.title')}
                            </div>

                            <div style={s.kpis}>
                                <div style={s.kpi}>
                                    <div style={{ ...s.kpiVal, color: 'var(--color-success)' }}>
                                        {kpiData.filter(d => d.status === 'present').length}
                                    </div>
                                    <div style={s.kpiLbl}>{t('attendance.kpiPresent')}</div>
                                </div>
                                <div style={s.kpi}>
                                    <div style={{ ...s.kpiVal, color: 'var(--color-warning)' }}>
                                        {kpiData.filter(d => d.status === 'late').length}
                                    </div>
                                    <div style={s.kpiLbl}>{t('attendance.kpiLate')}</div>
                                </div>
                                <div style={s.kpi}>
                                    <div style={{ ...s.kpiVal, color: 'var(--color-error)' }}>
                                        {kpiData.filter(d => d.status === 'absent').length}
                                    </div>
                                    <div style={s.kpiLbl}>{t('attendance.kpiAbsent')}</div>
                                </div>
                                <div style={s.kpi}>
                                    <div style={{ ...s.kpiVal, color: 'var(--color-info)' }}>
                                        {kpiData.filter(d => d.status === 'early_leave').length}
                                    </div>
                                    <div style={s.kpiLbl}>{t('attendance.kpiEarlyLeave')}</div>
                                </div>
                            </div>

                            <div style={s.toolbar}>
                                <div style={s.filterGroup as React.CSSProperties}>
                                    <div style={s.searchBox as React.CSSProperties}>
                                        <Search size={16} style={s.searchIcon as React.CSSProperties} />
                                        <input
                                            style={{
                                                ...s.searchInput,
                                                paddingInlineEnd: 'var(--space-4)',
                                            }}
                                            placeholder={t('attendance.searchEmp')}
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        type="date"
                                        value={dateFilter}
                                        onChange={e => setDateFilter(e.target.value)}
                                        style={{ height: 40, margin: 0 }}
                                    />
                                    <Select
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value)}
                                        options={[
                                            { label: t('attendance.filterAll'), value: 'All' },
                                            { label: t('attendance.kpiPresent'), value: 'present' },
                                            { label: t('attendance.kpiLate'), value: 'late' },
                                            { label: t('attendance.kpiAbsent'), value: 'absent' },
                                            { label: t('attendance.kpiEarlyLeave'), value: 'early_leave' },
                                        ]}
                                        style={{ width: 140 }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                    <Button
                                        variant="outline"
                                        onClick={() => addToast('info', t('attendance.toastExporting'))}
                                    >
                                        <Download size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                                        {t('attendance.export')}
                                    </Button>
                                    <Button onClick={() => setIsAddOpen(true)}>
                                        <Plus size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />{' '}
                                        {t('attendance.addRecord')}
                                    </Button>
                                </div>
                            </div>

                            {filtered.length > 0 ? (
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            {[
                                                t('attendance.colEmp'),
                                                t('attendance.colDate'),
                                                t('attendance.colCheckIn'),
                                                t('attendance.colCheckOut'),
                                                t('attendance.colHours'),
                                                t('attendance.colOvertime'),
                                                t('attendance.colStatus'),
                                                t('attendance.colActions'),
                                            ].map(h => (
                                                <th
                                                    key={h}
                                                    style={{
                                                        ...(s.th as React.CSSProperties),
                                                        textAlign: 'start',
                                                    }}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(row => {
                                            const st = statusMap[row.status];
                                            return (
                                                <tr key={row.id} className="hoverRow">
                                                    <td
                                                        style={
                                                            {
                                                                ...s.td,
                                                                fontWeight: 'var(--font-medium)',
                                                                textAlign: 'start',
                                                            } as React.CSSProperties
                                                        }
                                                    >
                                                        {row.employee}
                                                    </td>
                                                    <td style={{ ...s.td, textAlign: 'start' }}>{row.date}</td>
                                                    <td style={{ ...s.td, textAlign: 'start' }}>{row.checkIn}</td>
                                                    <td style={{ ...s.td, textAlign: 'start' }}>{row.checkOut}</td>
                                                    <td style={{ ...s.td, textAlign: 'start' }}>{row.hours}</td>
                                                    <td
                                                        style={
                                                            {
                                                                ...s.td,
                                                                color:
                                                                    row.overtime !== '0m' && row.overtime !== '-'
                                                                        ? 'var(--color-primary-600)'
                                                                        : 'var(--text-tertiary)',
                                                                textAlign: 'start',
                                                            } as React.CSSProperties
                                                        }
                                                    >
                                                        {row.overtime}
                                                    </td>
                                                    <td style={{ ...s.td, textAlign: 'start' }}>
                                                        <span
                                                            style={{ ...s.badge, background: st.bg, color: st.color }}
                                                        >
                                                            {getTranslatedStatus(row.status)}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...s.td, textAlign: 'start' }}>
                                                        <div style={s.actions}>
                                                            <button
                                                                style={s.btnIcon}
                                                                onClick={() => openEdit(row)}
                                                                title={t('attendance.editRecordTooltip')}
                                                            >
                                                                <Edit size={14} />
                                                            </button>
                                                            <button
                                                                style={{ ...s.btnIcon, color: 'var(--color-error)' }}
                                                                onClick={() => {
                                                                    setSelectedRecord(row);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                title={t('attendance.deleteRecordTooltip')}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <EmptyState
                                    icon={<Clock size={32} color="var(--text-tertiary)" />}
                                    title={t('attendance.emptyTitle')}
                                    description={t('attendance.emptyDesc')}
                                />
                            )}

                            <style>{`
                .hoverRow:hover { background-color: var(--bg-secondary); }
                .hoverRow:last-child td { border-bottom: none !important; }
            `}</style>

                            {/* Add SlideOver */}
                            <SlideOver
                                open={isAddOpen}
                                onClose={() => setIsAddOpen(false)}
                                title={t('attendance.addModalTitle')}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                                            {t('attendance.cancel')}
                                        </Button>
                                        <Button onClick={handleSaveAdd}>{t('attendance.saveRecord')}</Button>
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <Select
                                        label={t('attendance.empNameLabel')}
                                        value={formData.employee}
                                        onChange={e => setFormData({ ...formData, employee: e.target.value })}
                                        options={[
                                            { value: '', label: t('attendance.selectEmployee') },
                                            ...(apiEmployees.length > 0
                                                ? apiEmployees.map(e => ({ value: e.name, label: e.name }))
                                                : Array.from(new Set(records.map(r => r.employee))).map(name => ({
                                                      value: name,
                                                      label: name,
                                                  }))),
                                        ]}
                                    />
                                    <Input
                                        type="date"
                                        label={t('attendance.dateLabel')}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <Select
                                        label={t('attendance.statusLabel')}
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        options={[
                                            { label: t('attendance.kpiPresent'), value: 'present' },
                                            { label: t('attendance.kpiLate'), value: 'late' },
                                            { label: t('attendance.kpiAbsent'), value: 'absent' },
                                            { label: t('attendance.kpiEarlyLeave'), value: 'early_leave' },
                                        ]}
                                    />

                                    {formData.status !== 'absent' && (
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 'var(--space-3)',
                                            }}
                                        >
                                            <Input
                                                type="time"
                                                label={t('attendance.checkInLabel')}
                                                value={formData.checkIn}
                                                onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                                            />
                                            <Input
                                                type="time"
                                                label={t('attendance.checkOutLabel')}
                                                value={formData.checkOut}
                                                onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </SlideOver>

                            {/* Edit SlideOver */}
                            <SlideOver
                                open={isEditOpen}
                                onClose={() => {
                                    setIsEditOpen(false);
                                    setSelectedRecord(null);
                                }}
                                title={t('attendance.editModalTitle')}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                                            {t('attendance.cancel')}
                                        </Button>
                                        <Button onClick={handleSaveEdit}>{t('attendance.saveChanges')}</Button>
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <Select
                                        label={t('attendance.empNameLabel')}
                                        value={formData.employee}
                                        onChange={e => setFormData({ ...formData, employee: e.target.value })}
                                        options={[
                                            { value: '', label: t('attendance.selectEmployee') },
                                            ...(apiEmployees.length > 0
                                                ? apiEmployees.map(e => ({ value: e.name, label: e.name }))
                                                : Array.from(new Set(records.map(r => r.employee))).map(name => ({
                                                      value: name,
                                                      label: name,
                                                  }))),
                                        ]}
                                    />
                                    <Input
                                        type="date"
                                        label={t('attendance.dateLabel')}
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <Select
                                        label={t('attendance.statusLabel')}
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        options={[
                                            { label: t('attendance.kpiPresent'), value: 'present' },
                                            { label: t('attendance.kpiLate'), value: 'late' },
                                            { label: t('attendance.kpiAbsent'), value: 'absent' },
                                            { label: t('attendance.kpiEarlyLeave'), value: 'early_leave' },
                                        ]}
                                    />

                                    {formData.status !== 'absent' && (
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 'var(--space-3)',
                                            }}
                                        >
                                            <Input
                                                type="time"
                                                label={t('attendance.checkInLabel')}
                                                value={formData.checkIn}
                                                onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                                            />
                                            <Input
                                                type="time"
                                                label={t('attendance.checkOutLabel')}
                                                value={formData.checkOut}
                                                onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                            </SlideOver>

                            {/* Delete Modal */}
                            <Modal
                                open={isDeleteOpen}
                                onClose={() => {
                                    setIsDeleteOpen(false);
                                    setSelectedRecord(null);
                                }}
                                title={t('attendance.deleteModalTitle')}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                                            {t('attendance.cancel')}
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete}>
                                            {t('attendance.deleteConfirmBtn')}
                                        </Button>
                                    </div>
                                }
                            >
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {t('attendance.deleteConfirmMsg1')}
                                    <strong>{selectedRecord?.employee}</strong>
                                    {t('attendance.deleteConfirmMsg2')}
                                    {selectedRecord?.date}
                                    {t('attendance.deleteConfirmMsg3')}
                                </p>
                            </Modal>
                        </>
                    ),
                    attendMethods: () => <AttendMethodsPage />,
                    attendSettings: () => <AttendanceSettingsPage />,
                    fingerprints: () => <FingerprintsPage />,
                }}
            </SubTabs>
        </div>
    );
}
