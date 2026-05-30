// X15 — data backing the shared canonical catalogue (PR-7). The User app books
// against the provider's canonical catalogue: real services, real ServicePrice
// rows (so a line resolves a real price) and real bookable availability slots.
// These seeds give the catalogue/availability adapters something to return until
// the live endpoints expose them.
//
// Prices are canonical Money — integer MINOR units (100 = EGP 1.00).
import {
    buildAvailableDays,
    toCanonicalService,
    toCanonicalServicePrice,
    resolveServicePrice,
    type Service,
    type ServicePrice,
    type CanonicalService,
    type CanonicalServicePrice,
    type AvailableDay,
} from '@/lib/api';

const PROVIDER_UUID = 'prov-001';
const MAIN_BRANCH = 'br-001';

// ── Services ────────────────────────────────────────────────────────────────
export const catalogServices: Service[] = [
    {
        uuid: 'svc-001',
        name: 'Hair Cut & Style',
        name_ar: 'قص وتصفيف الشعر',
        description: 'Wash, cut and blow-dry',
        sub_category_uuid: 'cat-hair',
        estimated_duration_minutes: 45,
        image_url: null,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
    {
        uuid: 'svc-002',
        name: 'Hair Coloring - Full',
        name_ar: 'صبغ شعر - كامل',
        description: 'Full-head colour',
        sub_category_uuid: 'cat-hair',
        estimated_duration_minutes: 90,
        image_url: null,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
    {
        uuid: 'svc-003',
        name: 'Beard Trim',
        name_ar: 'تهذيب اللحية',
        description: 'Shape and line-up',
        sub_category_uuid: 'cat-grooming',
        estimated_duration_minutes: 20,
        image_url: null,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
];

// ── ServicePrice rows (cascade: base + a senior-specialist tier) ─────────────
export const catalogServicePrices: ServicePrice[] = [
    // svc-001 — base + senior specialist override
    {
        uuid: 'sp-001',
        service_uuid: 'svc-001',
        branch_uuid: null,
        employee_uuid: null,
        pricing_group_uuid: null,
        price: 15000,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
    {
        uuid: 'sp-002',
        service_uuid: 'svc-001',
        branch_uuid: null,
        employee_uuid: 'emp-2',
        pricing_group_uuid: null,
        price: 20000,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
    // svc-002 — base only
    {
        uuid: 'sp-003',
        service_uuid: 'svc-002',
        branch_uuid: null,
        employee_uuid: null,
        pricing_group_uuid: null,
        price: 52000,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
    // svc-003 — base only
    {
        uuid: 'sp-004',
        service_uuid: 'svc-003',
        branch_uuid: null,
        employee_uuid: null,
        pricing_group_uuid: null,
        price: 8000,
        active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z',
    },
];

// ── Bookable availability (next few days, 10:00–20:00, hourly) ───────────────
export const catalogAvailability: AvailableDay[] = buildAvailableDays({
    dates: ['2026-06-01', '2026-06-02', '2026-06-03'],
    open: '10:00',
    close: '20:00',
    slotMinutes: 60,
    employeeUuid: null, // any available specialist
    busy: { '2026-06-01': ['12:00', '13:00'], '2026-06-02': ['15:00'] },
});

// ── Canonical projections the User app consumes (PR-7) ───────────────────────
export const canonicalCatalogServices: CanonicalService[] = catalogServices.map(s =>
    toCanonicalService(s, PROVIDER_UUID)
);

export const canonicalCatalogPrices: CanonicalServicePrice[] = catalogServicePrices.map(toCanonicalServicePrice);

/** Convenience: resolve a service's price (minor units) from the seed catalogue. */
export function catalogPriceFor(serviceUuid: string, employeeUuid?: string | null): number {
    return resolveServicePrice(catalogServicePrices, {
        service_uuid: serviceUuid,
        employee_uuid: employeeUuid ?? null,
        branch_uuid: MAIN_BRANCH,
    });
}
