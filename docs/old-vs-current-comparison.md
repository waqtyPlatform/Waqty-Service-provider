# Old Dashboard vs Current Project — Comparison & Merge Plan

> Generated 2026-06-02. Compares the **old dashboard** (`origin` = `waqtyPlatform/Waqty-Service-provider`) against the **current project** (`waqty-org` = `Waqty-eco-system/Waqty-ServiceProviderDashboard`, branch `feat/ecosystem-flow-gaps`).
>
> Every claim below is backed by a git command you can re-run from the repo root.

---

## 1. Executive summary

The two are **not separate codebases** — they are two diverged lines of the **same** repo. Both are remotes of this local clone:

```
git remote -v
# origin     https://github.com/waqtyPlatform/Waqty-Service-provider.git        (OLD)
# waqty-org  https://github.com/Waqty-eco-system/Waqty-ServiceProviderDashboard.git (CURRENT)
```

They share a common ancestor and then forked on **2026-04-26**:

```
                         ┌─ +7 commits ─► origin/main  ef40612  (2026-06-01)   [OLD: real-API work]
5cbad7f (fork point) ────┤
                         └─ +4 commits ─► HEAD         cf629f7  (2026-06-02)   [CURRENT: ecosystem work]

git merge-base HEAD origin/main          # 5cbad7f
git rev-list --left-right --count HEAD...origin/main   # 4   7
```

**The headline:** the two teams worked in opposite directions.

| | OLD (`origin/main`) | CURRENT (`HEAD`) |
|---|---|---|
| Direction | Wire **real APIs**, trim mocks | Build **ecosystem contract** + i18n |
| Net change since fork | 55 files, **+5,445 / −12,122** (shrinks) | 93 files, **+7,182 / −2,089** (grows) |
| `src/lib/api.ts` | **+734 / −455** (real-API rewrite) | +253 / −15 (contract adapters on top) |
| Real endpoints added | ~20 (dashboard, payments, clients, availability, revenue, …) | 0 net new business endpoints |
| New pages | 6 real-API pages | settlement, ads |
| Removed | entire mock marketing suite (8 pages) | nothing |
| Auth token | single `hagzy_token` | namespaced `hagzy_provider_token` / `hagzy_employee_token` |
| Arabic i18n | +43 lines | **+1,499 lines** (full localization) |
| Contract/Visit model | none | `waqty_contract.ts`, `contract.ts`, `money.ts`, `platform_finance.ts` |

> Net difference between the two tips: **111 files, +19,008 / −7,238** (`git diff --shortstat origin/main HEAD`).

**Recommendation (detailed in §7):** keep CURRENT as the base (it has the contract layer + full Arabic), and **port the OLD branch's real-API `api.ts` and its 6 real-API pages on top**. The main conflict is `src/lib/api.ts`, where both sides edited heavily in incompatible ways.

---

## 2. Commit-level differences

**OLD-only commits** (`git log HEAD..origin/main`):

| Hash | Date | Subject |
|---|---|---|
| `ef40612` | 2026-06-01 | fix: add missing price property to Service mock objects |
| `77a50f2` | 2026-05-19 | sad |
| `9512e7b` | 2026-05-19 | sad |
| `16406eb` | 2026-05-19 | sad |
| `9f5b20f` | 2026-05-19 | sad |
| `8da7ecf` | 2026-04-26 | Merge pull request #2 from waqtyPlatform/development |
| `504cf63` | 2026-04-20 | Merge pull request #1 from waqtyPlatform/development |

> The four "sad"-titled commits carry the bulk of the real-API rewrite despite their throwaway messages — don't be misled by the titles; the diffs are substantial.

**CURRENT-only commits** (`git log origin/main..HEAD`):

| Hash | Date | Subject |
|---|---|---|
| `cf629f7` | 2026-06-02 | feat: full Arabic localization across all pages; check-in verify; queue display |
| `e05fb2a` | 2026-05-31 | fix(contract): keep vendored canonical verbatim for the drift check |
| `6837f4b` | 2026-05-31 | feat: provider settlement + ads purchase (F2/F1A/F5) |
| `f711792` | 2026-05-30 | feat: canonical Visit/contract, ServicePrice+availability, namespaced auth, bilingual modals |

---

## 3. API layer comparison (the "real APIs" question)

`src/lib/api.ts` is the heart of the divergence.

### 3.1 Path convention (same wire URL, different code)

| | OLD | CURRENT |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` default | `https://waqty.alemtayaz.shop/public/api` | `https://waqty.alemtayaz.shop/public` |
| Endpoint strings in code | `/provider/branches` (no `/api`) | `/api/provider/branches` |
| Resulting request URL | `…/public/api/provider/branches` | `…/public/api/provider/branches` |

Net effect on the wire is **identical**; the difference is purely where `/api` lives. This matters for the merge: you can't copy endpoint strings verbatim between the two without normalizing the `/api` prefix.

### 3.2 Auth token strategy

```
git show origin/main:src/lib/api.ts | grep -n hagzy_token   # single 'hagzy_token'
git show HEAD:src/lib/api.ts        | grep -n hagzy_         # path-based provider/employee keys
```

- **OLD:** one shared `hagzy_token` for the whole app.
- **CURRENT:** picks `hagzy_employee_token` under `/employee-portal`, else `hagzy_provider_token` — so the provider dashboard and employee portal don't clobber each other's session. (Same change mirrored in `src/contexts/AuthContext.tsx`.)

### 3.3 Real endpoints in OLD that CURRENT is **missing**

Reproduce by normalizing both files (strip the `/api` prefix) and diffing:

```
git show origin/main:src/lib/api.ts | grep -oE "/(provider|public|employee)/[A-Za-z0-9_/{}-]+" | sed 's/{[^}]*}/{id}/g' | sort -u > /tmp/old
git show HEAD:src/lib/api.ts        | grep -oE "/(provider|public|employee)/[A-Za-z0-9_/{}-]+" | sed -E 's#^/api##; s/{[^}]*}/{id}/g' | sort -u > /tmp/cur
comm -23 /tmp/old /tmp/cur
```

| Endpoint (OLD) | Powers / purpose | Backing page |
|---|---|---|
| `/provider/dashboard` | Real dashboard summary | `app/page.tsx` (CURRENT uses mock) |
| `/provider/payments`, `/provider/payments/{id}` | Booking payments ledger | **`bookings/payments`** |
| `/provider/clients`, `/clients/{id}/bookings`, `/clients/{id}/statement`, `/clients/statements` | Client CRM + statements | **`customers/clients`** |
| `/provider/availability` | Employee availability | **`employees/availability`** |
| `/provider/revenue` | Revenue analytics | **`reports/revenue`** |
| `/provider/bookings/grid` | Calendar grid w/ real availability | `bookings/page.tsx` (CURRENT uses mock employees) |
| `/provider/bookings/{id}/cancel`, `/advance`, `/activities` | Booking actions + activity log | `bookings/[id]` |
| `/provider/bookings/next-upcoming` | Upcoming bookings widget | dashboard |
| `/provider/employees/booking-counts` | Per-employee booking counts | `employees` |
| `/provider/pricing-groups/{id}/employees/add`, `/sync` | Pricing-group membership | **`settings/pricing-groups`** |
| `/provider/services/{id}/assign`, `/services/bulk-attach` | Service↔employee assignment | settings |
| `/provider/quick-sale` | POS quick sale | sales |
| `/provider/ratings` | Ratings feed | reviews |
| `/provider/branches/{id}/active` | Toggle branch active | settings/branches |

### 3.4 Endpoints in CURRENT not in OLD

All under `/provider/marketing/*` (announcements, messages, notifications, offers, packages, promo-codes, service-groups, templates) — because **OLD deleted the marketing module entirely**. CURRENT retained those endpoints and their pages.

---

## 4. Page / route differences

Reproduce: `git diff --diff-filter=D --name-only origin/main HEAD` (only-OLD) and `--diff-filter=A` (only-CURRENT).

### 4.1 Only in OLD — real-API pages CURRENT lacks (6)

| Page | API calls | Mock fallback? |
|---|---|---|
| `src/app/bookings/payments/page.tsx` | `providerApi.getPayments / createPayment / updatePayment` | yes |
| `src/app/customers/clients/page.tsx` | `providerApi.getClients` (+ client bookings/statements) | **no — pure real API** |
| `src/app/employees/availability/page.tsx` | `providerApi.getAvailability / getBranches` | yes |
| `src/app/reports/revenue/page.tsx` | `providerApi.getRevenue` | yes |
| `src/app/settings/pricing-groups/page.tsx` | `providerApi` pricing-group CRUD + `syncPricingGroupEmployees` | **no — pure real API** |
| `src/app/settings/profile/page.tsx` | `authApi.me` + profile update | **no — pure real API** |

### 4.2 Only in CURRENT (ecosystem additions + retained marketing)

- **Contract layer:** `src/lib/waqty_contract.ts`, `contract.ts`, `contract.lock`, `CONTRACT.md`, `money.ts`, `platform_finance.ts`
- **New features:** `src/app/finance/settlement/page.tsx`, `src/app/marketing/ads/page.tsx`
- **Mocks:** `src/mocks/catalog.ts`, `finance.ts`, `visits.ts`; `src/app/bookings/_visits.ts`
- **Retained marketing suite** (OLD deleted these): `marketing/{announcements,messages,notifications,offers,packages,promo-codes,service-groups}/page.tsx`, `MarketingTabs.tsx`, `marketing.module.css`, `marketing/loading.tsx`
- **Tooling:** `.github/workflows/contract.yml`, `scripts/check-contract.mjs` (canonical-contract drift check)

### 4.3 Edited by BOTH sides — conflict zones (28 files)

`git diff --diff-filter=M --name-only 5cbad7f origin/main` ∩ `… 5cbad7f HEAD`:

```
src/lib/api.ts                         ← biggest conflict
src/contexts/AuthContext.tsx
src/i18n/translations.ts
src/app/page.tsx                       (dashboard)
src/app/employees/page.tsx
src/app/settings/branches/page.tsx     src/app/settings/branches/[id]/page.tsx
src/app/settings/services/page.tsx
src/app/settings/shifts/page.tsx
src/app/settings/service-pricing/page.tsx
src/app/settings/page.tsx
src/app/bookings/page.tsx              src/app/bookings/list/page.tsx
src/app/bookings/new/page.tsx          src/app/bookings/[id]/page.tsx
src/app/bookings/waitlist/page.tsx
src/app/customers/reviews/page.tsx
src/app/employee-portal/{dashboard,layout,login}.tsx
src/app/employees/{[id],departments,payroll,schedule}/page.tsx
src/app/onboarding/page.tsx
src/components/CommandPalette.tsx
src/components/layout/Sidebar.tsx      src/components/layout/TopBar.tsx
```

---

## 5. Feature-level differences

| Area | OLD | CURRENT |
|---|---|---|
| **Auth** | single `hagzy_token` | namespaced provider/employee tokens (no cross-surface clobber) |
| **Booking model** | backend `Booking` used directly | canonical multi-service **`Visit`** model + `bookingToVisit()` adapter, `resolveServicePrice()` cascade |
| **Money** | inline number handling | `src/lib/money.ts` (integer minor units, EGP formatting) |
| **Platform finance** | — | `platform_finance.ts` (commission, fees, payouts) + `finance/settlement` page |
| **Ads** | — | `marketing/ads` purchase flow with rate card |
| **Marketing suite** | **removed** (8 pages) | present (mock-backed) |
| **Check-in** | basic | deterministic FNV-1a 6-digit `checkInCode()` + verify |
| **Queue** | — | `VisitQueueStatus` display |
| **Arabic i18n** | partial (+43 lines) | **full (+1,499 lines)**, RTL across all pages |
| **Real-API coverage** | high (dashboard, payments, clients, availability, revenue wired) | lower (more pages fall back to mocks) |

**One-line takeaway:** OLD is closer to a *working backend integration*; CURRENT is closer to a *correct domain model + fully localized UI*. Neither is a superset of the other.

---

## 6. Conflict-zone risk notes

- **`src/lib/api.ts` (HIGH):** OLD did a +734/−455 real-API rewrite; CURRENT added contract adapters. A 3-way merge will conflict heavily. Treat OLD's version as the base for the API surface, then re-apply CURRENT's adapters (`bookingToVisit`, `resolveServicePrice`, namespaced `getToken`) and add back the `/provider/marketing/*` endpoints. Watch the `/api`-prefix convention.
- **`src/contexts/AuthContext.tsx` (MED):** token-key rename `hagzy_token → hagzy_provider_token`. Keep CURRENT's namespaced version.
- **`src/i18n/translations.ts` (MED, mechanical):** keep CURRENT's +1,499-line version; cherry-pick OLD's +43 lines for any keys CURRENT lacks (new OLD pages will need keys anyway).
- **`src/app/page.tsx`, `bookings/page.tsx`, `employees/page.tsx`, `settings/*` (MED):** both rewrote these. Decide per page whether to take OLD's real-API version or CURRENT's contract/i18n version, then re-apply the other's concerns.

---

## 7. Reconciliation / merge plan

**Goal:** a single branch that has CURRENT's contract layer + full Arabic UI **and** OLD's real-API integration.

**Strategy: base = CURRENT, port OLD's real-API work on top** (CURRENT is the actively-localized, contract-correct line; OLD's value is concentrated in `api.ts` + 6 self-contained pages).

### Step 1 — Branch
```
git checkout feat/ecosystem-flow-gaps
git checkout -b merge/real-apis
```

### Step 2 — Bring in the 6 OLD-only pages (low risk, additive)
These files don't exist in CURRENT, so no conflict:
```
git checkout origin/main -- \
  src/app/bookings/payments/page.tsx \
  src/app/customers/clients/page.tsx \
  src/app/employees/availability/page.tsx \
  src/app/reports/revenue/page.tsx \
  src/app/settings/pricing-groups/page.tsx \
  src/app/settings/profile/page.tsx
```
Then add their nav entries (`Sidebar.tsx`) and i18n keys.

### Step 3 — Reconcile `src/lib/api.ts` (the hard part)
This is the only file needing real merge judgement. Recommended approach:
1. Add the **~20 missing endpoint methods** from OLD (§3.3) into CURRENT's `api.ts`, written with CURRENT's `/api/...` prefix convention.
2. Keep CURRENT's `getToken()` (namespaced), contract adapters, and the `marketingApi` module.
3. Add the matching request/response **types** OLD introduced for the new endpoints (payments, clients, availability, revenue, pricing-group employees, etc.).
4. Decide whether to map the new endpoints' responses through the `Visit`/contract adapters or use them raw (raw is faster; adapters are more consistent).

Diffs to read while doing this:
```
git diff 5cbad7f origin/main -- src/lib/api.ts   # what OLD added
git diff 5cbad7f HEAD        -- src/lib/api.ts   # what CURRENT added
```

### Step 4 — Wire the conflict-zone pages to real APIs (optional, incremental)
For each "both-edited" page where OLD added a real endpoint (dashboard `app/page.tsx` → `/provider/dashboard`; `bookings/page.tsx` → `/provider/bookings/grid`), swap CURRENT's mock fallback for the real call while keeping CURRENT's i18n + contract usage. Do one page per PR.

### Step 5 — Decide the marketing module
OLD deleted it; CURRENT kept it (mock-backed). Either keep CURRENT's pages (no action) or, if the backend now has the `/provider/marketing/*` endpoints, wire them. Keeping is the safe default.

### Step 6 — Verify
```
npm run lint
npm run build
npm test
npx playwright test   # if backend reachable
```
Smoke-test the 6 ported pages against `NEXT_PUBLIC_API_BASE_URL` and confirm the namespaced token still authenticates.

### Suggested PR sequence
1. PR-A: add 6 OLD-only pages + nav + i18n (additive, safe).
2. PR-B: merge `api.ts` (endpoints + types), keep contract adapters + namespaced auth.
3. PR-C…: per-page real-API wiring for dashboard / bookings calendar / employees (one each).

---

## 8. Appendix — commands used

```bash
git remote -v
git fetch origin
git merge-base HEAD origin/main                         # 5cbad7f
git rev-list --left-right --count HEAD...origin/main    # 4  7
git log HEAD..origin/main      --format="%h %ci %s"     # OLD-only commits
git log origin/main..HEAD      --format="%h %ci %s"     # CURRENT-only commits
git diff --shortstat 5cbad7f origin/main               # 55 files +5445 -12122
git diff --shortstat 5cbad7f HEAD                       # 93 files +7182 -2089
git diff --shortstat origin/main HEAD                   # 111 files +19008 -7238
git diff --diff-filter=D --name-only origin/main HEAD   # only-OLD files
git diff --diff-filter=A --name-only origin/main HEAD   # only-CURRENT files
git diff --shortstat 5cbad7f origin/main -- src/lib/api.ts   # +734 -455
git diff --shortstat 5cbad7f HEAD        -- src/lib/api.ts   # +253 -15
```
