
---
feature: "admin_members_directory"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "not-supplied-in-archive"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 4 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Members Directory — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_members/members_directory` (V35 Group 03 repair boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; physical source path: `frontend_admin/admin_members/members_directory/page.tsx`; canonical UI route: `/admin/admin_members/members_directory`.


### Component files
- `AdminMembersDirectoryMemberForm.tsx`
- `AdminMembersDirectoryMemberTable.tsx`
- `AdminMembersDirectorySecondaryViews.tsx`
- `AdminMembersDirectoryView.tsx`
### Hook files
- `useAdminMembersDirectoryMain.ts`
- `useAdminMembersDirectoryUnsavedChangesGuard.ts`
### API/contract files
- None found in the current physical module tree.
### Type files
- `types/AdminMembersDirectoryComponentTypes.ts`
### Schema files
- `schemas/AdminMembersDirectorySchema.ts`
### Utility files
- `utils/AdminMembersDirectoryExportUtils.ts`
### Mock/fixture files
- `AdminMembersDirectoryFixtures.ts`
### Test files
- `AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `AdminMembersDirectoryCoreRegressionSuite.test.tsx`
### Configuration files
- `admin_members_directory.url_config.ts`
### Locale files
- `admin_members_directory_en.json`
- `admin_members_directory_hi.json`
### Host contract files
- `contracts/host-stubs.d.ts`

### Framework route and state entries
- `error.tsx`
- `loading.tsx`
- `page.tsx`

### Root documentation and remaining artifacts
- `admin_members_directory_features.md`
- `admin_members_directory_forbidden.md`
- `admin_members_directory_theme_contract.md`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_members/members_directory`.
- Physical route owner: `admin_members/members_directory/page.tsx`.
- Canonical submodule URL configuration: `config/admin_members_directory.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (0):
- None found in current source closure.

Observed API URL literals from the local API/config source closure:

Schema files (1):
- `schemas/AdminMembersDirectorySchema.ts`

Type files (1):
- `types/AdminMembersDirectoryComponentTypes.ts`

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

**UI Data Requirements Mapping (V35 source evidence)**

| Visible field/state | Source/contract | Nullable/fallback rule | Verification status |
|---|---|---|---|
| Member name, email, phone, plan, status, expiry | `schemas/AdminMembersDirectorySchema.ts` and member fixtures | Optional/empty values must use the module formatter/display fallback; do not derive status not declared by source | `VERIFIED` for local fixture/schema; live DTO shape `NOT_VERIFIED` |
| Categories, departments, renewal action, documents, import/export and legacy plans deep link | Parent-owned secondary views and renewal action; `?view=plans` compatibility card links to the verified canonical `ADMIN_ROUTES.MEMBERS_PLANS` destination. | Preserve current parent query values; plan CRUD is owned by `admin_members/members_plans`. | `VERIFIED` for local view routing and canonical link; unsupported external retrieval/mutations remain `CONTRACT_MISSING`. |
| KPI values | `AdminMembersDirectoryView.tsx` and demo member/renewal state | Derive available totals from fixtures; show em dash where sample date semantics are not supplied | `DERIVED` from in-scope demo entities |


**SOURCE_CONFLICT — semantic text-color utility naming:** The supplied UI/UX design maps `text-primary` to `--text-primary` and `text-danger` to `--danger-text`, while the shipped Tailwind v4 `globals.css` maps `--color-primary` to `--primary`, `--color-text-primary` to `--text-primary`, `--color-danger` to `--danger`, and `--color-danger-text` to `--danger-text`. Under those token names, the generated utilities are `text-primary` (primary/gold) versus `text-text-primary` (foreground), and `text-danger` (solid danger) versus `text-danger-text` (status text). `tailwind.config.ts` repeats the same color-key naming. The design document also uses `text-primary` for gold links/active states, so changing the utility globally would change existing UI semantics. No global token remapping is applied as part of this focused role-module repair. This remains `SOURCE_CONFLICT` with direct evidence in `globals.css` (`@theme inline`), `tailwind.config.ts`, and `WEB_FRONTEND_UI_UX_DESIGN.md`; a coordinated design-system decision is required before a global rename.

## 5. Query Key Registry

- Canonical registry: `config/admin_members_directory.url_config.ts`.
- Export: `ADMIN_MEMBERS_DIRECTORY_QUERY_KEYS`.
- Root namespace: `admin_members_directory`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None found outside registry declarations. This is a stable key declaration, not evidence that a live query or endpoint is implemented.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.
Canonical file: `api/admin_members_directory.query_keys.ts`
Export: `ADMIN_MEMBERS_DIRECTORY_QUERY_KEYS`
Root namespace: `admin_members_directory`


## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC source-reference files (4 listed):

- `components/AdminMembersDirectoryMemberTable.tsx`
- `components/AdminMembersDirectoryView.tsx`
- `components/AdminMembersDirectoryView.tsx`
- `hooks/useAdminMembersDirectoryMain.ts`

These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (1):

- `hooks/useAdminMembersDirectoryMain.ts`

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

Accessibility-related component files (6 physical files):

- `components/AdminMembersDirectoryView.tsx`
- `components/AdminMembersDirectoryMemberForm.tsx`
- `components/AdminMembersDirectoryMemberTable.tsx`
- `components/AdminMembersDirectorySecondaryViews.tsx`
- `components/AdminMembersDirectoryView.tsx`
- `components/AdminMembersDirectoryView.tsx`

Preserve labels, keyboard behavior, focus restoration, reduced-motion safeguards, and semantic status/error messaging present in source. This inventory is not a browser accessibility pass.

## 12. Background Tasks

Background-task evidence files (1):

- `utils/AdminMembersDirectoryExportUtils.ts`

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

Canonical route: `/admin/admin_members/members_directory`. The old URL is intentionally retired; no compatibility alias is provided. Backend API endpoints and payload contracts are unchanged.
## 16. Test Coverage Map

Current test files (4), verified from the physical module tree:
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/scenario files (2):
- `mocks/AdminMembersDirectoryFixtures.ts` (exports `ADMIN_MEMBERS_MSW_HANDLERS`; no separate handler file exists)
- `mocks/scenarios/admin_members_directory.scenarios.ts`
- The canonical scenario module owns the UI-harness scenario union; `tests/harness/bootstrap.ts` re-exports it rather than owning production-consumed types.

Locale catalogs (2):
- `locales/admin_members_directory_en.json`
- `locales/admin_members_directory_hi.json`

Test and harness files (6):
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/AdminMembersDirectoryCoreRegressionSuite.test.tsx`
- `tests/harness/bootstrap.ts` (scenario labels and test harness)
- `tests/harness/bootstrap.ts`

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_members/members_directory/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_members_directory.url_config.ts`.
## V42 CSS Migration Outcome (2026-10-29)

- The prior feature-local stylesheet has been removed after the consumed styles were translated into semantic Tailwind utilities in the owning components. No feature stylesheet import remains.
- Existing routes, event handlers, form fields, and business behavior were preserved; the CSS change is visual-layer-only.
- Static migration and negative-regression checks pass. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## 22. Deliverables & Version History
- **V43/RBG31–35 route-navigation follow-up:** `useAdminMembersDirectoryUnsavedChangesGuard` owns the browser-exit and eligible same-origin anchor guard for dirty, non-submitting drafts. The form's existing localized discard/keep-editing confirmation now receives a pending internal destination; confirmed discard resets the form and continues with Next.js `router.push`. Modified/new-window/download/external links remain unaffected. Co-located hook regression tests cover dirty/clean navigation and browser-exit behavior; execution is `DEFERRED_TO_HOST_RUNTIME`.


V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL registry: `config/admin_members_directory.url_config.ts` exports UI routes only. Source-backed Members API paths live separately in `config/admin_members_directory.url_config.ts`; the Members MSW handler deliberately returns 501 until the response DTO is supplied.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.

## V33 internal view boundary
The active Member navigation keeps directory, category/department, import/export, documents and status views. Gym-specific Plans and Renewals are not exposed as active Member navigation destinations; their source components and data are retained as legacy/internal code pending an approved Library requirement. Renewal history within an individual member detail remains a distinct historical view.

Inventory correction (2026-10-30): current recursive tree contains 25 files (20 TS/TSX/JS/JSX/MJS files; 4 component TSX/JSX files). Use the source tree, current route/config files and this inventory as the current evidence; any prior physical count in historical notes is superseded.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 note (superseded by the current inventory above):** the earlier version recorded 28 files and used `COHESIVE_EXCEPTION_REVIEWED_NO_SPLIT_EVIDENCE`. The cited five-gate review CSV is absent from this supplied archive, so this historical phrase is not approval under the current architecture ceiling. The current 30-file tree must be repaired by a genuine evidence-backed operational boundary; count-only deletion or arbitrary nesting is prohibited. The five-gate criteria remain route/navigation destination, distinct lifecycle/state boundary, healthy granularity without nano-modules, standalone testability/mockability, and alignment to a verified backend entity/aggregate.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_members_directory.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` contains `useAdminMembersDirectoryMain.ts` and `useAdminMembersDirectoryUnsavedChangesGuard.ts`. `api/` contains the required canonical query-key registry only; no separate feature API client/service is present in the physical module tree. No active query consumer is confirmed, and folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.

## V42 RBG16–20 Semantic Styling Closure

- The current source uses semantic Tailwind utilities for the repaired presentation surfaces; the earlier unstyled legacy class hooks were replaced without deleting controls, handlers, forms, tables, dialogs, or demo-mode guards.
- Styling resolves through the global design-token map. No new feature stylesheet, cross-submodule business dependency, or inline CSS style object was added.
- Static migration and negative-regression gates now reject orphaned `ss-*`, `sys-*`, `mgr-table-wrapper`, and `ad-page-animate` presentation hooks. Browser visual parity remains `DEFERRED_TO_HOST_RUNTIME`.


## RBG 3 repair notes (2026-10-29)

- `ADMIN_MEMBERS_MSW_HANDLERS` remains defined in `mocks/AdminMembersDirectoryFixtures.ts`, and regression tests import it from that same file. There is no separate `AdminMembersDirectoryMembersMSWHandlers.ts` in the physical source tree.
- The top inventory is 30 files. The prior reference to `OVER25_FIVE_GATE_REVIEW.csv` does not establish an exception because that CSV is not present in the supplied source archive. The >25-file structural finding remains open until a genuine bounded-context refactor is supported by verified route/lifecycle evidence.


## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **4**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
