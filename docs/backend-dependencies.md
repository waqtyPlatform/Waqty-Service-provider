# Hagzy — Backend Dependencies (Mock Data Inventory)

This document lists every page that currently renders **mock / fallback data** in place of a real API call. It is the hand-off list for the backend team and a working checklist for swap-in once endpoints ship.

> **Convention:** pages keep a `FALLBACK_*`, `fallback*`, or `MOCK_*` constant. The convention is to swap in `useApiQuery(() => <module>Api.<fn>(), [])` when the corresponding endpoint is delivered.

## How to find these in code

```bash
# All pages with fallback / mock constants:
grep -rln -E "FALLBACK_|fallback[A-Z]|MOCK_" src/app

# Pages explicitly tagged for future API wire-up:
grep -rln "MOCK: replace" src
```

## Pages awaiting backend endpoints

### Dashboard & analytics
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/page.tsx` | `FALLBACK_SUMMARY` | `dashboardApi.getSummary` |
| `src/app/reports/page.tsx` | `fallbackRevenueData`, `fallbackBranchData`, `fallbackServiceBreakdown`, `fallbackWeeklyBookings` | `reportApi.getRevenueReport` and friends |
| `src/app/reports/[category]/page.tsx` | `fallback*` | category-aware report endpoints |
| `src/app/reports/[category]/[report]/page.tsx` | `fallback*` | dynamic report endpoint |

### Bookings
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/bookings/page.tsx` | `fallback*` | `providerApi.getBookings` |
| `src/app/bookings/new/page.tsx` | `MOCK_*`, `SERVICES`, `EMPLOYEES`, `MOCK_PRICE_OVERRIDES`, `EMP_BUSY`, `ROOM_BUSY` | services, employees, branches, pricing, availability |
| `src/app/bookings/waitlist/page.tsx` | `fallback*` | waitlist endpoints |

### Customers
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/customers/page.tsx` | `fallback*` | `customerApi.getCustomers` |
| `src/app/customers/[id]/page.tsx` | `fallbackClient`, `fallbackReviews`, `fallbackStaffNotes` | `customerApi.getCustomer/getReviews/getNotes` |
| `src/app/customers/groups/page.tsx` | `fallback*` | groups |
| `src/app/customers/last-visits/page.tsx` | `fallback*` | last-visits report |
| `src/app/customers/reviews/page.tsx` | `fallback*` | reviews |
| `src/app/customers/statements/page.tsx` | `fallback*` | statements |

### Employees / HR
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/employees/page.tsx` | `fallback*` | `providerApi.getEmployees` |
| `src/app/employees/attend-methods/page.tsx` | `fallback*` | attendance-method config |
| `src/app/employees/attendance-settings/page.tsx` | `fallback*` | attendance settings |
| `src/app/employees/branch-management/page.tsx` | `fallback*` | per-employee branch links |
| `src/app/employees/commissions/page.tsx` | `fallback*` | commission ledger |
| `src/app/employees/commission-settings/page.tsx` | `fallback*` | commission rules |
| `src/app/employees/departments/page.tsx` | `fallback*` | departments |
| `src/app/employees/fingerprints/page.tsx` | `fallback*` | fingerprint enrollment |
| `src/app/employees/payroll/page.tsx` | `fallback*` | payroll periods, payslips |
| `src/app/employees/performance/page.tsx` | `fallback*` | KPIs |
| `src/app/employees/permissions/page.tsx` | `fallback*` | role/permission matrix |
| `src/app/employees/positions/page.tsx` | `fallback*` | positions |
| `src/app/employees/roles/page.tsx` | `fallback*` | roles |
| `src/app/employees/schedule/page.tsx` | `fallback*` | shift schedule |
| `src/app/employees/targets/page.tsx` | `fallback*` | sales targets |
| `src/app/employees/time-tracking/page.tsx` | `fallback*` | clock-in / clock-out |
| `src/app/employees/transfers/page.tsx` | `fallback*` | inter-branch transfers |

### Transactions / Finance
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/transactions/page.tsx` | `fallback*` | `providerApi.getTransactions` |
| `src/app/transactions/advance-payments/page.tsx` | `fallback*` | advance payments |
| `src/app/transactions/best-sales/page.tsx` | `fallback*` | best sellers report |
| `src/app/transactions/cash-sales/page.tsx` | `fallback*` | cash sales |
| `src/app/transactions/client-sales/page.tsx` | `fallback*` | per-client sales |
| `src/app/transactions/dailies/page.tsx` | `fallback*` | daily totals |
| `src/app/transactions/package-sales/page.tsx` | `fallback*` | package sales |
| `src/app/transactions/petty-cash/page.tsx` | `fallback*` | petty cash log |
| `src/app/transactions/safe-balances/page.tsx` | `fallback*` | safe balances |
| `src/app/transactions/shifts/page.tsx` | `fallback*` | shift sessions |
| `src/app/transactions/transfers/page.tsx` | `fallback*` | inter-safe transfers |
| `src/app/expenses/page.tsx` | `fallbackExpenses` | expenses |
| `src/app/returns/page.tsx` | `fallbackReturns` | returns ledger |
| `src/app/returns/cash-refund/page.tsx` | `fallback*` | cash refunds |
| `src/app/returns/cancel-down-payment/page.tsx` | `fallback*` | down-payment cancellation |
| `src/app/returns/petty-cash-refund/page.tsx` | `fallback*` | petty-cash refunds |

### Sales & marketing
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/sales/page.tsx` | `fallback*` | service catalog |
| `src/app/sales/packages/page.tsx` | `fallback*` | package catalog |
| `src/app/marketing/announcements/page.tsx` | `fallback*` | announcements |
| `src/app/marketing/messages/page.tsx` | `fallback*` | messages |
| `src/app/marketing/notifications/page.tsx` | `fallback*` | push/email notifications |
| `src/app/marketing/offers/page.tsx` | `fallbackOffers` (now also with local-state CRUD) | `marketingApi.getOffers/createOffer/updateOffer/deleteOffer` |
| `src/app/marketing/packages/page.tsx` | `fallback*` | packages |
| `src/app/marketing/promo-codes/page.tsx` | `fallback*` | promo codes |
| `src/app/marketing/service-groups/page.tsx` | `fallback*` | service groups |

### Settings
| Page | Mock constant | Target API |
|---|---|---|
| `src/app/settings/appearance/page.tsx` | `fallback*` | appearance prefs |
| `src/app/settings/audit-log/page.tsx` | `fallback*` | audit log |
| `src/app/settings/branches/page.tsx` | `fallback*` | `settingsApi.getBranches` |
| `src/app/settings/branches/[id]/page.tsx` | `fallback*` | per-branch detail |
| `src/app/settings/data/page.tsx` | `fallback*` | data import/export |
| `src/app/settings/devices/page.tsx` | `fallback*` | devices |
| `src/app/settings/diary-automations/page.tsx` | `fallback*` | diary automations |
| `src/app/settings/fingerprint-areas/page.tsx` | `fallback*` | fingerprint areas |
| `src/app/settings/fingerprint-devices/page.tsx` | `fallback*` | fingerprint devices |
| `src/app/settings/hours/page.tsx` | `fallback*` | business hours |
| `src/app/settings/integrations/page.tsx` | `fallback*` | integrations |
| `src/app/settings/invoice/page.tsx` | `fallback*` | invoice settings |
| `src/app/settings/localization/page.tsx` | `fallback*` | localization |
| `src/app/settings/loyalty/page.tsx` | `fallback*` | loyalty programs |
| `src/app/settings/notifications/page.tsx` | `fallback*` | notification prefs |
| `src/app/settings/payment-methods/page.tsx` | `fallback*` | payment methods |
| `src/app/settings/petty-cash-items/page.tsx` | `fallback*` | petty cash items |
| `src/app/settings/roles/page.tsx` | `fallback*` | roles |
| `src/app/settings/safes/page.tsx` | `fallback*` | safes |
| `src/app/settings/security/page.tsx` | `fallback*` | security settings |
| `src/app/settings/service-categories/page.tsx` | `fallback*` | service categories |
| `src/app/settings/service-employees/page.tsx` | `fallback*` | service ↔ employee links |
| `src/app/settings/service-pricing/page.tsx` | `fallback*` | tiered pricing |
| `src/app/settings/services/page.tsx` | `fallback*` | services |
| `src/app/settings/shift-automations/page.tsx` | `fallback*` | shift automations |
| `src/app/settings/subscription/page.tsx` | `fallback*` | subscription |
| `src/app/settings/tipping/page.tsx` | `fallback*` | tipping |

## Auth flows still mocked

| Flow | Location | Target API |
|---|---|---|
| OTP request | `src/contexts/AuthContext.tsx` (`requestOTP`) | `authApi.sendOtp` (already imported, used by `forgotPassword`) |
| OTP verify | `src/contexts/AuthContext.tsx` (`verifyOTP`) | `authApi.verifyOtp` |
| Demo logins | `src/contexts/AuthContext.tsx` (`MOCK_USERS`) | strip once real login covers all roles |

## Re-running this inventory

```bash
grep -rln -E "FALLBACK_|fallback[A-Z]|MOCK_" src/app | wc -l
# Should equal the count above (≈ 83 files)
```
