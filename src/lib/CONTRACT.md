# Canonical contract — this dashboard is the anchor (PR-9)

`src/lib/contract.ts` is the **anchor** for the Waqty/Hagzy ecosystem contract.
Its TypeScript types are the agreed source of truth that the other three apps
conform to. The booking model (`Visit` + `VisitLineItem`), payment models,
unified `CanonicalSubscriptionPlan`, staff earnings (`EmployeeCommission`,
`Payslip`, `Tip`), the catalogue (`CanonicalService`/`CanonicalServicePrice`/
`CanonicalPackage`) and the `BusinessCategory` enum all originate here.

## One source, three mirrors

| Consumer | How it consumes the contract |
| --- | --- |
| **Provider dashboard** (this app) | Imports from `@/lib/contract` directly. Authoritative. |
| **SuperAdmin** (Next.js/TS) | Imports the same TS types (shared package / workspace, or a copied `waqty_contract.ts`). |
| **User app** (Flutter) | `lib/contract/waqty_contract.dart` — a generated/copied Dart mirror. |
| **Employee app** (Flutter) | `lib/contract/waqty_contract.dart` — byte-identical to the User app's mirror. |

The repo-root file `contract/waqty_contract.ts` is the portable copy of this
anchor that the Flutter mirrors are generated from. When the contract changes:

1. Edit the types here (`src/lib/contract.ts`) — this is the anchor.
2. Sync `contract/waqty_contract.ts` to match (this is what the dashboards share
   and what the Dart mirror is generated from).
3. Regenerate / re-copy both Flutter `waqty_contract.dart` mirrors together so
   they stay byte-identical to each other and faithful to the TS source.

## Rules

1. **One source.** Canonical types live here; screens import them from
   `@/lib/contract` (re-exported via `@/lib/api` for convenience) instead of
   redefining their own shapes.
2. **Money is integer minor units (piastres).** 100 = EGP 1.00, never floats.
   Format with `@/lib/money` (`formatMoney` / `egp` / `toMinor` / `fromMinor`).
3. **Status is the canonical enum.** Persistent `BookingStatus`
   (`pending|confirmed|in_progress|completed|cancelled|no_show`) is separate from
   any time-derived display state (e.g. `arrived`/`inService` in the booking
   detail screen).
4. **Business type is the canonical enum.** Derive type-specific terminology and
   intake from `BUSINESS_TERMINOLOGY` / `normalizeBusinessCategory`, never from
   ad-hoc `.includes()` string matching.

## Target end-state

Promote the contract to a shared package (e.g. a `@waqty/contract` workspace
package) that both web dashboards depend on, with a codegen step emitting the
Dart mirror, so there is exactly one TS source and one generated Dart copy.
Until that package exists, keep `contract/waqty_contract.ts` and the two Dart
mirrors in lock-step with this anchor.
