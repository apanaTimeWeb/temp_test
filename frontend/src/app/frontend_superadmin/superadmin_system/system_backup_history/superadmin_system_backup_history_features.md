---
feature: "superadmin_system_backup_history"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# backup_history — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Backup History workflow at `/superadmin/superadmin_system/backup_history`. It was separated from the secondary-navigation workflow in `backup_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `backup_history/page.tsx`; route adapter: `components/SuperadminBackupHistoryScreen.tsx`; client screen: `components/SuperadminBackupHistoryPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_system/backup_history`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

### UI Data Requirements

The following inventory is derived from this module's local schemas, types, and fixtures. It records the frontend's declared data shape; it does **not** assert that a backend endpoint or durable response contract exists. No backend/OpenAPI source was supplied for this role slice.

| Field / key | Source file and line |
|---|---|
| `date` | `superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowTypes.ts:9`, `superadmin_system/system_backup_history/types/SuperadminBackupHistoryTypes.ts:9` |
| `destination` | `superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowTypes.ts:7`, `superadmin_system/system_backup_history/types/SuperadminBackupHistoryTypes.ts:7` |
| `filtered` | `superadmin_system/system_backup_history/types/SuperadminBackupHistoryEmptyStateTypes.ts:4`, `superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowEmptyStateTypes.ts:4` |
| `onPreviewNotice` | `superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowSchedulePanelComponentTypes.ts:3`, `superadmin_system/system_backup_history/types/SuperadminBackupHistorySchedulePanelComponentTypes.ts:3` |
| `reason` | `superadmin_system/system_backup_history/schemas/SuperadminBackupHistorySchemaContractStatus.ts:9` |
| `records` | `superadmin_system/system_backup_history/types/SuperadminBackupHistoryHistoryPanelComponentTypes.ts:9`, `superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowHistoryPanelComponentTypes.ts:9` |
| `status` | `superadmin_system/system_backup_history/schemas/SuperadminBackupHistorySchemaContractStatus.ts:7`, `superadmin_system/system_backup_history/types/SuperadminBackupHistoryRestoreFlowTypes.ts:8`, `superadmin_system/system_backup_history/types/SuperadminBackupHistoryTypes.ts:8` |
| `zodSchemaDefined` | `superadmin_system/system_backup_history/schemas/SuperadminBackupHistorySchemaContractStatus.ts:8` |

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
- Keep `backup_overview` as a legacy-compatible entry; workflow tabs now navigate to the canonical child route. Rollback by restoring the pre-split parent page client and removing this child route.

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| `tests/SuperadminBackupHistoryAsyncStateContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBackupHistoryMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBackupHistoryQueryKeys.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBackupHistoryRestoreFlowHarness.tsx` | Source present; execution not asserted |
| `tests/SuperadminBackupHistoryRestoreFlowRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBackupHistoryRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminCanonicalMockScenarioHarness.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminSystemBackupHistoryPreviewOnlyApiContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminSystemBackupHistoryScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/harness/SuperadminBackupHistoryHarness.tsx` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

### Submodule size review (2026-10-30)

This leaf has 65 total files, including 60 source files. The count includes the mandatory documentation trio, locale catalogs, host contract stubs, tests/harness, fixtures/scenarios and leaf-owned UI components. The Scope and Non-Scope section defines one named capability for this leaf; no independent second/third workflow or cross-feature business ownership was identified in the source inventory. The canonical sizing rule explicitly says a cohesive workflow is not penalized solely by file count, so no split or feature deletion is justified by count alone.

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

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminBackupHistoryHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_system_backup_history.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. Network-backed error states are deliberately not represented as executable API responses unless a verified module endpoint/auth contract and handler exist.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_system_backup_history.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.


- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.


> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History
- V1: extracted the Backup History workflow into an autonomous route in RBG 6.

---

## Canonical Workflow Contract — Backup History and Restore Point

One autonomous leaf owns both the backup-history and restore-point workflow contracts. This documentation consolidation does not introduce new routes, endpoints, permissions, persistence, or mutation behavior.


### Restore Point workflow (legacy contract identifier: `backup_restore_flow`)

#### Scope and Non-Scope
- Scope: independently refreshable Restore Point workflow at `/superadmin/superadmin_system/backup_history?view=restore`. It was separated from the secondary-navigation workflow in `backup_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

#### Screen Inventory
- Route page: `backup_history/page.tsx` (?view=restore)`; route adapter: `components/SuperadminBackupHistoryRestoreFlowScreen.tsx`; client screen: `components/SuperadminBackupHistoryRestoreFlowPageClient.tsx`.

#### Navigation Contract
- Canonical route: `/superadmin/superadmin_system/backup_history?view=restore`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

#### API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

#### Query Key Registry
- No new query key is introduced by this route split; retain only verified resource keys in the local copied source.

#### Mutation Inventory
- Existing preview-only or unavailable mutation messaging is preserved. No durable mutation is enabled by route decomposition.

#### Permissions and Role Rules
- Owner role: Superadmin. Server authorization remains a host/backend responsibility.

#### State Ownership
- State and helpers are copied into this leaf; no runtime import from a sibling leaf is permitted.

#### Offline and Reconnect Behavior
- No new offline persistence, retry, or background write behavior is introduced.

#### Security and PII Rules
- Preserve source masking and security notices. Do not claim local preview data is live server data.

#### Accessibility Requirements
- Preserve source semantics, keyboard behavior, status messaging, focus handling, and reduced-motion utilities; host browser verification remains pending.

#### Background Tasks
- None introduced.

#### Feature Flags
- No new feature flag inferred.

#### Cache Invalidation
- No cache invalidation behavior added without an existing verified mutation contract.

#### Migration and Rollback
- Keep `backup_overview` as a legacy-compatible entry; workflow tabs now navigate to the canonical child route. Rollback by restoring the pre-split parent page client and removing this child route.

#### Test Coverage Map
- Route contract and direct-refresh marker test are local. Full UI/runtime suites require the host test runner.

#### Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

#### Known Contract Gaps
- Backend aggregate, permissions, and durable mutation contracts remain blocked unless explicitly evidenced in inherited source.

#### Compliance checklist ownership

The single canonical **Rule Compliance Checklist** in the main Backup History feature specification above governs both the Backup History route and the Restore Point workflow documented here. Its 55 items are intentionally not duplicated; workflow-specific API/authorization gaps and host-runtime deferrals remain as stated in the relevant sections.

#### Standalone Run, Mock & Test Harness
- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

#### Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.

#### Deliverables & Version History
- V1: extracted the Restore Point workflow into an autonomous route in RBG 6.
