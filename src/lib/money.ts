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

/**
 * Localized currency LABEL per UI language. The contract's `currency` is the ISO
 * code ("EGP"); under Arabic we show the native word "جنيه" instead. The ambient
 * language is synced from the language provider via `setMoneyLocale`, so amounts
 * show "جنيه" in Arabic without threading a locale through every call site.
 */
type LangCode = 'en' | 'ar';
const CURRENCY_LABELS: Record<string, Record<LangCode, string>> = {
    EGP: { en: 'EGP', ar: 'جنيه' },
};
let activeLang: LangCode = 'en';

export function setMoneyLocale(lang: LangCode): void {
    activeLang = lang;
}

function currencyLabel(currency: CurrencyCode, lang: LangCode): string {
    return CURRENCY_LABELS[currency]?.[lang] ?? currency;
}

/**
 * The active-market currency LABEL for the current UI language — "EGP" (en) or
 * "جنيه" (ar). Use this to localize legacy screens that hold MAJOR-unit numbers and
 * render `{value.toLocaleString()} EGP`: swap the hardcoded "EGP" for `{egpLabel()}`
 * so the currency word follows the language without touching the number.
 */
export function egpLabel(): string {
    return currencyLabel(DEFAULT_CURRENCY, activeLang);
}

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
    return withCurrency ? `${text} ${currencyLabel(currency, activeLang)}` : text;
}

/** Shorthand for the active-market currency from minor units. */
export function egp(minor: Money): string {
    return formatMoney(minor); // currency comes from activeMarket (X8)
}

/**
 * Compact MINOR-UNIT amount for dense surfaces (chart axes, tooltips, KPI cards) —
 * the SP counterpart of SuperAdmin's `formatCompactMoney` so both dashboards render
 * dense money identically (cross-app parity). `formatCompactMoney(34000000)` -> "340K جنيه"
 * (ar) / "340K EGP" (en); `formatCompactMoney(296300000)` -> "3.0M …". Pass
 * `withCurrency: false` for bare axis ticks ("340K"). Number-first to match `formatMoney`.
 */
export function formatCompactMoney(minor: Money, opts: { withCurrency?: boolean } = {}): string {
    const { withCurrency = true } = opts;
    const major = fromMinor(minor ?? 0);
    const abs = Math.abs(major);
    const n =
        abs >= 1_000_000
            ? `${(major / 1_000_000).toFixed(1)}M`
            : abs >= 1_000
              ? `${Math.round(major / 1_000)}K`
              : `${Math.round(major)}`;
    return withCurrency ? `${n} ${currencyLabel(DEFAULT_CURRENCY, activeLang)}` : n;
}
