
---
feature: "admin_dashboard_reports"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_SUPPLIED — archive has no verified Git commit metadata"
documentation_status: "current"
portability_score: "NOT_VERIFIED — source/static checks only; host typecheck, Vitest, lint, build and browser E2E are not yet executed"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 4 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Dashboard Reports — Autonomous Submodule Specification

## 1. Scope and Non-Scope

This submodule owns the one canonical dashboard-report route, its demo-only analytics view, and its metadata-only report catalog. It does not own a separate `admin_reports_main` route. It does not implement or claim live report metrics until a complete backend report DTO and authorization contract are supplied.

## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_dashboard/dashboard_reports`.


Component files:
- `AdminDashboardReportsAnalyticsPageHeaderSection.tsx`
- `AdminDashboardReportsAnalyticsPanel.tsx`
- `AdminDashboardReportsAnalyticsPrimaryChartsGrid.tsx` (owns KPI cards and the two primary charts)
- `AdminDashboardReportsAnalyticsSecondaryInsightsSection.tsx` (owns revenue/student charts and responsive branch summary)

The canonical route component is `page.tsx`; it owns the analytics/library view switch, metadata search and metadata-only CSV export.
Hook files:
- `useAdminDashboardReportsAnalyticsViewState.ts`
API service files:
- `admin_dashboard_reports.api.ts`
State files:
- None found in the current physical module tree.
Schema files:
- `schemas/AdminDashboardReportsAnalyticsApiSchema.ts`
Type files:
- `types/AdminDashboardReportsComponentTypes.ts`
Utility files:
- `utils/AdminDashboardReportsFormatters.ts`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_dashboard/dashboard_reports`.
- Physical route owner: `admin_dashboard/dashboard_reports/page.tsx`.
- Canonical submodule URL configuration: `config/admin_dashboard_reports.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## UI Data Requirements Mapping

| UI surface | Source / field mapping | Current status | Contract boundary |
|---|---|---|---|
| Analytics KPI cards | Module-owned demo fixture (`AdminDashboardReportsFixtures.ts`); nullable values rendered with `displayValue()` from the supplied shared formatter. | `VERIFIED` for demo fixture rendering only. | Live KPI names/units/aggregation periods are `CONTRACT_MISSING`; do not present fixtures as live data. |
| Analytics charts | Module-owned demo fixture for revenue, expense, occupancy and student trend series. | `VERIFIED` for demo mode. | Backend chart DTO is not supplied; live metrics remain unavailable. |
| Branch selector and date range | `useAdminDashboardReportsAnalyticsViewState` local range/branch state and derived filtered branch rows. | `VERIFIED` for local client state. | No server query/filter contract is established by current source. |
| Report-library cards | `ADMIN_DASHBOARD_REPORTS_FIXTURES` metadata: report identifier, localized title/description keys, and category. | `VERIFIED` for metadata-only cards and search/export. | This catalog does not mean report data endpoints exist; each report family remains unavailable pending a verified contract. |
| CSV export | Client-side serializer for demo analytics or library metadata. | `VERIFIED` for client-generated download path. | No server export, PDF-generation or email-delivery action is established. |

## 4. API Contract

Current API service files (1):
- `api/admin_dashboard_reports.api.ts`

Observed API URL literals from the local API/config source closure:

### API client callsites (source-derived)

These expressions are used by the current frontend API adapter. Their resolved path below is classified as an API-client argument, not a browser route.

- `api/admin_dashboard_reports.api.ts` calls `apiFetch(ADMIN_DASHBOARD_REPORTS_API.LIST)`; effective endpoint requires following the source-defined runtime wrapper.

Schema files (1):
- `schemas/AdminDashboardReportsAnalyticsApiSchema.ts` (minimal envelope-data record shape; no live metric DTO invented)

Type files (1):
- `types/AdminDashboardReportsComponentTypes.ts` (transport record, view-model types, component props and dataset shapes)

Utility files (1):
- `utils/AdminDashboardReportsFormatters.ts` (currency/number formatting and CSV serialization/building)

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical registry: `api/admin_dashboard_reports.api.ts`.
- Export: `ADMIN_DASHBOARD_REPORTS_ANALYTICS_QUERY_KEYS`; its separate file follows the normative query-key filename contract.
- Root namespace: `admin_dashboard_reports`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.
Canonical file: `api/admin_dashboard_reports.query_keys.ts`
Export: `ADMIN_DASHBOARD_REPORTS_ANALYTICS_QUERY_KEYS`
Root namespace: `admin_dashboard_reports`


## 6. Mutation Inventory

No report mutation endpoint is established by the available source evidence. Catalog CSV export and demo analytics CSV export are client-side downloads, not server mutations.

## 7. Permissions and Role Rules

The module is under the authenticated Admin role shell. This UI does not prove backend authorization or per-library tenant isolation. Backend enforcement requires backend source/runtime evidence and is outside this frontend-only package.

## 8. State Ownership

The parent page owns the active local view (`analytics` or `library`). The analytics hook owns the selected time range and branch filter; its sample data source is selected by the demo-mode flag. The library owns search text and derives visible catalog entries. No cross-submodule business store is used.

## 9. Offline and Reconnect Behavior

The page has no live metric polling or reconnect logic. The Analytics view must clearly show live data unavailable when not in demo mode; do not imply cached/demo values are current server data.

## 10. Security and PII Rules

Do not add personal student records or branch-level production metrics to sample fixtures. CSV downloads contain demo analytics or report-library metadata only. Do not log secrets, tokens, credentials, or unnecessary PII. The frontend cannot establish backend permission enforcement.

## 11. Accessibility Requirements

The view selector is a labelled button group with `aria-pressed` state. Search has an explicit label; no-result text is announced with `role="status"`. Maintain visible focus indicators, keyboard operability, reduced-motion compatibility, responsive chart wrappers, and descriptive labels for chart semantics. Browser accessibility verification remains runtime-dependent.

## 12. Background Tasks

No polling, background task, socket subscription, worker, or timer is introduced. Object URLs created by CSV downloads are revoked after the click opportunity and temporary anchors are removed.

## 13. Feature Flags

`isFrontendDemoModeEnabled()` is the governing source for synthetic analytics. Do not rename or bypass the flag. Non-demo mode must not render sample metrics as live results.

## 14. Cache Invalidation

No report mutation cache invalidation is evidenced or introduced. The API adapter tests verify response-envelope/schema handling only.

## 15. Migration and Rollback

The canonical route is `/admin/admin_dashboard/dashboard_reports`. Retired report routes are not preserved. Analytics and library now live as views within the same canonical submodule; report analytics source was relocated, not discarded. Rollback must restore the complete module folder from version control/archive rather than reintroducing legacy aliases.

## 16. Test Coverage Map

Current test files from the current physical module tree (execution not implied):
- `tests/AdminDashboardReportsRegressionSuite.test.tsx` — consolidated from five prior test files after comparing all 32 original test cases and 92 explicit expect calls against the merged suite. Original route/library interaction tests, fixture parity checks, API/schema checks, scenario tests and chart/branch summary assertions are retained.
- `tests/harness/bootstrap.ts` — mandatory standalone UI-state harness aligned to the canonical eight scenario names.

The tests are source artifacts, not a successful runtime result. Dependency-backed Vitest/typecheck/lint/build and browser E2E remain `DEFERRED_TO_HOST_RUNTIME`.
## 17. Architecture Exceptions

No exception to domain/submodule isolation is approved. All business code stays in this submodule's category folders. Cross-submodule links and legacy URL aliases are forbidden.

## 18. Known Contract Gaps

The report API schema does not define metric names, units, aggregation periods, branch filters, pagination, or authorization metadata. `CONTRACT_MISSING`: live report metrics cannot be bound to this endpoint safely until the backend DTO contract is supplied and verified. The module therefore uses explicitly demo-only sample data and a non-demo unavailable state.

## 19. Rule Compliance Checklist

- [x] Canonical route and domain secondary-navigation placement are documented.
- [x] Analytics sample metrics are gated by the existing frontend demo flag.
- [x] Report library is metadata-only and restricted to requested domain categories.
- [x] API response contract is schema-checked without inventing live metric fields.
- [x] Documentation trio exists.
- [x] Canonical URL config, host stubs, and standalone test harness exist.
- [ ] Dependency-backed unit tests, lint, typecheck, build, and browser E2E — `DEFERRED_TO_HOST_RUNTIME` until dependencies and application runtime are available.

## 20. Standalone Run, Mock & Test Harness

Mock/fixture/scenario files (3):
- `mocks/AdminDashboardReportsFixtures.ts` (fixture data and scenario-specific MSW handlers)
- `mocks/AdminDashboardReportsFixtures.ts` (typed fixtures and scenario-specific handlers; the eight-state catalog is `mocks/scenarios/admin_dashboard_reports.scenarios.ts`)
- `mocks/scenarios/admin_dashboard_reports.scenarios.ts` (canonical eight-state catalog)

Locale catalogs (2):
- `locales/admin_dashboard_reports_en.json`
- `locales/admin_dashboard_reports_hi.json`

Test and harness files (2):
- `tests/AdminDashboardReportsRegressionSuite.test.tsx` (32 consolidated test cases; source assertion parity reviewed)
- `tests/harness/bootstrap.ts` (canonical eight-state harness and scenario label exports)

Run these tests from the host package with the declared dependencies and test setup. Fixtures demonstrate frontend test contracts only; they do not prove live backend support. In this supplied environment, host execution is not claimed unless a command result is recorded in the Group 01 audit evidence.
## 21. Module Portability & Host Integration Guide

Canonical source folder: `frontend_admin/admin_dashboard/dashboard_reports/`. Requires Next.js App Router, React, `next-intl`, the approved shared `apiFetch`/API schema adapter, `sonner`, and existing chart host setup. Locale namespaces are `ADMIN_SHELL` and `ADMIN_REPORTS`, with keys available in the role's application-infrastructure locale catalogs. Every dependency path must resolve in the host. The module does not require the retired `admin_reports/` directory. `npm install` / package-manager execution is not run in this isolated source copy because it contains no installed dependencies and its package manifest declares peer dependencies; run `npm ci` only in the approved host after package-lock provenance is checked, then run `npm run typecheck`, `npm test -- --run`, `npm run lint`, `npm run format:check`, and `npm run test:e2e` from `frontend_admin/`.

## 22. Deliverables & Version History

V35 Group 01 working copy: repaired canonical URL exports, moved query-key registry to `api/`, added a direct view-state test, implemented scenario-specific harness/transport behavior, and corrected route feedback namespace/monitoring imports; retired legacy route references, updated canonical URL contract and tests, and documented the live API DTO gap. Release readiness depends on full source re-audit and host/runtime verification.

Historical note (superseded by the normative architecture rule): The query-key registry is co-located with this module-owned API adapter to keep the cache contract with its entity-family transport. Both exports remain typed and are tested.

Repair note (2026-10-28): Fixture declarations are consolidated into `mocks/AdminDashboardReportsFixtures.ts`; module-owned MSW handlers remain separate to avoid pulling MSW into runtime/demo consumers.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 note (superseded by the current inventory above):** the earlier version recorded 28 files and used `COHESIVE_EXCEPTION_REVIEWED_NO_SPLIT_EVIDENCE`. The cited five-gate review CSV is absent from this supplied archive, so this historical phrase is not approval under the current architecture ceiling. This historical note refers to the earlier 32-file snapshot and is superseded by the current inventory at the top of this document. The repair retained all existing UI states, source-level test cases and explicit assertions; the mandatory `tests/harness/bootstrap.ts` artifact remains present, and no count-only documentation change was used. The five-gate criteria remain route/navigation destination, distinct lifecycle/state boundary, healthy granularity without nano-modules, standalone testability/mockability, and alignment to a verified backend entity/aggregate.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_dashboard_reports.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`. `NETWORK_TIMEOUT` delays for 15 seconds by default before returning a typed 504 envelope; regression tests may set the delay to zero to avoid slow tests.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present. `hooks/useAdminDashboardReportsAnalyticsViewState.ts` owns local demo-view state, and `api/admin_dashboard_reports.api.ts` owns the minimal typed transport adapter. The current source contains no confirmed TanStack Query consumer; folder presence alone is not runtime evidence.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## RBG 2 repair notes (2026-10-30)

- `schemas/AdminDashboardReportsAnalyticsApiSchema.ts` owns the minimal frontend transport validation schema; it deliberately does not define unknown live report metrics.
- `api/admin_dashboard_reports.api.ts` owns the report request adapter and its typed query-key registry.
- `utils/AdminDashboardReportsFormatters.ts` owns currency/count formatting and report CSV construction/serialization; API transport no longer owns presentation formatters.
- `mocks/scenarios/admin_dashboard_reports.scenarios.ts` is the canonical eight-state registry; `mocks/AdminDashboardReportsFixtures.ts` implements those states without inventing a production DTO. `ACTIVE_RECORDS` requires an explicitly supplied adapter record, otherwise empty results remain distinct from errors.
- The 32-file ceiling finding remains open pending a real operational boundary. The absent `OVER25_FIVE_GATE_REVIEW.csv` is not evidence of an approved exception.


### RBG 2 — closure evidence (2026-10-30)

- `ISSUE-002`: closed at source level; physical module count is within the 25-file ceiling after responsibility-preserving consolidation.
- `ISSUE-052`: transport schema remains in `schemas/AdminDashboardReportsAnalyticsApiSchema.ts`; presentation formatters remain in `utils/AdminDashboardReportsFormatters.ts`, outside the API service.
- `ISSUE-053`: eight canonical scenario descriptors map to the MSW handler adapter; the standalone UI harness now uses the exact canonical names including 403, network rejection and malformed response. Runtime MSW execution remains `DEFERRED_TO_HOST_RUNTIME`.
- `ISSUE-088`: `loading.tsx` uses the verified `ADMIN_REPORTS.LOADING_DASHBOARD` locale key present in both locale catalogs.
- `ISSUE-100`: physical inventory, component list, fixture/test/harness map and historical count language reconciled to the actual tree.
- `ISSUE-101`: currency/count presentation functions are owned by the module-local formatter utility; the API transport file does not own presentation formatting. The KPI currency call now passes `(minorUnits, currencyCode, locale)` in the declared parameter order.
- Canonical route `/admin/admin_dashboard/dashboard_reports` and the analytics/library view switch are unchanged. No new browser routes or compatibility redirects were introduced.
- Verification boundary: test case names and explicit `expect`-call counts were compared to the five original suite files (32 test cases / 92 expects, zero unmatched); TypeScript syntax-only parsing and dependency-light static checks still need a fresh post-consolidation run. Full Vitest, semantic typecheck, build and browser E2E have not been executed in this host-less ZIP and are not claimed as PASS.


### Chart loading state ownership
The dynamic chart loading skeleton is kept in each owning chart component so the module remains within the 25-file hard ceiling while preserving the localized `CHART_LOADING` accessible status.


## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **4**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
