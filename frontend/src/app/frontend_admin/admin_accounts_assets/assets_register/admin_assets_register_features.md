---
feature: "admin_assets_register"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_SUPPLIED — archive has no verified Git commit metadata"
documentation_status: "current"
portability_score: "NOT_VERIFIED — source/static checks only; host typecheck, Vitest, lint, build and browser E2E are not yet executed"
---

Current working-tree physical inventory (2026-10-30): 24 files total, 19 TS/TSX/JS/JSX/MJS files, 5 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Assets Register — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_accounts_assets/assets_register` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_accounts_assets/assets_register`.


Component files:
- `AdminAssetsRegisterPage.tsx`
- `AdminAssetsRegisterRoute.tsx`
- `AdminAssetsRegisterFilterSection.tsx`
- `AdminAssetsRegisterPage.tsx`
- `AdminAssetsRegisterRoute.tsx`
- `AdminAssetsRegisterSummarySection.tsx`
- `AdminAssetsRegisterTableSection.tsx`
Hook files:
- None found in the current physical module tree.
API service files:
- `admin_assets_register_api.ts`
State files:
- None found in the current physical module tree.
Schema files:
- `AdminAssetsRegisterFormSchemas.ts`
Type files:
- `types/AdminAssetsRegisterComponentTypes.ts`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_accounts_assets/assets_register`.
- Physical route owner: `admin_accounts_assets/assets_register/page.tsx`.
- Canonical submodule URL configuration: `config/admin_assets_register.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (1):
- `api/admin_assets_register_api.ts`

Observed API URL literals from the local API/config source closure:

### API client callsites (source-derived)

These expressions are used by the current frontend API adapter. Their resolved path below is classified as an API-client argument, not a browser route.

- `api/admin_assets_register_api.ts` calls `apiFetch(ADMIN_ASSETS_REGISTER_API.list)` → `/api/v1/admin/accounting`.

Schema files (1):
- `schemas/AdminAssetsRegisterFormSchemas.ts`

Type files (1):
- `types/AdminAssetsRegisterComponentTypes.ts`

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical registry: `api/admin_assets_register.query_keys.ts`.
- Export: `ADMIN_ASSETS_REGISTER_QUERY_KEYS`.
- Root namespace: `admin_assets_register`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None found outside registry declarations. This is a stable key declaration, not evidence that a live query or endpoint is implemented.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

- Client-only CSV export of currently visible demo asset rows is enabled in demo mode. Formula-like user strings are escaped; export does not call a server mutation. Live asset data/export remain `CONTRACT_MISSING`.


Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (6):

- `components/AdminAssetsRegisterPage.tsx`
- `components/AdminAssetsRegisterPage.tsx`
- `mocks/admin_assets_register.scenarios.ts`
- `schemas/AdminAssetsRegisterFormSchemas.ts`

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

Accessibility-related source files (5):

- `components/AdminAssetsRegisterSummarySection.tsx`
- `components/AdminAssetsRegisterFilterSection.tsx`
- `components/AdminAssetsRegisterTableSection.tsx`
- `components/AdminAssetsRegisterPage.tsx`
- `components/AdminAssetsRegisterRoute.tsx`

Preserve labels, keyboard behavior, focus restoration, reduced-motion safeguards, and semantic status/error messaging present in source. This inventory is not a browser accessibility pass.

## 12. Background Tasks

Background-task evidence files (1):

- `utils/AdminAssetsRegisterCurrencyAndCsv.ts`

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

Canonical route: `/admin/admin_accounts_assets/assets_register`. The old URL is intentionally retired; no compatibility alias is provided. No live backend API endpoint or DTO was modified or assumed. The screen remains demo-only unless the host supplies and verifies the asset-register API contract.
## 16. Test Coverage Map

Current test and harness files from the current physical module tree (execution not implied):
- `tests/AdminAssetsRegisterContracts.test.tsx`

These paths establish inventory only, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E are not claimed as passed.
## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (2):
- `mocks/admin_assets_register.scenarios.ts`
- `mocks/admin_assets_register.scenarios.ts` (verified current handler location)

Locale catalogs (2):
- `locales/admin_assets_register_en.json`
- `locales/admin_assets_register_hi.json`

Test and harness files (3):
- `tests/AdminAssetsRegisterContracts.test.tsx`
- `tests/harness/AdminAssetsRegisterHarness.tsx`
- `tests/harness/bootstrap.ts`

Run these tests from the host package with the declared dependencies and test setup. Fixtures demonstrate frontend test contracts only; they do not prove live backend support. In this supplied environment, host execution is not claimed unless a command result is recorded in the Group 01 audit evidence.
## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_accounts_assets/assets_register/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_assets_register.url_config.ts`.
## 22. Deliverables & Version History

V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## Group 01 Repair Notes

- Host declaration boundary: `contracts/host-stubs.d.ts`; its declarations describe host seams and do not replace host verification.
- Canonical URL config is module-owned and exports the current route contract. Backend endpoints and response models remain unverified unless listed in the verified contract below.
- No nested autonomous sub-module was created. This module still requires a five-gate boundary/route decision when its physical file count exceeds the architecture ceiling.
- The source archive does not contain Git commit metadata; no commit hash or runtime pass is asserted.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 disposition (superseded 2026-10-30):** the preceding v44 audit text described the frozen input tree, not this repaired tree. Current recursive inventory is 24 files (19 TS/TSX/JS/JSX/MJS files; 5 component TSX/JSX files), and the current file-ceiling status is COMPLIANT. Historical exception claims are not approval; no absent exception CSV is inferred. Preserve the five-gate boundary rule for any future topology decision.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_assets_register.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **24**.
- TS/TSX/JS/JSX/MJS files: **19**.
- Component TSX/JSX files: **5**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
