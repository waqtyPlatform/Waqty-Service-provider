/**
 * Canonical Visit view-models for the bookings screens (X2).
 *
 * The list and calendar render the canonical multi-line `Visit` + `VisitLineItem`
 * (each line has its own optional specialist, slot and price) instead of the
 * legacy single-service `Booking`. Live API rows arrive as `Booking` and are
 * lifted to a one-line `Visit` via `bookingToVisit`; mock fallback data is built
 * directly as canonical Visits (including a genuine multi-line visit).
 *
 * A `VisitView` wraps the canonical `Visit` with the display joins the screens
 * render (client / branch / per-line service + employee names) — the canonical
 * entity carries uuids, not names.
 */
import { bookingToVisit, type Booking } from '@/lib/api';
import { catalogServicePrices } from '@/mocks/catalog';
import {
    BOOKING_STATUSES,
    type BookingStatus,
    type PaymentStatus,
    type Visit,
    type VisitLineItem,
} from '@/lib/contract';

export interface VisitLineView {
    line: VisitLineItem;
    serviceName: string;
    employeeName: string; // "Unassigned" when employee_uuid is null
    employeeLevel: string;
}

export interface VisitView {
    visit: Visit;
    clientName: string;
    clientPhone: string;
    branchName: string;
    payMethod: string;
    lines: VisitLineView[];
}

// Canonical 6-state PERSISTENT status in display order (X3) — `BOOKING_STATUSES`
// is the canonical ordered list from the contract. The richer reception DISPLAY
// vocabulary (arrived / inService, derived from check-in + time) is single-sourced
// in `@/lib/displayStatus` (G2); legacy ad-hoc states (workDone / waitingPay /
// unconfirmed) are gone.
export const STATUS_ORDER: readonly BookingStatus[] = BOOKING_STATUSES;

export const STATUS_LABEL_KEY: Record<BookingStatus, string> = {
    pending: 'bk.stPending',
    confirmed: 'bk.stConfirmed',
    in_progress: 'bk.stInProgress',
    completed: 'bk.stCompleted',
    cancelled: 'bk.stCancelled',
    no_show: 'bk.stNoShow',
};

// Display payment bucket the list filters on, derived from canonical PaymentStatus.
export type PaymentBucket = 'paid' | 'partial' | 'unpaid';
export function paymentBucket(status: PaymentStatus): PaymentBucket {
    if (status === 'paid') return 'paid';
    if (status === 'partial') return 'partial';
    return 'unpaid'; // pending / refunded / failed
}

/** "2026-03-23T09:00:00" -> "09:00". */
export function hhmm(iso: string): string {
    const t = iso.split('T')[1] ?? '';
    return t.slice(0, 5) || '—';
}

/** Lift a live single-service Booking into a canonical VisitView (PR-1 adapter). */
export function visitViewFromBooking(b: Booking): VisitView {
    // Resolve the line price from the provider's ServicePrice catalogue (X15) so
    // the lifted Visit carries a real price instead of 0.
    const visit = bookingToVisit(b, { servicePrices: catalogServicePrices });
    return {
        visit,
        clientName: b.user?.name || 'Walk-in',
        clientPhone: b.user?.phone || '—',
        branchName: b.branch?.name || 'Main',
        payMethod: '—',
        lines: visit.line_items.map(line => ({
            line,
            serviceName: b.service?.name || 'Service',
            employeeName: b.employee?.name || 'Unassigned',
            employeeLevel: '',
        })),
    };
}

// ── Mock fallback data, built as canonical Visits ───────────────────────────
export interface VisitSeedLine {
    service: string;
    employee: string;
    level?: string;
    priceMajor: number; // EGP major units in the seed; stored as minor units
    durationMin?: number;
    employeeUuid?: string | null;
}
export interface VisitSeed {
    id: string;
    branch: string;
    client: string;
    mobile: string;
    date: string; // ISO date "2026-03-23"
    time: string; // "09:00"
    status: BookingStatus;
    payment: PaymentStatus;
    payMethod: string;
    lines: VisitSeedLine[];
}

/** Build a canonical VisitView from a declarative seed (lines run sequentially). */
export function buildVisitView(o: VisitSeed): VisitView {
    const [h0, m0] = o.time.split(':').map(Number);
    let cursor = h0 * 60 + m0;
    let subtotal = 0;
    const lineItems: VisitLineItem[] = [];
    const lineViews: VisitLineView[] = [];

    o.lines.forEach((ln, i) => {
        const dur = ln.durationMin ?? 60;
        const price = Math.round(ln.priceMajor * 100); // major -> minor units
        subtotal += price;
        const hh = String(Math.floor(cursor / 60)).padStart(2, '0');
        const mm = String(cursor % 60).padStart(2, '0');
        const line: VisitLineItem = {
            uuid: `${o.id}-${i + 1}`,
            visit_uuid: o.id,
            service_uuid: `svc-${o.id}-${i + 1}`,
            employee_uuid: ln.employeeUuid ?? null,
            start_time: `${o.date}T${hh}:${mm}:00`,
            duration_minutes: dur,
            price,
            status: o.status,
        };
        lineItems.push(line);
        lineViews.push({
            line,
            serviceName: ln.service,
            employeeName: ln.employee,
            employeeLevel: ln.level ?? '',
        });
        cursor += dur;
    });

    const total = subtotal;
    const paid = o.payment === 'paid' ? total : o.payment === 'partial' ? Math.round(total / 2) : 0;
    const start = `${o.date}T${o.time}:00`;
    const endH = String(Math.floor(cursor / 60)).padStart(2, '0');
    const endM = String(cursor % 60).padStart(2, '0');

    const visit: Visit = {
        uuid: o.id,
        provider_uuid: 'prov-mock',
        branch_uuid: `branch-${o.branch.toLowerCase().replace(/\s+/g, '-')}`,
        customer_uuid: `cust-${o.id}`,
        status: o.status,
        scheduled_start: start,
        scheduled_end: `${o.date}T${endH}:${endM}:00`,
        line_items: lineItems,
        payment: {
            visit_uuid: o.id,
            model: 'cash',
            method: null,
            status: o.payment,
            total,
            paid_amount: paid,
            balance_amount: total - paid,
            currency: 'EGP',
            platform_fee: 0,
            commission_amount: 0,
            created_at: start,
            updated_at: start,
        },
        subtotal,
        discount_total: 0,
        tip_total: 0,
        total,
        currency: 'EGP',
        notes: null,
        created_at: start,
        updated_at: start,
    };

    return {
        visit,
        clientName: o.client,
        clientPhone: o.mobile,
        branchName: o.branch,
        payMethod: o.payMethod,
        lines: lineViews,
    };
}

const MOCK_VISITS: VisitSeed[] = [
    {
        id: 'BK-1042',
        branch: 'Downtown',
        client: 'Fatima Al-Rashid',
        mobile: '+20 123 456 789',
        date: '2026-03-23',
        time: '09:00',
        status: 'confirmed',
        payment: 'paid',
        payMethod: 'Card',
        lines: [
            { service: 'Hair Coloring', employee: 'Sara Ahmed', level: 'Senior', priceMajor: 520, durationMin: 90 },
        ],
    },
    // A genuine MULTI-LINE visit: two services, two specialists, two slots.
    {
        id: 'BK-1043',
        branch: 'Downtown',
        client: 'Mona Adel',
        mobile: '+20 122 345 678',
        date: '2026-03-23',
        time: '09:30',
        status: 'in_progress',
        payment: 'partial',
        payMethod: 'Cash',
        lines: [
            { service: 'Haircut & Styling', employee: 'Sara Ahmed', level: 'Senior', priceMajor: 180, durationMin: 45 },
            { service: 'Gel Manicure', employee: 'Hana Youssef', level: 'Junior', priceMajor: 130, durationMin: 45 },
        ],
    },
    {
        id: 'BK-1041',
        branch: 'Downtown',
        client: 'Aisha Mohammed',
        mobile: '+20 111 222 333',
        date: '2026-03-13',
        time: '09:30',
        status: 'in_progress',
        payment: 'paid',
        payMethod: 'Cash',
        lines: [
            { service: 'Keratin Treatment', employee: 'Nora Ali', level: 'Mid', priceMajor: 800, durationMin: 120 },
        ],
    },
    {
        id: 'BK-1040',
        branch: 'Downtown',
        client: 'Maryam Ibrahim',
        mobile: '+20 100 200 300',
        date: '2026-03-23',
        time: '10:00',
        status: 'completed',
        payment: 'paid',
        payMethod: 'Card',
        lines: [
            { service: 'Classic Facial', employee: 'Layla Hassan', level: 'Mid', priceMajor: 200, durationMin: 60 },
        ],
    },
    {
        id: 'BK-1039',
        branch: 'Downtown',
        client: 'Huda Saleh',
        mobile: '+20 155 666 777',
        date: '2026-03-19',
        time: '10:30',
        status: 'pending',
        payment: 'pending',
        payMethod: '—',
        lines: [
            { service: 'Gel Manicure', employee: 'Hana Youssef', level: 'Junior', priceMajor: 130, durationMin: 45 },
        ],
    },
    {
        id: 'BK-1038',
        branch: 'Downtown',
        client: 'Noura Ahmed',
        mobile: '+20 199 888 999',
        date: '2026-03-19',
        time: '11:00',
        status: 'confirmed',
        payment: 'partial',
        payMethod: 'Cash',
        lines: [
            { service: 'Swedish Massage', employee: 'Reem Mohamed', level: 'Senior', priceMajor: 350, durationMin: 60 },
        ],
    },
    {
        id: 'BK-1037',
        branch: 'Mall of Arabia',
        client: 'Rania Khalil',
        mobile: '+20 133 444 555',
        date: '2026-03-25',
        time: '12:00',
        status: 'completed',
        payment: 'pending',
        payMethod: '—',
        lines: [{ service: 'HydraFacial', employee: 'Nora Ali', level: 'Mid', priceMajor: 600, durationMin: 60 }],
    },
    {
        id: 'BK-1036',
        branch: 'Downtown',
        client: 'Dana Faris',
        mobile: '+20 177 333 222',
        date: '2026-03-12',
        time: '14:00',
        status: 'completed',
        payment: 'paid',
        payMethod: 'Card',
        lines: [
            { service: 'Olaplex Treatment', employee: 'Sara Ahmed', level: 'Senior', priceMajor: 350, durationMin: 60 },
        ],
    },
    {
        id: 'BK-1035',
        branch: 'Downtown',
        client: 'Joud Wahid',
        mobile: '+20 144 555 666',
        date: '2026-03-17',
        time: '16:00',
        status: 'cancelled',
        payment: 'pending',
        payMethod: '—',
        lines: [
            { service: 'Laser Hair Removal', employee: 'Layla Hassan', level: 'Mid', priceMajor: 250, durationMin: 30 },
        ],
    },
    {
        id: 'BK-1034',
        branch: 'New Cairo',
        client: 'Sama Latif',
        mobile: '+20 166 777 888',
        date: '2026-03-19',
        time: '09:00',
        status: 'completed',
        payment: 'paid',
        payMethod: 'Cash',
        lines: [
            {
                service: 'Haircut & Styling',
                employee: 'Hana Youssef',
                level: 'Junior',
                priceMajor: 100,
                durationMin: 45,
            },
        ],
    },
    {
        id: 'BK-1033',
        branch: 'Downtown',
        client: 'Yara Bassam',
        mobile: '+20 188 999 000',
        date: '2026-03-17',
        time: '10:00',
        status: 'no_show',
        payment: 'pending',
        payMethod: '—',
        lines: [{ service: 'Pedicure', employee: 'Reem Mohamed', level: 'Senior', priceMajor: 180, durationMin: 45 }],
    },
];

export const mockVisitViews: VisitView[] = MOCK_VISITS.map(buildVisitView);
