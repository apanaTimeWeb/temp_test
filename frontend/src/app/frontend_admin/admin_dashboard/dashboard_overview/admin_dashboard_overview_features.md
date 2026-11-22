---
feature: "admin_dashboard_overview"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "8/8"
---

Current working-tree physical inventory (2026-10-30): 18 files total, 13 TS/TSX/JS/JSX/MJS files, 1 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.
# Dashboard Overview — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_dashboard/dashboard_overview` (canonical V34 target boundary).

## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_dashboard/dashboard_overview`.


Component files:
- `AdminDashboardOverviewMain.tsx`
Hook files:
- None found in the current physical module tree.
API service files:
- None found in the current physical module tree.
State files:
- None found in the current physical module tree.
Schema files:
- None found in the current physical module tree.
Type files:
- None found in the current physical module tree.

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_dashboard/dashboard_overview`.
- Physical route owner: `admin_dashboard/dashboard_overview/page.tsx`.
- Canonical submodule URL configuration: `config/admin_dashboard_overview.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (0):
- None found in current source closure.

Observed API URL literals from the local API/config source closure:
- None found in current source closure.

Schema files (0):
- None found in current source closure.

Type files (0):
- None found in current source closure.

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical registry: `api/admin_dashboard_overview.query_keys.ts`.
- Export: `ADMIN_DASHBOARD_OVERVIEW_QUERY_KEYS`.
- Root namespace: `admin_dashboard_overview`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

No mutations or state-changing actions exist here. The cards navigate to other canonical admin workspaces; they do not create or modify business records.

## 7. Permissions and Role Rules

No local permission hook or role-conditioned rendering is present in the component. The page is part of the Admin role container, but that alone does not prove server authorization or tenant isolation. Keep authorization enforcement in the trusted host/backend boundary.

## 8. State Ownership

No local Zustand store, mutable business state, form state, or server-state cache exists in this submodule. The destination card array is static presentation configuration.

## 9. Offline and Reconnect Behavior

No offline cache, retry loop, or reconnect state is implemented by this page. The pending-metrics message is informational, not a live connectivity indicator.

## 10. Security and PII Rules

The overview displays no member-level PII, payment details, credentials, or tokens. Do not add data display or logging without a verified contract and explicit scope. Server authorization remains outside the evidence available in this submodule.

## 11. Accessibility Requirements

Use semantic `main`, `header`, `section`, `article`, heading, link, and `aside role="status"` structures present in the component. Decorative Lucide icons use `aria-hidden="true"`. Every destination link has a visible translated label and a 44px minimum-height class (`min-h-11`); maintain keyboard focus-visible styling, readable wrapping, and accessible status text. Browser-based WCAG verification has not been executed in this environment.

## 12. Background Tasks

No timers, polling, WebSockets, SSE, workers, or background tasks exist in this source closure.

## 13. Feature Flags

No feature flag is referenced. Do not invent a flag to control the overview.

## 14. Cache Invalidation

No query cache or mutation invalidation exists in this submodule. No cache behavior should be inferred.

## 15. Migration and Rollback

The leaf moved from `admin_dashboard/dashboard_overview` to the exact user-requested folder `admin_dashboard/dashboard_overview`. The canonical route is `/admin/admin_dashboard/dashboard_overview`; the old route is intentionally not retained. Rollback means restoring the V33 source snapshot for this leaf and its domain redirect/route references, not adding an old-path alias. The RBG1 changed-file ledger records the migrated source artifacts.

## 16. Test Coverage Map

Current test files (2), refreshed from the physical module tree:
- `tests/AdminDashboardOverview.test.tsx`

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The physical folder name `dashboard_overview` is the exact user-approved target submodule name and intentionally does not repeat the `admin_dashboard_` prefix. This explicit domain-taxonomy requirement overrides generic examples that prefix the domain into submodule folder names. Internal filenames, the URL config filename, and documentation artifacts retain the complete role+submodule prefix (e.g. `AdminDashboardOverviewMain.tsx`, `admin_dashboard_overview.url_config.ts`).

## 18. Known Contract Gaps

There is no verified live Library overview KPI endpoint in this source scope; the component deliberately states that Library metrics are pending verification. This module does not establish host route mounting, runtime translations, backend authorization, or live API readiness. Mark such verification `DEFERRED_TO_HOST_RUNTIME` where applicable.

## 19. Rule Compliance Checklist

- [x] Exact user-specified leaf folder `admin_dashboard/dashboard_overview`.
- [x] Full role+submodule filenames, locale names, URL config name, and docs trio.
- [x] Route entry is thin and delegates to the component.
- [x] Canonical direct route is declared and the domain root points to the canonical child.
- [x] Only requested active destinations are linked from the overview.
- [x] Existing pending-metrics disclosure retained; no KPI/API invented.
- [x] Required categories, host stub, locale catalogs, tests and harness are present.
- [ ] Dependency-backed tests, typecheck, lint, and browser route checks — `DEFERRED_TO_HOST_RUNTIME`.

## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (0):
- None found in current source closure.

Locale catalogs (2):
- `locales/admin_dashboard_overview_en.json`
- `locales/admin_dashboard_overview_hi.json`

Test and harness files (4):
- `tests/AdminDashboardOverview.test.tsx`

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `dashboard_overview/` under `src/app/frontend_admin/admin_dashboard/`; do not recreate the retired `admin_dashboard_library_overview/` route. Ensure `@/*` resolves to `src/*`, `next/navigation` is available for the parent redirect, `next-intl` provides namespace `ADMIN_DASHBOARD`, and `lucide-react` plus Next.js `Link` are available. The host must register the required English/Hindi namespace catalogs and route mounting. The three destination URLs are UI route contracts from `AdminApplicationRoutes`; create/move those target leaves as specified before enabling release navigation. No backend endpoint or authorization capability is asserted by this module.

## 22. Deliverables & Version History

V33 source leaf moved and renamed in V34 RBG1 to match the explicit domain/submodule taxonomy. Canonical route changed to `/admin/admin_dashboard/dashboard_overview`; old route compatibility is intentionally not preserved. Route consumer references, locale catalog names and local test identifiers were updated in this RBG. Runtime verification remains pending.

## Canonical Route Rebuild

This submodule is directly reachable at `/admin/admin_dashboard/dashboard_overview`. Legacy routes and compatibility aliases are retired. API URLs and payload contracts remain source-derived and unchanged.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 18 files (13 TS/TSX/JS/JSX/MJS files; 1 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_dashboard_overview.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **18**.
- TS/TSX/JS/JSX/MJS files: **13**.
- Component TSX/JSX files: **1**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
