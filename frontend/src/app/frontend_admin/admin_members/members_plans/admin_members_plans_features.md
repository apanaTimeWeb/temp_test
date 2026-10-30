---
feature: "admin_members_plans"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "not-supplied-in-archive"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 4 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Members Plans — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_members/members_plans` (V35 Group 03 repair boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical UI route: `admin_members/members_plans/page.tsx`.
Route entry `page.tsx` now renders `components/AdminMembersPlansPage.tsx` directly; the former pass-through `AdminMembersPlansMain.tsx` was removed without changing the destination view.


### Component files
- `AdminMembersPlansDeleteDialog.tsx`
- `AdminMembersPlansPage.tsx`
- `AdminMembersPlansErrorBoundary.tsx`
- `AdminMembersPlansFormDialog.tsx`
- `AdminMembersPlansPage.tsx`
### Hook files
- `useAdminMembersPlansMain.ts`
- `useAdminMembersPlansUnsavedChangesGuard.ts`
### API/contract files
- `admin_members_plans_api.ts`
### Type files
- None found in the current physical module tree.
### Schema files
- `AdminMembersPlansSchema.ts`
### Utility files
- None found in the current physical module tree.
### Mock/fixture files
- `admin_members_plans.scenarios.ts`
### Test files
- `AdminMembersPlansApi.test.ts`
- `AdminMembersPlansNonMockRegressionSuite.test.tsx`
### Configuration files
- `admin_members_plans.url_config.ts`
### Locale files
- `admin_members_plans_en.json`
- `admin_members_plans_hi.json`
### Host contract files
- `contracts/host-stubs.d.ts`

### Framework route and state entries
- `error.tsx`
- `loading.tsx`
- `page.tsx`

### Root documentation and remaining artifacts
- `admin_members_plans_features.md`
- `admin_members_plans_forbidden.md`
- `admin_members_plans_theme_contract.md`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_members/members_plans`.
- Physical route owner: `admin_members/members_plans/page.tsx`.
- Canonical submodule URL configuration: `config/admin_members_plans.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

**Endpoint status: `CONTRACT_MISSING`.** The previous API path duplicated this submodule's browser UI route (`/admin/admin_members/members_plans`); that duplication is not evidence of a backend endpoint and has been removed from active API configuration.

- Active API adapter: `api/admin_members_plans_api.ts`.
- Adapter behavior: `fetchAdminPlans()` throws `AdminPlansApiContractMissingError` before calling `apiFetch` while the endpoint/response contract is absent.
- `config/admin_members_plans.url_config.ts` keeps the canonical UI `ROOT` separate from nullable `API_LIST` and `API_DETAIL` contract slots.
- `mocks/AdminMembersPlansMSWHandlers.ts` exports no endpoint handlers. A test/mock must not intercept a UI page route and make it look like a successful backend response.
- Schema and synthetic fixture files remain frontend validation/test assets only; they do not prove a real backend DTO, persistence, or service endpoint.

Required external evidence before activating live transport: approved API URL, HTTP method, authentication/tenant context expectations, request parameters, response envelope/DTO, nullable field semantics, and error contract. Until that evidence is supplied, live fetch fails closed and the UI's existing error/unavailable state remains visible.

Schema file: `schemas/AdminMembersPlansSchema.ts`.

Backend authorization, tenant isolation, and persistence cannot be proven from this frontend-only source package.

**UI Data Requirements Mapping (V35 source evidence)**

| Visible field/state | Source/contract | Nullable/fallback rule | Verification status |
|---|---|---|---|
| Plan name, price/currency/unit, duration, features, status, subscribers | `AdminMembersPlansTypes.ts`, API schema and demo fixtures | Price displays only when currency and unit are explicit; no implicit currency for live API records | `VERIFIED` for local types/formatter; live plan endpoint `CONTRACT_MISSING` |
| Plan create/edit/delete | Form schema, demo mutation handlers and confirmation components | Demo state only; production writes remain blocked until verified mutation contracts exist | `VERIFIED` for demo guard; live mutation contract `CONTRACT_MISSING` |
| Loading, empty, error and retry | Page and local error/loading components | Render separate states and local translations; retry is user-triggered | `VERIFIED` for source structure; runtime `DEFERRED_TO_HOST_RUNTIME` |


**SOURCE_CONFLICT — semantic text-color utility naming:** The supplied UI/UX design maps `text-primary` to `--text-primary` and `text-danger` to `--danger-text`, while the shipped Tailwind v4 `globals.css` maps `--color-primary` to `--primary`, `--color-text-primary` to `--text-primary`, `--color-danger` to `--danger`, and `--color-danger-text` to `--danger-text`. Under those token names, the generated utilities are `text-primary` (primary/gold) versus `text-text-primary` (foreground), and `text-danger` (solid danger) versus `text-danger-text` (status text). `tailwind.config.ts` repeats the same color-key naming. The design document also uses `text-primary` for gold links/active states, so changing the utility globally would change existing UI semantics. No global token remapping is applied as part of this focused role-module repair. This remains `SOURCE_CONFLICT` with direct evidence in `globals.css` (`@theme inline`), `tailwind.config.ts`, and `WEB_FRONTEND_UI_UX_DESIGN.md`; a coordinated design-system decision is required before a global rename.

## 5. Query Key Registry

- Canonical registry: `api/admin_members_plans.query_keys.ts`.
- Export: `ADMIN_PLANS_QUERY_KEYS`.
- Root namespace: `admin_plans`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- `hooks/useAdminMembersPlansMain.ts`

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (7):

- `components/AdminMembersPlansPage.tsx`
- `components/AdminMembersPlansDeleteDialog.tsx`
- `components/AdminMembersPlansFormDialog.tsx`

These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (1):

- `hooks/useAdminMembersPlansMain.ts`

State/store files (0):

- None found in the local source closure.

API/cache ownership stays with the existing local query/API layer. Do not copy server responses into client UI state as the primary source.

## 9. Offline and Reconnect Behavior

Only preserve offline/reconnect behavior explicitly implemented in the local source closure. No new offline guarantees are added. Missing behavior remains documented as not evidenced.
## 10. Security and PII Rules

Sensitive-data/masking evidence files (0):

- None found in the local source closure.

Do not log secrets, tokens, credentials, or unnecessary PII. Preserve masking and permissions in the source closure; absent evidence is not a security guarantee.

## 11. Accessibility Requirements

Accessibility-related source files (5):

- `components/AdminMembersPlansPage.tsx`
- `components/AdminMembersPlansDeleteDialog.tsx`
- `components/AdminMembersPlansErrorBoundary.tsx`
- `components/AdminMembersPlansFormDialog.tsx`

Preserve labels, keyboard behavior, focus restoration, reduced-motion safeguards, and semantic status/error messaging present in source. This inventory is not a browser accessibility pass.

## 12. Background Tasks

Background-task evidence files (0):

- None found in the local source closure.

No timer, polling cadence, WebSocket, or background worker is introduced by this repair. Any listed source occurrence must retain its existing host contract.

## 13. Feature Flags

Feature-flag evidence files (0):

- None found in the local source closure.

No new feature flag is introduced. Preserve exact existing flag names and host semantics if present.

## 14. Cache Invalidation

Cache-invalidation/query-state evidence files (1):

- `hooks/useAdminMembersPlansMain.ts`

Preserve source-declared invalidation/reconciliation behavior. Do not invent query keys or cache invalidation for undocumented mutations.

## 15. Migration and Rollback

Canonical route: `/admin/admin_members/members_plans`. The old URL is intentionally retired; no compatibility alias is provided. Backend API endpoint/response contracts are `CONTRACT_MISSING`; no backend path is inferred from this UI route.
## 16. Test Coverage Map

Current test files (7), refreshed from the physical module tree:
- `tests/AdminMembersPlansApi.test.ts`

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (2):
- `mocks/admin_members_plans.scenarios.ts`
- `mocks/AdminMembersPlansMSWHandlers.ts`

Locale catalogs (2):
- `locales/admin_members_plans_en.json`
- `locales/admin_members_plans_hi.json`

Test and harness files (9):
- `tests/AdminMembersPlansApi.test.ts`

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_members/members_plans/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_members_plans.url_config.ts`.
## V42 CSS Migration Outcome (2026-10-29)

- The prior feature-local stylesheet has been removed after the consumed styles were translated into semantic Tailwind utilities in the owning components. No feature stylesheet import remains.
- Existing routes, event handlers, form fields, and business behavior were preserved; the CSS change is visual-layer-only.
- Static migration and negative-regression checks pass. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## 22. Deliverables & Version History
- **V43/RBG31–35 route-navigation follow-up:** `useAdminMembersPlansUnsavedChangesGuard` owns the browser-exit and eligible same-origin anchor guard for dirty, non-submitting drafts. The form's existing localized discard/keep-editing confirmation now receives a pending internal destination; confirmed discard resets the form and continues with Next.js `router.push`. Modified/new-window/download/external links remain unaffected. Co-located hook regression tests cover dirty/clean navigation and browser-exit behavior; execution is `DEFERRED_TO_HOST_RUNTIME`.


V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL compatibility registry: `config/admin_members_plans.url_config.ts` re-exports the existing domain registry without changing route values.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 4 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_members_plans.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **4**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
