---
feature: "admin_communication_notification_center"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_SUPPLIED — archive has no verified Git commit metadata"
documentation_status: "current"
portability_score: "NOT_VERIFIED — source/static checks only; host typecheck, Vitest, lint, build and browser E2E are not yet executed"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 2 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# Communication Notification Center — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_communication/communication_notification_center` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_communication/communication_notification_center`.


Component files:
- `AdminCommunicationNotificationCenterPage.tsx`
- `AdminCommunicationNotificationCenterRoute.tsx`
Hook files:
- None found in the current physical module tree.
API service files:
- `admin_communication_notification_center_api.ts`
State files:
- None found in the current physical module tree.
Schema files:
- `AdminCommunicationNotificationCenterApiSchema.ts`
- `AdminCommunicationNotificationCenterSchema.ts`
Type files:
- `AdminCommunicationNotificationCenterTypes.ts`

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_communication/communication_notification_center`.
- Physical route owner: `admin_communication/communication_notification_center/page.tsx`.
- Canonical submodule URL configuration: `config/admin_communication_notification_center.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## 4. API Contract

Current API service files (1):
- `api/admin_communication_notification_center_api.ts`

No verified live backend contract was supplied for this isolated screen. The local API adapter has source-observed URL arguments, but the current notification-center page does not consume the adapter, and product intent/DTO/authorization are not verified. Treat its live connection as `CONTRACT_MISSING`; the values below are API-client arguments, not browser routes.

- `api/admin_communication_notification_center_api.ts` calls `apiFetch(ADMIN_COMMUNICATION_URLS.COMPLAINTS)` → `/communication/complaints`.
- `api/admin_communication_notification_center_api.ts` calls `apiFetch(ADMIN_COMMUNICATION_URLS.NOTICES)` → `/communication/notices`.

Schema files (2):
- `schemas/AdminCommunicationNotificationCenterApiSchema.ts`
- `schemas/AdminCommunicationNotificationCenterSchema.ts`

Type files (1):
- `types/AdminCommunicationNotificationCenterTypes.ts`

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical registry: `api/admin_communication_notification_center.query_keys.ts`.
- Export: `ADMIN_COMMUNICATION_NOTIFICATION_CENTER_QUERY_KEYS`.
- Root namespace: `admin_communication_notification_center`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (4):

- `schemas/AdminCommunicationNotificationCenterApiSchema.ts`
- `utils/AdminCommunicationNotificationCenterWhatsappPhoneUtils.ts`

These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (0):

- None found in the local source closure.

State/store files (0):

- None found in the local source closure.

An API adapter exists, but no query hook or server-state integration is present in the screen. Its data source remains deliberately disconnected until product intent and a verified DTO/permission contract are supplied; do not infer a live connection from test-only MSW fixtures.

## 9. Offline and Reconnect Behavior

Only preserve offline/reconnect behavior explicitly implemented in the local source closure. No new offline guarantees are added. Missing behavior remains documented as not evidenced.
## 10. Security and PII Rules

Sensitive-data/masking evidence files (0):

- None found in the local source closure.

Do not log secrets, tokens, credentials, or unnecessary PII. Preserve masking and permissions in the source closure; absent evidence is not a security guarantee.

## 11. Accessibility Requirements

Accessibility-related source files (1):

- `components/AdminCommunicationNotificationCenterPage.tsx`

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

Canonical route: `/admin/admin_communication/communication_notification_center`. The old URL is intentionally retired; no compatibility alias is provided. Backend API endpoints and payload contracts are unchanged.
## 16. Test Coverage Map

Current test files from the current physical module tree (execution not implied):
- `tests/AdminCommunicationNotificationCenterContracts.test.tsx`

These paths establish inventory only, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E are not claimed as passed.
## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

`CONTRACT_MISSING`: intended live notification-center API source, response DTO, authorization and tenant scope, persistence/mutation semantics, and pagination. Existing complaint/notice API adapters and MSW tests remain source artifacts but are not wired into this page because the supplied audit does not establish that product intent. No endpoint/field contract is invented.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (2):
- `mocks/AdminCommunicationNotificationCenterFixtures.ts`
- `mocks/AdminCommunicationNotificationCenterMSWHandlers.ts`

Locale catalogs (2):
- `locales/admin_communication_notification_center_en.json`
- `locales/admin_communication_notification_center_hi.json`

Test and harness files (3):
- `tests/AdminCommunicationNotificationCenterContracts.test.tsx`
- `tests/harness/AdminCommunicationNotificationCenterHarness.tsx`
- `tests/harness/bootstrap.ts`

Run these tests from the host package with the declared dependencies and test setup. Fixtures demonstrate frontend test contracts only; they do not prove live backend support. In this supplied environment, host execution is not claimed unless a command result is recorded in the Group 01 audit evidence.
## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_communication/communication_notification_center/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_communication_notification_center.url_config.ts`.
## V42 CSS Migration Outcome (2026-10-29)

- The prior feature-local stylesheet has been removed after the consumed styles were translated into semantic Tailwind utilities in the owning components. No feature stylesheet import remains.
- Existing routes, event handlers, form fields, and business behavior were preserved; the CSS change is visual-layer-only.
- Static migration and negative-regression checks pass. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## 22. Deliverables & Version History

V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## Group 01 Repair Notes

- Host declaration boundary: `contracts/host-stubs.d.ts`; its declarations describe host seams and do not replace host verification.
- Canonical URL config is module-owned and exports the current route contract. Backend endpoints and response models remain unverified unless listed in the verified contract below.
- No nested autonomous sub-module was created. This module still requires a five-gate boundary/route decision when its physical file count exceeds the architecture ceiling.
- The source archive does not contain Git commit metadata; no commit hash or runtime pass is asserted.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 disposition (superseded 2026-10-30):** the preceding v44 audit text described the frozen input tree, not this repaired tree. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 2 component TSX/JSX files), and the current file-ceiling status is COMPLIANT. Historical exception claims are not approval; no absent exception CSV is inferred. Preserve the five-gate boundary rule for any future topology decision.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_communication_notification_center.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
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
