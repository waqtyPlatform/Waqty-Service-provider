import { describe, it, expect } from 'vitest';
import {
    SHIFT_TEMPLATES,
    resolveEmployeeSchedule,
    detectConflicts,
    isEmployeeOnShift,
    isEmployeeDuringBreak,
    getEmployeeShiftForDate,
    generateId,
} from '@/lib/shiftData';

describe('SHIFT_TEMPLATES', () => {
    it('should have at least one shift template', () => {
        expect(SHIFT_TEMPLATES.length).toBeGreaterThan(0);
    });

    it('each template should have required fields', () => {
        for (const template of SHIFT_TEMPLATES) {
            expect(template).toHaveProperty('id');
            expect(template).toHaveProperty('name');
            expect(template).toHaveProperty('start');
            expect(template).toHaveProperty('end');
        }
    });

    it('shift times should be valid HH:MM format', () => {
        const timeRegex = /^\d{2}:\d{2}$/;
        for (const template of SHIFT_TEMPLATES) {
            expect(template.start).toMatch(timeRegex);
            expect(template.end).toMatch(timeRegex);
        }
    });

    it('each template should have break times', () => {
        for (const template of SHIFT_TEMPLATES) {
            expect(template).toHaveProperty('breakStart');
            expect(template).toHaveProperty('breakEnd');
        }
    });
});

describe('resolveEmployeeSchedule', () => {
    it('should return a weekly schedule object with all 7 days', () => {
        const schedule = resolveEmployeeSchedule('emp-1', 'Senior Stylist');
        expect(schedule).toBeDefined();
        expect(Object.keys(schedule)).toEqual(
            expect.arrayContaining(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
        );
    });

    it('should return null for days with no assignment', () => {
        const schedule = resolveEmployeeSchedule('non-existent-emp', 'non-existent-role');
        const hasAllNull = Object.values(schedule).every(v => v === null);
        expect(hasAllNull).toBe(true);
    });
});

describe('detectConflicts', () => {
    it('should return an empty array when there are no conflicts', () => {
        const branchHours = [{ day: 'Monday', open: '08:00', close: '22:00', closed: false }];
        const conflicts = detectConflicts(
            branchHours,
            'emp-1',
            'Mon',
            { start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
            []
        );
        expect(Array.isArray(conflicts)).toBe(true);
        expect(conflicts.length).toBe(0);
    });

    it('should detect outside-branch-hours conflict', () => {
        const branchHours = [{ day: 'Monday', open: '10:00', close: '18:00', closed: false }];
        const conflicts = detectConflicts(
            branchHours,
            'emp-1',
            'Mon',
            { start: '07:00', end: '15:00', breakStart: '12:00', breakEnd: '13:00' },
            []
        );
        expect(conflicts.some(c => c.kind === 'outside-branch-hours')).toBe(true);
    });

    it('should detect booking-during-break conflict', () => {
        const branchHours = [{ day: 'Monday', open: '08:00', close: '22:00', closed: false }];
        const conflicts = detectConflicts(
            branchHours,
            'emp-1',
            'Mon',
            { start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
            ['12:30']
        );
        expect(conflicts.some(c => c.kind === 'booking-during-break')).toBe(true);
    });

    it('should detect closed branch', () => {
        const branchHours = [{ day: 'Monday', open: '', close: '', closed: true }];
        const conflicts = detectConflicts(
            branchHours,
            'emp-1',
            'Mon',
            { start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
            []
        );
        expect(conflicts.some(c => c.kind === 'outside-branch-hours')).toBe(true);
    });
});

describe('isEmployeeOnShift', () => {
    it('should return false for non-existent employee', () => {
        const result = isEmployeeOnShift('nonexistent', 'norole', '2025-06-16');
        expect(result).toBe(false);
    });
});

describe('isEmployeeDuringBreak', () => {
    it('should return false when employee has no shift', () => {
        const result = isEmployeeDuringBreak('nonexistent', 'norole', '2025-06-16', '12:30');
        expect(result).toBe(false);
    });
});

describe('getEmployeeShiftForDate', () => {
    it('should return null for non-existent employee', () => {
        const result = getEmployeeShiftForDate('nonexistent', 'norole', '2025-06-16');
        expect(result).toBeNull();
    });
});

describe('generateId', () => {
    it('should generate IDs with prefix', () => {
        const id = generateId('test');
        expect(id).toMatch(/^test-/);
    });

    it('should use the provided prefix', () => {
        const id = generateId('shift');
        expect(id.startsWith('shift-')).toBe(true);
    });
});
