'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, Filter, CalendarDays, Clock, Building2, AlertTriangle } from 'lucide-react';
import styles from './bookings.module.css';
import BookingsTabs from './BookingsTabs';
import { useTranslation } from '@/hooks/useTranslation';
import { isEmployeeOnShift } from '@/lib/shiftData';
import { providerApi, getImageUrl, type Employee } from '@/lib/api';
import type { BookingStatus } from '@/lib/contract';
import { egp } from '@/lib/money';
import { Modal, Select, Button } from '@/components/ui';
import {
    type VisitView,
    type VisitSeed,
    buildVisitView,
    visitViewFromBooking,
    hhmm,
    STATUS_ORDER,
    STATUS_LABEL_KEY,
} from './_visits';
import { loadLocalVisits } from './_localBookings';

// Local-date YYYY-MM-DD. Plain toISOString() converts to UTC and, for UTC+ zones
// (Egypt is UTC+2/+3), a local-midnight Date lands on the PREVIOUS calendar day —
// which made the calendar fetch/deep-link the wrong day. The booking date is a
// local calendar day, so normalize before slicing.
function toLocalDateStr(d: Date): string {
    const x = new Date(d);
    x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
    return x.toISOString().split('T')[0];
}

interface CalEmployee {
    name: string;
    initials: string;
    color: string;
    status: string;
    empId: string;
    role: string;
    uuid: string;
}

const fallbackEmployees: CalEmployee[] = [
    {
        name: 'Sara A.',
        initials: 'SA',
        color: '#8B5CF6',
        status: 'Available',
        empId: 'E001',
        role: 'Senior Stylist',
        uuid: 'emp-1',
    },
    {
        name: 'Nora A.',
        initials: 'NA',
        color: '#EC4899',
        status: 'In Session',
        empId: 'E002',
        role: 'Skin Specialist',
        uuid: 'emp-2',
    },
    {
        name: 'Layla H.',
        initials: 'LH',
        color: '#3B82F6',
        status: 'Available',
        empId: 'E003',
        role: 'Senior Therapist',
        uuid: 'emp-3',
    },
    {
        name: 'Reem M.',
        initials: 'RM',
        color: '#10B981',
        status: 'Break',
        empId: 'E005',
        role: 'Massage Therapist',
        uuid: 'emp-4',
    },
    {
        name: 'Hana Y.',
        initials: 'HY',
        color: '#F59E0B',
        status: 'Available',
        empId: 'E004',
        role: 'Nail Technician',
        uuid: 'emp-5',
    },
];

const empColors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#F97316', '#6366F1', '#14B8A6'];

function mapApiEmployees(apiEmployees: Employee[]): CalEmployee[] {
    return apiEmployees.map((emp, i) => ({
        name: emp.name,
        initials: emp.name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        color: empColors[i % empColors.length],
        status: 'Available', // GAP: API has no real-time employee availability status
        empId: emp.uuid,
        role: '', // GAP: API has no employee role/title/specialization
        uuid: emp.uuid,
    }));
}

const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
];

// A grid block = one canonical VisitLineItem positioned in an employee column.
// A multi-line Visit therefore renders as several blocks (across columns/slots).
interface CalBlock {
    empIndex: number;
    startSlot: number;
    span: number;
    client: string;
    service: string;
    status: BookingStatus;
    visitId: string;
}

/** Flatten canonical visits into positioned grid blocks (one per line item). */
function visitsToBlocks(visits: VisitView[], employees: CalEmployee[], slots: string[]): CalBlock[] {
    const blocks: CalBlock[] = [];
    for (const v of visits) {
        for (const l of v.lines) {
            // Match the line's specialist to a column by uuid; if that misses (a
            // booking created from the mock catalogue carries different employee
            // ids than the calendar's fallback columns), fall back to the first-name
            // token. uuid wins, so live API data is matched exactly as before.
            let empIndex = employees.findIndex(e => e.uuid && e.uuid === l.line.employee_uuid);
            if (empIndex === -1 && l.employeeName) {
                const first = l.employeeName.trim().split(/\s+/)[0].toLowerCase();
                empIndex = employees.findIndex(e => e.name.trim().split(/\s+/)[0].toLowerCase() === first);
            }
            if (empIndex === -1) continue; // specialist not in current columns
            const startSlot = slots.indexOf(hhmm(l.line.start_time));
            if (startSlot === -1) continue; // outside displayed range
            blocks.push({
                empIndex,
                startSlot,
                span: Math.max(1, Math.round(l.line.duration_minutes / 30)),
                client: v.clientName,
                service: l.serviceName,
                status: v.visit.status,
                visitId: v.visit.uuid,
            });
        }
    }
    return blocks;
}

// Mock day, seeded as canonical visits (incl. two multi-line visits: BK-9006
// runs across two specialists, BK-9007 chains two services on one specialist).
const CAL_SEED: VisitSeed[] = [
    {
        id: 'BK-1042',
        branch: 'Downtown',
        client: 'Fatima R.',
        mobile: '+20 123 456 789',
        date: '2026-03-23',
        time: '09:00',
        status: 'confirmed',
        payment: 'paid',
        payMethod: 'Card',
        lines: [
            { service: 'Hair Coloring', employee: 'Sara A.', employeeUuid: 'emp-1', priceMajor: 520, durationMin: 90 },
        ],
    },
    {
        id: 'BK-1041',
        branch: 'Downtown',
        client: 'Aisha M.',
        mobile: '+20 111 222 333',
        date: '2026-03-23',
        time: '12:00',
        status: 'completed',
        payment: 'paid',
        payMethod: 'Cash',
        lines: [{ service: 'Haircut', employee: 'Sara A.', employeeUuid: 'emp-1', priceMajor: 180, durationMin: 60 }],
    },
    {
        id: 'BK-1039',
        branch: 'Downtown',
        client: 'Huda S.',
        mobile: '+20 155 666 777',
        date: '2026-03-23',
        time: '09:30',
        status: 'in_progress',
        payment: 'partial',
        payMethod: 'Cash',
        lines: [{ service: 'Keratin', employee: 'Nora A.', employeeUuid: 'emp-2', priceMajor: 800, durationMin: 120 }],
    },
    {
        id: 'BK-1038',
        branch: 'Downtown',
        client: 'Noura A.',
        mobile: '+20 199 888 999',
        date: '2026-03-23',
        time: '13:00',
        status: 'confirmed',
        payment: 'pending',
        payMethod: '—',
        lines: [{ service: 'Facial', employee: 'Nora A.', employeeUuid: 'emp-2', priceMajor: 300, durationMin: 60 }],
    },
    {
        id: 'BK-9006',
        branch: 'Downtown',
        client: 'Mona Adel',
        mobile: '+20 122 345 678',
        date: '2026-03-23',
        time: '10:30',
        status: 'in_progress',
        payment: 'partial',
        payMethod: 'Cash',
        lines: [
            {
                service: 'Haircut & Styling',
                employee: 'Sara A.',
                employeeUuid: 'emp-1',
                priceMajor: 180,
                durationMin: 60,
            },
            { service: 'Gel Manicure', employee: 'Hana Y.', employeeUuid: 'emp-5', priceMajor: 130, durationMin: 45 },
        ],
    },
    {
        id: 'BK-1036',
        branch: 'Downtown',
        client: 'Dana F.',
        mobile: '+20 177 333 222',
        date: '2026-03-23',
        time: '09:00',
        status: 'completed',
        payment: 'paid',
        payMethod: 'Card',
        lines: [{ service: 'Manicure', employee: 'Layla H.', employeeUuid: 'emp-3', priceMajor: 200, durationMin: 60 }],
    },
    {
        id: 'BK-9007',
        branch: 'Downtown',
        client: 'Sara Q.',
        mobile: '+20 144 222 111',
        date: '2026-03-23',
        time: '14:00',
        status: 'confirmed',
        payment: 'pending',
        payMethod: '—',
        lines: [
            { service: 'Facial', employee: 'Layla H.', employeeUuid: 'emp-3', priceMajor: 280, durationMin: 60 },
            {
                service: 'Swedish Massage',
                employee: 'Layla H.',
                employeeUuid: 'emp-3',
                priceMajor: 350,
                durationMin: 60,
            },
        ],
    },
    {
        id: 'BK-1033',
        branch: 'Downtown',
        client: 'Yara B.',
        mobile: '+20 188 999 000',
        date: '2026-03-23',
        time: '10:00',
        status: 'confirmed',
        payment: 'partial',
        payMethod: 'Cash',
        lines: [{ service: 'Massage', employee: 'Reem M.', employeeUuid: 'emp-4', priceMajor: 350, durationMin: 90 }],
    },
    {
        id: 'BK-1030',
        branch: 'Downtown',
        client: 'Joud W.',
        mobile: '+20 166 222 333',
        date: '2026-03-23',
        time: '09:00',
        status: 'cancelled',
        payment: 'pending',
        payMethod: '—',
        lines: [{ service: 'Gel Nails', employee: 'Hana Y.', employeeUuid: 'emp-5', priceMajor: 180, durationMin: 45 }],
    },
    {
        id: 'BK-1031',
        branch: 'Downtown',
        client: 'Rana Z.',
        mobile: '+20 155 222 444',
        date: '2026-03-23',
        time: '14:00',
        status: 'no_show',
        payment: 'pending',
        payMethod: '—',
        lines: [{ service: 'Laser', employee: 'Reem M.', employeeUuid: 'emp-4', priceMajor: 250, durationMin: 60 }],
    },
];

const mockCalVisits: VisitView[] = CAL_SEED.map(buildVisitView);

// ─── Queue numbering & expected start time ──────────────────────────────────

/** Compute daily queue numbers per employee (sorted by startSlot). */
function computeQueueNumbers(blocks: CalBlock[]): Map<CalBlock, number> {
    const map = new Map<CalBlock, number>();
    const byEmp = new Map<number, CalBlock[]>();
    for (const b of blocks) {
        if (b.status === 'cancelled') continue;
        const list = byEmp.get(b.empIndex) || [];
        list.push(b);
        byEmp.set(b.empIndex, list);
    }
    for (const [, list] of byEmp) {
        list.sort((a, b) => a.startSlot - b.startSlot);
        list.forEach((b, i) => map.set(b, i + 1));
    }
    return map;
}

/**
 * Calculate expected start time for a block, considering preceding blocks for
 * the same employee. Completed/cancelled blocks don't cause delay.
 */
function getExpectedStartTime(
    block: CalBlock,
    allBlocks: CalBlock[],
    slots: string[]
): { expected: string; scheduled: string; delayMins: number } {
    const scheduled = slots[block.startSlot] || '09:00';
    const empBlocks = allBlocks
        .filter(b => b.empIndex === block.empIndex && b.status !== 'cancelled')
        .sort((a, b) => a.startSlot - b.startSlot);

    let runningEndMinutes = 0; // minutes from 09:00
    for (const b of empBlocks) {
        if (b === block) break;
        const bScheduledStart = b.startSlot * 30;
        const bDuration = b.span * 30;
        if (b.status === 'completed') {
            runningEndMinutes = bScheduledStart + bDuration;
        } else {
            const actualStart = Math.max(bScheduledStart, runningEndMinutes);
            runningEndMinutes = actualStart + bDuration;
        }
    }

    const scheduledMinutes = block.startSlot * 30;
    const expectedMinutes = Math.max(scheduledMinutes, runningEndMinutes);
    const delayMins = expectedMinutes - scheduledMinutes;

    const baseHour = 9;
    const expectedH = Math.floor(expectedMinutes / 60) + baseHour;
    const expectedM = expectedMinutes % 60;
    const expected = `${String(expectedH).padStart(2, '0')}:${String(expectedM).padStart(2, '0')}`;

    return { expected, scheduled, delayMins };
}

const statusBlockClass: Record<BookingStatus, string> = {
    pending: styles.blockUnconfirmed,
    confirmed: styles.blockConfirmed,
    in_progress: styles.blockArrived,
    completed: styles.blockCompleted,
    cancelled: styles.blockCancelled,
    no_show: styles.blockCancelled,
};

function formatDate(d: Date): string {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Week / Month date helpers ──────────────────────────────────────────────
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function startOfWeek(d: Date): Date {
    const n = new Date(d);
    n.setDate(n.getDate() - n.getDay());
    n.setHours(0, 0, 0, 0);
    return n;
}
function addDays(d: Date, n: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}
function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function monthMatrix(d: Date): Date[] {
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

// Status → CSS color token (for the colored edge on week/month chips).
const statusVar: Record<BookingStatus, string> = {
    pending: '--status-unconfirmed',
    confirmed: '--status-confirmed',
    in_progress: '--status-arrived',
    completed: '--status-completed',
    cancelled: '--status-cancelled',
    no_show: '--status-no-show',
};

export default function BookingsCalendarPage() {
    const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [employees, setEmployees] = useState<CalEmployee[]>(fallbackEmployees);
    const [visits, setVisits] = useState<VisitView[]>(mockCalVisits);
    const [localVisits, setLocalVisits] = useState<VisitView[]>([]);
    const [apiLoaded, setApiLoaded] = useState(false);
    // Calendar filters: by booking status and/or by employee (empty string = "all").
    const [filterOpen, setFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
    const [employeeFilter, setEmployeeFilter] = useState('');
    const router = useRouter();
    const { t, lang } = useTranslation();

    // Fetch employees once
    useEffect(() => {
        providerApi
            .getEmployees()
            .then(res => {
                if (res.success && res.data && res.data.length > 0) {
                    setEmployees(mapApiEmployees(res.data));
                }
            })
            .catch(() => {});
    }, []);

    // Locally-created bookings (offline/demo) — client-only read after mount.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is unavailable during SSR; locally-created bookings are loaded once on the client after mount
        setLocalVisits(loadLocalVisits());
    }, []);

    // Fetch bookings for the selected date and lift each into a canonical VisitView.
    // GAP: API has no price/payment data on bookings (resolved via ServicePrice — X15).
    useEffect(() => {
        const dateStr = toLocalDateStr(currentDate);
        providerApi
            .getBookings({ booking_date: dateStr, per_page: 100 })
            .then(res => {
                if (res.success && res.data && res.data.length > 0) {
                    setVisits(res.data.map(visitViewFromBooking));
                    setApiLoaded(true);
                }
            })
            .catch(() => {
                // Keep fallback data
            });
    }, [currentDate]);

    // Show locally-created bookings on top of the mock day; once the API answers
    // for the selected date, its rows are authoritative (no duplicates).
    const allVisits = useMemo(
        () => (apiLoaded ? visits : [...localVisits, ...visits]),
        [apiLoaded, localVisits, visits]
    );

    // Apply the active filters (status / employee) to the canonical visits. An
    // employee match keeps a visit when ANY of its line items is that specialist.
    const filteredVisits = useMemo(
        () =>
            allVisits.filter(v => {
                if (statusFilter && v.visit.status !== statusFilter) return false;
                if (employeeFilter && !v.lines.some(l => l.line.employee_uuid === employeeFilter)) return false;
                return true;
            }),
        [allVisits, statusFilter, employeeFilter]
    );
    const activeFilterCount = (statusFilter ? 1 : 0) + (employeeFilter ? 1 : 0);

    const blocks = useMemo(() => visitsToBlocks(filteredVisits, employees, timeSlots), [filteredVisits, employees]);
    const queueMap = computeQueueNumbers(blocks);

    const countBy = (s: BookingStatus) => filteredVisits.filter(v => v.visit.status === s).length;
    const revenueToday = filteredVisits.reduce(
        (sum, v) => (v.visit.status === 'cancelled' ? sum : sum + v.visit.total),
        0
    );

    // Deep-linkable: restore view + date from the URL once on mount.
    useEffect(() => {
        const p = new URLSearchParams(window.location.search);
        const v = p.get('view');
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL→state restore on mount
        if (v === 'day' || v === 'week' || v === 'month') setCalendarView(v);
        const dt = p.get('date');
        if (dt) {
            const d = new Date(dt);
            if (!isNaN(d.getTime())) setCurrentDate(d);
        }
    }, []);

    // Write to the URL only from user actions (no read-back ⇒ no effect race).
    const writeUrl = (view: 'day' | 'week' | 'month', date: Date) => {
        const p = new URLSearchParams(window.location.search);
        p.set('view', view);
        p.set('date', toLocalDateStr(date));
        window.history.replaceState(null, '', `?${p.toString()}`);
    };
    const selectView = (view: 'day' | 'week' | 'month') => {
        setCalendarView(view);
        writeUrl(view, currentDate);
    };
    const selectDate = (date: Date, view: 'day' | 'week' | 'month' = calendarView) => {
        setCurrentDate(date);
        setCalendarView(view);
        writeUrl(view, date);
    };

    // Prev/next step by the active view's unit (day / week / month).
    const step = (dir: number) => {
        const n = new Date(currentDate);
        if (calendarView === 'week') n.setDate(n.getDate() + 7 * dir);
        else if (calendarView === 'month') n.setMonth(n.getMonth() + dir);
        else n.setDate(n.getDate() + dir);
        selectDate(n, calendarView);
    };
    const goToday = () => selectDate(new Date(), calendarView);
    const goPrev = () => step(-1);
    const goNext = () => step(1);

    const handleEmptyCellClick = (empIndex: number, slotIndex: number) => {
        const time = timeSlots[slotIndex];
        const emp = employees[empIndex];
        const dateStr = toLocalDateStr(currentDate);
        router.push(`/bookings/new?emp=${emp.initials}&date=${dateStr}&time=${time}`);
    };

    const viewTitle =
        calendarView === 'day'
            ? formatDate(currentDate)
            : calendarView === 'week'
              ? (() => {
                    const sow = startOfWeek(currentDate);
                    const eow = addDays(sow, 6);
                    return `${MONTHS[sow.getMonth()].slice(0, 3)} ${sow.getDate()} – ${MONTHS[eow.getMonth()].slice(0, 3)} ${eow.getDate()}, ${eow.getFullYear()}`;
                })()
              : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // The mock seed loads for the selected day; place loaded visits on currentDate's
    // cell/column (a week/month range fetch will populate the rest once wired).
    const today = new Date();
    const visitTime = (v: VisitView) => hhmm(v.lines[0]?.line.start_time || '');
    const visitSvc = (v: VisitView) => v.lines[0]?.serviceName || '';
    const sortByTime = (a: VisitView, b: VisitView) =>
        (a.lines[0]?.line.start_time || '').localeCompare(b.lines[0]?.line.start_time || '');
    const dayVisitsFor = (day: Date) => (isSameDay(day, currentDate) ? [...filteredVisits].sort(sortByTime) : []);

    const weekGrid = (
        <div className={styles.weekView}>
            {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i)).map(day => {
                const dayVisits = dayVisitsFor(day);
                return (
                    <div
                        key={day.toISOString()}
                        className={`${styles.weekCol} ${isSameDay(day, currentDate) ? styles.weekColActive : ''}`}
                    >
                        <div className={styles.weekColHead}>
                            <span className={styles.weekColDow}>{WEEKDAYS[day.getDay()]}</span>
                            <span
                                className={`${styles.weekColDate} ${isSameDay(day, today) ? styles.weekColToday : ''}`}
                            >
                                {day.getDate()}
                            </span>
                        </div>
                        <div className={styles.weekColBody} onClick={() => selectDate(day, 'day')}>
                            {dayVisits.map(v => (
                                <div
                                    key={v.visit.uuid}
                                    className={styles.weekChip}
                                    style={{ borderInlineStartColor: `var(${statusVar[v.visit.status]})` }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        router.push(`/bookings/${v.visit.uuid}`);
                                    }}
                                >
                                    <span className={styles.weekChipTime}>{visitTime(v)}</span>
                                    <span className={styles.weekChipName}>{v.clientName}</span>
                                    <span className={styles.weekChipSvc}>{visitSvc(v)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const monthGrid = (
        <div className={styles.monthView}>
            <div className={styles.monthDow}>
                {WEEKDAYS.map(d => (
                    <div key={d} className={styles.monthDowCell}>
                        {d}
                    </div>
                ))}
            </div>
            <div className={styles.monthGrid}>
                {monthMatrix(currentDate).map(day => {
                    const inMonth = day.getMonth() === currentDate.getMonth();
                    const dayVisits = dayVisitsFor(day);
                    return (
                        <div
                            key={day.toISOString()}
                            className={`${styles.monthCell} ${inMonth ? '' : styles.monthCellOut} ${isSameDay(day, currentDate) ? styles.monthCellActive : ''}`}
                            onClick={() => selectDate(day, 'day')}
                        >
                            <div className={styles.monthCellHead}>
                                <span
                                    className={`${styles.monthCellNum} ${isSameDay(day, today) ? styles.monthCellToday : ''}`}
                                >
                                    {day.getDate()}
                                </span>
                                {dayVisits.length > 0 && <span className={styles.monthCount}>{dayVisits.length}</span>}
                            </div>
                            <div className={styles.monthCellBody}>
                                {dayVisits.slice(0, 3).map(v => (
                                    <div
                                        key={v.visit.uuid}
                                        className={styles.monthEvent}
                                        style={{ borderInlineStartColor: `var(${statusVar[v.visit.status]})` }}
                                    >
                                        {visitTime(v)} {v.clientName}
                                    </div>
                                ))}
                                {dayVisits.length > 3 && (
                                    <div className={styles.monthMore}>+{dayVisits.length - 3}</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={styles.bookingsPage}>
            {/* Tabs */}
            <BookingsTabs />

            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <div className={styles.calendarNav}>
                    <button className={styles.navBtn} onClick={goPrev}>
                        <ChevronLeft size={18} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                    </button>
                    <span className={styles.calendarTitle}>{viewTitle}</span>
                    <button className={styles.navBtn} onClick={goNext}>
                        <ChevronRight size={18} style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }} />
                    </button>
                    <button className={styles.todayBtn} onClick={goToday}>
                        {t('bookings.today')}
                    </button>
                </div>

                <div className={styles.viewToggle}>
                    {(['day', 'week', 'month'] as const).map(v => (
                        <button
                            key={v}
                            className={`${styles.viewBtn} ${calendarView === v ? styles.viewBtnActive : ''}`}
                            onClick={() => selectView(v)}
                        >
                            {t(`bookings.${v}`)}
                        </button>
                    ))}
                </div>

                <div className={styles.calendarActions}>
                    <button
                        className={styles.filterBtn}
                        onClick={() => setFilterOpen(true)}
                        aria-haspopup="dialog"
                        aria-expanded={filterOpen}
                    >
                        <Filter size={16} /> {t('bookings.filters')}
                        {activeFilterCount > 0 && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 18,
                                    height: 18,
                                    padding: '0 var(--space-1)',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--color-primary-500)',
                                    color: 'white',
                                    fontSize: 11,
                                    fontWeight: 'var(--font-bold)',
                                    lineHeight: 1,
                                }}
                            >
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <Link href="/bookings/new" className={styles.btnPrimary}>
                        <Plus size={16} /> {t('bookings.newBooking')}
                    </Link>
                </div>
            </div>

            {/* Calendar Grid + Side Panel */}
            <div className={styles.calendarWrapper}>
                {calendarView === 'day' ? (
                    <div
                        className={styles.calendarGrid}
                        style={{ '--emp-count': employees.length } as React.CSSProperties}
                    >
                        {/* Header row */}
                        <div className={styles.calendarGridHeader}>
                            <div className={styles.timeColHeader}>
                                <Clock size={14} style={{ margin: '0 auto', color: 'var(--text-tertiary)' }} />
                            </div>
                            {employees.map(emp => (
                                <div key={emp.name} className={styles.empColHeader}>
                                    <div
                                        className={styles.empAvatar}
                                        style={{ background: emp.color, overflow: 'hidden', position: 'relative' }}
                                    >
                                        {emp.uuid && !emp.uuid.startsWith('emp-') && (
                                            <img
                                                src={getImageUrl('employees', emp.uuid)}
                                                alt={emp.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    position: 'absolute',
                                                    inset: 0,
                                                }}
                                                onError={e => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <span>{emp.initials}</span>
                                    </div>
                                    <div className={styles.empName}>{emp.name}</div>
                                    <div className={styles.empStatus}>{emp.status}</div>
                                    {!isEmployeeOnShift(
                                        emp.empId,
                                        emp.role,
                                        currentDate.toISOString().split('T')[0]
                                    ) && (
                                        <div
                                            style={{
                                                color: 'var(--color-warning-600)',
                                                fontSize: 10,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                marginTop: 2,
                                            }}
                                        >
                                            <AlertTriangle size={10} /> {t('bookings.offShift')}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Time rows */}
                        <div className={styles.calendarBody}>
                            {timeSlots.map((time, slotIndex) => (
                                <div key={time} className={styles.timeRow}>
                                    <div className={styles.timeLabel}>{time}</div>
                                    {employees.map((_, empIndex) => {
                                        const block = blocks.find(
                                            b => b.empIndex === empIndex && b.startSlot === slotIndex
                                        );

                                        return (
                                            <div
                                                key={empIndex}
                                                className={styles.timeCell}
                                                onClick={() => !block && handleEmptyCellClick(empIndex, slotIndex)}
                                                style={{ cursor: block ? 'default' : 'pointer' }}
                                                title={
                                                    !block
                                                        ? t('bookings.bookSlot').replace('{time}', timeSlots[slotIndex])
                                                        : undefined
                                                }
                                            >
                                                {block && (
                                                    <div
                                                        className={`${styles.bookingBlock} ${statusBlockClass[block.status] || ''}`}
                                                        style={{ height: `${block.span * 64 - 4}px` }}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            router.push(`/bookings/${block.visitId}`);
                                                        }}
                                                    >
                                                        <span className={styles.queueBadge}>
                                                            #{queueMap.get(block) || '—'}
                                                        </span>
                                                        <div className={styles.bookingBlockName}>{block.client}</div>
                                                        <div className={styles.bookingBlockService}>
                                                            {block.service}
                                                        </div>
                                                        <div className={styles.bookingBlockTime}>
                                                            {timeSlots[block.startSlot]} –{' '}
                                                            {timeSlots[block.startSlot + block.span] || '21:00'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : calendarView === 'week' ? (
                    weekGrid
                ) : (
                    monthGrid
                )}

                {/* Side Panel */}
                <div className={styles.sidePanel}>
                    {/* Next Appointment */}
                    {(() => {
                        const activeBlocks = blocks
                            .filter(b => b.status !== 'completed' && b.status !== 'cancelled')
                            .sort((a, b) => a.startSlot - b.startSlot);
                        const nextBlock = activeBlocks[0];
                        if (!nextBlock) return null;
                        const nextQueue = queueMap.get(nextBlock) || 0;
                        const nextExpected = getExpectedStartTime(nextBlock, blocks, timeSlots);
                        return (
                            <div className={styles.sidePanelCard}>
                                <div className={styles.sidePanelTitle}>
                                    <Clock size={16} /> {t('bookings.nextAppt')}
                                </div>
                                <div
                                    className={styles.nextApptCard}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => router.push(`/bookings/${nextBlock.visitId}`)}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-2)',
                                            marginBottom: 'var(--space-1)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 22,
                                                height: 22,
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--color-primary-100)',
                                                color: 'var(--color-primary-700)',
                                                fontSize: 11,
                                                fontWeight: 'var(--font-bold)',
                                            }}
                                        >
                                            #{nextQueue}
                                        </span>
                                        <div className={styles.nextApptName}>{nextBlock.client}</div>
                                    </div>
                                    <div className={styles.nextApptService}>{nextBlock.service}</div>
                                    <div className={styles.nextApptTime}>
                                        <Clock size={12} /> {timeSlots[nextBlock.startSlot]} –{' '}
                                        {timeSlots[nextBlock.startSlot + nextBlock.span] || '21:00'}
                                    </div>
                                    <div className={styles.expectedTimeRow}>
                                        <span>{t('bookings.expectedStart')}</span>
                                        <span className={styles.expectedTimeValue}>{nextExpected.expected}</span>
                                        {nextExpected.delayMins > 0 && (
                                            <span className={styles.delayBadge}>
                                                <AlertTriangle size={10} /> +{nextExpected.delayMins}m
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.countdown}>
                                        {t('bookings.inMins').replace('%mins%', '23')}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Today's Summary */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <CalendarDays size={16} /> {t('bookings.todaySummary')}
                        </div>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue}>{filteredVisits.length}</div>
                                <div className={styles.summaryLabel}>{t('bookings.total')}</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-confirmed)' }}>
                                    {countBy('confirmed')}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.confirmed')}</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-completed)' }}>
                                    {countBy('completed')}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.completed')}</div>
                            </div>
                            <div className={styles.summaryItem}>
                                <div className={styles.summaryValue} style={{ color: 'var(--status-cancelled)' }}>
                                    {countBy('cancelled')}
                                </div>
                                <div className={styles.summaryLabel}>{t('bookings.cancelled')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className={styles.sidePanelCard}>
                        <div className={styles.sidePanelTitle}>
                            <Building2 size={16} /> {t('bookings.revenueToday')}
                        </div>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div
                                style={{
                                    fontSize: 'var(--text-2xl)',
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-primary-600)',
                                }}
                            >
                                {apiLoaded ? egp(0) : egp(revenueToday)}
                            </div>
                            <div
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--text-tertiary)',
                                    marginTop: 'var(--space-1)',
                                }}
                            >
                                {t('bookings.fromBookings').replace('%count%', String(filteredVisits.length))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters: by status and/or employee. Applied live to the rendered visits. */}
            <Modal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                title={t('bookings.filters')}
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setStatusFilter('');
                                setEmployeeFilter('');
                            }}
                            disabled={activeFilterCount === 0}
                        >
                            {t('bookings.clearFilters')}
                        </Button>
                        <Button variant="primary" onClick={() => setFilterOpen(false)}>
                            {t('bookings.applyFilters')}
                        </Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Select
                        label={t('common.status')}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as BookingStatus | '')}
                        options={[
                            { value: '', label: t('bk.allStatuses') },
                            ...STATUS_ORDER.map(s => ({ value: s, label: t(STATUS_LABEL_KEY[s]) })),
                        ]}
                    />
                    <Select
                        label={t('bookings.employee')}
                        value={employeeFilter}
                        onChange={e => setEmployeeFilter(e.target.value)}
                        options={[
                            { value: '', label: t('mkt.lblAllEmployees') },
                            ...employees.map(emp => ({ value: emp.uuid, label: emp.name })),
                        ]}
                    />
                </div>
            </Modal>
        </div>
    );
}
