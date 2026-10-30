---
feature: "admin_accounts_expenses"
owner_role: "admin"
module_version: 2
api_contract_source: "CONTRACT_MISSING — no verified expense API endpoint/DTO supplied"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_SUPPLIED — archive has no verified Git commit metadata"
documentation_status: "reconciled-to-working-copy"
portability_score: "NOT_VERIFIED — source/static checks only; host typecheck, Vitest, lint, build and browser E2E are not yet executed"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 6 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.


# Accounts Expenses — Autonomous Submodule Specification

## 1. Scope and Non-Scope

This autonomous sub-module owns the admin expense ledger screen, its add form, demo fixtures, filtering, KPI display, delete confirmation, schema validation, and local tests. It does not own assets, asset maintenance, shifts, seats, seat-gap analysis, or the live accounting API. Existing visible actions are retained; mutation remains demo-only until an approved backend API contract is supplied. No financial entity is persisted in browser storage.

## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical UI route: `/admin/admin_accounts_assets/accounts_expenses`. The add view is selected by the existing `?view=add` query parameter; this is an in-submodule view, not a separate autonomous module.

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 6 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

Component files:
- `components/AdminAccountsExpensesAddPage.tsx`
- `components/AdminAccountsExpensesPage.tsx`
- `components/AdminAccountsExpensesFilterSection.tsx`
- `components/AdminAccountsExpensesHeaderSection.tsx`
- `components/AdminAccountsExpensesKpiSection.tsx`
- `components/AdminAccountsExpensesPage.tsx`
- `components/AdminAccountsExpensesTableSection.tsx`

Other owned files:
- `config/admin_accounts_expenses.url_config.ts`
- `config/admin_accounts_expenses.url_config.ts`
- `contracts/host-stubs.d.ts`
- `error.tsx`, `loading.tsx`, `page.tsx`
- `hooks/useAdminAccountsExpensesUnsavedChangesGuard.ts`
- `locales/admin_accounts_expenses_en.json`
- `locales/admin_accounts_expenses_hi.json`
- `mocks/admin_accounts_expenses.scenarios.ts`
- `schemas/AdminAccountsExpensesSchemas.ts`
- `tests/AdminAccountsExpensesFeatureContracts.test.tsx`
- `tests/harness/AdminAccountsExpensesHarness.tsx`
- `tests/harness/bootstrap.ts`
- `utils/AdminAccountsExpensesFormatCurrency.ts`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_accounts_assets/accounts_expenses`.
- Route owner: `page.tsx`.
- Canonical route config: `config/admin_accounts_expenses.url_config.ts` exporting `ADMIN_ACCOUNTS_EXPENSES_ROUTES` and `ADMIN_ACCOUNTS_EXPENSES_API` as `as const`.
- The verified add-view destination is `/admin/admin_accounts_assets/accounts_expenses?view=add`, derived from the route entry and prior domain route registry in the supplied ZIP.
- No new route alias, redirect, or route leaf is introduced by this repair.
- Browser routes and backend API endpoints are separate contracts. Host rewrites and server authorization are not verified in this isolated role package.

## 4. API Contract and UI Data Mapping

No verified live expense API endpoint, request DTO, response DTO, permission contract, or mutation semantics were supplied. Classify the live API contract as `CONTRACT_MISSING`; do not infer or activate a guessed endpoint. `ADMIN_ACCOUNTS_EXPENSES_API` is intentionally empty until an approved contract is supplied.

| UI/data need | Source in this sub-module | Availability and limits |
|---|---|---|
| Expense rows and KPI totals | `mocks/admin_accounts_expenses.scenarios.ts` plus transient state in `components/AdminAccountsExpensesPage.tsx` | Demo-mode only; not evidence of backend support |
| Expense category choices | `config/admin_accounts_expenses.url_config.ts` | One shared tuple drives the add form and filter; EN/HI labels use the module locale namespace |
| Add form validation | `schemas/AdminAccountsExpensesSchemas.ts` with React Hook Form | Amount input is major-unit INR, finite, positive and limited to two decimals; records use positive integer paise |
| Delete confirmation | `components/AdminAccountsExpensesPage.tsx` | Deletes only demo-state rows; no persistent or live mutation is claimed |
| Live errors / API authorization | No verified API contract in the supplied scope | `CONTRACT_MISSING`; UI demo guard is not server authorization |

Only source evidence in this ZIP is treated as verified. Do not infer backend fields, tenant scope, persistence, pagination, or financial authorization from UI labels or mock data.

## 5. Query Key Registry

- Canonical registry: `api/admin_accounts_expenses.query_keys.ts`.
- Export: `ADMIN_ACCOUNTS_EXPENSES_QUERY_KEYS`.
- Root namespace: `admin_accounts_expenses`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

There is no verified live API mutation. Demo create/delete actions modify only transient React state. Non-demo mutation attempts fail closed with localized feedback; the existence of a demo button is not evidence of backend persistence. When a real mutating API is approved, it must follow the global `ApiResponse<T>` envelope and UUIDv4 `Idempotency-Key` rules.

## 7. Permissions and Role Rules

The module uses the existing explicit demo-mode feature gate to enable local create/delete behaviors. This is UI gating only, not proof of server-side authorization. Preserve host authorization and fail closed until a verified session/permission and API contract is available. Do not infer tenant identifiers from form fields or user-controlled request bodies.

## 8. State Ownership

`components/AdminAccountsExpensesPage.tsx` owns transient list/filter/delete state; `AdminAccountsExpensesAddPage.tsx` owns form state through React Hook Form v7. There is no module-level Zustand store or TanStack Query server cache because the current module has no verified live API. Expense records must not be persisted in `localStorage` or `sessionStorage`. The unsaved-change guard is owned by `hooks/useAdminAccountsExpensesUnsavedChangesGuard.ts`.

## 9. Offline and Reconnect Behavior

No live network or offline-reconnect contract exists in this module. The harness can render deterministic mock states for tests only; it does not establish real timeout, server, or authorization behavior. Do not advertise offline functionality or retry guarantees that are not implemented against a verified service.

## 10. Security and PII Rules

Do not persist expense/financial ledger records in browser storage; do not log secrets, credentials, tokens, or unnecessary personal data. Demo state is volatile and disappears on route/page lifecycle reset. Backend authorization and data minimization remain host responsibilities and are not claimed as verified by this UI-only module.

## 11. Accessibility Requirements

The add form has explicit labels, field-level validation messages, `aria-invalid`, and conditional `aria-describedby` references. Primary action controls use a minimum 44px height/width where applicable; status and error states use semantic roles. Keep keyboard, focus-visible, translated text wrapping, modal focus behavior, and reduced-motion behavior when extending the feature. These source checks do not constitute a live browser WCAG pass.

## 12. Background Tasks

No timers, polling, background workers, or realtime subscriptions are owned by this module. No new background behavior is introduced.

## 13. Feature Flags

The module reads the existing `isFrontendDemoModeEnabled()` host feature gate. Its implementation and deployment configuration belong to host infrastructure and are not changed here. Live mutations stay blocked when demo mode is disabled.

## 14. Cache Invalidation

No server cache is mutated because no live API/Query contract is supplied. No query invalidation is invented. Any future live mutations must reconcile/invalidate module-owned TanStack Query keys derived from a verified response contract.

## 15. Migration and Rollback

The existing route and `?view=add` behavior are preserved. The previous cross-domain route config facade is replaced by a local `as const` route/API contract without introducing new route paths. Expense data is no longer written to browser storage; old stored demo ledger values are intentionally not loaded, because financial entity persistence in `localStorage`/`sessionStorage` violates the governing architecture. No backend schema or persisted server data is modified.

## 16. Test Coverage Map

Current test files from the current physical module tree (execution not implied):
- `tests/AdminAccountsExpensesFeatureContracts.test.tsx`

These paths establish inventory only, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E are not claimed as passed.
## 17. Architecture Exceptions

No sub-module is nested inside another sub-module. Business source lives under this autonomous module's canonical internal folders. Relative imports and re-export facades are prohibited. The parent `page.tsx` is a Server Component route entry and passes the current view into the stable client state owner; no business logic or API endpoint is added to the route entry.

## 18. Known Contract Gaps

- `CONTRACT_MISSING`: live expense endpoint, request/response DTOs, server authorization/tenant scope, persistence semantics, pagination, and mutation failure envelope.
- `NOT_VERIFIED`: host route rewrites, the actual deployed demo-mode value, browser behavior, accessibility runtime, and host typecheck/test/build.
- No route, endpoint, API field, or business rule is invented to fill these gaps.

## 19. Rule Compliance Checklist

- [x] Autonomous module uses the canonical role/domain/sub-module structure.
- [x] Required documentation trio, canonical URL config, and host-stub file exist.
- [x] No sub-module is nested inside this sub-module.
- [x] Financial entity data is not persisted in browser storage.
- [x] Visible form errors and demo mutation feedback are implemented in source.
- [ ] Host typecheck, tests, lint, build and browser E2E: `DEFERRED_TO_HOST_RUNTIME` (dependencies/runtime not available in the supplied archive).

## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (1):
- `mocks/admin_accounts_expenses.scenarios.ts`

Locale catalogs (2):
- `locales/admin_accounts_expenses_en.json`
- `locales/admin_accounts_expenses_hi.json`

Test and harness files (3):
- `tests/AdminAccountsExpensesFeatureContracts.test.tsx`
- `tests/harness/AdminAccountsExpensesHarness.tsx`
- `tests/harness/bootstrap.ts`

Run these tests from the host package with the declared dependencies and test setup. Fixtures demonstrate frontend test contracts only; they do not prove live backend support. In this supplied environment, host execution is not claimed unless a command result is recorded in the Group 01 audit evidence.
## 21. Module Portability & Host Integration Guide

Copy only `frontend_admin/admin_accounts_assets/accounts_expenses/` as the autonomous repair unit. Host integrations used here: Next.js App Router, React, `next-intl`, React Hook Form v7, Zod, Sonner, shared dialog primitives, and `isFrontendDemoModeEnabled()`. The module-local ambient host stubs declare the standard optional host boundaries required by the architecture; they do not replace an actual host API or validate live integration. The feature does not import sibling business modules.

## 22. Deliverables & Version History

V34 source → V35 Group 01 RBG 3 repair in progress. This specification reflects the current working-copy source inventory only. Release readiness requires the Section 43P anti-skipping checklist, three physical cross-check tables, source-level closure of all in-scope findings, and host verification where available. Archive/runtime reports from older snapshots are historical and are not evidence that this working copy passed those checks.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 disposition (superseded 2026-10-30):** the preceding v44 audit text described the frozen input tree, not this repaired tree. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 6 component TSX/JSX files), and the current file-ceiling status is COMPLIANT. Historical exception claims are not approval; no absent exception CSV is inferred. Preserve the five-gate boundary rule for any future topology decision.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_accounts_expenses.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **6**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
