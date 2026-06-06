/**
 * Client-side store for bookings created in this browser (the "New Booking" flow).
 *
 * Why this exists: the new-booking confirm has no backend in the offline/demo
 * environment (every provider API call falls back to mock), so a freshly created
 * booking had nowhere to live and never appeared in the list or calendar. This
 * persists each created booking as a canonical `VisitView` in `localStorage`, and
 * the list + calendar merge it in — but ONLY while running on mock data
 * (`apiLoaded === false`). Once a real backend answers, its rows are the single
 * source of truth and these local copies are ignored, so there is never a
 * duplicate. NOTE: there is currently no backend write — the Waqty API exposes
 * no provider booking-create endpoint (only `POST /api/user/bookings`, which is
 * customer-authenticated), so a provider-created walk-in booking lives only here
 * until that route exists.
 */
import { resolveServicePrice, type ServicePriceOverride } from '@/lib/priceResolver';
import type { BookingStatus, Visit, VisitLineItem } from '@/lib/contract';
import type { BookingItem } from './new/types';
import type { VisitView, VisitLineView } from './_visits';

const STORAGE_KEY = 'waqty_local_bookings';
const MAX_STORED = 50; // cap so the demo store can't grow unbounded

/** Read all locally-created visits (newest first). Safe during SSR. */
export function loadLocalVisits(): VisitView[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as VisitView[]) : [];
    } catch {
        return [];
    }
}

function writeLocalVisits(visits: VisitView[]): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits.slice(0, MAX_STORED)));
    } catch {
        /* ignore quota / serialization errors */
    }
}

/** Persist a newly-created visit at the top of the store. */
export function addLocalVisit(view: VisitView): void {
    writeLocalVisits([view, ...loadLocalVisits()]);
}

/** Flip the status of a locally-created visit (e.g. cancel from the list). */
export function updateLocalVisitStatus(uuid: string, status: BookingStatus): void {
    writeLocalVisits(loadLocalVisits().map(v => (v.visit.uuid === uuid ? { ...v, visit: { ...v.visit, status } } : v)));
}

const toMinor = (major: number) => Math.round(major * 100);

/** Add `mins` to an "YYYY-MM-DDTHH:mm:ss" string, same-day (salon visits never
 *  cross midnight — matches the assumption baked into `buildVisitView`). */
function addMinutes(iso: string, mins: number): string {
    const [date, time = '00:00:00'] = iso.split('T');
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + mins;
    const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${date}T${hh}:${mm}:00`;
}

export interface LocalVisitInput {
    items: BookingItem[];
    clientName: string;
    clientPhone: string;
    discountPct: number;
    notes: string;
    branchName: string;
    branchId: string;
    priceOverrides: ServicePriceOverride[];
}

/**
 * Build a canonical `VisitView` from the new-booking form state. Each service
 * keeps its OWN specialist, slot and resolved price, so the list renders a
 * (possibly multi-line) visit and the calendar can place each line as a block.
 */
export function buildLocalVisitView(input: LocalVisitInput): VisitView {
    const id = `BK-${Date.now().toString().slice(-6)}`;
    const lineItems: VisitLineItem[] = [];
    const lines: VisitLineView[] = [];
    let subtotal = 0;

    input.items.forEach((item, i) => {
        const resolved = resolveServicePrice(item.service, item.employee, input.branchId, input.priceOverrides);
        const price = toMinor(resolved.price);
        subtotal += price;
        const line: VisitLineItem = {
            uuid: `${id}-${i + 1}`,
            visit_uuid: id,
            service_uuid: item.service.id,
            employee_uuid: item.employee.id,
            start_time: `${item.date}T${item.time}:00`,
            duration_minutes: item.service.durationMins,
            price,
            status: 'confirmed',
        };
        lineItems.push(line);
        lines.push({
            line,
            serviceName: item.service.name,
            employeeName: item.employee.name,
            employeeLevel: item.employee.level ?? '',
        });
    });

    const discountTotal = Math.round((subtotal * input.discountPct) / 100);
    const total = subtotal - discountTotal;

    // scheduled_start = earliest line; scheduled_end = end of the latest line.
    const ordered = [...lineItems].sort((a, b) => a.start_time.localeCompare(b.start_time));
    const firstLine = ordered[0];
    const lastLine = ordered[ordered.length - 1];
    const scheduledStart = firstLine?.start_time ?? `${input.items[0]?.date}T${input.items[0]?.time}:00`;
    const scheduledEnd = lastLine ? addMinutes(lastLine.start_time, lastLine.duration_minutes) : null;
    const now = new Date().toISOString();

    const visit: Visit = {
        uuid: id,
        provider_uuid: 'prov-mock',
        branch_uuid: `branch-${input.branchName.toLowerCase().replace(/\s+/g, '-')}`,
        customer_uuid: `cust-${id}`,
        status: 'confirmed',
        scheduled_start: scheduledStart,
        scheduled_end: scheduledEnd,
        line_items: lineItems,
        payment: {
            visit_uuid: id,
            model: 'cash',
            method: null,
            status: 'pending', // nothing collected at booking time
            total,
            paid_amount: 0,
            balance_amount: total,
            currency: 'EGP',
            platform_fee: 0,
            commission_amount: 0,
            created_at: now,
            updated_at: now,
        },
        subtotal,
        discount_total: discountTotal,
        tip_total: 0,
        total,
        currency: 'EGP',
        notes: input.notes || null,
        created_at: now,
        updated_at: now,
    };

    return {
        visit,
        clientName: input.clientName || 'Walk-in',
        clientPhone: input.clientPhone || '—',
        branchName: input.branchName,
        payMethod: '—',
        lines,
    };
}
