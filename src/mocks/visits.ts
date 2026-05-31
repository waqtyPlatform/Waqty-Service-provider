/**
 * Provider-scoped mock Visits (F2 input).
 *
 * The logged-in provider's settlement (commission ledger + payouts) is DERIVED
 * from these paid/partial Visits via src/lib/platform_finance.ts — nothing is
 * hand-aggregated, so the provider's net reconciles with the platform's by
 * construction. All money is integer MINOR UNITS (piastres); 100 = EGP 1.00.
 *
 * Single-tenant: every visit belongs to PROVIDER_UUID. COMMISSION_RATE is the
 * platform commission this provider pays (a 0..1 fraction, mirroring the
 * canonical Provider.commission_rate). In production these come from the
 * authenticated provider + their Visit history.
 */
import type { Visit, Payment, VisitLineItem, PaymentStatus, BookingStatus } from '@/lib/contract';
import { toMinor, DEFAULT_CURRENCY } from '@/lib/money';

/** The provider this dashboard belongs to (mock identity). */
export const PROVIDER_UUID = 'prov-001';
/** Platform commission rate for this provider (0..1 fraction). */
export const COMMISSION_RATE = 0.12;

let _n = 0;
const id = (p: string) => `${p}-${(++_n).toString().padStart(4, '0')}`;

interface VisitSeed {
    customer: string; // customer_uuid
    grossMajor: number; // visit total in MAJOR units (EGP)
    feeMajor: number; // user transaction fee in MAJOR units
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    paidAt: string | null; // ISO; null while unpaid
    createdAt: string;
}

function mkVisit(s: VisitSeed): Visit {
    const visitUuid = id('visit');
    const total = toMinor(s.grossMajor);
    const fee = toMinor(s.feeMajor);
    const paid = s.paymentStatus === 'paid' ? total : s.paymentStatus === 'partial' ? Math.round(total / 2) : 0;

    const lineItem: VisitLineItem = {
        uuid: id('line'),
        visit_uuid: visitUuid,
        service_uuid: id('svc'),
        employee_uuid: null,
        start_time: s.createdAt,
        duration_minutes: 60,
        price: total,
        status: s.status,
    };

    const payment: Payment = {
        uuid: id('pay'),
        visit_uuid: visitUuid,
        model: 'online_upfront',
        method: 'card',
        status: s.paymentStatus,
        total,
        paid_amount: paid,
        balance_amount: total - paid,
        currency: DEFAULT_CURRENCY,
        platform_fee: fee,
        commission_amount: 0, // platform commission is derived in platform_finance
        paid_at: s.paidAt,
        created_at: s.createdAt,
        updated_at: s.paidAt ?? s.createdAt,
    };

    return {
        uuid: visitUuid,
        provider_uuid: PROVIDER_UUID,
        branch_uuid: 'branch-001',
        customer_uuid: s.customer,
        status: s.status,
        scheduled_start: s.createdAt,
        scheduled_end: null,
        line_items: [lineItem],
        payment,
        subtotal: total,
        discount_total: 0,
        tip_total: 0,
        total,
        currency: DEFAULT_CURRENCY,
        notes: null,
        created_at: s.createdAt,
        updated_at: s.paidAt ?? s.createdAt,
        completed_at: s.status === 'completed' ? s.paidAt : null,
    };
}

export const mockVisits: Visit[] = [
    // May 2026 — current period (billed)
    mkVisit({
        customer: 'cus-001',
        grossMajor: 350,
        feeMajor: 7,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-05-28T10:00:00Z',
        createdAt: '2026-05-28T09:00:00Z',
    }),
    mkVisit({
        customer: 'cus-002',
        grossMajor: 220,
        feeMajor: 4,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-05-27T13:30:00Z',
        createdAt: '2026-05-27T12:30:00Z',
    }),
    mkVisit({
        customer: 'cus-003',
        grossMajor: 500,
        feeMajor: 10,
        status: 'in_progress',
        paymentStatus: 'partial',
        paidAt: '2026-05-26T16:00:00Z',
        createdAt: '2026-05-26T15:00:00Z',
    }),
    mkVisit({
        customer: 'cus-004',
        grossMajor: 180,
        feeMajor: 4,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-05-24T11:00:00Z',
        createdAt: '2026-05-24T10:00:00Z',
    }),
    mkVisit({
        customer: 'cus-005',
        grossMajor: 420,
        feeMajor: 8,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-05-20T15:00:00Z',
        createdAt: '2026-05-20T14:00:00Z',
    }),
    // not billed yet — must NOT contribute to the settlement
    mkVisit({
        customer: 'cus-006',
        grossMajor: 300,
        feeMajor: 6,
        status: 'pending',
        paymentStatus: 'pending',
        paidAt: null,
        createdAt: '2026-05-29T16:00:00Z',
    }),
    mkVisit({
        customer: 'cus-007',
        grossMajor: 150,
        feeMajor: 3,
        status: 'cancelled',
        paymentStatus: 'failed',
        paidAt: null,
        createdAt: '2026-05-18T12:00:00Z',
    }),
    // April 2026 — prior period (drives a second, already-paid payout bucket)
    mkVisit({
        customer: 'cus-008',
        grossMajor: 900,
        feeMajor: 18,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-04-22T12:00:00Z',
        createdAt: '2026-04-22T11:00:00Z',
    }),
    mkVisit({
        customer: 'cus-009',
        grossMajor: 450,
        feeMajor: 9,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-04-15T14:00:00Z',
        createdAt: '2026-04-15T13:00:00Z',
    }),
    mkVisit({
        customer: 'cus-010',
        grossMajor: 260,
        feeMajor: 5,
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: '2026-04-10T09:00:00Z',
        createdAt: '2026-04-10T08:00:00Z',
    }),
];
