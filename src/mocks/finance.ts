/**
 * Provider settlement — DERIVED from the provider's paid Visits (F2).
 *
 * The per-booking commission ledger and the monthly payouts are computed from
 * `mockVisits` + this provider's commission rate using the canonical
 * `platform_finance.ts` helpers — the SAME math SuperAdmin runs, so what the
 * provider sees here reconciles with the platform's payout view by construction.
 * No hand-aggregated money mocks. All money is integer MINOR UNITS.
 */
import type { Uuid, Payout, PlatformCommission } from '@/lib/contract';
import { isBilled, commissionForVisit, buildPayouts, platformRevenueSummary } from '@/lib/platform_finance';
import { mockVisits, PROVIDER_UUID, COMMISSION_RATE } from '@/mocks/visits';

/** provider_uuid -> commission_rate (0..1 fraction). Single-tenant dashboard. */
export const commissionRateByProvider: Record<Uuid, number> = {
    [PROVIDER_UUID]: COMMISSION_RATE,
};

/** Per-booking commission ledger, one row per billed visit. */
export const platformCommissions: PlatformCommission[] = mockVisits
    .filter(isBilled)
    .map(v => commissionForVisit(v, COMMISSION_RATE))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

const rawPayouts = buildPayouts(mockVisits, commissionRateByProvider);
const latestPeriod = rawPayouts.reduce((max, p) => (p.period_start > max ? p.period_start : max), '');

/**
 * One payout per period, newest first. Prior periods are already settled
 * ('paid'); the current period is still accruing ('pending').
 */
export const payouts: Payout[] = rawPayouts
    .map(p => ({ ...p, status: p.period_start === latestPeriod ? ('pending' as const) : ('paid' as const) }))
    .sort((a, b) => (a.period_start < b.period_start ? 1 : -1));

/** Roll-up across all billed visits (gross, commission, fees, net). */
export const summary = platformRevenueSummary(mockVisits, commissionRateByProvider);
