
---
feature: "admin_settings_profile"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-30"
last_verified_commit: "NOT_VERIFIED_IN_HOST_REPOSITORY"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 4 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.
# Settings Profile — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_settings/settings_profile` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_settings/settings_profile`.


Component files (`components/`, 4 files):
- `AdminSettingsProfileEditForm.tsx`
- `AdminSettingsProfileReadOnlyPanels.tsx` (overview, history and session view states)
- `AdminSettingsProfilePasswordForm.tsx`
- `AdminSettingsProfileUnsavedChangesDialog.tsx`
Hook files (`hooks/`, 1 file):
- `useAdminSettingsProfileUnsavedChangesGuard.ts`
API service files:
- None found in the current physical module tree.
State files:
- None found in the current physical module tree.
Schema files:
- `schemas/AdminSettingsProfileSchema.ts`
Canonical type declarations live in `types/AdminSettingsProfileTypes.ts`. The navigation registry, forms, confirmation dialog, view-switched read-only panel and standalone harness consume its narrow, module-owned interfaces.

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_settings/settings_profile`.
- Physical route owner: `admin_settings/settings_profile/page.tsx`.
- Canonical submodule URL configuration: `config/admin_settings_profile.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (0):
- None found in current source closure. The query-key factory is a reserved namespace only; no live API behavior is implied.

Observed API URL literals from the local API/config source closure:

Schema files (1):
- `schemas/AdminSettingsProfileSchema.ts`

Canonical type declarations live in `types/AdminSettingsProfileTypes.ts`. The navigation registry, forms, confirmation dialog, view-switched read-only panel and standalone harness consume its narrow, module-owned interfaces.

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical namespace registry: `api/admin_settings_profile.query_keys.ts` (`ADMIN_SETTINGS_PROFILE_QUERY_KEYS`, reserved namespace).
- The registry exposes the standard `all`, `lists`, `list(filters)`, `details`, and `detail(resourceId)` factory shape.
- Source audit found no active TanStack Query consumer in this module closure. This is a reserved namespaced key contract only; it does not establish a live API endpoint, response DTO, query, or cache-invalidation flow.
- Do not add consumers or imply backend behavior until the module API/query contract is verified.
Canonical file: `api/admin_settings_profile.query_keys.ts`
Export: `ADMIN_SETTINGS_PROFILE_QUERY_KEYS`
Root namespace: `admin_settings_profile`


## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (0 verified):

- No dedicated role/permission enforcement file is present in the physical module tree. This is not evidence that the host/backend lacks authorization; the host and backend are outside this module-only proof boundary.

Do not infer authorization from the presence or absence of UI controls; backend authorization remains authoritative.

## 8. State Ownership

Hooks (1):

- `hooks/useAdminSettingsProfileUnsavedChangesGuard.ts`

The route component owns the single-use `view` query-parameter state directly; the duplicate one-use hook was consolidated without changing query semantics. Canonical type declarations remain in `types/AdminSettingsProfileTypes.ts`.

State/store files (0):

- None found in the local source closure.

API/cache ownership stays with the existing local query/API layer. Do not copy server responses into client UI state as the primary source.

## 9. Offline and Reconnect Behavior

Only preserve offline/reconnect behavior explicitly implemented in the local source closure. No new offline guarantees are added. Missing behavior remains documented as not evidenced.
## 10. Security and PII Rules

Sensitive-data/masking evidence files (0):

- None found in the local source closure.

Do not log secrets, tokens, credentials, or unnecessary PII. Preserve masking and permissions in the source closure; absent evidence is not a security guarantee.

### Password visibility and draft-loss safety (current source)

- The password validation draft provides independently controlled show/hide buttons for current password, new password, and confirmation fields. Accessible button labels are localized in `locales/admin_settings_profile_en.json` and `locales/admin_settings_profile_hi.json`.
- Profile edit/password forms report React Hook Form dirty state to the profile page. Dirty drafts trigger a feature-local confirmation dialog before profile tab changes or same-origin anchor navigation and use `beforeunload` for browser exits.
- The profile form remains validation-only: no password or profile mutation is implied, because the host-authentication/profile-persistence contracts are not supplied. The guard covers eligible same-origin anchor clicks, beforeunload, and a source-level back/forward restoration path before showing the localized confirmation. Navigation initiated by external code that bypasses this module remains outside this hook’s interception scope; browser-history ordering requires host-runtime verification.

## 11. Accessibility Requirements

Accessibility-related UI files (4 physical component files plus the route page):

- `components/AdminSettingsProfileEditForm.tsx`
- `components/AdminSettingsProfileReadOnlyPanels.tsx` (overview, history and session view states)
- `components/AdminSettingsProfilePasswordForm.tsx`
- `components/AdminSettingsProfileUnsavedChangesDialog.tsx`
- `page.tsx` (route navigation and inline 2FA/security views)

The two-factor and security-preference panels are inline sections of `page.tsx` (canonical route entry and page component); separate `AdminSettingsProfileSecuritySettingsPanel.tsx`, `AdminSettingsProfileTwoFactorPanel.tsx`, and `AdminSettingsProfileUnavailableState.tsx` files are not present. Preserve labels, keyboard behavior, focus restoration, reduced-motion safeguards, and semantic status/error messaging present in source. This inventory is not a browser accessibility pass.

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

Canonical route: `/admin/admin_settings/settings_profile`. The refactor preserves the existing canonical URL and its existing `view` query parameter values. No route migration, legacy URL retirement, or compatibility redirect was introduced. Backend API endpoints and payload contracts are unchanged.
## 16. Test Coverage Map

Current test files (3), verified from the physical module tree:
- `tests/AdminSettingsProfileNonMockRegressionSuite.test.tsx` (includes existing form, fixture, locale, view and unsaved-navigation regression assertions)
- `tests/AdminSettingsProfileUnavailableState.test.tsx`
- `tests/AdminSettingsProfileUnsavedChangesGuard.test.tsx`

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/scenario files (2):
- `mocks/AdminSettingsProfileFixtures.ts`
- `mocks/scenarios/admin_settings_profile.scenarios.ts`

No separate MSW handler file exists; `ADMIN_PROFILE_MSW_HANDLERS` is intentionally empty because no profile API endpoint is verified in the supplied contract.

Locale catalogs (2):
- `locales/admin_settings_profile_en.json`
- `locales/admin_settings_profile_hi.json`

Test and harness files (5 physical files):
- `tests/AdminSettingsProfileNonMockRegressionSuite.test.tsx`
- `tests/AdminSettingsProfileUnavailableState.test.tsx`
- `tests/AdminSettingsProfileUnsavedChangesGuard.test.tsx`
- `tests/harness/AdminSettingsProfileHarness.tsx`
- `tests/harness/bootstrap.ts`

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_settings/settings_profile/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_settings_profile.url_config.ts`.
## 22. Deliverables & Version History

V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. RBG-01 refactor preserves the original route and current `view` query values. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL registry: `config/admin_settings_profile.url_config.ts` owns the existing canonical route value and navigation metadata; the route string was not changed.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.


## UI Data Requirements Mapping (Group 04 re-audit)

| UI area | Source evidence | Data contract status | Handling rule |
|---|---|---|---|
| Main list / overview | Existing component, local fixture and adapter files | Source-derived; live backend contract must be verified in host | Do not infer missing fields or endpoints |
| Filters / tabs / query view | Existing route/query-state source | UI behavior source-observed | Preserve current route and query semantics |
| Detail / edit forms | Existing form/schema source where present | Validate only fields defined by supplied schema | Preserve unsaved edits and show localized validation feedback |
| Loading / empty / error states | Existing route boundaries and locale files | Source-derived; host namespace integration not runtime-verified | Keep states accessible and fail closed on contract gaps |
| Mutations / authorization | No additional host contract inferred by this re-audit | NOT_VERIFIED unless explicit adapter/schema exists | Do not invent endpoints, DTOs, persistence or permissions |

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 note (superseded by the inventory above):** earlier source versions recorded 26–31 files and used exception-review language. The referenced five-gate review CSV is absent from the supplied archive, so no exception is assumed. The current physical tree is at 25 files after evidence-based in-module consolidation of read-only panels and URL state; no independent profile submodule was invented because the available contract does not prove a separate backend entity/API lifecycle. The five-gate criteria remain route/navigation destination, distinct lifecycle/state boundary, healthy granularity without nano-modules, standalone testability/mockability, and alignment to a verified backend entity/aggregate. Reopen a sibling-module split only when source evidence demonstrates all applicable gates.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_settings_profile.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- ``page.tsx` owns the single-use URL-backed tab state and `hooks/` contains `useAdminSettingsProfileUnsavedChangesGuard.ts`. `api/` contains the required canonical query-key registry only; no profile API service or verified profile endpoint is supplied. No active query consumer is confirmed, and folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## RBG 1 repair notes (2026-10-30)

- The profile password visibility, unsaved-change dialog, and phone validation messages are nested under `ADMIN_PROFILE`, matching component namespace lookup. English and Hindi catalogs carry the same keys.
- `useAdminSettingsProfileUnsavedChangesGuard` now covers browser `beforeunload`, eligible same-origin anchor navigation, and a source-level back/forward restoration path with a confirmation callback. Programmatic navigation outside this module and browser runtime behavior remain subject to host verification.
- Scenario vocabulary is owned by `mocks/scenarios/admin_settings_profile.scenarios.ts`; component prop types no longer import from the tests directory. The eight scenario labels remain transport/mock harness states, not proof of a profile backend API.
- `ERROR_PHONE_INVALID` distinguishes format errors from required and overlength validation messages.
- `error.tsx` uses the existing `ADMIN_PROFILE.ROUTE_TRY_AGAIN` key; both boundary locales provide it alongside the loading/error title and description keys.
- The structure finding is now reduced to the 25-file hard ceiling by the view-state and activity-presentation consolidation described above. This source-level closure is not a host-runtime pass; browser history behavior remains `DEFERRED_TO_HOST_RUNTIME`.


## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **4**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
