/**
 * Provider Dashboard DISPLAY lifecycle (G2) — the SINGLE source for the
 * reception-facing booking status vocabulary, so the booking detail page, the
 * rooms board and the home charts never disagree.
 *
 * It is richer than the canonical persistent `BookingStatus`: it adds `arrived`
 * (customer checked in, not yet in service) and renames `in_progress` ->
 * `inService` for reception. These are DERIVED, never stored:
 *   - `arrived`   persists canonically as `confirmed` + `Visit.checked_in_at`
 *   - `inService` persists canonically as `in_progress`
 * The contract owns the persistent machine (BOOKING_TRANSITIONS); this owns only
 * how it READS on the dashboard.
 */
import type { BookingStatus } from './waqty_contract';

export type DisplayStatus = 'draft' | 'confirmed' | 'arrived' | 'inService' | 'completed' | 'cancelled' | 'no_show';

// The happy-path stepper order (terminal cancelled/no_show sit off the path).
export const STATUS_STEPS: DisplayStatus[] = ['draft', 'confirmed', 'arrived', 'inService', 'completed'];

export const STEP_INDEX: Record<DisplayStatus, number> = {
    draft: 0,
    confirmed: 1,
    arrived: 2,
    inService: 3,
    completed: 4,
    cancelled: -1,
    no_show: -1,
};

// Canonical persistent status -> base display status (no check-in context).
export function statusToDisplay(status: BookingStatus): DisplayStatus {
    switch (status) {
        case 'pending':
            return 'draft';
        case 'confirmed':
            return 'confirmed';
        case 'in_progress':
            return 'inService';
        case 'completed':
            return 'completed';
        case 'cancelled':
            return 'cancelled';
        case 'no_show':
            return 'no_show';
    }
}

// Full derivation including the check-in overlay: a confirmed visit whose
// customer has checked in (Visit.checked_in_at set — matched via checkInCode)
// reads as `arrived`. `arrived` is NEVER persisted as a BookingStatus; on the
// backend the visit stays `confirmed` and carries `checked_in_at`.
export function deriveDisplayStatus(status: BookingStatus, ctx: { checkedIn: boolean }): DisplayStatus {
    if (status === 'confirmed' && ctx.checkedIn) return 'arrived';
    return statusToDisplay(status);
}

// One badge tone per display status — shared by chips, the rooms board and charts.
export type BadgeTone = 'neutral' | 'info' | 'warning' | 'success' | 'error';
export const DISPLAY_BADGE: Record<DisplayStatus, BadgeTone> = {
    draft: 'neutral',
    confirmed: 'info',
    arrived: 'warning',
    inService: 'info',
    completed: 'success',
    cancelled: 'error',
    no_show: 'error',
};
