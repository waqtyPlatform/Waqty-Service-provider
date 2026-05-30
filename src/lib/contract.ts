/**
 * Provider dashboard — view of the CANONICAL ecosystem contract (X1).
 *
 * The single source of truth lives at  <repo-root>/contract/waqty_contract.ts
 * and is synced VERBATIM into  ./waqty_contract.ts  (guarded by the contract
 * drift check — see scripts/check-contract.mjs and .github/workflows/contract.yml).
 * Do NOT edit ./waqty_contract.ts by hand: edit the root source, then re-sync
 * with `node ../contract/sync.mjs` and re-baseline (`npm run contract:check -- --write`).
 *
 * This file is the dashboard's thin local layer over that canonical:
 *   - it re-exports the canonical entities / enums / helpers the dashboard uses;
 *   - it adds `Canonical*` aliases for the entities whose plain names collide
 *     with the dashboard's legacy local types (Service / Package / Customer / …),
 *     so existing imports of `@/lib/contract` keep working unchanged.
 */

// --- canonical re-exports (values) ---
export {
    BOOKING_STATUSES,
    BUSINESS_CATEGORIES,
    normalizeBusinessCategory,
    BUSINESS_TERMINOLOGY,
} from './waqty_contract';

// --- canonical re-exports (types the dashboard refers to by their plain name) ---
export type {
    Uuid,
    IsoDate,
    IsoDateTime,
    TimeStr,
    Money,
    CurrencyCode,
    CountryCode,
    LocaleCode,
    BookingStatus,
    BusinessCategory,
    ProviderStatus,
    PaymentModel,
    PaymentStatus,
    ReviewStatus,
    CommissionType,
    WaitlistStatus,
    LoyaltyTxnType,
    PlanTier,
    BillingCycle,
    SubscriptionStatus,
    PayoutStatus,
    AdType,
    AdStatus,
    MarketConfig,
    BusinessTerminology,
    CustomerProviderProfile,
    AvailabilitySlot,
    AvailableDay,
    Visit,
    VisitLineItem,
    Payment,
    LoyaltyAccount,
    PlanFeature,
    PlanLimits,
    ProviderSubscription,
    Invoice,
    PlatformCommission,
    Payout,
    TransactionFee,
    AdPlacement,
    EmployeeCommission,
    Payslip,
} from './waqty_contract';

// --- Canonical* aliases: the dashboard keeps legacy local types under these
//     plain names, so it refers to the canonical entities via a Canonical* prefix.
import type {
    MarketConfig as MarketConfigT,
    PaymentMethod,
    Customer,
    ServiceCategory,
    Service,
    ServicePrice,
    Package,
    Review,
    Tip,
    LoyaltyTransaction,
    WaitlistEntry,
    SubscriptionPlan,
    CommissionRule,
} from './waqty_contract';

export type CanonicalPaymentMethod = PaymentMethod;
export type CanonicalCustomer = Customer;
export type CanonicalServiceCategory = ServiceCategory;
export type CanonicalService = Omit<Service, 'created_at' | 'updated_at'>;
export type CanonicalServicePrice = ServicePrice;
export type CanonicalPackage = Package;
export type CanonicalReview = Review;
export type CanonicalTip = Tip;
export type CanonicalLoyaltyTransaction = LoyaltyTransaction;
export type CanonicalWaitlistEntry = WaitlistEntry;
export type CanonicalSubscriptionPlan = SubscriptionPlan;
export type CanonicalCommissionRule = CommissionRule;

// --- dashboard-local app config (NOT part of the canonical contract; each app
//     owns its market registry — cf. SuperAdmin's src/lib/market.ts) ---
export const EGYPT_MARKET: MarketConfigT = {
    country: 'EG',
    currency: 'EGP',
    default_locale: 'ar',
    dialing_code: '+20',
    minor_units_per_major: 100,
    vat_rate: 0.14,
};
