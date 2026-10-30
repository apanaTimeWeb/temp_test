---

## Shared primitive ownership

Business-agnostic card, button, badge, input, label, switch, KPI and dialog primitives are consumed directly from the role-owned `frontend_admin/components/ui/` layer. Feature-owned state, labels, data mappings and business workflows remain inside this submodule.

feature: "admin_system_auto_scale"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_VERIFIED: source ZIP has no Git commit metadata"
documentation_status: "current"
portability_score: "8/8"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 4 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# System Auto Scale — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_system/system_auto_scale` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_system/system_auto_scale`.


Component files:
- `AdminSystemAutoScaleKpisSection.tsx`
- `AdminSystemAutoScalePage.tsx`
- `AdminSystemAutoScaleRecommendationsSection.tsx`
- `AdminSystemAutoScaleThresholdsSection.tsx`
Hook files:
- None found in the current physical module tree.
API service files:
- None found in the current physical module tree.
State files:
- None found in the current physical module tree.
Schema files:
- `AdminSystemAutoScaleSchema.ts`
Type files:
- None found in the current physical module tree.

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_system/system_auto_scale`.
- Physical route owner: `admin_system/system_auto_scale/page.tsx`.
- Canonical submodule URL configuration: `config/admin_system_auto_scale.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (0):
- None found in current source closure.

Observed API URL literals from the local API/config source closure:

Schema files (1):
- `schemas/AdminSystemAutoScaleSchema.ts`

Type files (0):
- None found in current source closure.

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical namespace registry: `api/admin_system_auto_scale.query_keys.ts` (`ADMIN_SYSTEM_AUTO_SCALE_QUERY_KEYS`).
- The registry exposes the standard `all`, `lists`, `list(filters)`, `details`, and `detail(resourceId)` factory shape.
- Source audit found no active TanStack Query consumer in this module closure. This is a reserved namespaced key contract only; it does not establish a live API endpoint, response DTO, query, or cache-invalidation flow.
- Do not add consumers or imply backend behavior until the module API/query contract is verified.

## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (2):


These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (0):

- None found in the local source closure.

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

Accessibility-related source files (4):

- `components/AdminSystemAutoScaleKpisSection.tsx`
- `components/AdminSystemAutoScaleThresholdsSection.tsx`
- `components/AdminSystemAutoScalePage.tsx`

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

Cache-invalidation/query-state evidence files (0):

- None found in the local source closure.

Preserve source-declared invalidation/reconciliation behavior. Do not invent query keys or cache invalidation for undocumented mutations.

## 15. Migration and Rollback

Canonical route: `/admin/admin_system/system_auto_scale`. The old URL is intentionally retired; no compatibility alias is provided. Backend API endpoints and payload contracts are unchanged.
## 16. Test Coverage Map

Current test files (2), refreshed from the physical module tree:
- `tests/AdminSystemAutoScaleStandaloneContract.test.ts`

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (1):
- `mocks/admin_system_auto_scale.scenarios.ts`

Locale catalogs (2):
- `locales/admin_system_auto_scale_en.json`
- `locales/admin_system_auto_scale_hi.json`

Test and harness files (4):
- `tests/AdminSystemAutoScaleStandaloneContract.test.ts`

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_system/system_auto_scale/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_system_auto_scale.url_config.ts`.
## 22. Deliverables & Version History
- **V43 / RBG 31–35 — Rule 79 unsaved-draft safety:** This sub-module owns `hooks/useAdminSystemAutoScaleUnsavedChangesGuard.ts` with a co-located test. threshold configuration preserves form state until discard is confirmed. Dirty, non-submitting forms register a `beforeunload` guard and intercept eligible same-origin anchor navigation; continuation occurs only after the localized confirmation approves discard. New-window, modified, download, external-origin and same-page links are not intercepted. Test execution remains `DEFERRED_TO_HOST_RUNTIME`.


V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL compatibility registry: `config/admin_system_auto_scale.url_config.ts` re-exports the existing domain registry without changing route values.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.


## UI Data Requirements Mapping

| UI data / control | Source of truth in this ZIP | Boundary / caveat |
|---|---|---|
| Auto-scale KPI, threshold, and recommendation cards | Existing component props, local fixtures, and schema where present | Operational scheduling, mutations, thresholds, and persistence contracts are `CONTRACT_MISSING` unless host verifies them |

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 4 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_system_auto_scale.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
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
