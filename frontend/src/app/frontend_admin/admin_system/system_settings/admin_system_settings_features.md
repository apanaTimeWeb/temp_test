---

## Shared primitive ownership
Generic tabs, cards, buttons, field primitives, empty states, dialog overlays, error boundaries, and KPI display primitives are owned by the role-wide `frontend_admin/components/ui/` layer. This submodule retains its form state, validation schema, category-specific fields, demo-mode guards, and localized business labels.

feature: "admin_system_settings"
owner_role: "admin"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-29"
last_verified_commit: "NOT_SUPPLIED — archive has no verified Git commit metadata"
documentation_status: "current"
portability_score: "NOT_VERIFIED — source/static checks only; host typecheck, Vitest, lint, build and browser E2E are not yet executed"
---

Current working-tree physical inventory (2026-10-30): 25 files total, 20 TS/TSX/JS/JSX/MJS files, 5 component TSX/JSX files. Current file-ceiling status: COMPLIANT (hard ceiling 25). Counts are recursive and measured from the repaired working tree.

# System Settings — Autonomous Submodule Specification

## 1. Scope and Non-Scope

Owner: `admin_system/system_settings` (canonical V34 target boundary).
## 2. Screen Inventory

Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_system/system_settings`.


Component files:
- `AdminSystemSettingsCanonicalDestinationCard.tsx`
- `AdminSystemSettingsNotificationsSection.tsx`
- `AdminSystemSettingsPageView.tsx`
- `AdminSystemSettingsRoute.tsx`
- `AdminSystemSettingsUpiSection.tsx`
Hook files:
- `useAdminSystemSettingsPage.ts`
API service files:
- `admin_system_settings_api.ts`
State files:
- None found in the current physical module tree.
Schema files:
- None found in the current physical module tree.
Type files:
- None found in the current physical module tree.

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_system/system_settings`.
- Physical route owner: `admin_system/system_settings/page.tsx`.
- Canonical submodule URL configuration: `config/admin_system_settings.url_config.ts`.
- No legacy URL aliases or compatibility redirects are retained. Active internal UI links must target the canonical route or another explicitly listed canonical submodule route.
- Query parameters may be used only for source-backed in-submodule views/actions; they do not create additional top-level modules.
- API-relative paths and backend endpoint contracts belong to Section 4 and MUST NOT be treated as browser UI routes. The host application's rewrites and server-side authorization cannot be verified from this isolated role package.

## UI Data Requirements Mapping

| UI field/surface | State/schema source | Status | Verified contract boundary |
|---|---|---|---|
| Branding compatibility view | Parent `?view=branding` resolves to a compatibility card linking to `admin_system/system_branding`. | `VERIFIED` for parent query resolution and canonical destination link. | This module no longer owns a duplicate branding form. External persistence remains `CONTRACT_MISSING`. |
| Late-fee compatibility view | Parent `?view=late-fee` resolves to a compatibility card linking to `admin_finance/finance_late_fees`. | `VERIFIED` for parent query resolution and canonical destination link. | The policy editor is owned by the existing finance late-fees module; no duplicate form remains here. Live persistence is `CONTRACT_MISSING`. |
| Auto-suspend compatibility view | Parent `?view=auto-suspend` resolves to a compatibility card linking to `admin_finance/finance_auto_suspend`. | `VERIFIED` for parent query resolution and canonical destination link. | The policy editor is owned by the existing finance auto-suspend module; no duplicate form remains here. Live scheduler behavior is `CONTRACT_MISSING`. |
| UPI/payment options | `upiId` and booleans for cash/UPI/card/bank acceptance. | `VERIFIED` for client state and validation. | No payment processor setup or backend payment mutation contract is supplied. |
| Notification API key | `apiKey` in form state; starts blank; masked by default. | `VERIFIED` for current client handling only. | No credential persistence, reveal-to-server, or live test-connection contract is supplied. Do not persist or log secrets. |

## 4. API Contract

Current API service files (1):
- `api/admin_system_settings_api.ts`

Observed API URL literals from the local API/config source closure:

### API client callsites (source-derived)

These expressions are used by the current frontend API adapter. Their resolved path below is classified as an API-client argument, not a browser route.

- `api/admin_system_settings_api.ts` calls `apiFetch(ADMIN_SYSTEM_SETTINGS_API.LIST)` → `/api/v1/admin/system`.

Schema files (0):
- None found in the current physical module tree.

Type files (0):
- None found in the current physical module tree.

Only fields and response semantics supported by the local API clients, runtime schemas, and documented contracts may be treated as verified. Missing behavior is `CONTRACT_MISSING`; do not infer backend DTOs, authorization, tenant isolation, persistence, pagination, or mutation semantics from UI labels or mock-only data.

## 5. Query Key Registry

- Canonical registry: `api/admin_system_settings.query_keys.ts`.
- Export: `ADMIN_SYSTEM_SETTINGS_QUERY_KEYS`.
- Root namespace: `admin_system_settings`; every resource-specific key must retain resource identity.
- Factory shape: `all`, `lists`, `list(filters)`, `details`, `detail(resourceId)`.

Observed current-source consumers:
- None confirmed in the current module source audit beyond the registry declaration; no active query behavior is implied.

This section documents only source-backed registry declarations and the consumers recorded above. It does not establish an API endpoint, response DTO, or cache-invalidation behavior where the module contract is missing.

## 6. Mutation Inventory

Mutation evidence files (0):

- None found in the local source closure.

No mutation pattern was found in the local API adapter/hook closure. No mutation is added by this structural repair.

## 7. Permissions and Role Rules

Permission/RBAC evidence files (1):

- `components/AdminSystemSettingsRoute.tsx`

This source evidence describes route/UI gating only; it is not proof of server-side authorization.

These are source search hits, not proof of server authorization. Preserve existing UI visibility behavior; backend authorization remains authoritative.

## 8. State Ownership

Hooks (1):

- `hooks/useAdminSystemSettingsPage.ts`

State/store files (0):

- None found in the local source closure.

API/cache ownership stays with the existing local query/API layer. Do not copy server responses into client UI state as the primary source.

## 9. Offline and Reconnect Behavior

Only preserve offline/reconnect behavior explicitly implemented in the local source closure. No new offline guarantees are added. Missing behavior remains documented as not evidenced.
## 10. Security and PII Rules

Sensitive-data/masking evidence files (1):


Do not log secrets, tokens, credentials, or unnecessary PII. Preserve masking and permissions in the source closure; absent evidence is not a security guarantee.

## 11. Accessibility Requirements

Accessibility-related source files (17):

- `components/AdminSystemSettingsPageView.tsx`
- `components/AdminSystemSettingsRoute.tsx`
- `components/AdminSystemSettingsAutoSuspendSection.tsx`
- `components/AdminSystemSettingsBrandingSection.tsx`
- `components/AdminSystemSettingsGeneralSection.tsx`
- `components/AdminSystemSettingsLateFeeSection.tsx`
- `components/AdminSystemSettingsNotificationsSection.tsx`
- `components/AdminSystemSettingsUpiSection.tsx`

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

Canonical route: `/admin/admin_system/system_settings`. The old URL is intentionally retired; no compatibility alias is provided. Backend API endpoints and payload contracts are unchanged.
## 16. Test Coverage Map

Current test files from the current physical module tree (execution not implied):

These paths establish inventory only, not successful execution. Dependency-backed Vitest/typecheck/lint/build and browser E2E are not claimed as passed.
## 17. Architecture Exceptions

The domain-level `page.tsx` remains the route/navigation shell; domain URL config and parent documentation remain at the domain root. Shared dependencies are copied locally to enforce sibling isolation (WET rule).
## 18. Known Contract Gaps

No backend contract was modified or invented. Any missing endpoint, DTO, amount unit, pagination envelope, permission, or session contract remains explicitly deferred to the host contract.
## 19. Rule Compliance Checklist

[x] Domain-prefixed submodule exists. [x] Local documentation trio exists. [x] Code moved into canonical local categories. [ ] Dependency-backed tests/typecheck/build/browser verification — run in host runtime before production release.
## 20. Standalone Run, Mock & Test Harness

Mock/fixture/handler files (2):
- `mocks/AdminSystemSettingsMSWHandlers.ts`

Locale catalogs (2):
- `locales/admin_system_settings_en.json`
- `locales/admin_system_settings_hi.json`

Test and harness files (12):

Run these tests from the host package with the declared dependencies and test setup. Fixtures demonstrate frontend test contracts only; they do not prove live backend support. In this supplied environment, host execution is not claimed unless a command result is recorded in the Group 01 audit evidence.
## 21. Module Portability & Host Integration Guide

Copy `frontend_admin/admin_system/system_settings/` as the autonomous repair unit. Required host integrations: Next.js routing, React, the existing shared design-system primitives, `next-intl` namespace, and only the source-declared API contracts. Canonical URL config: `config/admin_system_settings.url_config.ts`.
## V42 CSS Migration Outcome (2026-10-29)

- The prior feature-local stylesheet has been removed after the consumed styles were translated into semantic Tailwind utilities in the owning components. No feature stylesheet import remains.
- Existing routes, event handlers, form fields, and business behavior were preserved; the CSS change is visual-layer-only.
- Static migration and negative-regression checks pass. Browser-level visual parity remains `DEFERRED_TO_HOST_RUNTIME`.

## 22. Deliverables & Version History

V34 → RBG-01: structural isolation and source relocation. Generated from source evidence on 2026-10-23. Do not mark release-ready until the Section 43P re-audit and host runtime verification are complete.

## Group 01 Repair Notes

- Host declaration boundary: `contracts/host-stubs.d.ts`; its declarations describe host seams and do not replace host verification.
- Canonical URL config is module-owned and exports the current route contract. Backend endpoints and response models remain unverified unless listed in the verified contract below.
- No nested autonomous sub-module was created. The current physical tree is under the 25-file ceiling. The five-gate decision keeps this page as a parent compatibility surface and routes branding, late-fee and auto-suspend ownership to existing canonical modules; count alone does not mandate a split.
- The source archive does not contain Git commit metadata; no commit hash or runtime pass is asserted.

## RBG 5 Ownership Correction

The `branding`, `late-fee`, and `auto-suspend` query values remain accepted as compatibility views, but they no longer render duplicate policy forms. The parent resolves each to the existing canonical destination card. UPI, notifications, and general settings remain local to this module. The supplied source does not prove live write persistence or external policy behavior; those contracts remain `CONTRACT_MISSING`.

## V41 Physical Inventory and 5-Gate Disposition

**Historical V41 status (superseded 2026-10-30):** this status refers to the archived pre-repair snapshot. Current recursive inventory is 25 files (20 TS/TSX/JS/JSX/MJS files; 5 component TSX/JSX files); current file-ceiling status is COMPLIANT. No five-gate exception is claimed for the present tree.

Evidence is the current physical tree, canonical URL config, route-entry files, module-owned tests/mocks/harness, and the source feature contract. Unknown external business/API behavior remains `CONTRACT_MISSING` or `NOT_VERIFIED`; never infer an endpoint, permission, or backend entity from naming alone.

## V42 RBG5 Canonical Mock Scenario Catalog Update

- Canonical registry: `mocks/scenarios/admin_system_settings.scenarios.ts`. It declares eight states: `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The five scenarios explicitly required by the architecture standard are retained in equivalent canonical names; the three supplemental states are `FORBIDDEN_403`, `NETWORK_ERROR`, and `INVALID_RESPONSE`.
- The registry is transport-level and dependency-free. `ACTIVE_RECORDS` requires an adapter to bind the module's existing documented fixture. No feature endpoint, business DTO, permission matrix, or production behavior is inferred.
- `hooks/` and `api/` are physically present per the selected Section 45.4A checklist. They remain empty where the source does not support a hook/API implementation; folder presence is not evidence of runtime capability.
- Static catalog/folder verification is available via `scripts/check-mock-scenario-registries.mjs`. Runtime behavior, handler wiring, and host API parity remain unverified until the host dependency/runtime environment is available.



## Current repaired-tree inventory (2026-10-30)

- Recursive physical file count: **25**.
- TS/TSX/JS/JSX/MJS files: **20**.
- Component TSX/JSX files: **5**.
- 25-file ceiling: **COMPLIANT**.
- Evidence: measured directly from this module directory in the repaired working tree. Historical v41/v44 counts are not current and must not override this section.
