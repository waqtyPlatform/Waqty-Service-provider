# Hagzy Backend API Requirements Report

**Date:** April 5, 2026
**From:** Frontend Team
**To:** Backend Team (Waqty API)
**Purpose:** Complete list of API endpoints needed to wire remaining frontend pages

---

## Table of Contents

1. [Data Gaps on Existing Endpoints](#1-data-gaps-on-existing-endpoints)
2. [Customers Module](#2-customers-module)
3. [Sales Module](#3-sales-module)
4. [Transactions Module](#4-transactions-module)
5. [Returns Module](#5-returns-module)
6. [Expenses Module](#6-expenses-module)
7. [Reports Module](#7-reports-module)
8. [Marketing Module](#8-marketing-module)
9. [Employee Sub-pages](#9-employee-sub-pages)
10. [Settings Sub-pages](#10-settings-sub-pages)
11. [Summary](#11-summary)

---

## 1. Data Gaps on Existing Endpoints

These are missing fields/features on endpoints that **already exist** in the Waqty collection. The frontend is currently showing hardcoded fallbacks for these.

### Bookings Endpoint
| Missing Field | Where It's Needed | Notes |
|---|---|---|
| `price` / `total_amount` | Booking list, calendar, detail | No revenue/payment data on booking object |
| `payment_status` | Booking list | unpaid/paid/partial |
| `payment_method` | Booking list | cash/card/etc. |
| `arrived` status | Booking detail | Only have: pending, confirmed, completed, cancelled, no_show |
| `in_service` status | Booking detail | Need intermediate status for "currently being served" |
| Provider-side create booking | Calendar page | `POST /provider/bookings` — provider can't create bookings |

### Employees Endpoint
| Missing Field | Where It's Needed | Notes |
|---|---|---|
| `role` / `job_title` | Employee list, booking calendar | No role/position/specialization field |
| `bookings_today_count` | Employee list | Aggregated count |
| `rating` | Employee list | Average customer rating |
| `revenue` | Employee list | Total/monthly revenue |
| `employee_level` / `tier` | Booking list | Senior/Junior/etc. |
| Real-time availability status | Booking calendar | Available / In Session / On Break |

### Booking Relationships (Eager Loading)
| Relationship | Issue |
|---|---|
| `booking.user` | Sometimes null — no client name/phone |
| `booking.service` | Name depends on eager-loading |
| `booking.employee` | Name depends on eager-loading |
| `booking.branch` | Name depends on eager-loading |
| `booking.user.vip` | No VIP flag on user |
| `booking.user.notes` | No client notes field |

---

## 2. Customers Module

**Pages:** `/customers`, `/customers/[id]`, `/customers/groups`, `/customers/last-visits`, `/customers/statements`

### 2.1 Customers CRUD

```
GET    /provider/customers                    — List customers
       Query: search, group (vip/regular/new), per_page, page
       Response: { id, name, phone, email, visits_count, total_spend, last_visit,
                   vip, has_allergy, group, status, avatar_url }

GET    /provider/customers/{uuid}             — Customer detail
       Response: { ...customer, address, dob, joined_at,
                   medical: { allergies[], conditions[], medications[], notes },
                   stats: { visits, spend, points, last_visit },
                   preferences }

POST   /provider/customers                    — Create customer
       Body: { name, phone, email, address, dob, medical }

PUT    /provider/customers/{uuid}             — Update customer
       Body: partial customer fields

DELETE /provider/customers/{uuid}             — Delete customer
```

### 2.2 Customer Reviews & Notes

```
GET    /provider/customers/{uuid}/reviews     — Customer reviews
       Response: [{ id, author, rating, date, comment }]

GET    /provider/customers/{uuid}/timeline    — Activity timeline
       Response: [{ time, title, description }]

POST   /provider/customers/{uuid}/staff-notes — Add staff note
       Body: { employee_uuid, service, rating, note }
```

### 2.3 Customer Groups

```
GET    /provider/customer-groups              — List groups
       Query: search, per_page, page
       Response: [{ id, name, members_count, discount, color, description, status }]

POST   /provider/customer-groups              — Create group
PUT    /provider/customer-groups/{uuid}       — Update group
DELETE /provider/customer-groups/{uuid}       — Delete group
```

### 2.4 Last Visits

```
GET    /provider/customers/last-visits        — List last visits
       Query: search, per_page, page
       Response: [{ id, client_name, phone, last_service, last_employee,
                    last_date, days_since, follow_up }]
```

### 2.5 Account Statements

```
GET    /provider/customers/statements         — List account statements
       Query: search, per_page, page
       Response: [{ id, client_name, group, opening_balance, credits,
                    debits, closing_balance, last_transaction }]
       KPIs: { total_closing, clients_with_balance, total_credits }

GET    /provider/customers/statements/export  — Export as CSV
```

---

## 3. Sales Module

**Pages:** `/sales`, `/sales/packages`

### 3.1 Sales Dashboard

```
GET    /provider/sales/summary                — Sales KPIs
       Query: date_from, date_to, branch
       Response: { total_revenue, total_transactions, avg_ticket,
                   top_services[], top_employees[] }
```

### 3.2 Packages

```
GET    /provider/packages                     — List packages
       Query: search, status, per_page, page
       Response: [{ uuid, name, price, original_price, validity_days,
                    sold_count, services[], status }]

POST   /provider/packages                     — Create package
PUT    /provider/packages/{uuid}              — Update package
DELETE /provider/packages/{uuid}              — Delete package
```

---

## 4. Transactions Module

**Pages:** `/transactions` + 10 sub-pages

### 4.1 Transactions List

```
GET    /provider/transactions                 — List all transactions
       Query: search, type (sale/refund/petty/advance/transfer),
              date_from, date_to, per_page, page
       Response: [{ id, date, time, type, client_name, service_name,
                    employee_name, payment_method, amount }]
       KPIs: { total_sales, total_refunds, net_revenue, count }
```

### 4.2 Cash Sales

```
GET    /provider/transactions/cash-sales      — List cash sales
       Query: search, date_from, date_to, per_page, page
       Response: [{ id, date, time, client_name, services[], amount,
                    base_price, price_source, payment_method, receipt_no,
                    cashier, employee, employee_level }]
```

### 4.3 Client Sales Summary

```
GET    /provider/transactions/client-sales    — Client sales aggregation
       Query: search, per_page, page
       Response: [{ id, name, group, visits, total_spend, avg_ticket,
                    last_visit, top_service }]
```

### 4.4 Advance Payments

```
GET    /provider/transactions/advance-payments — List advance payments
       Query: search, status (pending/paid/partial), per_page, page
       Response: [{ id, date, client_name, booking_id, service_name,
                    total, paid, balance, status }]
       KPIs: { total_collected, outstanding, pending_count }
```

### 4.5 Daily Records

```
GET    /provider/transactions/dailies         — Daily summary records
       Query: date_from, date_to
       Response: [{ date, revenue, cash, card, other_methods,
                    shifts_count, closed_shifts, status }]
       KPIs: { total_revenue, avg_daily_revenue, closed_shifts_count }
```

### 4.6 Petty Cash

```
GET    /provider/transactions/petty-cash      — List petty cash entries
       Query: search, category, date_from, date_to, per_page, page
       Response: [{ id, date, category, description, vendor, amount,
                    approved_by, status }]

POST   /provider/transactions/petty-cash      — Create entry
PUT    /provider/transactions/petty-cash/{id} — Update entry
```

### 4.7 Safe Balances

```
GET    /provider/transactions/safe-balances   — List safe balances
       Response: [{ name, type, opening, deposits, withdrawals,
                    balance, color }]
```

### 4.8 Shift Records

```
GET    /provider/transactions/shifts          — List shift records
       Query: date_from, date_to
       Response: [{ id, date, cashier, safe, open_time, close_time,
                    opening_balance, expected, actual, variance, status }]
```

### 4.9 Safe Transfers

```
GET    /provider/transactions/transfers       — List transfers
       Query: search, date_from, date_to, per_page, page
       Response: [{ id, date, time, from_safe, to_safe, amount,
                    cashier, status }]
```

### 4.10 Best Sales

```
GET    /provider/transactions/best-sales      — Top performers
       Query: date_from, date_to
       Response: { top_services[], top_employees[] }
```

### 4.11 Package Sales

```
GET    /provider/transactions/package-sales   — List package sales
       Query: search, status, per_page, page
       Response: [{ id, date, client_name, package_name, price,
                    sessions_total, sessions_used, expires, status }]
```

---

## 5. Returns Module

**Pages:** `/returns`, `/returns/cash-refund`, `/returns/cancel-down-payment`, `/returns/petty-cash-refund`

```
GET    /provider/returns                      — List all returns
       Query: search, type (service/advance/petty), status, per_page, page
       Response: [{ id, date, time, type, original_txn_id, client_name,
                    item, reason, amount, base_price, price_source,
                    payment_method, status, employee, employee_level }]
       KPIs: { total_refunded, pending_count, avg_processing_time }

POST   /provider/returns                      — Create return
       Body: { type, original_transaction_id, reason, amount, method }

PUT    /provider/returns/{id}                 — Update return status

GET    /provider/returns/refundable-transactions — Transactions eligible for refund
       Query: search, client
       Response: [{ id, date, client, items[], amount }]

POST   /provider/returns/cash-refund          — Process cash refund
       Body: { transaction_id, selected_items[], reason, notes }

GET    /provider/returns/cancellable-bookings — Bookings with down payments
       Query: search
       Response: [{ id, client, service, date, paid, total }]

POST   /provider/returns/cancel-down-payment  — Cancel down payment
       Body: { booking_id, reason, notes }

POST   /provider/returns/petty-cash-refund    — Refund petty cash
       Body: { entry_id, reason, notes }
```

---

## 6. Expenses Module

**Page:** `/expenses`

```
GET    /provider/expenses                     — List expenses
       Query: search, category, status, date_from, date_to, per_page, page
       Response: [{ id, date, category, description, vendor, amount,
                    payment_method, status }]
       KPIs: { total_expenses, pending_approvals, category_breakdown[] }

POST   /provider/expenses                     — Create expense
PUT    /provider/expenses/{id}                — Update expense
DELETE /provider/expenses/{id}                — Delete expense
```

---

## 7. Reports Module

**Pages:** `/reports`, `/reports/[category]`, `/reports/[category]/[report]`

```
GET    /provider/reports/revenue              — Revenue report
       Query: date_range (1m/3m/6m), branch
       Response: [{ period, revenue, expenses }]

GET    /provider/reports/revenue-by-service   — Service revenue breakdown
       Response: [{ name, value, color }]

GET    /provider/reports/bookings-by-day      — Weekly booking distribution
       Response: [{ day, bookings_count }]

GET    /provider/reports/branch-stats         — Branch KPIs
       Query: branch
       Response: { revenue, bookings, clients, growth_percentage }

GET    /provider/reports/employees            — Employee performance report
       Query: date_from, date_to
       Response: [{ employee, revenue, bookings, rating, retention }]

GET    /provider/reports/export               — Export any report
       Query: report_type, format (csv/pdf), date_from, date_to
       Response: file download
```

---

## 8. Marketing Module

**Pages:** `/marketing` + 6 sub-pages

### 8.1 Offers

```
GET    /provider/marketing/offers             — List offers
       Query: status, per_page, page
       Response: [{ uuid, name, discount, type (percentage/fixed),
                    services[], start_date, end_date, status, uses_count,
                    usage_limit, description, color }]

POST   /provider/marketing/offers             — Create offer
PUT    /provider/marketing/offers/{uuid}      — Update offer
DELETE /provider/marketing/offers/{uuid}      — Delete offer
```

### 8.2 Promo Codes

```
GET    /provider/marketing/promo-codes        — List promo codes
       Query: search, status, per_page, page
       Response: [{ uuid, code, discount, type, uses_count, usage_limit,
                    min_order, expires_at, status, created_at, description }]

POST   /provider/marketing/promo-codes        — Create promo code
PUT    /provider/marketing/promo-codes/{uuid} — Update
DELETE /provider/marketing/promo-codes/{uuid} — Delete
```

### 8.3 Messages

```
GET    /provider/marketing/messages           — List message templates
       Query: search, channel, per_page, page
       Response: [{ uuid, name, channel (sms/whatsapp/email), body,
                    last_used, usage_count, placeholders[] }]

POST   /provider/marketing/messages           — Create template
PUT    /provider/marketing/messages/{uuid}    — Update template
DELETE /provider/marketing/messages/{uuid}    — Delete template

POST   /provider/marketing/messages/{uuid}/send — Send to recipients
       Body: { recipient_uuids[] }
```

### 8.4 Notifications

```
GET    /provider/marketing/notifications      — List push notifications
       Query: status, channel, per_page, page
       Response: [{ uuid, title, channel, audience, sent_count,
                    opened_count, date, status, message }]

POST   /provider/marketing/notifications      — Create notification
PUT    /provider/marketing/notifications/{uuid} — Update
DELETE /provider/marketing/notifications/{uuid} — Delete

GET    /provider/marketing/notifications/{uuid}/recipients — Recipient details
       Response: [{ name, phone, opened, opened_at }]
```

### 8.5 Marketing Packages

```
GET    /provider/marketing/packages           — List marketing packages
       Query: search, per_page, page
       Response: [{ uuid, name, price, original_price, services[],
                    target_audience, active, sold_count, description }]

POST   /provider/marketing/packages           — Create
PUT    /provider/marketing/packages/{uuid}    — Update
DELETE /provider/marketing/packages/{uuid}    — Delete
```

### 8.6 Service Groups

```
GET    /provider/marketing/service-groups     — List service groups/bundles
       Query: search, per_page, page
       Response: [{ uuid, name, services[], discount, active }]

POST   /provider/marketing/service-groups     — Create
PUT    /provider/marketing/service-groups/{uuid} — Update
DELETE /provider/marketing/service-groups/{uuid} — Delete
```

---

## 9. Employee Sub-pages

**15 pages** under `/employees/` that need new endpoints.

### 9.1 Payroll

```
GET    /provider/payroll                      — List payroll records
       Query: month (YYYY-MM), department, status, search, per_page, page
       Response: [{ id, employee_uuid, employee_name, department,
                    base_salary, commission, deductions, tax,
                    net_salary, payment_method, payment_date, status }]

GET    /provider/payroll/{id}/commission-breakdown
       Response: [{ segment, revenue, rate, commission }]

PUT    /provider/payroll/{id}                 — Update payroll record
```

### 9.2 Commissions

```
GET    /provider/commissions                  — List commission records
       Query: employee_uuid, service_uuid, date_from, date_to, per_page, page
       Response: [{ id, date, employee_name, service_name, segment,
                    count, base_price, resolved_price, revenue, rate, commission }]

GET    /provider/commissions/by-segment       — Segment aggregation
       Response: [{ segment, total_revenue, total_commission, count }]

GET    /provider/commissions/targets          — Commission targets
       Response: [{ segment, target, achieved, percentage }]
```

### 9.3 Commission Settings

```
GET    /provider/commission-settings/service-rates
POST   /provider/commission-settings/service-rates
PUT    /provider/commission-settings/service-rates/{id}
DELETE /provider/commission-settings/service-rates/{id}
       Fields: { service_name, rate, min_price, max_price }

GET    /provider/commission-settings/target-rules
POST   /provider/commission-settings/target-rules
PUT    /provider/commission-settings/target-rules/{id}
DELETE /provider/commission-settings/target-rules/{id}
       Fields: { segment, target_amount, bonus, period }

GET    /provider/commission-settings/segment-rates
POST   /provider/commission-settings/segment-rates
PUT    /provider/commission-settings/segment-rates/{id}
DELETE /provider/commission-settings/segment-rates/{id}
       Fields: { segment, rate }

GET    /provider/commission-settings/extraction-rules
POST   /provider/commission-settings/extraction-rules
PUT    /provider/commission-settings/extraction-rules/{id}
DELETE /provider/commission-settings/extraction-rules/{id}
       Fields: { type, percentage, description }
```

### 9.4 Deductions

```
GET    /provider/deductions                   — List deductions
       Query: employee_uuid, type, date_from, date_to, department, per_page, page
       Response: [{ id, employee_uuid, employee_name, department, label,
                    amount, type (attendance/uniform/equipment/loan/other),
                    date, attachment_url }]

POST   /provider/deductions                   — Create (multipart for file)
PUT    /provider/deductions/{id}              — Update
DELETE /provider/deductions/{id}              — Delete
```

### 9.5 Performance

```
GET    /provider/employees/performance        — Performance metrics
       Query: period (month/lastMonth/quarter)
       Response: [{ id, employee_name, rating, reviews_count, revenue,
                    bookings_count, retention_rate, score }]
```

### 9.6 Targets

```
GET    /provider/employees/targets            — Employee targets
       Query: search, status (on_track/behind/exceeded)
       Response: [{ id, employee_name, target_revenue, achieved_revenue,
                    target_bookings, achieved_bookings, status }]
       KPIs: { avg_achievement, on_track_count, behind_count, total_target }

PUT    /provider/employees/{uuid}/targets     — Set targets
       Body: { target_revenue, target_bookings }
```

### 9.7 Permissions

```
GET    /provider/employees/{uuid}/permissions — Employee permissions
       Response: { modules: { [module]: { view, create, edit, delete } } }

PUT    /provider/employees/{uuid}/permissions — Update permissions
       Body: { modules: { [module]: { view, create, edit, delete } } }

GET    /provider/permissions/modules          — Available permission modules
       Response: [{ name, permissions[] }]
```

### 9.8 Roles

```
GET    /provider/roles                        — List roles
POST   /provider/roles                        — Create role
PUT    /provider/roles/{id}                   — Update role
DELETE /provider/roles/{id}                   — Delete role
       Fields: { name, color, permissions: { [module]: { view, create, edit, delete } } }
```

### 9.9 Positions

```
GET    /provider/positions                    — List positions
       Query: department, search
POST   /provider/positions
PUT    /provider/positions/{id}
DELETE /provider/positions/{id}
       Fields: { name, level, department, min_salary, max_salary }
```

### 9.10 Transfers

```
GET    /provider/employees/transfers          — List transfers
       Query: status, date_from, date_to, search, per_page, page
       Response: [{ id, date, employee_name, from_branch, to_branch,
                    type (permanent/temporary), status, until_date }]

POST   /provider/employees/transfers          — Create transfer
PUT    /provider/employees/transfers/{id}     — Update
DELETE /provider/employees/transfers/{id}     — Delete/Cancel
```

### 9.11 Time Tracking

```
GET    /provider/employees/time-tracking      — Time entries
       Query: status, date_from, date_to, search, per_page, page
       Response: [{ id, employee_name, date, clock_in, clock_out,
                    total_hours, overtime, status }]
       KPIs: { avg_hours, clocked_in_count, late_count, absent_count }

POST   /provider/employees/{uuid}/time-tracking — Manual entry
PUT    /provider/employees/{uuid}/time-tracking/{id} — Edit entry
```

### 9.12 Fingerprints

```
GET    /provider/employees/fingerprints       — Enrollment records
       Query: status, search
       Response: [{ id, employee_name, device, enroll_date,
                    fingers_count, status }]

POST   /provider/employees/{uuid}/fingerprints/enroll — Enroll
DELETE /provider/employees/{uuid}/fingerprints/{id}   — Remove
```

### 9.13 Attendance Methods

```
GET    /provider/attendance-methods           — List methods
       Response: [{ id, name, type, description, active }]

PUT    /provider/attendance-methods/{id}      — Toggle active
       Body: { active: boolean }
```

### 9.14 Attendance Settings

```
GET    /provider/attendance-settings
PUT    /provider/attendance-settings
       Fields: { grace_period_minutes, late_threshold, overtime_threshold,
                 deduction_rules: { late, absent, early_leave } }
```

### 9.15 Branch Management (Employee View)

```
GET    /provider/branches/{uuid}/employees    — Employees by branch
       Response: [{ uuid, name, position }]
```

---

## 10. Settings Sub-pages

**24 pages** under `/settings/` that need new endpoints.

### 10.1 Business Hours

```
GET    /provider/settings/hours
PUT    /provider/settings/hours
       Fields: { days: [{ day, is_open, open_time, close_time,
                          breaks: [{ start_time, end_time }] }] }
```

### 10.2 Roles (Settings)

```
Same as 9.8 — shared endpoint /provider/roles
```

### 10.3 Payment Methods

```
GET    /provider/settings/payment-methods
POST   /provider/settings/payment-methods
PUT    /provider/settings/payment-methods/{id}
DELETE /provider/settings/payment-methods/{id}
PUT    /provider/settings/payment-methods/reorder
       Fields: { name, type, fee, status }
```

### 10.4 Notification Preferences

```
GET    /provider/settings/notifications
PUT    /provider/settings/notifications
       Fields: { new_booking, cancel_booking, payment_received,
                 daily_summary, employee_clock_in, client_birthday }
```

### 10.5 Invoice Settings

```
GET    /provider/settings/invoice
PUT    /provider/settings/invoice
       Fields: { business_name, tax_number, address, phone,
                 prefix, next_number, tax_rate, currency, footer_text }
```

### 10.6 Devices

```
GET    /provider/settings/devices             — Device inventory (read-only)
       Query: status, type, search
       Response: [{ id, name, type, location, status, last_sync }]
```

### 10.7 Integrations

```
GET    /provider/settings/integrations
POST   /provider/settings/integrations/{id}/connect
DELETE /provider/settings/integrations/{id}/disconnect
GET    /provider/settings/integrations/{id}/config
PUT    /provider/settings/integrations/{id}/config
```

### 10.8 Security

```
GET    /provider/settings/security
PUT    /provider/settings/security
       Fields: { two_factor_auth, password_change_required,
                 lock_on_failed_attempts, session_timeout_minutes }
```

### 10.9 Localization

```
GET    /provider/settings/localization
PUT    /provider/settings/localization
       Fields: { timezone, currency, date_format }
```

### 10.10 Appearance

```
GET    /provider/settings/appearance
PUT    /provider/settings/appearance
       Fields: { theme, brand_color, language, compact_sidebar, animations }
```

### 10.11 Data Management

```
GET    /provider/settings/data                — Backup info
POST   /provider/settings/data/export         — Export all data
POST   /provider/settings/data/import         — Import data (file upload)
PUT    /provider/settings/data/backup         — Toggle auto-backup
```

### 10.12 Audit Log

```
GET    /provider/settings/audit-log           — List audit entries
       Query: user, action, entity, date_from, date_to, search, per_page, page
       Response: [{ id, timestamp, user, action, entity, details, ip }]

POST   /provider/settings/audit-log/export    — Export log
```

### 10.13 Subscription

```
GET    /provider/settings/subscription        — Current plan & usage
GET    /provider/settings/subscription/plans  — Available plans
POST   /provider/settings/subscription/upgrade/{plan_id}
```

### 10.14 Resources

```
GET    /provider/settings/resources
       Query: type, status, search
POST   /provider/settings/resources
PUT    /provider/settings/resources/{id}
DELETE /provider/settings/resources/{id}
       Fields: { name, type (chair/room/equipment), capacity, status }
```

### 10.15 Safes

```
GET    /provider/settings/safes
       Query: branch, status, search
POST   /provider/settings/safes
PUT    /provider/settings/safes/{id}
DELETE /provider/settings/safes/{id}
       Fields: { name, branch_uuid, balance, status, color }
       KPIs: { total_balance, active_safes, branches_covered }
```

### 10.16 Petty Cash Items

```
GET    /provider/settings/petty-cash-items
       Query: category, status, search
POST   /provider/settings/petty-cash-items
PUT    /provider/settings/petty-cash-items/{id}
DELETE /provider/settings/petty-cash-items/{id}
       Fields: { name, category, limit, status }
```

### 10.17 Service Categories

```
GET    /provider/settings/service-categories
POST   /provider/settings/service-categories
PUT    /provider/settings/service-categories/{id}
DELETE /provider/settings/service-categories/{id}
PUT    /provider/settings/service-categories/reorder
       Fields: { name, color, order }
```

### 10.18 Service-Employee Matrix

```
GET    /provider/settings/service-employees   — Capability matrix
PUT    /provider/settings/service-employees   — Update matrix
       Body: { assignments: [{ service_uuid, employee_uuid, enabled }] }
```

### 10.19 New Service (Multi-step)

```
POST   /provider/services                     — Create service (full)
       Body: { name, category_uuid, description, price, tax, tax_inclusive,
               duration, buffer, resource_uuids[], commission_type,
               commission_value, images[] }
```

### 10.20 Branch Detail Settings

```
GET    /provider/branches/{uuid}              — Full branch detail
PUT    /provider/branches/{uuid}              — Update branch settings
       Fields: { name, address, phone, manager_uuid, tax_id, currency,
                 tax_enabled, default_tax_rate, latitude, longitude,
                 geofence_radius }

GET    /provider/branches/{uuid}/hours
PUT    /provider/branches/{uuid}/hours

GET    /provider/branches/{uuid}/resources
PUT    /provider/branches/{uuid}/resources
```

### 10.21 Fingerprint Areas

```
GET    /provider/settings/fingerprint-areas
POST   /provider/settings/fingerprint-areas
PUT    /provider/settings/fingerprint-areas/{id}
DELETE /provider/settings/fingerprint-areas/{id}
       Fields: { name, branch_uuid, location_description }
```

### 10.22 Fingerprint Devices

```
GET    /provider/settings/fingerprint-devices
POST   /provider/settings/fingerprint-devices
PUT    /provider/settings/fingerprint-devices/{id}
DELETE /provider/settings/fingerprint-devices/{id}
       Fields: { name, model, area_uuid, ip_address, status }
```

### 10.23 Diary Automations

```
GET    /provider/settings/diary-automations
POST   /provider/settings/diary-automations
PUT    /provider/settings/diary-automations/{id}
DELETE /provider/settings/diary-automations/{id}
       Fields: { name, trigger, action, conditions, active }
```

### 10.24 Shift Automations

```
GET    /provider/settings/shift-automations
POST   /provider/settings/shift-automations
PUT    /provider/settings/shift-automations/{id}
DELETE /provider/settings/shift-automations/{id}
       Fields: { name, trigger, action, conditions, active }
```

---

## 11. Summary

### Endpoint Count by Module

| Module | New Endpoints Needed | Priority |
|---|---|---|
| **Existing endpoint gaps** | ~8 field additions | **Critical** |
| Customers | ~15 endpoints | High |
| Transactions | ~20 endpoints | High |
| Sales / Packages | ~6 endpoints | High |
| Returns | ~8 endpoints | Medium |
| Expenses | ~4 endpoints | Medium |
| Reports | ~6 endpoints | Medium |
| Marketing | ~20 endpoints | Medium |
| Employee (payroll, commissions, etc.) | ~40 endpoints | Medium |
| Settings | ~50 endpoints | Low |
| **Total** | **~177 new endpoints** | — |

### Priority Recommendation

1. **First** — Fix data gaps on existing endpoints (add price/payment to bookings, role to employees)
2. **Second** — Customers + Transactions (core business operations)
3. **Third** — Sales, Returns, Expenses (financial modules)
4. **Fourth** — Reports (depends on transaction data)
5. **Fifth** — Marketing (promo codes, offers, notifications)
6. **Sixth** — Employee HR sub-pages (payroll, commissions, targets)
7. **Last** — Settings pages (many are configuration-only)

### Auth Guard Recommendation

All endpoints above should use the **Provider** guard, matching the existing Waqty pattern.
Employee-facing features (time tracking, attendance) should also have mirrors under the **Employee** guard.
