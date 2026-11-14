---
feature: "superadmin_navigation"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# superadmin_navigation — Master Domain Feature Map

> **Authority:** `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md`, `WEB_FRONTEND_UI_UX_DESIGN.md`, and `FRONTEND_ROLE_MODULE_CREATE_AUDIT_REPAIR_V2_11.md`. This is the domain-level index; every route capability is independently owned by its leaf sub-module. Static checks do not prove runtime behavior.

## Domain Purpose and Boundary

The `superadmin_navigation` domain is a route shell and inventory boundary. Executable feature code belongs to its independent leaf modules, not to this domain root. The root may contain only the Next.js route/lifecycle files, its original URL config, and this master documentation trio.

## Route Shell Contract

- This is the dedicated navigation shell domain; it is not a page-bearing public route.
- Navigation keeps a local, WET-duplicated registry of canonical leaf route literals. It must not import business URL configs, components, stores, or domain hooks from sibling leaves.

## Autonomous Sub-Module Inventory

| Leaf sub-module | View key | Public URL / status | Screen adapter | API boundary | Tests |
|---|---|---|---|---|---|
| `navigation_shell` | `navigation_shell` | `navigation shell (no page route)` → `shell` | `adapter missing` | No verified backend contract; status-only API boundary | 1 |

## API and Mutation Contract

Only source-verified endpoints and request/response shapes may be used. The status-only API boundary is deliberate for modules without a supplied backend contract; it does not create a network request or imply CRUD support. No new endpoint, request field, permission, feature flag, or backend behavior is inferred.

| Sub-module | API files | Contract status | Mock fixtures / handlers / scenarios |
|---|---|---|---|
| `navigation_shell` | `superadmin_navigation_shell.api.ts` | Status-only / blocked by supplied contract | 1 / 1 / 1 |

## Query, Cache, and State Ownership

Every leaf owns exactly one query-key registry in its API category. Existing resource keys were retained where source contracts already used them; module-prefixed keys are present for new module ownership. Mutation invalidation and idempotency are implemented only where a verified write contract exists. A status-only module must not simulate durable persistence.

## Theme and Accessibility

- Observed module-local semantic tokens/classes: 80 distinct entries across the domain.
- Token sample: `CSS variable --bg-card`, `CSS variable --bg-floating`, `CSS variable --bg-header`, `CSS variable --bg-input`, `CSS variable --bg-overlay`, `CSS variable --bg-page`, `CSS variable --bg-sidebar`, `CSS variable --border`, `CSS variable --border-focus`, `CSS variable --danger`, `CSS variable --danger-bg`, `CSS variable --danger-text`, `CSS variable --focus-ring`, `CSS variable --font-inter`, `CSS variable --font-size-body`, `CSS variable --font-size-caption`, `CSS variable --font-size-section-title`, `CSS variable --info`, `CSS variable --info-bg`, `CSS variable --info-text`, `CSS variable --layout-content-padding`, `CSS variable --layout-header-height`, `CSS variable --layout-sidebar-width`, `CSS variable --overlay-backdrop`, `CSS variable --primary`, `CSS variable --primary-hover`, `CSS variable --primary-subtle`, `CSS variable --purple-text`, `CSS variable --radius-full`, `CSS variable --radius-md`, …; see each leaf `_theme_contract.md` for the full source inventory.
- No arbitrary hex colors were found in the source scan.
- Interactive controls have stable `data-testid` coverage; keyboard/focus, contrast, responsive, and reduced-motion behavior still require browser verification.
- Source CSS with animation/transition behavior includes reduced-motion handling.

## Testing and Mock Ownership

This domain contains 1 autonomous leaf modules. Each leaf owns its test folder, provider/bootstrap harness, fixtures, handlers, scenarios, locale pair, and documentation trio. The host test runner and browser suite are not present in the supplied role archive, so test source is not reported as executed.

## Domain-Level Architecture Gates

- Domain-root quarantine: PASS by static inventory (no domain-root business code folders).
- Leaf-root quarantine: PASS by static inventory (documentation trio only).
- Canonical prefixed category folders: PASS.
- Source filename role+module prefix: PASS by static inventory.
- Sibling and cross-domain business imports: 0 found by static scan.
- Local imports: 0 unresolved by static scan.
- Per-leaf 22-section feature maps and UI Data Requirements: present.
- Static portability score: 8/8 structural checks; host build/runtime checks remain separate.

## Host Integration and Known Limits

- Keep `@/app/frontend_superadmin` aligned with the host `tsconfig`/bundler alias; do not add host config to this role-only ZIP.
- Preserve all public route aliases and install the documented Next.js rewrites in the host app.
- Server-side authentication, tenant isolation, authorization, backend idempotency, persistence, and API error semantics cannot be verified from a frontend-only archive.
- `package.json`, lockfile, `tsconfig.json`, lint config, and Playwright runner are not included; typecheck, lint, unit tests, build, and browser E2E execution are deferred.

## Version History

- **V24:** Split every public query-view into an independent leaf sub-module; added module-local docs, URL/query-key registries, API contract boundaries, locale pairs, fixtures/handlers/scenarios, and test harnesses; fixed route `id` prop forwarding; added verified read-contract error scenarios; tightened test IDs and source naming.
- **V23 predecessor:** Route guard, honest unavailable write states, and route rewrite documentation.

## Scope and Non-Scope

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Screen Inventory

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Navigation Contract

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## API Contract

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Query Key Registry

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Mutation Inventory

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Permissions and Role Rules

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## State Ownership

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Offline and Reconnect Behavior

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Security and PII Rules

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Accessibility Requirements

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Background Tasks

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Feature Flags

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Cache Invalidation

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Migration and Rollback

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Known Contract Gaps

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Architecture Exceptions

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Standalone Run, Mock & Test Harness

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| *No test file currently found* | Coverage gap; a PASS is not claimed |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Module Portability & Host Integration Guide

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Rule Compliance Checklist

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.
- [ ] Rule 0A.2: Autonomous leaf is at the canonical one-level depth under its domain container
- [ ] Rule 1: Production components, hooks, API services, stores, schemas and utilities stay within their hard line ceilings
- [ ] Rule 2: No cross-role business import is present
- [ ] Rule 3: Every owned source filename follows the role/submodule prefix convention
- [ ] Rule 4: JSX uses documented semantic theme tokens and contains no hardcoded color values
- [ ] Rule 5: TanStack Query owns server state and the module-scoped Zustand store owns UI state where applicable
- [ ] Rule 6: Reusable side-effect and stateful logic is extracted into leaf-local hooks
- [ ] Rule 7: Domain types are owned by the canonical types/schemas folders
- [ ] Rule 8: Next.js server/client boundaries and use-client directives are valid
- [ ] Rule 9: Loading, error and not-found route states are implemented and non-generic
- [ ] Rule 11: All owned routes and API endpoints are represented by the leaf URL config
- [ ] Rule 13: Feature documentation reflects the actual source and makes no unsupported backend claims
- [ ] Rule 14: User-facing strings are localized and browser alerts are not used for business flows
- [ ] Rule 15A: Hook/utility/component tests are co-located and source paths resolve
- [ ] Rule 15B: Forms use React Hook Form v7 and Zod where a form exists
- [ ] Rule 15C: State ownership follows the approved server/client state decision
- [ ] Rule 15D: No secret is exposed through public environment variables or client source
- [ ] Rule 15E: Critical error reporting uses only the verified host monitoring adapter
- [ ] Rule 19: Interactive rows and click affordances have the required pointer/keyboard semantics
- [ ] Rule 26: Async action buttons preserve pending/disabled state and stable width
- [ ] Rule 30: Table sort, filter and pagination affordances match the implemented behavior
- [ ] Rule 32: No index.ts barrel or re-export facade exists in the leaf
- [ ] Rule 40: The leaf forbidden-pattern document exists and names concrete boundaries
- [ ] Rule 43: Sensitive values are masked before rendering or exporting where applicable
- [ ] Rule 44: Production code contains no console logging of user or tenant data
- [ ] Rule 48: Entity list surfaces have explicit empty and filtered-empty states where applicable
- [ ] Rule 55: Mapped lists use stable entity keys, not array indexes
- [ ] Rule 64: Responsive layouts support the defined breakpoints and reduced-motion preferences
- [ ] Rule 68: Rendered table column definitions align with header and row data
- [ ] Rule 71: Destructive actions are protected by the leaf confirmation contract
- [ ] Rule 72: API function names follow the canonical operation naming contract
- [ ] Rule 73: Type-only imports use import type where appropriate
- [ ] Rule 74: Security/dependency scan results are recorded rather than presumed
- [ ] Rule 75: MSW handlers and mock scenarios are owned by this leaf
- [ ] Rule 75D: Mock fixtures cover each field and displayed state used by this leaf
- [ ] Rule 76: Security-critical paths are covered by verified human CODEOWNERS mapping or explicitly deferred to host scope
- [ ] Rule 78: Nullable values use displayValue() or another explicitly approved empty-value contract
- [ ] Rule 79: Dirty forms and route-leave actions use the approved unsaved-changes guard
- [ ] Rule 80: Currency is formatted by a leaf-local formatter and raw toFixed() is absent from JSX
- [ ] Rule 81: Pending buttons reserve minimum width to avoid layout shift
- [ ] Rule 82: Toast/message emissions use stable deduplication identifiers
- [ ] Mutation Safety: Every enabled state-changing request uses Idempotency-Key: UUIDv4
- [ ] Debounced Search: Live search requests are debounced by at least 300 ms
- [ ] API Envelope: API responses use the canonical discriminated ApiResponse<T> envelope
- [ ] Contract Integrity: No endpoint, payload field, permission, or write behavior is invented
- [ ] Dialog Accessibility: Confirmation/dialog paths preserve focus, keyboard dismissal and background-state cleanup
- [ ] Localization Parity: All source-referenced English/Hindi keys and value types match across locale pairs
- [ ] Token Provenance: Theme-token inventory entries cite exact local source paths and line numbers
- [ ] Portability Evidence: Standalone compilation, mock tests and host wiring are reported separately
- [ ] Runtime Honesty: Unavailable host checks are marked DEFERRED_TO_HOST_RUNTIME, not passed

> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.
