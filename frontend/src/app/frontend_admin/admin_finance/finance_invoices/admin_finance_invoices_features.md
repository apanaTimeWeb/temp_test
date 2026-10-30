---
feature: "admin_finance_invoices"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_AVAILABLE_IN_SUPPLIED_SCOPE"
documentation_status: "updated-static-source-review-runtime-deferred"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 3 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Finance Invoices — Autonomous Submodule Specification

## 1. Scope and Non-Scope

**Role / business context:** Admin finance reviews issued invoices through a queryable list with search/status filtering, summary values, and query-driven invoice detail views. The supplied UI also offers print and WhatsApp preview actions for the invoice records represented by local demo fixtures.

**Included in this ZIP:** Local fixture-backed invoice list/detail display, status and search filtering, locale-aware date/currency presentation, printable and WhatsApp preview output with translated labels, visible error feedback for blocked popups, and source-level tests for formatting/route contracts. The existing local invoice API contract is empty; the UI must not claim that invoices are fetched or persisted by a live endpoint.

**Explicitly out of scope / not verified:** Invoice issuance, edits, payment marking, sending a real invoice through WhatsApp, backend persistence, and server-side authorization/tenant isolation. No backend endpoint or mutation is inferred from the page route or demo data.

**Boundary provenance:** This feature specification is derived from the supplied V34 ZIP and repaired V35 working copy. Host route registration and runtime behavior remain unverified in this isolated package.
## 2. Screen Inventory
Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_finance/finance_invoices`.

**Current physical inventory:** 25 files total, 11 TSX files, 3 component-category TypeScript files, 0 hook files, 0 API files, 0 schema files and 1 type files. Counts are derived from the supplied working tree, not from a host build.

Component files:
- `AdminFinanceInvoicesEmptyState.tsx`
- `AdminFinanceInvoicesIdPage.tsx`
- `AdminFinanceInvoicesPage.tsx`
Hook files:
- None in the current physical module tree.

API files:
- None in the current physical module tree.

Schema files:
- None found in the current physical module tree.
Type files:
- `types/AdminFinanceInvoicesTypes.ts`

**V35 static repair note:** User-facing date output uses `date-fns` locale patterns selected from the active document/browser locale; print and CSV helpers require explicit localized labels instead of English defaults. The standalone scenario harness has visible state-specific content, but its tests were not executed in this dependency-free ZIP environment.

### UI Data Requirements Mapping

| UI surface / behavior | Rendering source | Data / validation source | Evidence boundary |
|---|---|---|---|
| Invoice list, KPIs, search and status filter | `components/AdminFinanceInvoicesPage.tsx` | `mocks/admin_finance_invoices.scenarios.ts` | `invoiceNumber`, `studentName`, `studentId`, `invoiceDate`, `grandTotal`, `paymentMode`, and `paymentStatus` drive the visible demo list, KPI totals, filters and search. |
| Invoice detail | `components/AdminFinanceInvoicesIdPage.tsx` and query-driven `page.tsx` route entry | `mocks/admin_finance_invoices.scenarios.ts` | The primary detail uses the expanded fixture; other known IDs show only fields present in their list fixtures with a clear list-only notice. Unknown IDs remain not-found. |
| Currency and calendar dates | List and detail components | `utils/AdminFinanceInvoicesFormat.ts` | Display formatting is locale-aware and routed through local helpers. |
| Print and WhatsApp preview | Invoice list/detail action handlers | `utils/AdminFinanceInvoicesThermalPrint.ts`, `utils/AdminFinanceInvoicesWhatsApp.ts` | Uses fixture-provided fields and localized labels; popup failures show user-visible feedback. This is demo content, not invoice issuance. |
| Labels and failure feedback | Module components, `error.tsx`, `loading.tsx` | English/Hindi locale JSON catalogs | Locale key parity is verified statically; runtime namespace loading remains deferred. |

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_finance/finance_invoices`.
- Physical route owner: `admin_finance/finance_invoices/page.tsx`.
- Canonical submodule URL configuration: `config/admin_finance_invoices.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract
API service files (0):
- None in the current physical module tree.

No live invoice API adapter is present. `ADMIN_FINANCE_INVOICES_API` is empty; visible records originate from local demo fixtures. No backend DTO or persisted invoice contract is inferred.

Only local adapter callsites, runtime schemas and source fixtures support frontend expectations. Synthetic mock success is not proof of a live backend contract. Missing server semantics are `CONTRACT_MISSING` / `NOT_VERIFIED`, not assumptions.

## 5. Query Key Registry

- Canonical registry: `api/admin_finance_invoices.query_keys.ts`.
- Export: `ADMIN_FINANCE_INVOICES_QUERY_KEYS`.
- Root namespace: `admin_finance_invoices`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory
No invoice-creation, payment, issuance or persistence mutation is declared. Print/WhatsApp actions operate on demo records only.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (1):

- `mocks/admin_finance_invoices.scenarios.ts`

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

- `components/AdminFinanceInvoicesIdPage.tsx`
- `components/AdminFinanceInvoicesPage.tsx`

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
Canonical route remains `/admin/admin_finance/finance_invoices`. This RBG does not rename the route, introduce a new route leaf, migrate backend data, or alter persistence. The current UI/API contract evidence is summarized in Section 4; any host deployment rollback or server migration is outside the supplied ZIP scope.

## 16. Test Coverage Map
Current module-local test files (3):
- `tests/AdminFinanceInvoicesFormatAndPrint.test.tsx`
- `tests/AdminFinanceInvoicesPageSearchAccessibility.test.tsx`

The source tests are included, but runtime execution is `DEFERRED_TO_HOST_RUNTIME` until this package is provided with its declared peer/development dependencies and host integrations. Static architecture checks are reported separately; they do not imply Vitest, semantic typecheck, lint, format, build or browser test success.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness
Mock/fixture/handler files (1):
- `mocks/admin_finance_invoices.scenarios.ts`

Locale catalogs (2):
- `locales/admin_finance_invoices_en.json`
- `locales/admin_finance_invoices_hi.json`

Test/harness files (5):
- `tests/AdminFinanceInvoicesFormatAndPrint.test.tsx`
- `tests/AdminFinanceInvoicesPageSearchAccessibility.test.tsx`

The harness renders active, empty, server-error, timeout and unauthorized scenarios using module-local test-only presentation. MSW fixtures are test evidence only and are not a replacement for live API verification.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_finance/finance_invoices/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_finance_invoices.url_config.ts`.
## 22. Deliverables & Version History
V35 — Execution Group 02 (RBG 6–10), static source repair. Physical inventory and UI data mapping refreshed from the current supplied working tree. The exact host Git commit is unavailable in the supplied scope. Group 02 is packaged as an intermediate partial ZIP; runtime-dependent checks are explicitly deferred.

## Standalone Portability Artifacts

- Host boundary declarations: `contracts/host-stubs.d.ts`. These are minimal fallback declarations, not proof that the entire host package compiles in isolation.
- Canonical URL/API contract: the module-owned `config/admin_finance_invoices.url_config.ts` exports typed `_ROUTES` and `_API` contracts; no re-export-only facade is used.
- Canonical locale folder: `locales/`, with English/Hindi leaf-key parity verified statically.
- Standalone test harness: `tests/` contains the standalone harness and scenario vocabulary in `AdminFinanceInvoicesHarness.tsx`; its scenario test remains in `AdminFinanceInvoicesHarness.test.tsx`.
- Static architecture checks are run on the packaged source. Full portability / semantic compile is `NOT_VERIFIED` because declared peer dependencies and host infrastructure are not installed in this execution environment.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 3 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 CSS Migration Outcome (2026-10-29)

- The prior Finance-owned feature stylesheet has been removed after its consumed rules were translated into semantic Tailwind utility classes in the owning components. The owning layout no longer imports a feature stylesheet.
- Business styling remains inside this autonomous leaf; global `globals.css` contains only the central semantic token definitions and approved zero-business primitives.
- Source checks `check:feature-styles`, `check:feature-styles:negative`, and `check:finance-style-ownership` pass on the current tree. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_finance_invoices.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
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
