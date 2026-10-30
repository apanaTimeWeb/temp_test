---
feature: "admin_finance_receipts"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_AVAILABLE_IN_SUPPLIED_SCOPE"
documentation_status: "updated-static-source-review-runtime-deferred"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 3 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Finance Receipts — Autonomous Submodule Specification

## 1. Scope and Non-Scope

**Role / business context:** Admin finance reviews receipt records using a searchable, filterable list and query-driven detail views. Local fixtures contain demo receipt data, and the interface exposes print/WhatsApp preview actions for those demo records.

**Included in this ZIP:** Fixture-backed list/detail presentation, a debounced search, mode filtering, locale-aware date/currency formatting, safe unknown-ID handling, localized print/WhatsApp labels, and visible feedback when browser popups are blocked. Summary values that would imply live totals are displayed as unavailable when the view is not in demo mode.

**Explicitly out of scope / not verified:** Creating or storing a real receipt, proof of payment, fetching live receipts, triggering payment, or sending a receipt through a real external service. No live receipt endpoint was verified in the supplied source scope.

**Boundary provenance:** This specification reflects the supplied V34 ZIP and the repaired V35 working copy. Backend contracts, host route behavior, and runtime interaction remain unverified.
## 2. Screen Inventory
Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_finance/finance_receipts`.

**Current physical inventory:** 25 files total, 11 TSX files, 3 component-category TypeScript files, 0 hook files, 0 API files, 0 schema files and 1 type files. Counts are derived from the supplied working tree, not from a host build.

Component files:
- `AdminFinanceReceiptsEmptyState.tsx`
- `AdminFinanceReceiptsIdPage.tsx`
- `AdminFinanceReceiptsPage.tsx`
Hook files:
- None in the current physical module tree.

API files:
- None in the current physical module tree.

Schema files:
- None found in the current physical module tree.
Type files:
- `types/AdminFinanceReceiptsTypes.ts`

**V35 static repair note:** User-facing date output uses `date-fns` locale patterns selected from the active document/browser locale; print and CSV helpers require explicit localized labels instead of English defaults. The standalone scenario harness has visible state-specific content, but its tests were not executed in this dependency-free ZIP environment.

### UI Data Requirements Mapping

| UI surface / behavior | Rendering source | Data / validation source | Evidence boundary |
|---|---|---|---|
| Receipt list, KPIs, search and mode filter | `components/AdminFinanceReceiptsPage.tsx` | `mocks/admin_finance_receipts.scenarios.ts` | Receipt number, student details, date, amount, mode, plan, shift and seat are sourced from local demo records only. |
| Receipt detail | `components/AdminFinanceReceiptsIdPage.tsx` and query-driven `page.tsx` route entry | `mocks/admin_finance_receipts.scenarios.ts` | Expanded detail is shown for the primary fixture; other known list records show only the fields present in their list fixture. Unknown IDs remain not-found. |
| Currency and calendar date display | List and detail components | `utils/AdminFinanceReceiptsFormat.ts` | All amount and date presentation uses module-local formatters. |
| Print / WhatsApp preview | List/detail action handlers | `utils/AdminFinanceReceiptsThermalPrint.ts`, `utils/AdminFinanceReceiptsWhatsApp.ts` | Uses translated field labels and visible popup failure feedback; demo data is not a stored payment proof. |
| Locale and async state | Module route files and UI | English/Hindi locale JSON catalogs | Static key-set parity verified; host route/locale loading is not dynamically verified. |

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_finance/finance_receipts`.
- Physical route owner: `admin_finance/finance_receipts/page.tsx`.
- Canonical submodule URL configuration: `config/admin_finance_receipts.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract
API service files (0):
- None in the current physical module tree.

No live receipt API adapter is present. `ADMIN_FINANCE_RECEIPTS_API` is empty and visible list/detail records originate from source-local demo fixtures. No receipt persistence contract is inferred.

Only local adapter callsites, runtime schemas and source fixtures support frontend expectations. Synthetic mock success is not proof of a live backend contract. Missing server semantics are `CONTRACT_MISSING` / `NOT_VERIFIED`, not assumptions.

## 5. Query Key Registry

- Canonical registry: `api/admin_finance_receipts.query_keys.ts`.
- Export: `ADMIN_FINANCE_RECEIPTS_QUERY_KEYS`.
- Root namespace: `admin_finance_receipts`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory
No receipt creation or payment mutation is implemented. Print and WhatsApp actions are previews based on the supplied demo fixture.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (0):

- None found in the local source closure.

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

Accessibility-related source files (3):

- `components/AdminFinanceReceiptsIdPage.tsx`
- `components/AdminFinanceReceiptsPage.tsx`

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
Canonical route remains `/admin/admin_finance/finance_receipts`. This RBG does not rename the route, introduce a new route leaf, migrate backend data, or alter persistence. The current UI/API contract evidence is summarized in Section 4; any host deployment rollback or server migration is outside the supplied ZIP scope.

## 16. Test Coverage Map
Current module-local test files (3):
- `tests/AdminFinanceReceiptsFormatAndPrint.test.tsx`
- `tests/AdminFinanceReceiptsPageSearchAccessibility.test.tsx`

The source tests are included, but runtime execution is `DEFERRED_TO_HOST_RUNTIME` until this package is provided with its declared peer/development dependencies and host integrations. Static architecture checks are reported separately; they do not imply Vitest, semantic typecheck, lint, format, build or browser test success.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness
Mock/fixture/handler files (1):
- `mocks/admin_finance_receipts.scenarios.ts`

Locale catalogs (2):
- `locales/admin_finance_receipts_en.json`
- `locales/admin_finance_receipts_hi.json`

Test/harness files (5):
- `tests/AdminFinanceReceiptsFormatAndPrint.test.tsx`
- `tests/AdminFinanceReceiptsPageSearchAccessibility.test.tsx`

The harness renders active, empty, server-error, timeout and unauthorized scenarios using module-local test-only presentation. MSW fixtures are test evidence only and are not a replacement for live API verification.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_finance/finance_receipts/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_finance_receipts.url_config.ts`.
## 22. Deliverables & Version History
V35 — Execution Group 02 (RBG 6–10), static source repair. Physical inventory and UI data mapping refreshed from the current supplied working tree. The exact host Git commit is unavailable in the supplied scope. Group 02 is packaged as an intermediate partial ZIP; runtime-dependent checks are explicitly deferred.

## Standalone Portability Artifacts

- Host boundary declarations: `contracts/host-stubs.d.ts`. These are minimal fallback declarations, not proof that the entire host package compiles in isolation.
- Canonical URL/API contract: the module-owned `config/admin_finance_receipts.url_config.ts` exports typed `_ROUTES` and `_API` contracts; no re-export-only facade is used.
- Canonical locale folder: `locales/`, with English/Hindi leaf-key parity verified statically.
- Standalone test harness: `tests/` contains the standalone harness and scenario vocabulary in `AdminFinanceReceiptsHarness.tsx`; its scenario test remains in `AdminFinanceReceiptsHarness.test.tsx`.
- Static architecture checks are run on the packaged source. Full portability / semantic compile is `NOT_VERIFIED` because declared peer dependencies and host infrastructure are not installed in this execution environment.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 3 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 CSS Migration Outcome (2026-10-29)

- The prior Finance-owned feature stylesheet has been removed after its consumed rules were translated into semantic Tailwind utility classes in the owning components. The owning layout no longer imports a feature stylesheet.
- Business styling remains inside this autonomous leaf; global `globals.css` contains only the central semantic token definitions and approved zero-business primitives.
- Source checks `check:feature-styles`, `check:feature-styles:negative`, and `check:finance-style-ownership` pass on the current tree. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_finance_receipts.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **3**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
