---
feature: "admin_finance_collect_fee"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_AVAILABLE_IN_SUPPLIED_SCOPE"
documentation_status: "updated-static-source-review-runtime-deferred"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 19 TS/TSX/JS/JSX/MJS files, 3 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Finance Collect Fee — Autonomous Submodule Specification

## 1. Scope and Non-Scope

**Role / business context:** Admin finance collects a student's membership fee through a form that captures the selected student, amount, late fee, payment mode, transaction reference where required, optional coupon, renewal cycle, and remark. The route is `/admin/admin_finance/finance_collect_fee`.

**Included in this ZIP:** Demo-mode student search/selection, Zod/RHF field validation, integer-minor-unit amount previews, coupon preview calculations, reset/discard confirmation, localized receipt preview, and visible blocked-state feedback. The current form's collection submit remains disabled/fail-closed because this supplied source contains no verified payment-collection endpoint.

**Explicitly out of scope / not verified:** Recording or settling a real payment, writing a receipt to a backend, applying a real coupon to an account, changing membership validity, and authorizing payment modes. Those require a verified backend/business contract and are not inferred from demo fixtures.

**User stories supported by source:** An admin can search and select a demo student, inspect their due amount, enter/validate fee inputs, preview the resulting amount and localized receipt, and safely discard unsaved edits. A collection cannot be represented as successful from this package because the live mutation contract is absent.

**Boundary provenance:** The physical submodule boundary is carried forward from the supplied V34 ZIP snapshot; this document describes the repaired V35 working copy. It does not assert the host repository's current Git revision or successful standalone build.

## 2. Screen Inventory
Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_finance/finance_collect_fee`.

**Current physical inventory:** 25 files total, 9 TSX files, 3 component-category TypeScript files, 1 hook files, 0 API files, 1 schema files and 1 type files. Counts are derived from the supplied working tree, not from a host build.

Component files:
- `AdminFinanceCollectFeeMain.tsx`
- `AdminFinanceCollectFeePage.tsx`
- `AdminFinanceCollectFeePageView.tsx`
Hook files:
- `hooks/useAdminFinanceCollectFeePage.ts`

API files:
- None in the current physical module tree.

Schema files:
- `AdminFinanceCollectFeeSchema.ts`
Type files:
- `types/AdminFinanceCollectFeeTypes.ts`

**V35 static repair note:** User-facing date output uses `date-fns` locale patterns selected from the active document/browser locale. Collection submission fails closed because the supplied source has no verified live collection mutation contract; the visible scenario harness is source-authored and its tests were not executed in this dependency-free ZIP environment.

### UI Data Requirements Mapping

| UI surface / behavior | Rendering source | Data / validation source | Evidence boundary |
|---|---|---|---|
| Student search / selection | `components/AdminFinanceCollectFeePageView.tsx` | `mocks/admin_finance_collect_fee.scenarios.ts` | `name`, `smartId`, `phone`, `dueAmountMinor` feed the demo-only picker; no live student endpoint is declared. |
| Amount, late fee, payment mode, transaction reference, coupon and renewal cycle | `components/AdminFinanceCollectFeePageView.tsx` + `hooks/useAdminFinanceCollectFeePage.ts` | `schemas/AdminFinanceCollectFeeSchema.ts` | React Hook Form state is validated with Zod; amount/late-fee preview uses integer minor units; no collection mutation is available because no verified endpoint contract is supplied. |
| Receipt preview and currency/date display | `components/AdminFinanceCollectFeePageView.tsx` | `utils/AdminFinanceCollectFeeFormat.ts` | Preview-only values; all monetary display and local date formatting flow through module-local helpers. |
| Labels and validation feedback | All module-owned UI/error/loading states | `locales/admin_finance_collect_fee_en.json`, `locales/admin_finance_collect_fee_hi.json` | The same nested key paths exist in English and Hindi; locale parity is verified statically, translation quality/runtime loading is not. |

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_finance/finance_collect_fee`.
- Physical route owner: `admin_finance/finance_collect_fee/page.tsx`.
- Canonical submodule URL configuration: `config/admin_finance_collect_fee.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract
API service files (0):
- None in the current physical module tree.

No module API service is present. The canonical `ADMIN_FINANCE_COLLECT_FEE_API` object is empty because no backend endpoint is verified in the supplied source. Collect-fee submission remains fail-closed and must not be represented as a successful payment.

Only local adapter callsites, runtime schemas and source fixtures support frontend expectations. Synthetic mock success is not proof of a live backend contract. Missing server semantics are `CONTRACT_MISSING` / `NOT_VERIFIED`, not assumptions.

## 5. Query Key Registry

- Canonical namespace registry: `api/admin_finance_collect_fee.query_keys.ts` (`ADMIN_FINANCE_COLLECT_FEE_QUERY_KEYS`).
- The registry exposes the standard `all`, `lists`, `list(filters)`, `details`, and `detail(resourceId)` factory shape.
- Source audit found no active TanStack Query consumer in this module closure. This is a reserved namespaced key contract only; it does not establish a live API endpoint, response DTO, query, or cache-invalidation flow.
- Do not add consumers or imply backend behavior until the module API/query contract is verified.

## 6. Mutation Inventory
No backend mutation is implemented. The visible collect action remains disabled with an explicit unavailable explanation; no fake success or persisted payment is produced.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (5):

- `components/AdminFinanceCollectFeeMain.tsx`
- `components/AdminFinanceCollectFeePageView.tsx`
- `schemas/AdminFinanceCollectFeeSchema.ts`

These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (1):

- `hooks/useAdminFinanceCollectFeePage.ts`

State/store files (0):

- None found in the local source closure.

API/cache ownership stays with the existing local query/API layer. Do not copy server responses into client UI state as the primary source.

## 9. Offline and Reconnect Behavior

Only preserve offline/reconnect behavior explicitly implemented in the local source closure. No new offline guarantees are added. Missing behavior remains documented as not evidenced.
## 10. Security and PII Rules

Sensitive-data/masking evidence files (3):

- `components/AdminFinanceCollectFeePageView.tsx`
- `hooks/useAdminFinanceCollectFeePage.ts`

Do not log secrets, tokens, credentials, or unnecessary PII. Preserve masking and permissions in the source closure; absent evidence is not a security guarantee.

## 11. Accessibility Requirements

Accessibility-related source files (1):

- `components/AdminFinanceCollectFeePageView.tsx`

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
Canonical route remains `/admin/admin_finance/finance_collect_fee`. This RBG does not rename the route, introduce a new route leaf, migrate backend data, or alter persistence. The current UI/API contract evidence is summarized in Section 4; any host deployment rollback or server migration is outside the supplied ZIP scope.

## 16. Test Coverage Map
Current module-local test files (2):
- `tests/AdminFinanceCollectFeeValidationAndFormat.test.ts`

The source tests are included, but runtime execution is `DEFERRED_TO_HOST_RUNTIME` until this package is provided with its declared peer/development dependencies and host integrations. Static architecture checks are reported separately; they do not imply Vitest, semantic typecheck, lint, format, build or browser test success.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness
Mock/fixture/handler files (2):
- `mocks/admin_finance_collect_fee.scenarios.ts`
- `mocks/AdminFinanceCollectFeeMigrationSource.json`

Locale catalogs (2):
- `locales/admin_finance_collect_fee_en.json`
- `locales/admin_finance_collect_fee_hi.json`

Test/harness files (4):
- `tests/AdminFinanceCollectFeeValidationAndFormat.test.ts`

The harness renders active, empty, server-error, timeout and unauthorized scenarios using module-local test-only presentation. MSW fixtures are test evidence only and are not a replacement for live API verification.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_finance/finance_collect_fee/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_finance_collect_fee.url_config.ts`.
## 22. Deliverables & Version History
V35 — Execution Group 02 (RBG 6–10), static source repair. Physical inventory and UI data mapping refreshed from the current supplied working tree. The exact host Git commit is unavailable in the supplied scope. Group 02 is packaged as an intermediate partial ZIP; runtime-dependent checks are explicitly deferred.

## Standalone Portability Artifacts

- Host boundary declarations: `contracts/host-stubs.d.ts`. These are minimal fallback declarations, not proof that the entire host package compiles in isolation.
- Canonical URL/API contract: the module-owned `config/admin_finance_collect_fee.url_config.ts` exports typed `_ROUTES` and `_API` contracts; no re-export-only facade is used.
- Canonical locale folder: `locales/`, with English/Hindi leaf-key parity verified statically.
- Standalone test harness: `tests/` contains the standalone harness and scenario vocabulary in `AdminFinanceCollectFeeHarness.tsx`; its scenario test remains in `AdminFinanceCollectFeeHarness.test.tsx`.
- Static architecture checks are run on the packaged source. Full portability / semantic compile is `NOT_VERIFIED` because declared peer dependencies and host infrastructure are not installed in this execution environment.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (19 TS/TSX/JS/JSX/MJS files; 3 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 CSS Migration Outcome (2026-10-29)

- The prior Finance-owned feature stylesheet has been removed after its consumed rules were translated into semantic Tailwind utility classes in the owning components. The owning layout no longer imports a feature stylesheet.
- Business styling remains inside this autonomous leaf; global `globals.css` contains only the central semantic token definitions and approved zero-business primitives.
- Source checks `check:feature-styles`, `check:feature-styles:negative`, and `check:finance-style-ownership` pass on the current tree. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_finance_collect_fee.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **19**.
- Component TSX/JSX files: **3**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
