---
feature: "admin_members_students"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_VERIFIED_IN_HOST_REPOSITORY"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 2 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Members Students — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_members/members_students` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_members/members_students`.


Component files:
- `AdminMembersStudentsHeaderSection.tsx`
- `AdminMembersStudentsView.tsx`
Hook files:
- `useAdminMembersStudentsColumnDefinitions.tsx`
- `useAdminMembersStudentsMain.tsx`
API service files:
- `admin_members_students_api.ts`
State files:
- None found in the current physical module tree.
Schema files:
- `AdminMembersStudentsApiSchema.ts`
Type files:
- `AdminMembersStudentsTypes.ts`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_members/members_students`.
- Physical route owner: `admin_members/members_students/page.tsx`.
- Canonical submodule URL configuration: `config/admin_members_students.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (1):
- `api/admin_members_students_api.ts`

Verified live API endpoint: **none supplied** (`CONTRACT_MISSING`). The pre-migration Students config reused `/admin/admin_members/members_students` as both the Next.js UI route and the API request path. That collision has been removed; the live API adapter now fails closed before transport until an authoritative endpoint/request/response contract is supplied. No likely endpoint has been guessed.

### API client callsites (source-derived)

- `api/admin_members_students_api.ts` checks `ADMIN_STUDENTS_API_ENDPOINTS.LIST`; the current value is `null`, so `fetchAdminStudents()` raises `AdminStudentsApiContractMissingError` without calling `apiFetch`.
- The UI page is `/admin/admin_members/members_students`; it is never treated as a backend API endpoint.
- `mocks/AdminMembersStudentsMSWHandlers.ts` exports an empty handler list intentionally. A handler on the UI route would conceal the contract defect.

Schema files (1):
- `schemas/AdminMembersStudentsApiSchema.ts`

Type files (1):
- `types/AdminMembersStudentsTypes.ts`

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical registry: `api/admin_members_students.query_keys.ts`.
- Export: `ADMIN_MEMBERS_STUDENTS_QUERY_KEYS`.
- Root namespace: `admin_members_students`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- `hooks/useAdminMembersStudentsMain.tsx`

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

Mutation evidence files (1):

- `hooks/useAdminMembersStudentsMain.tsx`

These files contain source patterns associated with mutations; review their actual call sites for the authoritative operation inventory.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (1):


These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (2):

- `hooks/useAdminMembersStudentsMain.tsx`
- `hooks/useAdminMembersStudentsColumnDefinitions.tsx`

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

Accessibility-related source files (6):

- `components/AdminMembersStudentsView.tsx`

Preserve labels, keyboard behavior, focus restoration, reduced-motion safeguards, and semantic status/error messaging present in source. This inventory is not a browser accessibility pass.

## 12. Background Tasks

Background-task evidence files (0):

- None found in the local source closure.

No timer, polling cadence, WebSocket, or background worker is introduced by this repair. Any listed source occurrence must retain its existing host contract.

## 13. Feature Flags

- `hooks/useAdminMembersStudentsMain.tsx` consumes `isFrontendDemoModeEnabled()` from `frontend_admin/lib/runtimeFeatures.ts`.
- The existing flag resolves true only when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_FRONTEND_DEMO_MODE === 'true'`.
- Demo fixtures are only used while this flag is true; live mode does not fabricate records or make requests to an unverified API path.

## 14. Cache Invalidation

Cache-invalidation/query-state evidence files (1):

- `hooks/useAdminMembersStudentsMain.tsx`

Preserve source-declared invalidation/reconciliation behavior. Do not invent query keys or cache invalidation for undocumented mutations.

## 15. Migration and Rollback

Canonical route: `/admin/admin_members/members_students`. Legacy URLs are intentionally retired; no compatibility aliases are provided. The previously conflated UI/API path was removed from live transport. The correct Students API endpoint and DTO remain `CONTRACT_MISSING`; no backend contract was changed or invented.
## 16. Test Coverage Map

Current test files (9), refreshed from the physical module tree:

These paths establish test inventory, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E results are recorded only when actually run. Current runtime checks must be marked `DEFERRED_TO_HOST_RUNTIME` if host dependencies or a running application are unavailable.

## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

The Students list endpoint/request/response DTO is `CONTRACT_MISSING`. Live requests fail closed before transport. The authoritative branch identity/tenant scope, pagination semantics, mutation APIs, permissions and session behavior are also not proven by this frontend-only source. Demo records are synthetic, schema-validated, and isolated from live query keys.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (3):
- `mocks/admin_members_students.scenarios.ts` — synthetic display records used only in explicit demo mode
- `mocks/AdminMembersStudentsMSWHandlers.ts` — intentionally empty until the real API endpoint contract exists; it must not intercept the UI route

Locale catalogs (2):
- `locales/admin_members_students_en.json`
- `locales/admin_members_students_hi.json`

Test and harness files (11):

Run the module's Vitest/component tests from the host project with approved dependencies and shared test setup. Mock fixtures are evidence of frontend-expected shapes only, not proof of live backend support.

## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_members/members_students/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_members_students.url_config.ts`.
## 22. Deliverables & Version History

V34 → RBG-03: canonical route/API boundary repair. Students UI detail stays on the canonical route using `view=detail&id`; live API request is fail-closed pending a verified contract; demo records load locally only under the existing explicit demo flag. Runtime tests remain `DEFERRED_TO_HOST_RUNTIME` until host dependencies/runtime are available.

## RBG-01 Portability Artifacts

- Host declaration boundary: `contracts/host-stubs.d.ts` (no speculative ambient shims are added).
- Submodule URL registry: `config/admin_members_students.url_config.ts` exports UI routes only. The live Students API endpoint is represented as missing rather than borrowing the UI route.
- Canonical locale folder: `locales/`; existing English/Hindi catalog JSON content was preserved during the folder migration.


## UI Data Requirements Mapping (Group 04 re-audit)

| UI area | Source evidence | Data contract status | Handling rule |
|---|---|---|---|
| Main list / overview | Existing component, local fixture and adapter files | Source-derived; live backend contract must be verified in host | Do not infer missing fields or endpoints |
| Filters / tabs / query view | Existing route/query-state source | UI behavior source-observed | Preserve current route and query semantics |
| Detail / edit forms | Existing form/schema source where present | Validate only fields defined by supplied schema | Preserve unsaved edits and show localized validation feedback |
| Loading / empty / error states | Existing route boundaries and locale files | Source-derived; host namespace integration not runtime-verified | Keep states accessible and fail closed on contract gaps |
| Mutations / authorization | No additional host contract inferred by this re-audit | NOT_VERIFIED unless explicit adapter/schema exists | Do not invent endpoints, DTOs, persistence or permissions |

Repair note (2026-10-28): Query-key registry `admin_members_students_query_keys` is co-located with `admin_members_students_api.ts` because both define the same feature entity-family API/cache contract; all imports point to the API contract file.

Repair note (2026-10-28): Fixture declarations are consolidated into `mocks/admin_members_students.scenarios.ts`; module-owned MSW handlers remain separate to avoid pulling MSW into runtime/demo consumers.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 2 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_members_students.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **2**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
