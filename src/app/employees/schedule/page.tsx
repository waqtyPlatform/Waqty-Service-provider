'use client';

import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    Plus,
    Coffee,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Button, Modal, Input, Select, Badge, useToast } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useApiQuery } from '@/hooks/useApiQuery';
import SubTabs from '@/components/SubTabs';
import TimeTrackingPage from '@/app/employees/time-tracking/page';
import {
    SHIFT_TEMPLATES,
    SHIFT_ASSIGNMENTS,
    detectConflicts,
    DEFAULT_BRANCH_HOURS,
    generateId,
    type ShiftTemplate,
    type DayKey,
} from '@/lib/shiftData';
import { providerApi, employeeExtApi } from '@/lib/api';

/* ─── Mock Data ───────────────────────── */
const days: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const daysAr = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];

interface Shift {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
    templateId?: string | null;
    templateColor?: string | null;
    templateName?: string | null;
}

interface ShiftRow {
    id: string;
    employee: string;
    role: string;
    avatar: string;
    color: string;
    shifts: Record<string, Shift | null>;
}

const mkShift = (
    start: string,
    end: string,
    bs = '13:00',
    be = '13:30',
    tplId?: string,
    tplName?: string,
    tplColor?: string
): Shift => ({
    start,
    end,
    breakStart: bs,
    breakEnd: be,
    templateId: tplId ?? null,
    templateName: tplName ?? null,
    templateColor: tplColor ?? null,
});

// Template shortcuts for seed data
const morning = (s: string, e: string, bs = '13:00', be = '13:30') =>
    mkShift(s, e, bs, be, 'TPL-001', 'Morning Shift', '#10b981');
const evening = (s: string, e: string, bs = '18:00', be = '18:30') =>
    mkShift(s, e, bs, be, 'TPL-002', 'Evening Shift', '#f59e0b');
const fullDay = (s: string, e: string, bs = '14:00', be = '14:30') =>
    mkShift(s, e, bs, be, 'TPL-003', 'Full Day Shift', '#3b82f6');
const weekend = (s: string, e: string, bs = '13:00', be = '13:30') =>
    mkShift(s, e, bs, be, 'TPL-004', 'Weekend Shift', '#8b5cf6');

const initialSchedule: ShiftRow[] = [
    {
        id: 'E001',
        employee: 'Sara Ahmed',
        role: 'Senior Stylist',
        avatar: 'SA',
        color: '#10b981',
        shifts: {
            Mon: morning('10:00', '18:00'),
            Tue: morning('10:00', '18:00'),
            Wed: morning('10:00', '18:00'),
            Thu: fullDay('10:00', '20:00', '14:00', '14:30'),
            Fri: evening('13:00', '22:00', '17:00', '17:30'),
            Sat: null,
            Sun: weekend('10:00', '16:00', '12:30', '13:00'),
        },
    },
    {
        id: 'E002',
        employee: 'Nora Ali',
        role: 'Skin Specialist',
        avatar: 'NA',
        color: '#f59e0b',
        shifts: {
            Mon: morning('09:00', '17:00', '12:00', '12:30'),
            Tue: morning('09:00', '17:00', '12:00', '12:30'),
            Wed: null,
            Thu: morning('09:00', '17:00', '12:00', '12:30'),
            Fri: evening('12:00', '20:00', '16:00', '16:30'),
            Sat: weekend('10:00', '16:00'),
            Sun: null,
        },
    },
    {
        id: 'E003',
        employee: 'Layla Hassan',
        role: 'Senior Therapist',
        avatar: 'LH',
        color: '#3b82f6',
        shifts: {
            Mon: fullDay('11:00', '19:00'),
            Tue: fullDay('11:00', '19:00'),
            Wed: fullDay('11:00', '19:00'),
            Thu: fullDay('11:00', '21:00', '15:00', '15:30'),
            Fri: null,
            Sat: weekend('10:00', '18:00'),
            Sun: weekend('10:00', '16:00', '12:30', '13:00'),
        },
    },
    {
        id: 'E004',
        employee: 'Hana Youssef',
        role: 'Nail Technician',
        avatar: 'HY',
        color: '#8b5cf6',
        shifts: {
            Mon: morning('08:00', '16:00', '12:00', '12:30'),
            Tue: morning('08:00', '16:00', '12:00', '12:30'),
            Wed: morning('08:00', '16:00', '12:00', '12:30'),
            Thu: morning('08:00', '16:00', '12:00', '12:30'),
            Fri: morning('08:00', '14:00', '11:00', '11:30'),
            Sat: null,
            Sun: null,
        },
    },
    {
        id: 'E005',
        employee: 'Reem Mohamed',
        role: 'Massage Therapist',
        avatar: 'RM',
        color: '#ec4899',
        shifts: {
            Mon: null,
            Tue: evening('12:00', '20:00', '16:00', '16:30'),
            Wed: evening('12:00', '20:00', '16:00', '16:30'),
            Thu: evening('12:00', '20:00', '16:00', '16:30'),
            Fri: evening('14:00', '22:00', '18:00', '18:30'),
            Sat: fullDay('11:00', '19:00'),
            Sun: fullDay('11:00', '17:00'),
        },
    },
    {
        id: 'E006',
        employee: 'Dina Kamal',
        role: 'Senior Stylist',
        avatar: 'DK',
        color: '#6366f1',
        shifts: {
            Mon: morning('10:00', '18:00'),
            Tue: null,
            Wed: morning('10:00', '18:00'),
            Thu: morning('10:00', '18:00'),
            Fri: evening('13:00', '21:00', '17:00', '17:30'),
            Sat: weekend('10:00', '16:00'),
            Sun: null,
        },
    },
];

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#6366f1', '#14b8a6'];

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
    tableWrapper: {
        width: '100%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'auto',
    },
    table: { width: '100%', minWidth: 900, borderCollapse: 'collapse' },
    th: {
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'center',
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
        textAlign: 'center',
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
    empCell: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textAlign: 'left' },
    shiftCell: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6px 10px',
        borderRadius: 'var(--radius-md)',
        fontSize: 12,
        lineHeight: 1.5,
        gap: 2,
    },
    offCell: { color: 'var(--text-tertiary)', fontSize: 12, fontStyle: 'italic' },
    breakRow: { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, opacity: 0.8 },
    conflictIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 9,
        color: 'var(--color-warning-600)',
        marginTop: 2,
    },
    tplBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 9,
        fontWeight: 'var(--font-bold)',
        padding: '1px 6px',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
    },
    tplBadgeDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
    dayCheckRow: { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' },
    dayCheck: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        transition: 'all 0.15s',
        userSelect: 'none',
    },
    dayCheckActive: {
        background: 'var(--color-primary-50)',
        borderColor: 'var(--color-primary-500)',
        color: 'var(--color-primary-700)',
    },
    empCheckRow: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: 200, overflow: 'auto' },
    empCheck: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    empCheckActive: { background: 'var(--color-primary-50)', borderColor: 'var(--color-primary-500)' },
    section: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
    sectionTitle: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
    },
    // Template management
    tplCard: {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
    },
    tplHeader: {
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        background: 'var(--bg-secondary)',
    },
    tplRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: '1px solid var(--border-color)',
    },
    tplInfo: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
    tplSwatch: { width: 20, height: 20, borderRadius: 'var(--radius-md)', border: '2px solid var(--border-color)' },
    tplTime: { fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' },
    colorRow: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
    colorOption: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        cursor: 'pointer',
        border: '3px solid transparent',
        transition: 'border-color 0.15s',
    },
    breakBox: {
        padding: 'var(--space-3)',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
    },
    breakLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--color-warning-600)',
    },
};

/* ─── Component ─────────────────────────── */
export default function SchedulePage() {
    const { t, lang } = useTranslation();
    const { addToast } = useToast();

    // API: fetch schedule data (ready for backend)
    const {
        loading: scheduleLoading,
        error: scheduleError,
        refetch: refetchSchedule,
    } = useApiQuery(() => employeeExtApi.getSchedule() as never, [], { fallbackData: initialSchedule });

    const [scheduleData, setScheduleData] = useState(initialSchedule);

    // Templates
    const [templates, setTemplates] = useState<ShiftTemplate[]>([...SHIFT_TEMPLATES]);
    const [tplExpanded, setTplExpanded] = useState(false);
    const [isTplFormOpen, setIsTplFormOpen] = useState(false);
    const [editingTplId, setEditingTplId] = useState<string | null>(null);
    const [tplForm, setTplForm] = useState({
        name: '',
        color: COLORS[0],
        start: '09:00',
        end: '17:00',
        breakStart: '13:00',
        breakEnd: '13:30',
    });

    // Unified Add Shift modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
    const [shiftTimes, setShiftTimes] = useState({
        start: '09:00',
        end: '17:00',
        breakStart: '13:00',
        breakEnd: '13:30',
    });

    const dayLabels = lang === 'ar' ? daysAr : days;

    // ── Fetch real data from API (graceful degradation) ──
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [empRes, tplRes] = await Promise.allSettled([
                    providerApi.getEmployees(),
                    providerApi.getShiftTemplates(),
                ]);

                if (cancelled) return;

                if (empRes.status === 'fulfilled' && empRes.value.data && empRes.value.data.length > 0) {
                    const apiRows: ShiftRow[] = empRes.value.data.map((e, i) => ({
                        id: e.uuid,
                        employee: e.name,
                        role: e.branch?.name || 'Staff',
                        avatar: e.name
                            .split(' ')
                            .map(w => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase(),
                        color: COLORS[i % COLORS.length],
                        shifts: {},
                    }));
                    setScheduleData(apiRows);
                }

                if (tplRes.status === 'fulfilled' && tplRes.value.data && tplRes.value.data.length > 0) {
                    const apiTemplates: ShiftTemplate[] = tplRes.value.data.map((t, i) => ({
                        id: t.uuid,
                        name: t.name,
                        color: COLORS[i % COLORS.length],
                        start: t.start_time,
                        end: t.end_time,
                        breakStart: t.break_start || '13:00',
                        breakEnd: t.break_end || '13:30',
                    }));
                    setTemplates(apiTemplates);
                }
            } catch {
                // API unavailable — keep mock data
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    /* ─── Template CRUD ─── */
    const openAddTpl = () => {
        setEditingTplId(null);
        setTplForm({
            name: '',
            color: COLORS[0],
            start: '09:00',
            end: '17:00',
            breakStart: '13:00',
            breakEnd: '13:30',
        });
        setIsTplFormOpen(true);
    };

    const openEditTpl = (tpl: ShiftTemplate) => {
        setEditingTplId(tpl.id);
        setTplForm({
            name: tpl.name,
            color: tpl.color,
            start: tpl.start,
            end: tpl.end,
            breakStart: tpl.breakStart,
            breakEnd: tpl.breakEnd,
        });
        setIsTplFormOpen(true);
    };

    const handleSaveTpl = () => {
        if (!tplForm.name.trim()) return;
        let updated: ShiftTemplate[];
        if (editingTplId) {
            updated = templates.map(t => (t.id === editingTplId ? { ...t, ...tplForm } : t));
        } else {
            updated = [...templates, { id: generateId('TPL'), ...tplForm }];
        }
        setTemplates(updated);
        SHIFT_TEMPLATES.length = 0;
        SHIFT_TEMPLATES.push(...updated);
        setIsTplFormOpen(false);
        addToast('success', editingTplId ? t('shifts.templateUpdated') : t('shifts.templateAdded'));
    };

    const handleDeleteTpl = (id: string) => {
        const updated = templates.filter(t => t.id !== id);
        setTemplates(updated);
        SHIFT_TEMPLATES.length = 0;
        SHIFT_TEMPLATES.push(...updated);
        // Cascade: remove assignments
        const remaining = SHIFT_ASSIGNMENTS.filter(a => a.templateId !== id);
        SHIFT_ASSIGNMENTS.length = 0;
        SHIFT_ASSIGNMENTS.push(...remaining);
        addToast('success', t('shifts.templateDeleted'));
    };

    /* ─── Unified Add Shift ─── */
    const handleTemplateSelect = (tplId: string) => {
        setSelectedTemplate(tplId);
        if (tplId) {
            const tpl = templates.find(t => t.id === tplId);
            if (tpl)
                setShiftTimes({ start: tpl.start, end: tpl.end, breakStart: tpl.breakStart, breakEnd: tpl.breakEnd });
        }
    };

    const toggleEmployee = (id: string) => {
        setSelectedEmployees(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));
    };

    const toggleDay = (day: DayKey) => {
        setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
    };

    const selectAllEmployees = () => {
        if (selectedEmployees.length === scheduleData.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(scheduleData.map(r => r.id));
        }
    };

    const selectAllDays = () => {
        if (selectedDays.length === days.length) {
            setSelectedDays([]);
        } else {
            setSelectedDays([...days]);
        }
    };

    const handleAddShift = () => {
        if (selectedEmployees.length === 0 || selectedDays.length === 0) return;
        const tpl = selectedTemplate ? templates.find(t => t.id === selectedTemplate) : null;

        setScheduleData(prev =>
            prev.map(row => {
                if (!selectedEmployees.includes(row.id)) return row;
                const updatedShifts = { ...row.shifts };
                for (const day of selectedDays) {
                    updatedShifts[day] = {
                        start: shiftTimes.start,
                        end: shiftTimes.end,
                        breakStart: shiftTimes.breakStart,
                        breakEnd: shiftTimes.breakEnd,
                        templateId: tpl?.id ?? null,
                        templateColor: tpl?.color ?? null,
                        templateName: tpl?.name ?? null,
                    };
                }
                return { ...row, shifts: updatedShifts };
            })
        );

        setIsAddOpen(false);
        addToast('success', t('schedule.shiftAdded'));
        setSelectedTemplate('');
        setSelectedEmployees([]);
        setSelectedDays([]);
        setShiftTimes({ start: '09:00', end: '17:00', breakStart: '13:00', breakEnd: '13:30' });
    };

    const openAddShift = () => {
        setSelectedTemplate('');
        setSelectedEmployees([]);
        setSelectedDays([]);
        setShiftTimes({ start: '09:00', end: '17:00', breakStart: '13:00', breakEnd: '13:30' });
        setIsAddOpen(true);
    };

    /* ─── Edit Employee Shift (per-day view) ─── */
    type EditDayEntry = { templateId: string; start: string; end: string; breakStart: string; breakEnd: string };
    const emptyDay: EditDayEntry = {
        templateId: '',
        start: '09:00',
        end: '17:00',
        breakStart: '13:00',
        breakEnd: '13:30',
    };
    const OFF = '__OFF__';

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editRow, setEditRow] = useState<ShiftRow | null>(null);
    const [editDays, setEditDays] = useState<Record<DayKey, EditDayEntry | null>>({
        Mon: null,
        Tue: null,
        Wed: null,
        Thu: null,
        Fri: null,
        Sat: null,
        Sun: null,
    });

    const openEditEmployee = (row: ShiftRow) => {
        setEditRow(row);
        const dayMap: Record<DayKey, EditDayEntry | null> = {
            Mon: null,
            Tue: null,
            Wed: null,
            Thu: null,
            Fri: null,
            Sat: null,
            Sun: null,
        };
        for (const day of days) {
            const shift = row.shifts[day];
            if (shift) {
                dayMap[day] = {
                    templateId: shift.templateId ?? 'custom',
                    start: shift.start,
                    end: shift.end,
                    breakStart: shift.breakStart,
                    breakEnd: shift.breakEnd,
                };
            }
        }
        setEditDays(dayMap);
        setIsEditOpen(true);
    };

    const setEditDayTemplate = (day: DayKey, tplId: string) => {
        if (tplId === OFF) {
            setEditDays(prev => ({ ...prev, [day]: null }));
            return;
        }
        if (tplId === 'custom') {
            const existing = editDays[day];
            setEditDays(prev => ({ ...prev, [day]: { ...(existing ?? emptyDay), templateId: 'custom' } }));
            return;
        }
        const tpl = templates.find(t => t.id === tplId);
        if (!tpl) return;
        setEditDays(prev => ({
            ...prev,
            [day]: {
                templateId: tpl.id,
                start: tpl.start,
                end: tpl.end,
                breakStart: tpl.breakStart,
                breakEnd: tpl.breakEnd,
            },
        }));
    };

    const handleSaveEdit = () => {
        if (!editRow) return;
        setScheduleData(prev =>
            prev.map(row => {
                if (row.id !== editRow.id) return row;
                const updatedShifts: Record<string, Shift | null> = {};
                for (const day of days) {
                    const entry = editDays[day];
                    if (!entry) {
                        updatedShifts[day] = null;
                        continue;
                    }
                    const tpl = entry.templateId !== 'custom' ? templates.find(t => t.id === entry.templateId) : null;
                    updatedShifts[day] = {
                        start: entry.start,
                        end: entry.end,
                        breakStart: entry.breakStart,
                        breakEnd: entry.breakEnd,
                        templateId: tpl?.id ?? null,
                        templateName: tpl?.name ?? null,
                        templateColor: tpl?.color ?? null,
                    };
                }
                return { ...row, shifts: updatedShifts };
            })
        );
        setIsEditOpen(false);
        addToast('success', t('schedule.shiftAdded'));
    };

    /* ─── KPIs ─── */
    const totalShifts = scheduleData.reduce((sum, row) => sum + Object.values(row.shifts).filter(Boolean).length, 0);
    const todayIndex = Math.min(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, 6);
    const todayDay = days[todayIndex];
    const onShiftToday = scheduleData.filter(row => row.shifts[todayDay] !== null).length;
    const offToday = scheduleData.length - onShiftToday;
    const avgHoursPerWeek = Math.round(
        scheduleData.reduce((sum, row) => {
            const hours = Object.values(row.shifts).reduce((h, shift) => {
                if (!shift) return h;
                const [sh, sm] = shift.start.split(':').map(Number);
                const [eh, em] = shift.end.split(':').map(Number);
                const [bsh, bsm] = shift.breakStart.split(':').map(Number);
                const [beh, bem] = shift.breakEnd.split(':').map(Number);
                const breakMins = beh * 60 + bem - (bsh * 60 + bsm);
                return h + (eh + em / 60) - (sh + sm / 60) - breakMins / 60;
            }, 0);
            return sum + hours;
        }, 0) / scheduleData.length
    );

    const kpis = [
        {
            icon: <Clock size={20} />,
            bg: 'var(--color-primary-50)',
            color: 'var(--color-primary-600)',
            value: `${avgHoursPerWeek}h`,
            label: t('schedule.kpiAvgHours'),
        },
        {
            icon: <Users size={20} />,
            bg: 'var(--color-success-100)',
            color: 'var(--color-success-600)',
            value: onShiftToday,
            label: t('schedule.kpiOnShift'),
        },
        {
            icon: <Calendar size={20} />,
            bg: 'var(--color-purple-100)',
            color: 'var(--color-purple-600)',
            value: totalShifts,
            label: t('schedule.kpiTotalShifts'),
        },
        {
            icon: <AlertTriangle size={20} />,
            bg: 'var(--color-warning-100)',
            color: 'var(--color-warning-600)',
            value: offToday,
            label: t('schedule.kpiOffToday'),
        },
    ];

    const subTabs = [
        { key: 'schedule', label: t('empLayout.tabSchedule'), icon: <Calendar size={14} /> },
        { key: 'timeTracking', label: t('empLayout.tabTimeTracking'), icon: <Clock size={14} /> },
    ];

    return (
        <div style={{ ...s.page, direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
            <SubTabs tabs={subTabs} defaultTab="schedule">
                {{
                    schedule: (
                        <>
                            {/* KPIs */}
                            <div style={s.kpis}>
                                {kpis.map((kpi, i) => (
                                    <div key={i} style={s.kpiCard}>
                                        <div style={{ ...s.kpiIcon, background: kpi.bg, color: kpi.color }}>
                                            {kpi.icon}
                                        </div>
                                        <div>
                                            <div style={s.kpiVal}>{kpi.value}</div>
                                            <div style={s.kpiLabel}>{kpi.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Templates Card (collapsible) */}
                            <div style={s.tplCard}>
                                <div style={s.tplHeader} onClick={() => setTplExpanded(!tplExpanded)}>
                                    <span
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: 'var(--font-semibold)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                        }}
                                    >
                                        <Clock size={16} /> {t('shifts.title')}
                                        <Badge color="neutral" size="sm">
                                            {templates.length}
                                        </Badge>
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <Button
                                            size="sm"
                                            onClick={e => {
                                                e.stopPropagation();
                                                openAddTpl();
                                            }}
                                        >
                                            <Plus size={14} />
                                        </Button>
                                        {tplExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>
                                {tplExpanded &&
                                    templates.map(tpl => (
                                        <div key={tpl.id} style={s.tplRow}>
                                            <div style={s.tplInfo}>
                                                <div style={{ ...s.tplSwatch, background: tpl.color }} />
                                                <div>
                                                    <div
                                                        style={{
                                                            fontWeight: 'var(--font-medium)',
                                                            fontSize: 'var(--text-sm)',
                                                        }}
                                                    >
                                                        {tpl.name}
                                                    </div>
                                                    <div style={s.tplTime}>
                                                        {tpl.start} → {tpl.end} ·{' '}
                                                        <Coffee size={10} style={{ display: 'inline' }} />{' '}
                                                        {tpl.breakStart}–{tpl.breakEnd}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                <Button variant="ghost" size="sm" onClick={() => openEditTpl(tpl)}>
                                                    <Edit size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteTpl(tpl.id)}
                                                >
                                                    <Trash2 size={14} style={{ color: 'var(--color-error-500)' }} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Toolbar */}
                            <div style={s.toolbar}>
                                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                    {t('schedule.weeklyTitle')}
                                </div>
                                <Button onClick={openAddShift}>
                                    <Plus size={16} /> {t('schedule.addShift')}
                                </Button>
                            </div>

                            {/* Schedule Table */}
                            <div style={s.tableWrapper}>
                                <table style={s.table}>
                                    <thead>
                                        <tr>
                                            <th
                                                style={
                                                    {
                                                        ...s.th,
                                                        textAlign: lang === 'ar' ? 'right' : 'left',
                                                        minWidth: 160,
                                                    } as React.CSSProperties
                                                }
                                            >
                                                {t('schedule.colEmployee')}
                                            </th>
                                            {dayLabels.map((d, i) => (
                                                <th
                                                    key={i}
                                                    style={
                                                        {
                                                            ...s.th,
                                                            background:
                                                                i === todayIndex
                                                                    ? 'var(--color-primary-50)'
                                                                    : undefined,
                                                        } as React.CSSProperties
                                                    }
                                                >
                                                    {d}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scheduleData.map(row => (
                                            <tr
                                                key={row.id}
                                                style={{ transition: 'background 0.15s' }}
                                                onMouseEnter={e =>
                                                    (e.currentTarget.style.background = 'var(--bg-secondary)')
                                                }
                                                onMouseLeave={e => (e.currentTarget.style.background = '')}
                                            >
                                                <td style={{ ...s.td, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                                    <div style={{ ...s.empCell, justifyContent: 'space-between' }}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-2)',
                                                            }}
                                                        >
                                                            <div style={{ ...s.avatar, background: row.color }}>
                                                                {row.avatar}
                                                            </div>
                                                            <div>
                                                                <span style={{ fontWeight: 'var(--font-medium)' }}>
                                                                    {row.employee}
                                                                </span>
                                                                <div
                                                                    style={{
                                                                        fontSize: 10,
                                                                        color: 'var(--text-tertiary)',
                                                                    }}
                                                                >
                                                                    {row.role}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditEmployee(row)}
                                                            title={t('schedule.editShift')}
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                                {days.map((day, di) => {
                                                    const shift = row.shifts[day];
                                                    const conflicts = shift
                                                        ? detectConflicts(DEFAULT_BRANCH_HOURS, row.id, day, shift)
                                                        : [];
                                                    const tplColor = shift?.templateColor;
                                                    const cellBg = tplColor
                                                        ? `${tplColor}18`
                                                        : 'var(--color-success-100)';
                                                    const cellText = tplColor ?? 'var(--color-success-700)';

                                                    return (
                                                        <td
                                                            key={day}
                                                            style={{
                                                                ...s.td,
                                                                background:
                                                                    di === todayIndex
                                                                        ? 'var(--color-primary-50)'
                                                                        : undefined,
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            {shift ? (
                                                                <div
                                                                    style={
                                                                        {
                                                                            ...s.shiftCell,
                                                                            background: cellBg,
                                                                            color: cellText,
                                                                        } as React.CSSProperties
                                                                    }
                                                                >
                                                                    {shift.templateName && (
                                                                        <div style={s.tplBadge}>
                                                                            <div
                                                                                style={{
                                                                                    ...s.tplBadgeDot,
                                                                                    background:
                                                                                        shift.templateColor ?? cellText,
                                                                                }}
                                                                            />
                                                                            {shift.templateName}
                                                                        </div>
                                                                    )}
                                                                    <span
                                                                        style={{ fontWeight: 'var(--font-semibold)' }}
                                                                    >
                                                                        {shift.start}
                                                                    </span>
                                                                    <span style={{ fontSize: 10, opacity: 0.7 }}>
                                                                        → {shift.end}
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            ...s.breakRow,
                                                                            color: 'var(--color-warning-600)',
                                                                        }}
                                                                    >
                                                                        <Coffee size={9} />
                                                                        <span>
                                                                            {shift.breakStart}–{shift.breakEnd}
                                                                        </span>
                                                                    </div>
                                                                    {conflicts.length > 0 && (
                                                                        <div
                                                                            style={s.conflictIcon}
                                                                            title={conflicts
                                                                                .map(c => c.detail)
                                                                                .join('\n')}
                                                                        >
                                                                            <AlertTriangle size={10} />{' '}
                                                                            {conflicts.length}
                                                                        </div>
                                                                    )}
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

                            {/* ═══ Unified Add Shift Modal ═══ */}
                            <Modal
                                title={t('schedule.addShiftTitle')}
                                open={isAddOpen}
                                onClose={() => setIsAddOpen(false)}
                                footer={
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {t('schedule.empByDays')
                                                .replace('{emps}', String(selectedEmployees.length))
                                                .replace('{days}', String(selectedDays.length))}
                                        </span>
                                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                                                {t('schedule.cancel')}
                                            </Button>
                                            <Button
                                                onClick={handleAddShift}
                                                disabled={selectedEmployees.length === 0 || selectedDays.length === 0}
                                            >
                                                {t('schedule.save')}
                                            </Button>
                                        </div>
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                                    {/* 1. Template or Custom */}
                                    <div style={s.section}>
                                        <Select
                                            label={t('schedule.useTemplate')}
                                            value={selectedTemplate}
                                            onChange={e => handleTemplateSelect(e.target.value)}
                                            options={[
                                                { value: '', label: t('schedule.customShift') },
                                                ...templates.map(tpl => ({
                                                    value: tpl.id,
                                                    label: `${tpl.name} (${tpl.start}–${tpl.end})`,
                                                })),
                                            ]}
                                        />

                                        {/* Preview selected template */}
                                        {selectedTemplate &&
                                            (() => {
                                                const tpl = templates.find(t => t.id === selectedTemplate);
                                                if (!tpl) return null;
                                                return (
                                                    <div
                                                        style={{
                                                            padding: 'var(--space-3)',
                                                            background: `${tpl.color}12`,
                                                            border: `1px solid ${tpl.color}40`,
                                                            borderRadius: 'var(--radius-lg)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 'var(--space-3)',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 12,
                                                                height: 12,
                                                                borderRadius: '50%',
                                                                background: tpl.color,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        <div style={{ fontSize: 'var(--text-sm)' }}>
                                                            <strong>{tpl.name}</strong>
                                                            <div
                                                                style={{
                                                                    color: 'var(--text-tertiary)',
                                                                    fontSize: 'var(--text-xs)',
                                                                }}
                                                            >
                                                                {tpl.start} → {tpl.end} · {t('shifts.colBreak')}:{' '}
                                                                {tpl.breakStart}–{tpl.breakEnd}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                        {/* Times — locked when template is selected */}
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 'var(--space-4)',
                                                opacity: selectedTemplate ? 0.6 : 1,
                                            }}
                                        >
                                            <Input
                                                label={t('schedule.startTime')}
                                                type="time"
                                                value={shiftTimes.start}
                                                onChange={e => setShiftTimes({ ...shiftTimes, start: e.target.value })}
                                                disabled={!!selectedTemplate}
                                            />
                                            <Input
                                                label={t('schedule.endTime')}
                                                type="time"
                                                value={shiftTimes.end}
                                                onChange={e => setShiftTimes({ ...shiftTimes, end: e.target.value })}
                                                disabled={!!selectedTemplate}
                                            />
                                        </div>

                                        <div style={{ ...s.breakBox, opacity: selectedTemplate ? 0.6 : 1 }}>
                                            <div style={s.breakLabel}>
                                                <Coffee size={16} /> {t('schedule.breakTime')}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: '1fr 1fr',
                                                    gap: 'var(--space-4)',
                                                }}
                                            >
                                                <Input
                                                    label={t('schedule.breakStart')}
                                                    type="time"
                                                    value={shiftTimes.breakStart}
                                                    onChange={e =>
                                                        setShiftTimes({ ...shiftTimes, breakStart: e.target.value })
                                                    }
                                                    disabled={!!selectedTemplate}
                                                />
                                                <Input
                                                    label={t('schedule.breakEnd')}
                                                    type="time"
                                                    value={shiftTimes.breakEnd}
                                                    onChange={e =>
                                                        setShiftTimes({ ...shiftTimes, breakEnd: e.target.value })
                                                    }
                                                    disabled={!!selectedTemplate}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Select Employees (multi-select) */}
                                    <div style={s.section}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span style={s.sectionTitle}>
                                                <Users size={16} /> {t('schedule.colEmployee')}
                                                {selectedEmployees.length > 0 && (
                                                    <Badge color="primary" size="sm">
                                                        {selectedEmployees.length}
                                                    </Badge>
                                                )}
                                            </span>
                                            <Button variant="ghost" size="sm" onClick={selectAllEmployees}>
                                                {selectedEmployees.length === scheduleData.length
                                                    ? t('schedule.deselectAll')
                                                    : t('schedule.selectAll')}
                                            </Button>
                                        </div>
                                        <div style={s.empCheckRow}>
                                            {scheduleData.map(r => {
                                                const active = selectedEmployees.includes(r.id);
                                                return (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => toggleEmployee(r.id)}
                                                        style={{ ...s.empCheck, ...(active ? s.empCheckActive : {}) }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={active}
                                                            readOnly
                                                            style={{ accentColor: 'var(--color-primary-500)' }}
                                                        />
                                                        <div
                                                            style={{
                                                                ...s.avatar,
                                                                background: r.color,
                                                                width: 26,
                                                                height: 26,
                                                                fontSize: 9,
                                                            }}
                                                        >
                                                            {r.avatar}
                                                        </div>
                                                        <div>
                                                            <div
                                                                style={{
                                                                    fontSize: 'var(--text-sm)',
                                                                    fontWeight: 'var(--font-medium)',
                                                                }}
                                                            >
                                                                {r.employee}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    color: 'var(--text-tertiary)',
                                                                }}
                                                            >
                                                                {r.role}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 3. Select Days */}
                                    <div style={s.section}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span style={s.sectionTitle}>
                                                <Calendar size={16} /> {t('schedule.applyDays')}
                                                {selectedDays.length > 0 && (
                                                    <Badge color="primary" size="sm">
                                                        {selectedDays.length}
                                                    </Badge>
                                                )}
                                            </span>
                                            <Button variant="ghost" size="sm" onClick={selectAllDays}>
                                                {selectedDays.length === days.length
                                                    ? t('schedule.deselectAll')
                                                    : t('schedule.selectAll')}
                                            </Button>
                                        </div>
                                        <div style={s.dayCheckRow}>
                                            {days.map((day, i) => {
                                                const active = selectedDays.includes(day);
                                                return (
                                                    <div
                                                        key={day}
                                                        onClick={() => toggleDay(day)}
                                                        style={{ ...s.dayCheck, ...(active ? s.dayCheckActive : {}) }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={active}
                                                            readOnly
                                                            style={{ accentColor: 'var(--color-primary-500)' }}
                                                        />
                                                        {dayLabels[i]}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Modal>

                            {/* ═══ Edit Employee Schedule Modal (per-day) ═══ */}
                            <Modal
                                title={t('schedule.editShift')}
                                open={isEditOpen}
                                onClose={() => setIsEditOpen(false)}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
                                            {t('schedule.cancel')}
                                        </Button>
                                        <Button onClick={handleSaveEdit}>{t('schedule.save')}</Button>
                                    </div>
                                }
                            >
                                {editRow && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        {/* Employee header */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-3)',
                                                padding: 'var(--space-3)',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: 'var(--radius-lg)',
                                            }}
                                        >
                                            <div style={{ ...s.avatar, background: editRow.color }}>
                                                {editRow.avatar}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 'var(--font-semibold)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    {editRow.employee}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 'var(--text-xs)',
                                                        color: 'var(--text-tertiary)',
                                                    }}
                                                >
                                                    {editRow.role}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Per-day rows */}
                                        <div
                                            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
                                        >
                                            {days.map((day, i) => {
                                                const entry = editDays[day];
                                                const currentTplId = entry ? entry.templateId : OFF;
                                                const isCustom = entry?.templateId === 'custom';
                                                const tplColor =
                                                    !isCustom && entry
                                                        ? templates.find(t => t.id === entry.templateId)?.color
                                                        : undefined;
                                                const update = (field: string, val: string) => {
                                                    setEditDays(prev => ({
                                                        ...prev,
                                                        [day]: { ...prev[day]!, [field]: val },
                                                    }));
                                                };

                                                return (
                                                    <div
                                                        key={day}
                                                        style={{
                                                            padding: 'var(--space-3)',
                                                            borderRadius: 'var(--radius-lg)',
                                                            border: '1px solid var(--border-color)',
                                                            background: entry
                                                                ? tplColor
                                                                    ? `${tplColor}08`
                                                                    : 'var(--bg-primary)'
                                                                : 'var(--bg-secondary)',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 'var(--space-3)',
                                                            }}
                                                        >
                                                            {/* Day label */}
                                                            <div
                                                                style={{
                                                                    width: 36,
                                                                    fontWeight: 'var(--font-semibold)',
                                                                    fontSize: 'var(--text-sm)',
                                                                    color: entry
                                                                        ? 'var(--text-primary)'
                                                                        : 'var(--text-tertiary)',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {dayLabels[i]}
                                                            </div>

                                                            {/* Template select */}
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <select
                                                                    value={currentTplId}
                                                                    onChange={e =>
                                                                        setEditDayTemplate(day, e.target.value)
                                                                    }
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '6px 8px',
                                                                        fontSize: 'var(--text-xs)',
                                                                        border: '1px solid var(--border-color)',
                                                                        borderRadius: 'var(--radius-md)',
                                                                        background: 'var(--bg-primary)',
                                                                        color: 'var(--text-primary)',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <option value={OFF}>{t('schedule.off')}</option>
                                                                    {templates.map(tpl => (
                                                                        <option key={tpl.id} value={tpl.id}>
                                                                            {tpl.name}
                                                                        </option>
                                                                    ))}
                                                                    <option value="custom">
                                                                        {t('schedule.customShift')}
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            {/* Time summary */}
                                                            <div
                                                                style={{
                                                                    fontSize: 'var(--text-xs)',
                                                                    color: 'var(--text-tertiary)',
                                                                    whiteSpace: 'nowrap',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {entry ? (
                                                                    <span>
                                                                        {entry.start} → {entry.end}
                                                                    </span>
                                                                ) : (
                                                                    <span>—</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Inline custom time inputs */}
                                                        {isCustom && entry && (
                                                            <div
                                                                style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: '1fr 1fr',
                                                                    gap: 'var(--space-2)',
                                                                    marginTop: 'var(--space-2)',
                                                                }}
                                                            >
                                                                <Input
                                                                    label={t('schedule.startTime')}
                                                                    type="time"
                                                                    value={entry.start}
                                                                    onChange={e => update('start', e.target.value)}
                                                                />
                                                                <Input
                                                                    label={t('schedule.endTime')}
                                                                    type="time"
                                                                    value={entry.end}
                                                                    onChange={e => update('end', e.target.value)}
                                                                />
                                                                <Input
                                                                    label={t('schedule.breakStart')}
                                                                    type="time"
                                                                    value={entry.breakStart}
                                                                    onChange={e => update('breakStart', e.target.value)}
                                                                />
                                                                <Input
                                                                    label={t('schedule.breakEnd')}
                                                                    type="time"
                                                                    value={entry.breakEnd}
                                                                    onChange={e => update('breakEnd', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </Modal>

                            {/* ═══ Template Add/Edit Modal ═══ */}
                            <Modal
                                title={editingTplId ? t('shifts.editTemplate') : t('shifts.addTemplate')}
                                open={isTplFormOpen}
                                onClose={() => setIsTplFormOpen(false)}
                                footer={
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                                        <Button variant="ghost" onClick={() => setIsTplFormOpen(false)}>
                                            {t('shifts.cancel')}
                                        </Button>
                                        <Button onClick={handleSaveTpl}>{t('shifts.save')}</Button>
                                    </div>
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <Input
                                        label={t('shifts.templateName')}
                                        value={tplForm.name}
                                        onChange={e => setTplForm({ ...tplForm, name: e.target.value })}
                                        placeholder={t('schedule.templateNamePlaceholder')}
                                    />

                                    <div>
                                        <div
                                            style={{
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-medium)',
                                                marginBottom: 'var(--space-2)',
                                            }}
                                        >
                                            {t('shifts.color')}
                                        </div>
                                        <div style={s.colorRow}>
                                            {COLORS.map(c => (
                                                <div
                                                    key={c}
                                                    onClick={() => setTplForm({ ...tplForm, color: c })}
                                                    style={{
                                                        ...s.colorOption,
                                                        background: c,
                                                        borderColor: tplForm.color === c ? c : 'transparent',
                                                        boxShadow:
                                                            tplForm.color === c
                                                                ? `0 0 0 2px var(--bg-primary), 0 0 0 4px ${c}`
                                                                : 'none',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 'var(--space-4)',
                                        }}
                                    >
                                        <Input
                                            label={t('shifts.startTime')}
                                            type="time"
                                            value={tplForm.start}
                                            onChange={e => setTplForm({ ...tplForm, start: e.target.value })}
                                        />
                                        <Input
                                            label={t('shifts.endTime')}
                                            type="time"
                                            value={tplForm.end}
                                            onChange={e => setTplForm({ ...tplForm, end: e.target.value })}
                                        />
                                    </div>

                                    <div style={s.breakBox}>
                                        <div style={s.breakLabel}>
                                            <Coffee size={16} /> {t('schedule.breakTime')}
                                        </div>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: 'var(--space-4)',
                                            }}
                                        >
                                            <Input
                                                label={t('shifts.breakStart')}
                                                type="time"
                                                value={tplForm.breakStart}
                                                onChange={e => setTplForm({ ...tplForm, breakStart: e.target.value })}
                                            />
                                            <Input
                                                label={t('shifts.breakEnd')}
                                                type="time"
                                                value={tplForm.breakEnd}
                                                onChange={e => setTplForm({ ...tplForm, breakEnd: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        </>
                    ),
                    timeTracking: <TimeTrackingPage />,
                }}
            </SubTabs>
        </div>
    );
}
