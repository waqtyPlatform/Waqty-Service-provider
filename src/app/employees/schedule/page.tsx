'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, AlertTriangle, Plus, Edit, Trash2 } from 'lucide-react';
import { Button, Modal, Input, Select, useToast, Badge } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

/* ─── Mock Data ───────────────────────── */
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const daysAr = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

interface ShiftRow {
    id: string;
    employee: string;
    avatar: string;
    color: string;
    shifts: Record<string, { start: string; end: string } | null>;
}

const initialSchedule: ShiftRow[] = [
    { id: 'E001', employee: 'Sara Ahmed', avatar: 'SA', color: '#10b981', shifts: { Mon: { start: '10:00', end: '18:00' }, Tue: { start: '10:00', end: '18:00' }, Wed: { start: '10:00', end: '18:00' }, Thu: { start: '10:00', end: '20:00' }, Fri: { start: '13:00', end: '22:00' }, Sat: null, Sun: { start: '10:00', end: '16:00' } } },
    { id: 'E002', employee: 'Nora Ali', avatar: 'NA', color: '#f59e0b', shifts: { Mon: { start: '09:00', end: '17:00' }, Tue: { start: '09:00', end: '17:00' }, Wed: null, Thu: { start: '09:00', end: '17:00' }, Fri: { start: '12:00', end: '20:00' }, Sat: { start: '10:00', end: '16:00' }, Sun: null } },
    { id: 'E003', employee: 'Layla Hassan', avatar: 'LH', color: '#3b82f6', shifts: { Mon: { start: '11:00', end: '19:00' }, Tue: { start: '11:00', end: '19:00' }, Wed: { start: '11:00', end: '19:00' }, Thu: { start: '11:00', end: '21:00' }, Fri: null, Sat: { start: '10:00', end: '18:00' }, Sun: { start: '10:00', end: '16:00' } } },
    { id: 'E004', employee: 'Hana Youssef', avatar: 'HY', color: '#8b5cf6', shifts: { Mon: { start: '08:00', end: '16:00' }, Tue: { start: '08:00', end: '16:00' }, Wed: { start: '08:00', end: '16:00' }, Thu: { start: '08:00', end: '16:00' }, Fri: { start: '08:00', end: '14:00' }, Sat: null, Sun: null } },
    { id: 'E005', employee: 'Reem Mohamed', avatar: 'RM', color: '#ec4899', shifts: { Mon: null, Tue: { start: '12:00', end: '20:00' }, Wed: { start: '12:00', end: '20:00' }, Thu: { start: '12:00', end: '20:00' }, Fri: { start: '14:00', end: '22:00' }, Sat: { start: '11:00', end: '19:00' }, Sun: { start: '11:00', end: '17:00' } } },
    { id: 'E006', employee: 'Dina Kamal', avatar: 'DK', color: '#6366f1', shifts: { Mon: { start: '10:00', end: '18:00' }, Tue: null, Wed: { start: '10:00', end: '18:00' }, Thu: { start: '10:00', end: '18:00' }, Fri: { start: '13:00', end: '21:00' }, Sat: { start: '10:00', end: '16:00' }, Sun: null } },
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
    tableWrapper: { width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'auto' },
    table: { width: '100%', minWidth: 900, borderCollapse: 'collapse' },
    th: { padding: 'var(--space-3) var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' },
    td: { padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', textAlign: 'center' },
    avatar: { width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'var(--font-bold)', color: '#fff', flexShrink: 0 },
    empCell: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textAlign: 'left' },
    shiftCell: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', padding: '4px 10px', borderRadius: 'var(--radius-md)', fontSize: 12, lineHeight: 1.4 },
    offCell: { color: 'var(--text-tertiary)', fontSize: 12, fontStyle: 'italic' },
};

/* ─── Component ─────────────────────────── */
export default function SchedulePage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();
    const [scheduleData, setScheduleData] = useState(initialSchedule);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newShift, setNewShift] = useState({ employee: '', day: 'Mon', start: '09:00', end: '17:00' });

    const dayLabels = lang === 'ar' ? daysAr : days;

    // KPI calculations
    const totalShifts = scheduleData.reduce((sum, row) => sum + Object.values(row.shifts).filter(Boolean).length, 0);
    const todayIndex = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6);
    const todayDay = days[todayIndex];
    const onShiftToday = scheduleData.filter(row => row.shifts[todayDay] !== null).length;
    const offToday = scheduleData.length - onShiftToday;
    const avgHoursPerWeek = Math.round(scheduleData.reduce((sum, row) => {
        const hours = Object.values(row.shifts).reduce((h, shift) => {
            if (!shift) return h;
            const [sh, sm] = shift.start.split(':').map(Number);
            const [eh, em] = shift.end.split(':').map(Number);
            return h + (eh + em / 60) - (sh + sm / 60);
        }, 0);
        return sum + hours;
    }, 0) / scheduleData.length);

    const handleAddShift = () => {
        if (!newShift.employee) return;
        setScheduleData(prev => prev.map(row => {
            if (row.employee === newShift.employee) {
                return { ...row, shifts: { ...row.shifts, [newShift.day]: { start: newShift.start, end: newShift.end } } };
            }
            return row;
        }));
        setIsAddOpen(false);
        addToast('success', t('schedule.shiftAdded'));
        setNewShift({ employee: '', day: 'Mon', start: '09:00', end: '17:00' });
    };

    const handleRemoveShift = (empId: string, day: string) => {
        setScheduleData(prev => prev.map(row => {
            if (row.id === empId) {
                return { ...row, shifts: { ...row.shifts, [day]: null } };
            }
            return row;
        }));
        addToast('warning', t('schedule.shiftRemoved'));
    };

    const kpis = [
        { icon: <Clock size={20} />, bg: 'var(--color-primary-50)', color: 'var(--color-primary-600)', value: `${avgHoursPerWeek}h`, label: t('schedule.kpiAvgHours') },
        { icon: <Users size={20} />, bg: 'var(--color-success-100)', color: 'var(--color-success-600)', value: onShiftToday, label: t('schedule.kpiOnShift') },
        { icon: <Calendar size={20} />, bg: 'var(--color-purple-100)', color: 'var(--color-purple-600)', value: totalShifts, label: t('schedule.kpiTotalShifts') },
        { icon: <AlertTriangle size={20} />, bg: 'var(--color-warning-100)', color: 'var(--color-warning-600)', value: offToday, label: t('schedule.kpiOffToday') },
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
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                    {t('schedule.weeklyTitle')}
                </div>
                <Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> {t('schedule.addShift')}</Button>
            </div>

            {/* Schedule Table */}
            <div style={s.tableWrapper}>
                <table style={s.table}>
                    <thead>
                        <tr>
                            <th style={{ ...s.th, textAlign: lang === 'ar' ? 'right' : 'left', minWidth: 160 } as React.CSSProperties}>{t('schedule.colEmployee')}</th>
                            {dayLabels.map((d, i) => (
                                <th key={i} style={{ ...s.th, background: i === todayIndex ? 'var(--color-primary-50)' : undefined } as React.CSSProperties}>
                                    {d}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map(row => (
                            <tr key={row.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    <div style={s.empCell}>
                                        <div style={{ ...s.avatar, background: row.color }}>{row.avatar}</div>
                                        <span style={{ fontWeight: 'var(--font-medium)' }}>{row.employee}</span>
                                    </div>
                                </td>
                                {days.map((day, di) => {
                                    const shift = row.shifts[day];
                                    return (
                                        <td key={day} style={{ ...s.td, background: di === todayIndex ? 'var(--color-primary-50)' : undefined, position: 'relative' }}>
                                            {shift ? (
                                                <div style={{ ...s.shiftCell, background: 'var(--color-success-100)', color: 'var(--color-success-700)' } as React.CSSProperties}>
                                                    <span style={{ fontWeight: 'var(--font-semibold)' }}>{shift.start}</span>
                                                    <span style={{ fontSize: 10, opacity: 0.7 }}>→ {shift.end}</span>
                                                </div>
                                            ) : (
                                                <span style={s.offCell}>{t('schedule.off')}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Shift Modal */}
            <Modal
                title={t('schedule.addShiftTitle')}
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>{t('schedule.cancel')}</Button>
                        <Button onClick={handleAddShift}>{t('schedule.save')}</Button>
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Select
                        label={t('schedule.colEmployee')}
                        value={newShift.employee}
                        onChange={e => setNewShift({ ...newShift, employee: e.target.value })}
                        options={[{ value: '', label: t('schedule.selectEmployee') }, ...scheduleData.map(r => ({ value: r.employee, label: r.employee }))]}
                    />
                    <Select
                        label={t('schedule.day')}
                        value={newShift.day}
                        onChange={e => setNewShift({ ...newShift, day: e.target.value })}
                        options={days.map((d, i) => ({ value: d, label: dayLabels[i] }))}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input label={t('schedule.startTime')} type="time" value={newShift.start} onChange={e => setNewShift({ ...newShift, start: e.target.value })} />
                        <Input label={t('schedule.endTime')} type="time" value={newShift.end} onChange={e => setNewShift({ ...newShift, end: e.target.value })} />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
