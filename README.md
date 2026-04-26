# Hagzy — Service Provider Dashboard

**Hagzy** is a bilingual (English / Arabic, full RTL) **business management dashboard** for service providers. It is the operator-facing console for clinics (doctors), hairstyling salons, and barber shops, covering bookings, customers, employees & payroll, transactions & finance, marketing, multi-branch settings, and analytics.

The dashboard is a single Next.js 16 (App Router) application that talks to an external REST API. It runs on Vercel.

---

## Table of contents

1. [What Hagzy does](#what-hagzy-does)
2. [Three dashboards in one](#three-dashboards-in-one)
3. [Tech stack](#tech-stack)
4. [Architecture](#architecture)
5. [Directory structure](#directory-structure)
6. [Routes](#routes)
7. [Authentication & roles](#authentication--roles)
8. [Internationalization](#internationalization)
9. [API client & error handling](#api-client--error-handling)
10. [Local development](#local-development)
11. [Environment variables](#environment-variables)
12. [Scripts](#scripts)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Backend dependencies (mock data)](#backend-dependencies-mock-data)
16. [Security notes](#security-notes)
17. [Contributing](#contributing)
18. [Project status & roadmap](#project-status--roadmap)
19. [Recent updates](#recent-updates)

---

## What Hagzy does

Hagzy gives a service business one console to run day-to-day operations:

- **Calendar & bookings** — appointment calendar, booking list, new booking form, room calendar, waitlist, print view, conflict detection.
- **Customers (CRM)** — customer directory, groups (VIP / Regular / Corporate), reviews, statements, last-visit tracking.
- **Employees / HR** — directory, departments, roles & permissions, schedule & shifts, attendance & fingerprints, performance, targets, transfers, payroll, commissions, deductions.
- **Transactions & finance** — daily totals, cash sales, package sales, advance payments, petty cash, safe balances, transfers, returns (cash refund / down-payment cancellation / petty-cash refund), expenses.
- **Sales & POS** — services, packages, pricing tiers.
- **Marketing** — offers, promo codes, packages, announcements, push & email notifications, message templates, service groups.
- **Reports** — revenue, bookings, customers, services, employees, financial. Filter by date range and branch.
- **Settings** — branches, services & categories, business hours, payment methods, invoice template, devices & fingerprint hardware, safes, petty-cash items, subscription, integrations, audit log, security, appearance, localization, data import/export, automations, tipping, loyalty.
- **Help & support** — bilingual FAQ, bug reporting, support email & WhatsApp.
- **Employee portal** — separate sign-in for staff to view their schedule, attendance, and bookings.

---

## Three dashboards in one

The same codebase ships three distinct experiences driven by `user.businessType`:

| Business type | Token | Sample login | Sidebar / dashboard differences |
|---|---|---|---|
| **Doctor / Clinic** | `'clinic'` | `clinic@hagzy.com` | "Patients" instead of "Clients", "Appointments" instead of "Bookings", "Doctor / Specialist" service picker, **patient-intake form** (allergies, blood type, medications, chief complaint) on the New Booking page |
| **Hairstyling Salon** | `'salon'` | `salon@hagzy.com` | "Stylists", "Services", standard booking form |
| **Barber** | `'barber'` | `barber@hagzy.com` | "Barbers", "Appointments", standard booking form (no medical fields) |

The switch logic lives in three places:

- **Type definition**: [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx) — `BusinessType = 'clinic' | 'salon' | 'barber'`. Login enriches the user via `authApi.me()` and infers `businessType` from the provider's `category.name` (matches the words "clinic"/"عيادة", "barber"/"حلاق", or falls back to `'salon'`).
- **Sidebar navigation**: [`src/components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx) — `getNavigation(t, businessType, role)` swaps the labels for bookings, customers, and employees groups based on `businessType`.
- **Page-level UI**: dashboard root ([`src/app/page.tsx`](src/app/page.tsx)) and new-booking flow ([`src/app/bookings/new/page.tsx`](src/app/bookings/new/page.tsx)) read `user.businessType` and gate KPI labels and form sections accordingly.

The onboarding wizard ([`src/app/onboarding/page.tsx`](src/app/onboarding/page.tsx)) exposes the three options as tiles. The selected type then drives the entire experience for that workspace.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.1.6** (App Router, Turbopack) |
| UI | **React 19.2.3**, custom UI primitives in [`src/components/ui`](src/components/ui), CSS modules |
| Language | **TypeScript 5** (strict) |
| Charts | **Recharts 3** |
| Animation | **Framer Motion 12** |
| Icons | **Lucide React** |
| Forms | **React Hook Form 7** + **Zod 4** (via custom [`useValidatedForm`](src/hooks/useValidatedForm.ts) hook) |
| Toasts | **Sonner 2** + a small in-app `useToast` wrapper |
| Command palette | **cmdk 1** |
| Dates | **date-fns 4** |
| Tests | **Vitest 4** (unit) + **Playwright 1.58** (E2E) |
| Lint / format | **ESLint 9** (Next config) + **Prettier 3** + `eslint-plugin-unused-imports` |
| Git hooks | **Husky 9** + **lint-staged 16** |
| Deploy | **Vercel** |

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                     Browser (Next.js client)                       │
│                                                                    │
│   ┌────────────┐   ┌────────────┐   ┌──────────────┐               │
│   │  AuthCtx   │   │ Language   │   │ Theme +      │               │
│   │ user/role  │   │ en / ar    │   │ Settings     │               │
│   └─────┬──────┘   └─────┬──────┘   └─────┬────────┘               │
│         │                │                │                        │
│         └─────────┬──────┴────────────────┘                        │
│                   ▼                                                │
│           AppShell  →  Sidebar / TopBar / RoleGuard                │
│                   │                                                │
│                   ▼                                                │
│          Page (Next.js App Router) — uses                          │
│          useApiQuery() / api.* for data                            │
│                                                                    │
└────────┬───────────────────────────────────────────────────────────┘
         │ HTTPS, Bearer token in Authorization header
         ▼
┌────────────────────────────────────────────────────────────────────┐
│   External REST API   https://waqty.alemtayaz.shop/public          │
│   (provider auth, bookings, customers, employees, payroll, …)     │
└────────────────────────────────────────────────────────────────────┘
```

Notes:

- **No local database** — the dashboard is purely a client of an external REST API.
- **Middleware** ([`src/middleware.ts`](src/middleware.ts)) enforces only "are you logged in?" using a non-sensitive `hagzy_logged_in=true` cookie marker. **Role-based access** is enforced on the client by [`<RoleGuard>`](src/components/RoleGuard.tsx) and ultimately by the backend.
- State is held in four React Contexts: `AuthContext`, `LanguageContext`, `ThemeContext`, `SettingsContext` (no Redux / Zustand).

---

## Directory structure

```
src/
├── app/                       # Next.js App Router (60+ routes)
│   ├── layout.tsx             # Root providers (Theme, Language, Auth, Settings, AppShell)
│   ├── page.tsx               # Dashboard root (KPIs, charts)
│   ├── login/                 # Provider login (email/phone + password, OTP)
│   ├── forgot-password/       # OTP-driven password reset
│   ├── onboarding/            # 3-step setup (incl. business-type picker)
│   ├── invite/[token]/        # Invite-link registration
│   ├── employee-portal/       # Separate UI + auth for staff
│   ├── bookings/              # Calendar, list, [id], new, print, rooms, waitlist
│   ├── customers/             # Directory, [id], groups, reviews, statements, last-visits
│   ├── employees/             # Directory + 18 sub-modules (payroll, attendance, …)
│   ├── transactions/          # 11 sub-modules (cash sales, petty cash, transfers, …)
│   ├── sales/                 # Services + packages
│   ├── returns/               # Cash refund, cancel down-payment, petty-cash refund
│   ├── expenses/              # Expense ledger
│   ├── marketing/             # Offers, promo-codes, announcements, …
│   ├── reports/               # Hub + dynamic [category]/[report]
│   ├── settings/              # 27 sub-pages (branches, services, security, …)
│   ├── help/                  # FAQ + bug-report
│   ├── error.tsx              # Route-level error boundary
│   ├── global-error.tsx       # Global error boundary
│   └── not-found.tsx
│
├── components/
│   ├── ui/                    # Custom design primitives (Button, Input, Modal, …)
│   ├── layout/                # AppShell, Sidebar, TopBar, MobileBottomNav
│   ├── employees/             # Employee-specific composites
│   ├── ErrorBoundary.tsx
│   ├── RoleGuard.tsx          # Client-side RBAC wrapper
│   ├── DataGuard.tsx          # Loading / empty / error wrapper
│   ├── CommandPalette.tsx     # Ctrl+K palette
│   ├── MarketingTabs.tsx
│   ├── SettingsTabs.tsx
│   ├── SubTabs.tsx
│   ├── ComingSoon.tsx
│   └── OfflineBanner.tsx
│
├── contexts/
│   ├── AuthContext.tsx        # User, login, OTP, forgot/reset password, role
│   ├── LanguageContext.tsx    # 'en' | 'ar' + RTL toggle
│   ├── ThemeContext.tsx       # Light / dark
│   └── SettingsContext.tsx    # Workspace settings (currency, branding, …)
│
├── hooks/
│   ├── useApiQuery.ts         # Loading/error/refetch wrapper around api.*
│   ├── useTranslation.ts      # t(key) + lang
│   ├── useValidatedForm.ts    # RHF + Zod + dirty-tracking helper
│   ├── useUnsavedChanges.ts   # beforeunload prompt
│   ├── useFocusTrap.ts        # Modal accessibility
│   ├── useServiceWorker.ts    # PWA registration
│   └── useAnnounce.ts         # ARIA live announcer
│
├── i18n/
│   └── translations.ts        # ~3,800 lines, en + ar for every UI string
│
├── lib/
│   ├── api.ts                 # ApiClient + ApiError + typed module wrappers
│   ├── storage.ts             # safeJsonParse, safeLocalStorageGet
│   ├── validations.ts         # Zod schemas (login, forms)
│   ├── shiftData.ts           # Shift / schedule helpers
│   └── priceResolver.ts       # Service-price resolution (overrides, tiers)
│
├── middleware.ts              # Edge auth check (logged-in marker only)
└── __tests__/                 # Vitest unit tests
e2e/                           # Playwright E2E specs
docs/
└── backend-dependencies.md    # Inventory of pages still on mock data
```

---

## Routes

### Public (no auth required)
| Path | Purpose |
|---|---|
| `/login` | Provider sign-in (email/phone + password, OTP) |
| `/forgot-password` | OTP-driven password reset |
| `/onboarding` | First-run setup (business type, branch, services) |
| `/invite/[token]` | Invite-link registration |
| `/employee-portal/login` | Staff sign-in (separate from provider) |

### Authenticated — admin / manager / staff
| Path | Module | Min role |
|---|---|---|
| `/` | Dashboard | any |
| `/bookings` | Calendar | any |
| `/bookings/list` | Booking list | any |
| `/bookings/[id]` | Booking detail | any |
| `/bookings/new` | New booking (clinic gets patient-intake fields) | any |
| `/bookings/print` | Print view | any |
| `/bookings/rooms` | Room calendar | any |
| `/bookings/waitlist` | Waitlist | any |
| `/customers`, `/customers/[id]`, `/customers/{groups,reviews,statements,last-visits}` | CRM | any |
| `/employees`, `/employees/[id]`, `/employees/{departments,schedule,attendance,attend-methods,attendance-settings,fingerprints,positions,performance,targets,transfers,branch-management,time-tracking}` | HR | any |
| `/employees/payroll`, `/employees/commissions`, `/employees/deductions`, `/employees/roles` | HR — pay | admin / manager |
| `/employees/permissions`, `/employees/commission-settings` | HR — config | admin |
| `/transactions`, `/transactions/{cash-sales,client-sales,best-sales,dailies,package-sales,advance-payments,shifts,transfers}` | Finance | any |
| `/transactions/safe-balances`, `/transactions/petty-cash` | Finance — cash | admin / manager |
| `/expenses` | Expenses | any |
| `/returns`, `/returns/{cash-refund,cancel-down-payment,petty-cash-refund}` | Returns | any |
| `/sales`, `/sales/packages` | POS | any |
| `/marketing`, `/marketing/{offers,promo-codes,packages,announcements,messages,notifications,service-groups}` | Marketing | any |
| `/reports`, `/reports/[category]`, `/reports/[category]/[report]` | Analytics | any |
| `/settings`, `/settings/{branches,branches/[id],services,services/new,service-categories,service-employees,service-pricing,hours,resources,payment-methods,invoice,safes,appearance,localization,notifications,data,diary-automations,shift-automations,fingerprint-devices,fingerprint-areas,petty-cash-items,tipping,loyalty,shifts}` | Settings | any |
| `/settings/security`, `/settings/roles`, `/settings/audit-log`, `/settings/subscription`, `/settings/integrations`, `/settings/devices` | Settings — admin | admin |
| `/help`, `/help/bug-report` | Help | any |

### Employee portal
| Path | Purpose |
|---|---|
| `/employee-portal/dashboard` | Today's bookings + attendance |
| `/employee-portal/shifts` | My shifts |
| `/employee-portal/attendance` | My attendance |

The full routing & role gating list is in [`src/components/RoleGuard.tsx`](src/components/RoleGuard.tsx) (`ROLE_RESTRICTED_ROUTES`).

---

## Authentication & roles

### Flows

1. **Email / phone + password** — `authApi.login()` → JWT token + provider profile. Token is stored in `localStorage.hagzy_token`. A non-sensitive `hagzy_logged_in=true` cookie is set so the edge middleware can gate access without reading the token.
2. **OTP (mock today)** — `requestOTP()` simulates sending a code; `verifyOTP()` accepts the constant `MOCK_OTP_CODE = '123456'` and logs the demo user in. Marked with `// MOCK:` for hand-off.
3. **Forgot / reset password** — `authApi.sendOtp()` → `authApi.verifyOtp()` → `authApi.resetPassword()`. These are **real API calls** today.
4. **Invite registration** — open `/invite/[token]` to set up an invited staff account.
5. **Employee portal** — separate login, separate token (`hagzy_employee_token`), separate layout, isolated from provider session.

### Roles

`UserRole = 'admin' | 'manager' | 'staff'`. Routes gated to a role list in `ROLE_RESTRICTED_ROUTES` ([`src/components/RoleGuard.tsx`](src/components/RoleGuard.tsx)) redirect unauthorized users to `/?unauthorized=1`. The guard computes the unauthorized state synchronously and returns `null` while the redirect fires, so restricted page content (and any data fetches it would trigger) never renders for the wrong role.

Demo users (work in development against the mock OTP path):

```
clinic@hagzy.com    → admin    / clinic
salon@hagzy.com     → admin    / salon
barber@hagzy.com    → admin    / barber
manager@hagzy.com   → manager  / salon
staff@hagzy.com     → staff    / salon
```

Any 6+ character password works against the mock login; the OTP code is `123456`.

---

## Internationalization

- All translation strings live in [`src/i18n/translations.ts`](src/i18n/translations.ts) as `{ key: { en, ar } }`. There are ~3,800 keys.
- Use the `useTranslation()` hook in any client component:
  ```tsx
  const { t, lang } = useTranslation();
  return <h1>{t('dashboard.title')}</h1>;
  ```
- The `LanguageContext` toggles `<html lang>` and `<html dir>` automatically and persists the choice in `localStorage.hagzy_settings`.
- **RTL** is fully supported — Arabic flips the entire layout via `dir="rtl"`.
- To add a new key: drop a `'foo.bar': { en: '…', ar: '…' }` line, then call `t('foo.bar')`.

---

## API client & error handling

The HTTP layer is a single `ApiClient` singleton in [`src/lib/api.ts`](src/lib/api.ts):

```ts
import { api } from '@/lib/api';

const res = await api.get<MyType>('/endpoint');
if (res.success) {
  // res.data is MyType
}
```

Available methods: `get`, `post`, `put`, `patch`, `delete`, `postFormData`. All responses share the shape:

```ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
```

Failed requests throw a typed **`ApiError`**:

```ts
import { ApiError } from '@/lib/api';

try {
  await api.post('/foo', { … });
} catch (err) {
  if (err instanceof ApiError && err.status === 429) {
    // rate limited
  }
}
```

Module wrappers (`authApi`, `providerApi`, `customerApi`, `marketingApi`, `settingsApi`, `employeeApi`, …) live in the same file and provide typed helpers for each endpoint.

For data fetching, prefer the [`useApiQuery`](src/hooks/useApiQuery.ts) hook:

```ts
const { data, loading, error, refetch } = useApiQuery(
  () => providerApi.getEmployees(),
  [],
  { fallbackData: [] }
);
```

---

## Local development

### Prerequisites

- **Node.js 24 LTS** (Vercel default; 18 is deprecated).
- npm (this repo uses `package-lock.json`).

### First-time setup

```bash
git clone <repo>
cd Hagzy
npm install
cp .env.local.example .env.local   # if present, else create per the next section
npm run dev
```

Open <http://localhost:3000>. Sign in with one of the demo emails (any 6+ char password) to get into the dashboard.

---

## Environment variables

Create a `.env.local` in the project root:

```env
# Required — base URL for the external REST API
NEXT_PUBLIC_API_BASE_URL=https://waqty.alemtayaz.shop/public

# Optional — surfaced in the Help page contact card
NEXT_PUBLIC_SUPPORT_EMAIL=support@hagzy.com
NEXT_PUBLIC_SUPPORT_WHATSAPP_DISPLAY=+20 100 000 0000
NEXT_PUBLIC_SUPPORT_WHATSAPP_DIGITS=201000000000
```

Variables prefixed with `NEXT_PUBLIC_` are baked into the client bundle and visible in the browser. Only put non-sensitive values there.

In production, configure these via the Vercel dashboard (Project → Settings → Environment Variables) for each environment (Production / Preview / Development).

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) on `localhost:3000` |
| `npm run build` | Production build (catches type errors) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over `src/` |
| `npm run format` | Prettier write across `src/**/*.{ts,tsx,css,json}` |
| `npm run format:check` | Prettier check (no write) — useful for CI |
| `npm run test` | Vitest unit tests, single run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with coverage report |
| `npm run test:e2e` | Playwright end-to-end (headless) |
| `npm run test:headed` | Playwright with a visible browser |

---

## Testing

### Unit tests — Vitest

Tests live in `src/__tests__/`. Stack: Vitest + jsdom + Testing Library. Current suites cover the API client, validation schemas, and shift data utilities (48 tests).

```bash
npm run test
```

### End-to-end — Playwright

E2E specs live in `e2e/`:

- `auth.spec.ts` — login → dashboard → logout
- `navigation.spec.ts` — sidebar navigation
- `command-palette.spec.ts` — Ctrl+K command palette
- `dark-mode.spec.ts` — theme toggle
- `error-pages.spec.ts` — 404 and error boundary

Default config in [`playwright.config.ts`](playwright.config.ts) targets `localhost:3000`. The app must be running (or `webServer` configured) before E2E.

### Manual smoke matrix (three dashboards)

After significant changes, walk through each business type:

1. **Doctor / Clinic** — `clinic@hagzy.com` → dashboard says Patients/Appointments → `/bookings/new` shows patient-intake fields → sidebar shows clinic labels.
2. **Hairstyling Salon** — `salon@hagzy.com` → Stylists/Bookings, no medical fields.
3. **Barber** — `barber@hagzy.com` → Barbers/Appointments, no medical fields.

For all three: the Help page email & WhatsApp open clients; `/marketing/offers` Create modal adds a row to the list; logging in as `staff@hagzy.com` and visiting `/employees/payroll` redirects to `/?unauthorized=1`.

---

## Deployment

The project deploys to **Vercel** with zero configuration:

- Framework auto-detected as Next.js 16.
- Image optimization (AVIF / WebP, 30-day cache) is configured in [`next.config.ts`](next.config.ts).
- Environment variables are managed in the Vercel dashboard.
- Pre-commit hooks (Husky + lint-staged) run ESLint + Prettier on staged files.
- The CLI (optional) unlocks `vercel env pull`, `vercel deploy`, `vercel logs`. Install with `npm i -g vercel`.

Note: the Next.js 16 message _"the `middleware` file convention is deprecated, please use `proxy` instead"_ is informational. The current `src/middleware.ts` still works; renaming to `proxy.ts` is a future cosmetic migration.

---

## Backend dependencies (mock data)

The dashboard ships with a complete UI even when the backend is incomplete: pages that lack a stable API render `FALLBACK_*` / `fallback*` constants instead. **Do not replace these with live API calls until the corresponding endpoint is delivered.**

The full inventory of pages still on mock data — and the API endpoints they expect — is in [`docs/backend-dependencies.md`](docs/backend-dependencies.md). Counts as of this writing:

- ~83 page files contain a `FALLBACK_` / `fallback*` / `MOCK_` constant.
- The OTP flow in `AuthContext.requestOTP` / `verifyOTP` is also mocked behind a `MOCK_OTP_CODE` constant.

To regenerate the inventory:

```bash
grep -rln -E "FALLBACK_|fallback[A-Z]|MOCK_" src/app | wc -l
```

---

## Security notes

- **Auth tokens are kept in `localStorage`**. This is a deliberate trade-off for a SPA-style app talking to an external API — but it means **any XSS will leak tokens**. Defenses: strict CSP at the edge, never use `dangerouslySetInnerHTML` with untrusted input, sanitize markdown if/when it's added.
- **Role-based access control is enforced on the client** by `<RoleGuard>` because the edge middleware can only see a non-sensitive `hagzy_logged_in` cookie. The guard returns `null` synchronously when the current user lacks the required role (no flash of restricted content) and uses `useEffect` to drive the `/?unauthorized=1` redirect. **The backend API must still enforce role checks server-side** — never trust the client. The previous approach of putting the role into a JS-readable cookie was forgeable and has been removed.
- **JSON.parse hardening**: every read from `localStorage` goes through [`safeJsonParse`](src/lib/storage.ts), so corrupt values can't crash hydration.
- **Mock OTP**: the `123456` short-circuit in `verifyOTP` is dev-only convenience and must be removed once the backend OTP endpoint is wired.
- **Future hardening**: migrate tokens to HttpOnly + Secure cookies set by the API; have the API set a signed role claim and have the middleware verify it server-side.

---

## Contributing

### Branch model

- `main` — production
- `development` — integration; PRs target this first
- `feature/*`, `fix/*` — per-task branches off `development`

### Commit message convention

The project uses Conventional-Commit-style prefixes:

```
feat: add patient intake form to clinic booking flow
fix: handle 429 from authApi.sendOtp gracefully
refactor: extract role guard from middleware
docs: rewrite README
chore: bump deps
```

### Pre-commit

`npm install` registers Husky hooks. On commit:

- `src/**/*.{ts,tsx}` → `eslint --fix` then `prettier --write`
- `src/**/*.{css,json}` → `prettier --write`

If a hook fails, fix the underlying issue and create a **new** commit (do not amend).

### Adding a translation key

1. Add `'mymod.label': { en: '…', ar: '…' }` in `src/i18n/translations.ts` (keep alphabetically grouped within its module section).
2. Use `t('mymod.label')` in the component.
3. If the label is business-type aware, define one key per variant (e.g., `dash.kpiAppointments` vs `dash.kpiBookings`) and switch on `businessType`.
4. If a key is missing, `useTranslation` warns in development and returns the literal key string — watch the console after editing.

### Adding a role-restricted route

1. Create the route under `src/app/...`.
2. Add an entry to `ROLE_RESTRICTED_ROUTES` in `src/components/RoleGuard.tsx`.
3. The backend must also enforce the same restriction.

### Adding a new API call

1. Type the response shape near the top of `src/lib/api.ts`.
2. Add a method to the appropriate module wrapper (`providerApi`, `marketingApi`, …).
3. Consume it via `useApiQuery(() => myApi.fn(), [...])` so loading / error / fallback are wired uniformly.
4. Catch typed errors with `if (err instanceof ApiError) { ... }`.

---

## Project status & roadmap

### What's working
- Three business-type dashboards (clinic, salon, barber) with adapted sidebar, KPI labels, and bookings flow.
- Full bilingual UI (EN / AR + RTL).
- Auth: real password login, real forgot-password / reset, mocked OTP.
- Hardened auth: forgeable role cookie removed; `<RoleGuard>` blocks restricted content synchronously; `localStorage` reads go through `safeJsonParse`.
- Typed API errors via `ApiError` (consumers use `instanceof ApiError`).
- 60+ routes scaffolded with consistent UX (cards, modals, slide-overs, toasts, loading states).
- Local-state CRUD on demo data so every "Create / Edit / Delete" button gives feedback.
- Help page contacts (`mailto:` and `wa.me`) are clickable, configurable via env vars.
- All `alert()` calls replaced with `sonner` toasts.
- Lint clean. Vercel build passes. 48 unit tests pass.

### Known gaps (waiting on backend)
- Most list pages render fallback mock arrays — see [`docs/backend-dependencies.md`](docs/backend-dependencies.md).
- OTP `requestOTP`/`verifyOTP` are mocked.
- Role checks rely on the client + backend; there is no edge-side cryptographic verification yet.

### Next up
1. Swap fallback arrays for live API calls as endpoints ship (one module per PR).
2. Wire the real `authApi.sendOtp` / `authApi.verifyOtp` into `AuthContext`, drop `MOCK_OTP_CODE` and `MOCK_USERS`.
3. Move tokens to HttpOnly cookies; have the backend set a signed role claim and verify it in `proxy.ts`.
4. Split the three largest pages (`employees/payroll`, `bookings/new`, `employees/[id]`) into smaller composable units.
5. Rename `src/middleware.ts` → `src/proxy.ts` per Next.js 16 convention.

---

## Recent updates

- **Performance (2026-04)** — measured with Chrome DevTools traces against the running dev server. Cumulative dashboard LCP: **2576 ms → 1504 ms (−1072 ms, −42 %)**.

  Round 1 — fonts, Recharts off the critical path, package tree-shaking:
  - **Self-hosted fonts via `next/font/google`.** Replaced the runtime `@import url('https://fonts.googleapis.com/...')` in [`src/app/globals.css`](src/app/globals.css) with `Inter` and `Noto_Sans_Arabic` loaded through [`src/app/layout.tsx`](src/app/layout.tsx). The dashboard previously waited on a `localhost → fonts.googleapis.com → fonts.gstatic.com → woff2` chain (**466 ms critical-path latency**). Fonts are now bundled and served same-origin.
  - **Lazy-loaded Recharts on the dashboard.** Extracted KPI sparklines and the booking-status donut into [`src/components/dashboard/KpiSparkline.tsx`](src/components/dashboard/KpiSparkline.tsx) and [`src/components/dashboard/BookingStatusDonut.tsx`](src/components/dashboard/BookingStatusDonut.tsx), imported via `next/dynamic({ ssr: false })`. Recharts' `ResponsiveContainer` size detector was triggering a 270 ms forced reflow during the dashboard's critical render path — that work is now deferred to after first paint.
  - **`experimental.optimizePackageImports`** in [`next.config.ts`](next.config.ts) for `lucide-react`, `recharts`, `framer-motion`, and `date-fns`. Turbopack now tree-shakes named imports.
  - **15-second `AbortController` timeout** on every API request in [`src/lib/api.ts`](src/lib/api.ts). When the external Waqty API is slow or unreachable, requests abort cleanly with an `ApiError` (status `0`, message `"Request timed out"`) instead of hanging until the browser's ~3-minute default.

  Round 2 — defer below-the-fold work, drop framer-motion from the critical chunk, memoize Sidebar:
  - **Below-the-fold sections deferred.** Top-clients / top-employees / top-services tables and the summary strip moved to [`src/components/dashboard/DashboardBottomSections.tsx`](src/components/dashboard/DashboardBottomSections.tsx) and lazy-loaded via `next/dynamic({ ssr: false, loading: <skeleton/> })` from [`src/app/page.tsx`](src/app/page.tsx). ~126 elements + 3 ranking tables no longer render during first paint.
  - **`framer-motion` replaced with CSS keyframes** for the dashboard entrance animation. New `.fadeStaggerRow` class in [`src/app/page.module.css`](src/app/page.module.css) handles staggered card reveals on the compositor thread, ships 0 KB of JS, and respects `prefers-reduced-motion`. `framer-motion` import dropped from `page.tsx`.
  - **Sidebar nav array memoized** in [`src/components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx). The 70-item navigation tree is now built once per `(t, businessType, role)` triple via `useMemo`, instead of being re-allocated on every render.

  Measured deltas (dev mode, Chrome DevTools `performance_start_trace`):

  | Metric | Baseline | After Round 1 | After Round 2 | Cumulative Δ |
  |---|---:|---:|---:|---:|
  | Dashboard LCP | 2576 ms | 1929 ms | **1504 ms** | −1072 ms (−42 %) |
  | Render delay | 2539 ms | 1708 ms | **1258 ms** | −1281 ms (−50 %) |
  | LCP element | "Booking Status" title (below fold) | "Booking Status" title | above-fold (size 2016) | now in viewport |
  | Recharts forced reflow inside LCP | 360 ms | 81 ms | **0 ms** (now post-LCP) | gone |
  | CLS | 0.04 | 0.04 | 0.04 | unchanged |
  | Critical-path font roundtrip | 466 ms | 0 ms | 0 ms | gone |

  Production numbers will be lower across the board (no Turbopack on-demand compile). The relative deltas reflect real structural wins.
- **Bug fixes (2026-04)**
  - `<RoleGuard>` now blocks rendering of restricted page content synchronously — no flash of unauthorized UI before redirect.
  - Fixed two missing translation keys in the New Booking flow: `bookings.employee` (was `emp.role.employee`) and added `bookings.serviceProcedure`.
- **Auth & security hardening**
  - Removed the forgeable `hagzy_auth` JSON cookie; the edge middleware now only checks a non-sensitive `hagzy_logged_in` marker.
  - Role-based route gating moved from middleware to client-side `<RoleGuard>` component.
  - All `localStorage` JSON reads now go through `safeJsonParse` / `safeLocalStorageGet` ([`src/lib/storage.ts`](src/lib/storage.ts)).
  - Mock OTP code extracted to a single `MOCK_OTP_CODE` constant with `// MOCK:` markers for the future swap-in.
- **Type safety**
  - Introduced `ApiError extends Error` in [`src/lib/api.ts`](src/lib/api.ts); call sites use `instanceof ApiError` for status / message.
- **Three-dashboard parity**
  - Dashboard KPIs (`Bookings` / `New Clients`) flip to `Appointments` / `New Patients` for clinic, `Appointments` for barber, via translation keys (`dash.kpiBookings`, `dash.kpiAppointments`, `dash.kpiNewClients`, `dash.kpiNewPatients`).
  - New Booking page labels (`Service / Procedure`, `Doctor / Specialist`) are translation-keyed.
- **UX & flows**
  - Help page email and WhatsApp are now real `mailto:` / `wa.me` links, with `NEXT_PUBLIC_SUPPORT_EMAIL` / `NEXT_PUBLIC_SUPPORT_WHATSAPP_DISPLAY` / `NEXT_PUBLIC_SUPPORT_WHATSAPP_DIGITS` env-var overrides.
  - Marketing offers page Create / Edit / Delete now mutate local state with toast feedback (mock data preserved per backend timing).
  - All `alert()` calls replaced with `sonner` toasts.
- **Documentation**
  - [`docs/backend-dependencies.md`](docs/backend-dependencies.md) catalogs every page still rendering mock data and the API endpoint each one expects.
  - This README replaces the previous `create-next-app` boilerplate with a full project document.

---

© Hagzy. Built on Next.js + Vercel.
