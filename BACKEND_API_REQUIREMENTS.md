# Hagzy Backend API Requirements

> **Updated:** April 11, 2026 — Generated from Dashboard Gap Remediation implementation
> **From:** Frontend Team
> **To:** Backend Team (Waqty API)
> **Base URL:** `https://waqty.alemtayaz.shop/public`
> **Auth:** Bearer token in `Authorization` header

All frontend pages have been wired to call these endpoints with `fallbackData` (mock data) so the UI works without the backend. As each endpoint is implemented, the mock data will automatically be replaced.

---

## Already Implemented (Existing Endpoints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/provider/auth/login` | Provider login |
| POST | `/api/provider/auth/send-otp` | Send OTP |
| POST | `/api/provider/auth/verify-otp` | Verify OTP |
| POST | `/api/provider/auth/reset-password` | Reset password |
| POST | `/api/provider/auth/register` | Register provider (**needs `accepted_terms_at` field**) |
| GET | `/api/provider/auth/me` | Get current user |
| CRUD | `/api/provider/branches/*` | Branch management (**needs `geofence_radius`, `require_gps` fields**) |
| CRUD | `/api/provider/employees/*` | Employee management |
| CRUD | `/api/provider/services/*` | Service management |
| CRUD | `/api/provider/shifts/*` | Shift management |
| CRUD | `/api/provider/shift-templates/*` | Shift template management |
| CRUD | `/api/provider/service-prices/*` | Service price management |
| CRUD | `/api/provider/pricing-groups/*` | Pricing group management |
| GET | `/api/provider/bookings` | List bookings (with filters) |
| GET | `/api/provider/bookings/:uuid` | Get booking detail |
| PATCH | `/api/provider/bookings/:uuid/status` | Update booking status |
| GET | `/api/provider/attendance` | List attendance records |

---

## CRITICAL PRIORITY — Needed First

### 1. Dashboard Summary
| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/provider/dashboard/summary` | `from_date, to_date, branch_uuid` | `DashboardSummary` (revenue, bookings, clients, trends, top lists, charts) |

### 2. Customers (12 endpoints)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/provider/customers` | Paginated, filterable by `search, group_uuid, vip` |
| GET | `/api/provider/customers/:uuid` | With relations (group, reviews, notes) |
| POST | `/api/provider/customers` | Create customer |
| PUT | `/api/provider/customers/:uuid` | Update customer |
| DELETE | `/api/provider/customers/:uuid` | Delete customer |
| GET | `/api/provider/customers/last-visits` | Filter by `days_since` |
| GET | `/api/provider/customers/:uuid/statements` | Financial balance history |
| GET | `/api/provider/customers/:uuid/reviews` | Reviews by/about customer |
| GET | `/api/provider/customers/:uuid/staff-notes` | Internal staff notes |
| POST | `/api/provider/customers/:uuid/staff-notes` | Add staff note |
| DELETE | `/api/provider/customers/:uuid/staff-notes/:note_uuid` | Delete note |
| CRUD | `/api/provider/customer-groups/*` | Customer groups with discounts |

### 3. Transactions (16 endpoints)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/provider/transactions` | Main list, filterable by type/status/date/branch |
| GET | `/api/provider/transactions/:uuid` | Detail |
| POST | `/api/provider/transactions` | Create transaction |
| GET | `/api/provider/transactions/cash-sales` | Cash sale records |
| GET/POST | `/api/provider/transactions/advance-payments` | Advance payment tracking |
| GET/POST | `/api/provider/transactions/petty-cash` | Petty cash records |
| GET | `/api/provider/transactions/safe-balances` | Safe balances |
| GET | `/api/provider/transactions/shift-totals` | Shift reconciliation |
| PATCH | `/api/provider/transactions/shift-totals/:uuid/close` | Close shift |
| GET/POST | `/api/provider/transactions/transfers` | Money transfers |
| GET | `/api/provider/transactions/dailies` | Daily summaries |
| GET | `/api/provider/transactions/best-sales` | Top sellers |
| GET | `/api/provider/transactions/client-sales` | Sales by client |
| GET | `/api/provider/transactions/package-sales` | Package sales |

### 4. Reports (7 endpoints)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/provider/reports/revenue` | Revenue data with filters |
| GET | `/api/provider/reports/bookings` | Booking analytics |
| GET | `/api/provider/reports/customers` | Customer analytics |
| GET | `/api/provider/reports/services` | Service analytics |
| GET | `/api/provider/reports/employees` | Employee analytics |
| GET | `/api/provider/reports/financial` | Financial overview |
| GET | `/api/provider/reports/:type/export` | Export as CSV/PDF |

All report endpoints accept: `from_date, to_date, branch_uuid, employee_uuid, group_by (day|week|month)`
Response format: `{ labels[], datasets[{ label, data[] }], summary{} }`

### 5. Payroll (12 endpoints)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/provider/payroll` | List payroll records |
| GET | `/api/provider/payroll/:uuid` | Payroll detail |
| POST | `/api/provider/payroll/generate` | Generate payroll for period |
| PATCH | `/api/provider/payroll/:uuid/approve` | Approve payroll |
| PATCH | `/api/provider/payroll/:uuid/pay` | Mark as paid |
| GET | `/api/provider/payroll/export` | Export payroll |
| GET | `/api/provider/commissions` | Commission records |
| CRUD | `/api/provider/commission-rules/*` | Commission rule configuration |
| GET/POST/DELETE | `/api/provider/deductions/*` | Salary deductions |

### 6. Booking Create/Update
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/provider/bookings` | Create booking from dashboard |
| PUT | `/api/provider/bookings/:uuid` | Edit/reschedule booking (accepts `reschedule_reason`) |

---

## MAJOR PRIORITY

### 7. Marketing (~25 endpoints)
| Group | Endpoints | Notes |
|-------|-----------|-------|
| Offers | CRUD `/api/provider/marketing/offers/*` | With scheduling, usage tracking |
| Promo Codes | CRUD `/api/provider/marketing/promo-codes/*` | With usage limits |
| Messages | CRUD + send `/api/provider/marketing/messages/*` | SMS/email composition |
| Templates | CRUD `/api/provider/marketing/templates/*` | Message templates |
| Notifications | GET + POST `/api/provider/marketing/notifications` | Push notifications |
| Packages | CRUD `/api/provider/marketing/packages/*` | Service bundles |
| Service Groups | CRUD `/api/provider/marketing/service-groups/*` | Grouped promotions |
| Announcements | CRUD + publish `/api/provider/marketing/announcements/*` | Employee announcements (**NEW**) |

### 8. Reviews (4 endpoints)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/provider/reviews` | All reviews, filterable by status/rating |
| PATCH | `/api/provider/reviews/:uuid/respond` | Business response |
| PATCH | `/api/provider/reviews/:uuid/flag` | Flag inappropriate |
| PATCH | `/api/provider/reviews/:uuid/hide` | Hide review |

### 9. Expenses (7 endpoints)
CRUD `/api/provider/expenses/*` + approve/reject workflow

### 10. Sales (6 endpoints)
CRUD `/api/provider/sales/*` + void + package sales

### 11. Returns (5 endpoints)
CRUD `/api/provider/returns/*` + approve/reject workflow

### 12. Employee Extended (~20 endpoints)
| Group | Endpoints |
|-------|-----------|
| Performance | GET `/api/provider/employee-performance` |
| Targets | CRUD `/api/provider/employee-targets/*` |
| Roles | CRUD `/api/provider/roles/*` |
| Positions | CRUD `/api/provider/positions/*` |
| Departments | CRUD `/api/provider/departments/*` |
| Transfers | CRUD + approve `/api/provider/employee-transfers/*` |
| Time Tracking | GET `/api/provider/time-tracking` |
| Fingerprints | GET + POST `/api/provider/fingerprints` |
| Attendance Methods | GET + PUT `/api/provider/attendance-methods/*` |
| Schedule | GET + POST + DELETE `/api/provider/schedule` |

### 13. Settings (~30 endpoints)
| Group | Endpoints |
|-------|-----------|
| Business Hours | GET + PUT `/api/provider/settings/business-hours` |
| Payment Methods | CRUD `/api/provider/settings/payment-methods/*` |
| Safes | CRUD `/api/provider/settings/safes/*` |
| Resources | CRUD `/api/provider/settings/resources/*` |
| Invoice | GET + PUT `/api/provider/settings/invoice` |
| Notifications | GET + PUT `/api/provider/settings/notifications` |
| Integrations | GET + connect/disconnect `/api/provider/settings/integrations/*` |
| Subscription | GET + change plan `/api/provider/settings/subscription` |
| Audit Log | GET `/api/provider/settings/audit-log` (paginated, filterable) |
| Service Categories | CRUD + reorder `/api/provider/settings/service-categories/*` |
| Service-Employee Map | GET + PUT `/api/provider/settings/service-employees` |
| Diary Automations | CRUD `/api/provider/settings/diary-automations/*` |
| Shift Automations | CRUD `/api/provider/settings/shift-automations/*` |
| Petty Cash Items | CRUD `/api/provider/settings/petty-cash-items/*` |

---

## STRATEGIC PRIORITY (New Features)

### 14. Tipping
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET/PUT | `/api/provider/settings/tipping` | Tip configuration |
| GET | `/api/provider/tips` | Tip records with filters |

### 15. Waitlist
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/provider/waitlist` | Filterable by branch/status |
| POST | `/api/provider/waitlist` | Add to waitlist |
| PUT/DELETE | `/api/provider/waitlist/:uuid` | Manage entries |
| PATCH | `/api/provider/waitlist/:uuid/notify` | Notify customer |

### 16. Loyalty
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET/PUT | `/api/provider/settings/loyalty` | Loyalty configuration |
| GET | `/api/provider/customers/:uuid/loyalty` | Customer loyalty history |

### 17. Bug Reports
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/provider/bug-reports` | Submit bug report |
| POST | `/api/provider/bug-reports/screenshot` | Upload screenshot (FormData) |

---

## Endpoint Count Summary

| Priority | Category | Count |
|----------|----------|-------|
| Critical | Dashboard, Customers, Transactions, Reports, Payroll, Bookings | ~55 |
| Major | Marketing, Reviews, Expenses, Sales, Returns, Employees, Settings | ~95 |
| Strategic | Tipping, Waitlist, Loyalty, Bug Reports | ~12 |
| **Total new endpoints** | | **~162** |
| Existing field extensions | Branch (geofence), Register (T&C) | 2 |
