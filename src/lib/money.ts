/**
 * Canonical money helpers (PR-8 — currency consistency).
 *
 * The ecosystem contract stores money as INTEGER MINOR UNITS (piastres):
 * 100 = EGP 1.00, never floats. Use these helpers everywhere money is rendered
 * so amounts are consistent across the dashboard, the User app and SuperAdmin.
 *
 * Migration note: many legacy screens still hold major-unit numbers and render
 * with `.toLocaleString()` + a hardcoded "EGP". New/aligned code stores minor
 * units and formats with `formatMoney`. When converting a screen, wrap reads
 * with `fromMinor`/`toMinor` at the boundary and render via `formatMoney`.
 */

import type { CurrencyCode, Money, MarketConfig } from './contract';
import { EGYPT_MARKET, toMinorUnits, toMajorUnits } from './contract';

/**
 * The active market for this deployment (X8 — app config, NOT the contract;
 * cf. SuperAdmin's src/lib/market.ts). The displayed currency and minor-unit
 * scale follow this config, so a GCC market drops in by editing it — with zero
 * edits at any `formatMoney`/`egp` call site.
 */
export const activeMarket: MarketConfig = EGYPT_MARKET;
export const DEFAULT_CURRENCY: CurrencyCode = activeMarket.currency;
const MINOR_PER_MAJOR = activeMarket.minor_units_per_major;

/** Major units (e.g. 12.5 EGP) -> minor units (1250). Delegates to the contract. */
export function toMinor(major: number): Money {
    return toMinorUnits(major, activeMarket);
}

/** Minor units (1250) -> major units (12.5). For charts/inputs only — render with formatMoney. */
export function fromMinor(minor: Money): number {
    return toMajorUnits(minor, activeMarket);
}

interface FormatMoneyOptions {
    currency?: CurrencyCode;
    /** Show the currency code suffix (default true). */
    withCurrency?: boolean;
    /** Force 2 decimals even for whole amounts (default: hide ".00"). */
    alwaysDecimals?: boolean;
    /** BCP-47 locale for grouping/decimal marks (default "en-EG"). */
    locale?: string;
}

/**
 * Format an amount given in MINOR units as a display string.
 *   formatMoney(125000)                 -> "1,250 EGP"
 *   formatMoney(125050)                 -> "1,250.50 EGP"
 *   formatMoney(99900, { currency: 'EGP', withCurrency: false }) -> "999"
 */
export function formatMoney(minor: Money, opts: FormatMoneyOptions = {}): string {
    const { currency = DEFAULT_CURRENCY, withCurrency = true, alwaysDecimals = false, locale = 'en-EG' } = opts;
    const major = fromMinor(minor ?? 0);
    const hasFraction = alwaysDecimals || Math.round(minor ?? 0) % MINOR_PER_MAJOR !== 0;
    const text = major.toLocaleString(locale, {
        minimumFractionDigits: hasFraction ? 2 : 0,
        maximumFractionDigits: 2,
    });
    return withCurrency ? `${text} ${currency}` : text;
}

/** Shorthand for the active-market currency from minor units. */
export function egp(minor: Money): string {
    return formatMoney(minor); // currency comes from activeMarket (X8)
}
