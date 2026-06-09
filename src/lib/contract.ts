/**
 * Provider dashboard — thin local layer over the app-owned domain model.
 *
 * ./waqty_contract.ts is owned by this app (the shared ecosystem contract was
 * retired on 2026-06-10; the real backend API is the future source of truth)
 * and may be edited freely.
 *
 * This file:
 *   - re-exports the domain entities / enums / helpers the dashboard uses;
 *   - adds `Canonical*` aliases for the entities whose plain names collide
 *     with the dashboard's legacy local types (Service / Package / Customer / …),
 *     so existing imports of `@/lib/contract` keep working unchanged.
 */

// --- canonical re-exports (values) ---
export {
    BOOKING_STATUSES,
    BUSINESS_CATEGORIES,
    normalizeBusinessCategory,
    BUSINESS_TERMINOLOGY,
    // lifecycle (F-A) + settlement (F-B) + check-in — the dashboard's displayStatus
    // layer and reception flow consume these directly from the canonical contract.
    BOOKING_TRANSITIONS,
    canTransition,
    deriveVisitStatus,
    settlePayment,
    isFullyPaid,
    checkInCode,
    // market registry + money primitives (G5) — single-sourced from the contract.
    EGYPT_MARKET,
    MARKETS,
    toMinorUnits,
    toMajorUnits,
    vatAmount,
    minorFractionDigits,
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

// EGYPT_MARKET / MARKETS are re-exported from the canonical contract above (G5) —
// the dashboard no longer keeps its own copy of the market registry.
