---
feature: "admin_accounts_expense_categories"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_SUPPLIED — archive has no verified Git commit metadata"
documentation_status: "current"
portability_score: "NOT_VERIFIED — host typecheck, lint, unit tests, build and E2E were not executed"
---

Current working-tree physical inventory (2026-10-30): 24 files total, 19 TS/TSX/JS/JSX/MJS files, 3 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Accounts Expense Categories — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_accounts_assets/accounts_expense_categories` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_accounts_assets/accounts_expense_categories`.


Component files:
- `AdminAccountsExpenseCategoriesDeleteConfirmationDialog.tsx`
- `AdminAccountsExpenseCategoriesExpenseCategoryGridSection.tsx`
- `AdminAccountsExpenseCategoriesPage.tsx`
Hook files:
- None found in the current physical module tree.
API service files:
- None found in the current physical module tree.
State files:
- None found in the current physical module tree.
Schema files:
- `AdminAccountsExpenseCategoriesFormSchemas.ts`
Type files:
- `AdminAccountsExpenseCategoriesTypes.ts`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_accounts_assets/accounts_expense_categories`.
- Physical route owner: `admin_accounts_assets/accounts_expense_categories/page.tsx`.
- Canonical submodule URL configuration: `config/admin_accounts_expense_categories.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (0):
- None found in current source closure.

Observed API URL literals from the local API/config source closure:

Schema files (1):
- `schemas/AdminAccountsExpenseCategoriesFormSchemas.ts`

Type files (1):
- `types/AdminAccountsExpenseCategoriesTypes.ts`

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

### UI Data Requirements Mapping

| UI Element | Required Field(s) | API Endpoint | Response Path | Availability | Nullable? | Mocked? | UI Behavior When Unavailable |
|---|---|---|---|---|---|---|---|
| Main screen / view composition | Source components: `components/AdminAccountsExpenseCategoriesPage.tsx` | CONTRACT_MISSING — no feature-specific operation/DTO is verified by this mapping. | No verified response path supplied | feature_flagged | Source-defined | Yes — local fixture/mocked source exists; this is not a verified live response. | Preserve the source-defined unavailable/error state; do not treat local fixtures as live output. |
| Client form / validation schema | `name`, `category`, `purchaseDate`, `purchaseValue`, `location`, `assetName`, `issue`, `reportedDate`, `scheduledDate`, `vendor`, `cost`, `budget`, `date`, `description`, `amount`, `paidBy` — `schemas/AdminAccountsExpenseCategoriesFormSchemas.ts` | CONTRACT_MISSING — no feature-specific operation/DTO is verified by this mapping. | No verified API response path supplied | not_applicable | Defined by local schema; re-check optionality at source | Yes — local fixture/mocked source exists; this is not a verified live response. | Display field validation errors; do not imply server persistence without a contract. |
| Typed data model | `id`, `date`, `shift`, `openingBalance`, `cashCollected`, `upiCollected`, `expenses`, `closingBalance`, `settledBy`, `status`, `name`, `category`, `purchaseDate`, `purchaseValue`, `currentValue`, `location` — `types/AdminAccountsExpenseCategoriesTypes.ts` | CONTRACT_MISSING — no feature-specific operation/DTO is verified by this mapping. | No DTO response path verified | feature_flagged | Follow declared field optionality; use `displayValue()` for nullable presentation | Yes — local fixture/mocked source exists; this is not a verified live response. | Never infer a server DTO or show example values as production data. |
| Local fixture / mock state | Source fixtures: `mocks/AdminAccountsExpenseCategoriesExpenseCategoryFixtures.ts` | No endpoint asserted by a fixture | Fixture paths are local-only | feature_flagged | Fixture-specific | Yes — module-owned fixtures only | Keep fixture/demo state distinct from live state and retain explicit unavailable messaging. |

Availability labels follow the architecture contract: `required`, `nullable`, `permission_masked`, `feature_flagged`, or `not_applicable`. Where the package does not establish a feature-specific endpoint/DTO, the explicit state is `CONTRACT_MISSING`; no backend behavior is inferred.

## 5. Query Key Registry

- Canonical registry: `api/admin_accounts_expense_categories.query_keys.ts`.
- Export: `ADMIN_ACCOUNTS_EXPENSE_CATEGORIES_QUERY_KEYS`.
- Root namespace: `admin_accounts_expense_categories`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (5):

- `components/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.tsx`
- `components/AdminAccountsExpenseCategoriesPage.tsx`
- `components/AdminAccountsExpenseCategoriesDeleteConfirmationDialog.tsx`
- `schemas/AdminAccountsExpenseCategoriesFormSchemas.ts`
- `tests/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.test.tsx`

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

Accessibility-related source files (2):

- `components/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.tsx`
- `components/AdminAccountsExpenseCategoriesPage.tsx`

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

Canonical route: `/admin/admin_accounts_assets/accounts_expense_categories`. The old URL is intentionally retired; no compatibility alias is provided. Backend API endpoints and payload contracts are unchanged.
## 16. Test Coverage Map

Current test files (3), refreshed from the physical module tree:
- `tests/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.test.tsx`
- `tests/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.test.tsx`

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (1):
- `mocks/AdminAccountsExpenseCategoriesExpenseCategoryFixtures.ts`

Locale catalogs (2):
- `locales/admin_accounts_expense_categories_en.json`
- `locales/admin_accounts_expense_categories_hi.json`

Test and harness files (5):
- `tests/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.test.tsx`
- `tests/AdminAccountsExpenseCategoriesExpenseCategoryGridSection.test.tsx`

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_accounts_assets/accounts_expense_categories/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_accounts_expense_categories.url_config.ts`.
## V42 CSS Migration Outcome (2026-10-29)

- The prior feature-local stylesheet has been removed after the consumed styles were translated into semantic Tailwind utilities in the owning components. No feature stylesheet import remains.
- Existing routes, event handlers, form fields, and business behavior were preserved; the CSS change is visual-layer-only.
- Static migration and negative-regression checks pass. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## 22. Deliverables & Version History
- **V43 / RBG 31–35 — Rule 79 unsaved-draft safety:** This sub-module owns `hooks/useAdminAccountsExpenseCategoriesUnsavedChangesGuard.ts` with a co-located test. form discard changes via the existing dialog view to avoid nested modal focus traps. Dirty, non-submitting forms register a `beforeunload` guard and intercept eligible same-origin anchor navigation; continuation occurs only after the localized confirmation approves discard. New-window, modified, download, external-origin and same-page links are not intercepted. Test execution remains `DEFERRED_TO_HOST_RUNTIME`.


V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL compatibility registry: `config/admin_accounts_expense_categories.url_config.ts` re-exports the existing domain registry without changing route values.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 disposition (superseded 2026-10-30):** the preceding v44 audit text described the frozen input tree, not this repaired tree. Current recursive inventory is 24 files (19 TS/TSX/JS/JSX/MJS files; 3 component TSX/JSX files), and the current file-ceiling status is COMPLIANT. Historical exception claims are not approval; no absent exception CSV is inferred. Preserve the five-gate boundary rule for any future topology decision.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_accounts_expense_categories.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **24**.
- TS/TSX/JS/JSX/MJS files: **19**.
- Component TSX/JSX files: **3**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
