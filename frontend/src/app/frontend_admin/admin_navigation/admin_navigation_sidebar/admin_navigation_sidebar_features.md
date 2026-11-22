# admin_navigation_sidebar — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_navigation/admin_navigation_sidebar` (cross-domain navigation support infrastructure; not a tenth business domain). Capability identifier: `admin_navigation_sidebar`. Scope is limited to this submodule’s source closure. Non-scope: business capability logic, backend code, and undocumented contracts.
## 2. Screen Inventory

Entry candidates (0):

- None found in the local source closure.

Component source files (1); total TSX files: 1. Complete component inventory:

- `components/AdminNavigationSidebar.tsx`

Current working-tree physical inventory (2026-10-30): 19 files total, 14 TS/TSX/JS/JSX/MJS files, 1 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

## 3. Navigation Contract

Source-derived capability/view identifier: `admin_navigation_sidebar`. It supplies role navigation only; no business domain is inferred from this name.

URL configuration owner: `config/admin_navigation_sidebar.url_config.ts`. It exports `ADMIN_ADMIN_NAVIGATION_SIDEBAR_ROUTES`, compatibility constant `ADMIN_NAVIGATION_URLS`, and `ADMIN_ADMIN_NAVIGATION_SIDEBAR_API`. The nine destination values come from the existing verified `ADMIN_ROUTES` registry; no destination values were changed.

Preserve existing URL values, query parameters, and resource IDs exactly. No new public URL or host rewrite is inferred by this submodule split.

## 4. API Contract

Local API adapters (0):

- None found in the local source closure.

No literal API path could be safely extracted from the local adapter source.

Schemas (0):

- None found in the local source closure.

Types (1):

- `types/AdminNavigationSidebarTypes.ts`

API URL references resolved from source: none resolved from local URL config

Unknown server behavior remains `BLOCKED_BY_SUPPLIED_CONTRACT`; do not infer missing endpoint or DTO semantics.

## 5. Query Key Registry

- Canonical registry: `api/admin_navigation_sidebar.query_keys.ts`.
- Export: `ADMIN_NAVIGATION_SIDEBAR_QUERY_KEYS`.
- Root namespace: `admin_navigation_sidebar`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (3):

- `components/AdminNavigationSidebar.tsx`
- - `tests/AdminNavigationSidebarRoutes.test.ts`

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

Accessibility-related source files (1):

- `components/AdminNavigationSidebar.tsx`

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

Structural rollback is restoring the pre-migration files listed in `audit_evidence/rbg1/PRE_MIGRATION_SOURCE_MANIFEST.csv`. Routes and URL config are preserved. Submodule root: `admin_navigation_sidebar`.
## 16. Test Coverage Map

Local tests (3):

- - `tests/AdminNavigationSidebarLocaleContract.test.ts`
- `tests/AdminNavigationSidebarRoutes.test.ts`

These files establish test inventory only; they do not count as passing until executed with the host dependency tree.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (0):

- None found in the local source closure.

Locale catalogs (2):

- `locales/admin_navigation_sidebar_en.json`
- `locales/admin_navigation_sidebar_hi.json`

Tests (3):

- - `tests/AdminNavigationSidebarLocaleContract.test.ts`
- `tests/AdminNavigationSidebarRoutes.test.ts`

Run from the host project root with installed dependencies. Mock behavior is not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `admin_navigation_sidebar/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. URL values are owned by `config/admin_navigation_sidebar.url_config.ts`; the deprecated domain-root re-export was removed. The canonical source for all existing routes remains the verified `ADMIN_ROUTES` registry.
## 22. Deliverables & Version History

V29 → RBG1: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL contract: `config/admin_navigation_sidebar.url_config.ts` owns the route namespace without changing existing route values.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 19 files (14 TS/TSX/JS/JSX/MJS files; 1 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_navigation_sidebar.scenarios.ts`. It declares eight transport-level states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- `ACTIVE_RECORDS` binds through an adapter to the existing module-local fixture; this catalog does not fabricate navigation items or route data.
- The `hooks/` and `api/` folders are present per the strict Section 45.4A checklist. They remain empty unless implementation is supported by this leaf's source contract.
- Static catalog/folder verification does not prove runtime handler wiring; host-runtime verification remains deferred.


## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **19**.
- TS/TSX/JS/JSX/MJS files: **14**.
- Component TSX/JSX files: **1**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
