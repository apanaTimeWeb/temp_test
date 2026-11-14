---
feature: "superadmin_settings_profile_overview"
owner_role: "superadmin"
module_version: 2
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# profile_overview — Feature Specification

## Scope and Non-Scope

- Scope: autonomous, directly refreshable route `/superadmin/superadmin_settings/profile_overview` owned by `superadmin_settings/profile_overview/page.tsx`, rendered by `superadmin_settings/profile_overview/components/SuperadminProfileOverviewScreen.tsx` and `superadmin_settings/profile_overview/components/SuperadminProfileOverviewPageClient.tsx`.
- Non-scope: sibling sub-modules, host authentication/tenant enforcement, backend behavior not evidenced in the supplied archive, and host-level build/test configuration.

## Screen Inventory

- Screen adapter: `superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewScreen.tsx`.
- Main client component: `superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewPageClient.tsx`.
- Route view key: `overview`.

## Navigation Contract

- Public route: `/superadmin/superadmin_settings/profile_overview`.
- Expected route marker: `overview`.
- Role route registry: `superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config.ts` (domain route maps); API endpoints remain leaf-owned.
- Module URL contract: `superadmin_settings/settings_profile_overview/config/superadmin_profile_overview.url_config.ts`.
- Legacy `?view=` URLs are mapped by the domain redirect adapter, and non-view query parameters (including `id`) are preserved. Hyphenated public aliases require the host rewrite entries in `INTEGRATION_GUIDE.md` because host routing config is outside this ZIP.

## API Contract

- Module API boundary: `superadmin_settings/settings_profile_overview/api/superadmin_profile_overview.api.ts`.
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative request/write contract is outside the supplied scope.
- This module intentionally makes no new network request and invents no endpoint, request/response field, permission, or persistence behavior.

### UI Data Requirements

The inventory below is derived from files in this module. It is not a claim that a backend response exists unless the field is present in a supplied schema or verified API contract.

| Field / key | Source file |
|---|---|
| `activeTab` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `browser` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `cellClass` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `cellRenderer` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `className` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `colDefs` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `columnDefs` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `confirmPassword` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `currentPassword` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `date` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `defaultColDef` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `device` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `domLayout` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `email` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `field` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `filtered` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewEmptyStateTypes.ts` |
| `firstName` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `flex` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `getRowId` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `headerHeight` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `headerName` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `hide` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `id` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `ip` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `isCurrent` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `lastActive` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `lastName` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `location` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `loginAlerts` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `loginHistory` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `message` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `minWidth` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `newPassword` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `onDirtyChange` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `onRevokeSession` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `onSave` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `pagination` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `paginationPageSize` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `paginationPageSizeSelector` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `path` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `phone` | `superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema.ts` |
| `rowClassRules` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `rowData` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `rowHeight` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `sessions` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `sortable` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `status` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `suppressCellFocus` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `suppressPaginationPanel` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `theme` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `twoFactorEnabled` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts` |
| `valueFormatter` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `valueGetter` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |
| `width` | `superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes.ts` |

Screen/component evidence:
- `superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewScreen.tsx`
- `superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewPageClient.tsx`

## Query Key Registry

- Registry: `superadmin_settings/settings_profile_overview/api/superadmin_profile_overview.query_keys.ts`.
- Resource identity: `superadmin_profile_overview`; existing domain resource keys are retained locally where required to preserve cache identity.
- Query keys must remain resource-specific; sibling modules must not import this registry.

## Mutation Inventory

- No verified write method is declared in this module API boundary.
- Write controls must remain disabled/read-only or explicitly preview/unavailable; local state changes must not be presented as durable server success.

## Permissions and Role Rules

- Owner role: Superadmin. Client-side route guards are UX protection only; server authorization is outside the supplied frontend archive.
- Do not infer new permissions or role grants.

## State Ownership

- Local hooks: `superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewSemanticTableState.ts`, `superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewUnsavedChangesGuard.ts`, `superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewValidationMessage.ts`.
- State, query keys, mocks, and helpers remain owned by this leaf; do not import sibling business code.

## Offline and Reconnect Behavior

- No new offline persistence or background mutation behavior is introduced by this migration.
- Existing preview state is not durable; no write is retried unless an existing API contract explicitly supports it.

## Security and PII Rules

- Do not log secrets or unnecessary PII. Server-side authorization, tenant isolation, and data masking behavior require host/runtime verification.
- No new storage or credential handling was introduced by this module split.

## Accessibility Requirements

- Interactive controls have stable `data-testid` coverage by static scan.
- Component responsibility headers, explicit Switch accessible names, and reduced-motion styles were statically checked.
- Keyboard/focus order, screen-reader behavior, contrast, zoom, and responsive layout require browser verification.

## Background Tasks

- No background task, scheduler, or WebSocket behavior is added by this module split. Any future real-time/background behavior requires a supplied backend contract.

## Feature Flags

- No new feature flag is invented. Preserve only flags found in the supplied source.

## Cache Invalidation

- No verified write contract exists for this module; no new invalidation or optimistic mutation behavior is invented.

## Migration and Rollback

- No database/schema migration is included in this frontend-only artifact.
- Roll back this leaf as a unit; keep public routes and query-view keys stable.

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| `tests/SuperadminCanonicalMockScenarioHarness.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewAsyncStateContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewDetailsConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewDetailsDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewDetailsHarness.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewDetailsRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewEditConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewEditDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewEditHarness.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewEditRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewHarness.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewLocaleCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewQueryKeys.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewRouteBoundaries.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewSchema.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewSecurityFixtures.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewSemanticTable.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewSemanticTableStateHook.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewStableRowKey.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewUnsavedChangesGuardHook.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileOverviewValidationMessageHook.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminSettingsProfileOverviewPreviewOnlyApiContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminSettingsProfileOverviewScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/harness/SuperadminProfileOverviewHarness.tsx` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions

- None approved. Small helpers and fixtures are duplicated locally under the WET rule; no sibling business imports are allowed.
- Status-only API boundaries are deliberate contract blockers, not permission to invent endpoints.

### Documented component line-ceiling exceptions (2026-10-30)

The canonical rule allows a documented exception when cohesive logic requires it. The following single-route composition/panel files remain cohesive to their owning workflow; shared primitives, typed contracts, state hooks, fixtures and URL configs remain separately owned. No sibling workflow or API contract is added by these exceptions.

| File | Current lines | Rationale |
|---|---:|---|
| `SuperadminProfileOverviewPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |
| `SuperadminProfileOverviewEditPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |
| `SuperadminProfileOverviewDetailsPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |

### Submodule size review (2026-10-30)

This leaf has 111 total files, including 106 source files. The count includes the mandatory documentation trio, locale catalogs, host contract stubs, tests/harness, fixtures/scenarios and leaf-owned UI components. The Scope and Non-Scope section defines one named capability for this leaf; no independent second/third workflow or cross-feature business ownership was identified in the source inventory. The canonical sizing rule explicitly says a cohesive workflow is not penalized solely by file count, so no split or feature deletion is justified by count alone.

## Known Contract Gaps

- No verified backend request/response/write contract was supplied for this feature.
- Host `package.json`, lockfile, `tsconfig`, lint/test configuration, and CI are absent from this role archive.

## Rule Compliance Checklist

- PASS — domain root contains only route/lifecycle files, original URL config, and master documentation trio.
- PASS — leaf root contains only the three required documentation files.
- PASS — all 11 canonical web category folders are present and module-prefixed.
- PASS — all source/test filenames follow the role+module prefix rule; URL config and locale filenames use their documented special forms.
- PASS — feature documentation trio exists and all 22 canonical sections are present.
- PASS — UI Data Requirements is nested under API Contract and is source-derived.
- PASS — route-specific screen adapter exists.
- PASS — route-specific PageClient exists.
- PASS — exactly one module-owned URL config exists.
- PASS — exactly one module-owned query-key registry exists under the API category.
- PASS — module-local English locale catalog exists.
- PASS — module-local Hindi locale catalog exists.
- PASS — English/Hindi locale root keys match.
- PASS — module-owned fixture folder contains a fixture file.
- PASS — module-owned handler folder contains a handler file.
- PASS — module-owned scenario folder contains a scenario file.
- PASS — module-owned provider/mock-server harness exists.
- PASS — module-owned test file exists.
- PASS — all local imports resolve in the static resolver.
- PASS — zero sibling business imports found in the static import scan.
- PASS — zero cross-domain business imports found in the static import scan.
- PASS — Route key and marker statically preserved.
- PASS — route dispatcher contains no object-wrapped `id={{id}}` prop expression.
- PASS — interactive controls have stable data-testid values by static JSX scan.
- PASS — component responsibility headers are present at the top of module-owned TSX files.
- PASS — default exported component names match component filenames.
- PASS — TypeScript/TSX file-size ceilings show zero violations.
- PASS — reduced-motion handling is present in every module-owned CSS file (or no CSS file requires it).
- PASS — no hard-coded hex colors found in source styles.
- PASS — no `.toFixed()` calls found in source.
- PASS — no `@ts-ignore` or `@ts-nocheck` directives found.
- PASS — no barrel `index.ts` / `index.tsx` files found.
- PASS — no `console.log` calls found in source.
- PASS — no direct localStorage/sessionStorage/document.cookie use found in TSX components.
- PASS — no hard-coded absolute HTTP URL was found in API request calls.
- PASS — no endpoint/request/response field was invented; source-backed contracts only.
- PASS — unsupported write actions are read-only or explicitly preview/unavailable by source audit.
- N/A — no verified write method exists in this module.
- PASS — query/cache identity remains module-owned; runtime invalidation behavior is not inferred.
- DEFERRED_TO_HOST_RUNTIME — keyboard/focus order, screen-reader output, contrast, zoom, and responsive layout require browser verification.
- DEFERRED_TO_HOST_RUNTIME — test files are present but the host test runner is not included or executed.
- DEFERRED_TO_HOST_RUNTIME — production build, typecheck, lint, and Playwright execution require host tooling.
- DEFERRED_TO_HOST_RUNTIME — public route rewrites must be installed and verified by the host app.
- OUTSIDE_SUPPLIED_SCOPE — server-side authentication/authorization and tenant isolation are not in the frontend ZIP.
- OUTSIDE_SUPPLIED_SCOPE — backend persistence, production idempotency guarantees, and API error semantics require backend contract/runtime evidence.
- DEFERRED_TO_HOST_RUNTIME — runtime PII masking and sensitive-field exposure require review against real data and host rendering.
- PASS — static portability score is 8/8 for the explicitly listed structural criteria; this is not a runtime pass.

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

## Standalone Run, Mock & Test Harness

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminProfileOverviewHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_settings_profile_overview.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. Network-backed error states are deliberately not represented as executable API responses unless a verified module endpoint/auth contract and handler exist.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_settings_profile_overview.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.



- Module tests: `profile_overview_tests/`.
- Harness files: `superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewHarness.tsx`, `superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewRouteBoundaries.test.tsx`, `superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewSemanticTable.test.tsx`, `superadmin_settings/settings_profile_overview/tests/useSuperadminProfileOverviewSemanticTableState.test.tsx`, `superadmin_settings/settings_profile_overview/tests/useSuperadminProfileOverviewUnsavedChangesGuard.test.tsx`, `superadmin_settings/settings_profile_overview/tests/useSuperadminProfileOverviewValidationMessage.test.tsx`.
- Fixtures: `profile_overview_mocks/fixtures/`; handlers: `profile_overview_mocks/handlers/`; scenarios: `profile_overview_mocks/scenarios/`.
- No run command is invented because this role archive does not include a package manifest or test-runner config.

## Module Portability & Host Integration Guide

- Copy this leaf as an isolated unit; it has no sibling business imports.
- Configure host alias `@/app/frontend_superadmin` and the preserved Next.js route rewrites.
- Static portability score: 8/8; host build/runtime behavior is not included in this score.


> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History

- **RBG60 source audit:** reviewed `profile_overview` source coverage and retained the existing contract boundary; static source review only, with host-runtime behavior not asserted.

- **V24:** route-specific autonomous sub-module; module-owned URL/query-key/API boundary, locale pair, mocks, tests, and documentation trio.
- **Verification:** static architecture and syntax checks only; host runtime gates remain deferred.

---

## Preserved workflow specification: profile_overview_details

# profile_overview_details — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Profile workflow at `/superadmin/superadmin_settings/profile_overview?view=details`. It was separated from the secondary-navigation workflow in `profile_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `profile_overview/page.tsx` (?view=details)`; route adapter: `components/SuperadminProfileOverviewDetailsScreen.tsx`; client screen: `components/SuperadminProfileOverviewDetailsPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/profile_overview?view=details`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

## Query Key Registry
- No new query key is introduced by this route split; retain only verified resource keys in the local copied source.

## Mutation Inventory
- Existing preview-only or unavailable mutation messaging is preserved. No durable mutation is enabled by route decomposition.

## Permissions and Role Rules
- Owner role: Superadmin. Server authorization remains a host/backend responsibility.

## State Ownership
- State and helpers are copied into this leaf; no runtime import from a sibling leaf is permitted.

## Offline and Reconnect Behavior
- No new offline persistence, retry, or background write behavior is introduced.

## Security and PII Rules
- Preserve source masking and security notices. Do not claim local preview data is live server data.

## Accessibility Requirements
- Preserve source semantics, keyboard behavior, status messaging, focus handling, and reduced-motion utilities; host browser verification remains pending.

## Background Tasks
- None introduced.

## Feature Flags
- No new feature flag inferred.

## Cache Invalidation
- No cache invalidation behavior added without an existing verified mutation contract.

## Migration and Rollback
- Keep `profile_overview` as a legacy-compatible entry; workflow tabs now navigate to the canonical child route. Rollback by restoring the pre-split parent page client and removing this child route.

## Test Coverage Map
- Route contract and direct-refresh marker test are local. Full UI/runtime suites require the host test runner.

## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

## Known Contract Gaps
- Backend aggregate, permissions, and durable mutation contracts remain blocked unless explicitly evidenced in inherited source.

## Rule Compliance Checklist
- [x] Own route, direct refresh, local boundaries, local tests and mocks.
- [x] Secondary navigation links to canonical route per workflow.
- [x] No invented API contracts.
- [ ] Host build, browser, and backend contract verification: deferred.

## Standalone Run, Mock & Test Harness
- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.

## Deliverables & Version History
- V1: extracted the Profile workflow into an autonomous route in RBG 6.

---

## Preserved workflow specification: profile_overview_edit

# profile_overview_edit — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Edit Profile workflow at `/superadmin/superadmin_settings/profile_overview?view=edit`. It was separated from the secondary-navigation workflow in `profile_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `profile_overview/page.tsx` (?view=edit)`; route adapter: `components/SuperadminProfileOverviewEditScreen.tsx`; client screen: `components/SuperadminProfileOverviewEditPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/profile_overview?view=edit`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

## Query Key Registry
- No new query key is introduced by this route split; retain only verified resource keys in the local copied source.

## Mutation Inventory
- Existing preview-only or unavailable mutation messaging is preserved. No durable mutation is enabled by route decomposition.

## Permissions and Role Rules
- Owner role: Superadmin. Server authorization remains a host/backend responsibility.

## State Ownership
- State and helpers are copied into this leaf; no runtime import from a sibling leaf is permitted.

## Offline and Reconnect Behavior
- No new offline persistence, retry, or background write behavior is introduced.

## Security and PII Rules
- Preserve source masking and security notices. Do not claim local preview data is live server data.

## Accessibility Requirements
- Preserve source semantics, keyboard behavior, status messaging, focus handling, and reduced-motion utilities; host browser verification remains pending.

## Background Tasks
- None introduced.

## Feature Flags
- No new feature flag inferred.

## Cache Invalidation
- No cache invalidation behavior added without an existing verified mutation contract.

## Migration and Rollback
- Keep `profile_overview` as a legacy-compatible entry; workflow tabs now navigate to the canonical child route. Rollback by restoring the pre-split parent page client and removing this child route.

## Test Coverage Map
- Route contract and direct-refresh marker test are local. Full UI/runtime suites require the host test runner.

## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

## Known Contract Gaps
- Backend aggregate, permissions, and durable mutation contracts remain blocked unless explicitly evidenced in inherited source.

## Rule Compliance Checklist
- [x] Own route, direct refresh, local boundaries, local tests and mocks.
- [x] Secondary navigation links to canonical route per workflow.
- [x] No invented API contracts.
- [ ] Host build, browser, and backend contract verification: deferred.
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
## Standalone Run, Mock & Test Harness
- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.

## Deliverables & Version History
- V1: extracted the Edit Profile workflow into an autonomous route in RBG 6.

## RBG 15 — Component Size Exceptions

Static source re-scan (V19, 2026-10-29) found no `.tsx` files in the mapped leaf above the canonical 300-line hard ceiling. No size exceptions are approved. This is a source line-count check only; it does not establish host typecheck, build, test or runtime success.

