---
feature: "superadmin_settings_profile_login_history"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# profile_login_history — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Login History workflow at `/superadmin/superadmin_settings/profile_login_history`. It was separated from the secondary-navigation workflow in `profile_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `profile_login_history/page.tsx`; route adapter: `components/SuperadminProfileLoginHistoryScreen.tsx`; client screen: `components/SuperadminProfileLoginHistoryPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/profile_login_history`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

### UI Data Requirements

The following inventory is derived from this module's local schemas, types, and fixtures. It records the frontend's declared data shape; it does **not** assert that a backend endpoint or durable response contract exists. No backend/OpenAPI source was supplied for this role slice.

| Field / key | Source file and line |
|---|---|
| `activeTab` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:55`, `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:71` |
| `browser` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:23`, `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:45` |
| `cellClass` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:33` |
| `cellRenderer` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:34` |
| `colDefs` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:75` |
| `columnDefs` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:59` |
| `confirmPassword` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:23` |
| `currentPassword` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:17` |
| `date` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:41` |
| `defaultColDef` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:68` |
| `device` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:22` |
| `domLayout` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:69` |
| `email` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:7` |
| `field` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:27` |
| `filtered` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryEmptyStateTypes.ts:4` |
| `firstName` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:5` |
| `flex` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:30` |
| `getRowId` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:71` |
| `headerHeight` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:61` |
| `headerName` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:26` |
| `hide` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:32` |
| `ip` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:24`, `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:42` |
| `isCurrent` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:26` |
| `lastActive` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:25` |
| `lastName` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:6` |
| `location` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:27`, `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:43` |
| `loginAlerts` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:73` |
| `loginHistory` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:74` |
| `message` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:26`, `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:29` |
| `minWidth` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:29` |
| `newPassword` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:18` |
| `onDirtyChange` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:57` |
| `onRevokeSession` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:77` |
| `onSave` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:56` |
| `pagination` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:62` |
| `paginationPageSize` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:63` |
| `paginationPageSizeSelector` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:70` |
| `path` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:25`, `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:28` |
| `phone` | `superadmin_settings/settings_profile_login_history/schemas/SuperadminProfileLoginHistorySchema.ts:8` |
| `rowClassRules` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:72` |
| `rowData` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:58` |
| `rowHeight` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:60` |
| `sessions` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:76` |
| `sortable` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:31` |
| `status` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:44` |
| `suppressCellFocus` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:66` |
| `suppressPaginationPanel` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:67` |
| `theme` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:65` |
| `twoFactorEnabled` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistoryTypes.ts:72` |
| `valueFormatter` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:36` |
| `valueGetter` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:35` |
| `width` | `superadmin_settings/settings_profile_login_history/types/SuperadminProfileLoginHistorySemanticTableTypes.ts:28` |

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

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| `tests/SuperadminCanonicalMockScenarioHarness.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileLoginHistoryAsyncStateContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileLoginHistoryConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileLoginHistoryDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileLoginHistoryMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileLoginHistoryQueryKeys.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileLoginHistoryRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminSettingsProfileLoginHistoryPreviewOnlyApiContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminSettingsProfileLoginHistoryScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/harness/SuperadminProfileLoginHistoryHarness.tsx` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

### Documented component line-ceiling exceptions (2026-10-30)

The canonical rule allows a documented exception when cohesive logic requires it. The following single-route composition/panel files remain cohesive to their owning workflow; shared primitives, typed contracts, state hooks, fixtures and URL configs remain separately owned. No sibling workflow or API contract is added by these exceptions.

| File | Current lines | Rationale |
|---|---:|---|
| `SuperadminProfileLoginHistoryPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |

### Submodule size review (2026-10-30)

This leaf has 50 total files, including 45 source files. The count includes the mandatory documentation trio, locale catalogs, host contract stubs, tests/harness, fixtures/scenarios and leaf-owned UI components. The Scope and Non-Scope section defines one named capability for this leaf; no independent second/third workflow or cross-feature business ownership was identified in the source inventory. The canonical sizing rule explicitly says a cohesive workflow is not penalized solely by file count, so no split or feature deletion is justified by count alone.

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

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminProfileLoginHistoryHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_settings_profile_login_history.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. Network-backed error states are deliberately not represented as executable API responses unless a verified module endpoint/auth contract and handler exist.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_settings_profile_login_history.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.


- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.


> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History
- **RBG60 source audit:** reviewed `profile_login_history` source coverage and retained the existing contract boundary; static source review only, with host-runtime behavior not asserted.

- V1: extracted the Login History workflow into an autonomous route in RBG 6.

## RBG 15 — Component Size Exceptions

Static source re-scan (V19, 2026-10-29) found no `.tsx` files in the mapped leaf above the canonical 300-line hard ceiling. No size exceptions are approved. This is a source line-count check only; it does not establish host typecheck, build, test or runtime success.

