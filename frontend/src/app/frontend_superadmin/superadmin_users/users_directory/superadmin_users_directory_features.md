---
feature: "superadmin_users_directory"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# users_directory — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable All Users workflow at `/superadmin/superadmin_users/users_directory`. It was separated from the secondary-navigation workflow in `users_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `users_directory/page.tsx`; route adapter: `components/SuperadminUsersDirectoryScreen.tsx`; client screen: `components/SuperadminUsersDirectoryPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_users/users_directory`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

### UI Data Requirements

The following inventory is derived from this module's local schemas, types, and fixtures. It records the frontend's declared data shape; it does **not** assert that a backend endpoint or durable response contract exists. No backend/OpenAPI source was supplied for this role slice.

| Field / key | Source file and line |
|---|---|
| `activeTab` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:80` |
| `admin` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:66` |
| `branch` | `superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema.ts:12`, `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:23` |
| `cellClass` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:33` |
| `cellRenderer` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:34` |
| `columnDefs` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:59` |
| `defaultColDef` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:68` |
| `device` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:43` |
| `domLayout` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:69` |
| `editUser` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:97` |
| `email` | `superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema.ts:10`, `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:21` |
| `field` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:27` |
| `filtered` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryEmptyStateTypes.ts:4` |
| `flex` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:30` |
| `getRowId` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:71` |
| `handleSave` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:99` |
| `headerHeight` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:61` |
| `headerName` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:26` |
| `hide` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:32` |
| `ip` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:44` |
| `lastActive` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:46` |
| `lastLogin` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:27` |
| `location` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:45` |
| `manager` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:67` |
| `minWidth` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:29` |
| `module` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:64` |
| `onClose` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:98` |
| `pagination` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:62` |
| `paginationPageSize` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:63` |
| `paginationPageSizeSelector` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:70` |
| `rolePermissions` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:85` |
| `rowClassRules` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:72` |
| `rowData` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:58` |
| `rowHeight` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:60` |
| `sessionCols` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:84` |
| `sessions` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:83` |
| `showModal` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:96` |
| `sortable` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:31` |
| `status` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:26`, `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:47` |
| `superadmin` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:65` |
| `suppressCellFocus` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:66` |
| `suppressPaginationPanel` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:67` |
| `theme` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:65` |
| `twoFactor` | `superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema.ts:13`, `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:24` |
| `user` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:42` |
| `userCols` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:82` |
| `username` | `superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema.ts:9`, `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:20` |
| `users` | `superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes.ts:81` |
| `valueFormatter` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:36` |
| `valueGetter` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:35` |
| `width` | `superadmin_users/users_directory/types/SuperadminUsersDirectorySemanticTableTypes.ts:28` |

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
- Keep `users_overview` as a legacy-compatible entry; workflow tabs now navigate to the canonical child route. Rollback by restoring the pre-split parent page client and removing this child route.

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| `tests/SuperadminCanonicalMockScenarioHarness.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryAsyncStateContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryPreviewOnlyApiContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryQueryKeys.test.ts` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminUsersDirectoryScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/harness/SuperadminUsersDirectoryHarness.tsx` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

### Documented component line-ceiling exceptions (2026-10-30)

The canonical rule allows a documented exception when cohesive logic requires it. The following single-route composition/panel files remain cohesive to their owning workflow; shared primitives, typed contracts, state hooks, fixtures and URL configs remain separately owned. No sibling workflow or API contract is added by these exceptions.

| File | Current lines | Rationale |
|---|---:|---|
| `SuperadminUsersDirectoryPageClient.tsx` | 280 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |
| `SuperadminUsersDirectoryModal.tsx` | 216 | One cohesive modal/panel layout with its typed inputs and action feedback; it does not own route or backend contract semantics. |

### Submodule size review (2026-10-30)

This leaf has 51 total files, including 46 source files. The count includes the mandatory documentation trio, locale catalogs, host contract stubs, tests/harness, fixtures/scenarios and leaf-owned UI components. The Scope and Non-Scope section defines one named capability for this leaf; no independent second/third workflow or cross-feature business ownership was identified in the source inventory. The canonical sizing rule explicitly says a cohesive workflow is not penalized solely by file count, so no split or feature deletion is justified by count alone.

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

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminUsersDirectoryHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_users_directory.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. Network-backed error states are deliberately not represented as executable API responses unless a verified module endpoint/auth contract and handler exist.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_users_directory.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.


- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.


> **Portability evidence status:** `NOT_VERIFIED`. No numeric portability score is claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History
- V1: extracted the All Users workflow into an autonomous route in RBG 6.

## RBG 15 — Component Size Exceptions

Static source re-scan (V19, 2026-10-29) found no `.tsx` files in the mapped leaf above the canonical 300-line hard ceiling. No size exceptions are approved. This is a source line-count check only; it does not establish host typecheck, build, test or runtime success.

