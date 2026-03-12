/* ─── Shift Management — Types, Seed Data & Utilities ─────────────────────── */

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export const ALL_DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface ShiftTemplate {
    id: string;
    name: string;
    color: string;
    start: string;       // "HH:MM"
    end: string;
    breakStart: string;
    breakEnd: string;
}

export interface ShiftAssignment {
    id: string;
    templateId: string;
    targetType: 'employee' | 'role';
    targetId: string;    // employee ID like 'E001' or role like 'Senior Stylist'
    days: DayKey[];
}

export interface ResolvedShift {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
    templateId: string | null;
    templateName: string | null;
    templateColor: string | null;
}

export type ConflictKind =
    | 'outside-branch-hours'
    | 'overlapping-shift'
    | 'booking-during-break'
    | 'booking-off-shift';

export interface ShiftConflict {
    employeeId: string;
    day: DayKey;
    kind: ConflictKind;
    detail: string;
}

export interface BranchDayHours {
    day: string;
    open: string;
    close: string;
    closed: boolean;
}

/* ─── Seed Templates ──────────────────────────────────────────────────────── */

export let SHIFT_TEMPLATES: ShiftTemplate[] = [
    { id: 'TPL-001', name: 'Morning Shift',  color: '#10b981', start: '09:00', end: '17:00', breakStart: '13:00', breakEnd: '13:30' },
    { id: 'TPL-002', name: 'Evening Shift',  color: '#f59e0b', start: '14:00', end: '22:00', breakStart: '18:00', breakEnd: '18:30' },
    { id: 'TPL-003', name: 'Full Day Shift', color: '#3b82f6', start: '10:00', end: '20:00', breakStart: '14:00', breakEnd: '14:30' },
    { id: 'TPL-004', name: 'Weekend Shift',  color: '#8b5cf6', start: '10:00', end: '18:00', breakStart: '13:00', breakEnd: '13:30' },
];

/* ─── Seed Assignments ────────────────────────────────────────────────────── */

export let SHIFT_ASSIGNMENTS: ShiftAssignment[] = [
    // Role-based group assignments
    { id: 'ASN-001', templateId: 'TPL-001', targetType: 'role', targetId: 'Senior Stylist',   days: ['Mon', 'Tue', 'Wed'] },
    { id: 'ASN-002', templateId: 'TPL-002', targetType: 'role', targetId: 'Skin Specialist',  days: ['Mon', 'Tue', 'Thu'] },
    // Individual override example
    { id: 'ASN-003', templateId: 'TPL-003', targetType: 'employee', targetId: 'E001', days: ['Thu'] },
];

/* ─── Default Branch Hours (mirrors settings/branches/[id]) ───────────── */

export const DEFAULT_BRANCH_HOURS: BranchDayHours[] = [
    { day: 'Monday',    open: '10:00', close: '22:00', closed: false },
    { day: 'Tuesday',   open: '10:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '10:00', close: '22:00', closed: false },
    { day: 'Thursday',  open: '10:00', close: '23:00', closed: false },
    { day: 'Friday',    open: '13:00', close: '23:00', closed: false },
    { day: 'Saturday',  open: '',      close: '',      closed: true  },
    { day: 'Sunday',    open: '10:00', close: '18:00', closed: false },
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function toMin(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

const DAY_FULL: Record<DayKey, string> = {
    Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
    Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

export function dateToDayKey(dateStr: string): DayKey {
    const parts = dateStr.split('-');
    const localDate = new Date(+parts[0], +parts[1] - 1, +parts[2]); // local midnight, no UTC drift
    const map: DayKey[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return map[localDate.getDay()];
}

/* ─── Core: Resolve Schedule ──────────────────────────────────────────────── */

/**
 * Resolve all assignments for one employee into a weekly shift map.
 * Employee-specific assignments override role-level for the same day.
 */
export function resolveEmployeeSchedule(
    employeeId: string,
    role: string,
): Record<DayKey, ResolvedShift | null> {
    const result: Record<DayKey, ResolvedShift | null> = {
        Mon: null, Tue: null, Wed: null, Thu: null, Fri: null, Sat: null, Sun: null,
    };

    // Apply role-level first
    for (const asn of SHIFT_ASSIGNMENTS) {
        if (asn.targetType !== 'role' || asn.targetId !== role) continue;
        const tpl = SHIFT_TEMPLATES.find(t => t.id === asn.templateId);
        if (!tpl) continue;
        for (const day of asn.days) {
            result[day] = {
                start: tpl.start, end: tpl.end,
                breakStart: tpl.breakStart, breakEnd: tpl.breakEnd,
                templateId: tpl.id, templateName: tpl.name, templateColor: tpl.color,
            };
        }
    }

    // Apply employee-level (overrides role)
    for (const asn of SHIFT_ASSIGNMENTS) {
        if (asn.targetType !== 'employee' || asn.targetId !== employeeId) continue;
        const tpl = SHIFT_TEMPLATES.find(t => t.id === asn.templateId);
        if (!tpl) continue;
        for (const day of asn.days) {
            result[day] = {
                start: tpl.start, end: tpl.end,
                breakStart: tpl.breakStart, breakEnd: tpl.breakEnd,
                templateId: tpl.id, templateName: tpl.name, templateColor: tpl.color,
            };
        }
    }

    return result;
}

/* ─── Conflict Detection ──────────────────────────────────────────────────── */

export function detectConflicts(
    branchHours: BranchDayHours[],
    employeeId: string,
    day: DayKey,
    shift: { start: string; end: string; breakStart: string; breakEnd: string },
    bookingSlots: string[] = [],
): ShiftConflict[] {
    const conflicts: ShiftConflict[] = [];
    const branchDay = branchHours.find(h => h.day === DAY_FULL[day]);

    // 1. Outside branch hours
    if (branchDay && !branchDay.closed && branchDay.open && branchDay.close) {
        if (toMin(shift.start) < toMin(branchDay.open) || toMin(shift.end) > toMin(branchDay.close)) {
            conflicts.push({
                employeeId, day, kind: 'outside-branch-hours',
                detail: `Shift ${shift.start}–${shift.end} outside branch hours ${branchDay.open}–${branchDay.close}`,
            });
        }
    }
    if (branchDay?.closed) {
        conflicts.push({
            employeeId, day, kind: 'outside-branch-hours',
            detail: `Branch is closed on ${DAY_FULL[day]}`,
        });
    }

    // 2. Booking during break
    const breakS = toMin(shift.breakStart);
    const breakE = toMin(shift.breakEnd);
    for (const slot of bookingSlots) {
        const slotMin = toMin(slot);
        if (slotMin >= breakS && slotMin < breakE) {
            conflicts.push({
                employeeId, day, kind: 'booking-during-break',
                detail: `Booking at ${slot} falls within break ${shift.breakStart}–${shift.breakEnd}`,
            });
        }
    }

    return conflicts;
}

/* ─── Availability Queries ────────────────────────────────────────────────── */

/**
 * Check whether an employee is on-shift for a given ISO date string.
 */
export function isEmployeeOnShift(employeeId: string, role: string, dateStr: string): boolean {
    const dayKey = dateToDayKey(dateStr);
    const schedule = resolveEmployeeSchedule(employeeId, role);
    return schedule[dayKey] !== null;
}

/**
 * Check whether a time falls within an employee's break window on a given date.
 */
export function isEmployeeDuringBreak(employeeId: string, role: string, dateStr: string, time: string): boolean {
    const dayKey = dateToDayKey(dateStr);
    const schedule = resolveEmployeeSchedule(employeeId, role);
    const shift = schedule[dayKey];
    if (!shift) return false;
    const t = toMin(time);
    return t >= toMin(shift.breakStart) && t < toMin(shift.breakEnd);
}

/**
 * Get the resolved shift for an employee on a specific date. Returns null if off.
 */
export function getEmployeeShiftForDate(employeeId: string, role: string, dateStr: string): ResolvedShift | null {
    const dayKey = dateToDayKey(dateStr);
    return resolveEmployeeSchedule(employeeId, role)[dayKey];
}

/**
 * Generate a unique ID for new templates / assignments.
 */
export function generateId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}`;
}
