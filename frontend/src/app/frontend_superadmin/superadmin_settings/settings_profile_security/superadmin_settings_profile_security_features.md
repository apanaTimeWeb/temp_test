---
feature: "superadmin_settings_profile_security"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# profile_security — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Security Settings workflow at `/superadmin/superadmin_settings/profile_security`. It was separated from the secondary-navigation workflow in `profile_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `profile_security/page.tsx`; route adapter: `components/SuperadminProfileSecuritySettingsScreen.tsx`; client screen: `components/SuperadminProfileSecuritySettingsPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/profile_security`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

### UI Data Requirements

The following inventory is derived from this module's local schemas, types, and fixtures. It records the frontend's declared data shape; it does **not** assert that a backend endpoint or durable response contract exists. No backend/OpenAPI source was supplied for this role slice.

| Field / key | Source file and line |
|---|---|
| `activeTab` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:55`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:71`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:55`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:71`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:55`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:71` |
| `browser` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:23`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:45`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:23`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:45`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:23`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:45` |
| `cellClass` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:33`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:33`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:33` |
| `cellRenderer` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:34`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:34`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:34` |
| `colDefs` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:75`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:75`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:75` |
| `columnDefs` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:59`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:59`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:59` |
| `confirmPassword` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:23`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:23`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:23` |
| `currentPassword` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:17`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:17`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:17` |
| `date` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:41`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:41`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:41` |
| `defaultColDef` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:68`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:68`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:68` |
| `device` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:22`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:22`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:22` |
| `domLayout` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:69`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:69`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:69` |
| `email` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:7`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:7`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:7` |
| `field` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:27`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:27`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:27` |
| `filtered` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordEmptyStateTypes.ts:4`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsEmptyStateTypes.ts:4`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorEmptyStateTypes.ts:4` |
| `firstName` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:5`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:5`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:5` |
| `flex` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:30`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:30`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:30` |
| `getRowId` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:71`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:71`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:71` |
| `headerHeight` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:61`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:61`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:61` |
| `headerName` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:26`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:26`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:26` |
| `hide` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:32`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:32`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:32` |
| `ip` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:24`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:42`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:24`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:42`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:24`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:42` |
| `isCurrent` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:26`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:26`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:26` |
| `lastActive` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:25`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:25`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:25` |
| `lastName` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:6`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:6`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:6` |
| `location` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:27`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:43`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:27`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:43`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:27`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:43` |
| `loginAlerts` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:73`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:73`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:73` |
| `loginHistory` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:74`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:74`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:74` |
| `message` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:26`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:29`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:26`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:29`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:26`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:29` |
| `minWidth` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:29`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:29`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:29` |
| `newPassword` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:18`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:18`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:18` |
| `onDirtyChange` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:57`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:57`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:57` |
| `onRevokeSession` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:77`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:77`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:77` |
| `onSave` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:56`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:56`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:56` |
| `pagination` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:62`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:62`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:62` |
| `paginationPageSize` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:63`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:63`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:63` |
| `paginationPageSizeSelector` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:70`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:70`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:70` |
| `path` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:25`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:28`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:25`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:28`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:25`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:28` |
| `phone` | `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityChangePasswordSchema.ts:8`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecuritySettingsSchema.ts:8`, `superadmin_settings/settings_profile_security/schemas/SuperadminProfileSecurityTwoFactorSchema.ts:8` |
| `rowClassRules` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:72`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:72`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:72` |
| `rowData` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:58`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:58`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:58` |
| `rowHeight` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:60`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:60`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:60` |
| `sessions` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:76`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:76`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:76` |
| `sortable` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:31`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:31`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:31` |
| `status` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:44`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:44`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:44` |
| `suppressCellFocus` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:66`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:66`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:66` |
| `suppressPaginationPanel` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:67`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:67`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:67` |
| `theme` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:65`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:65`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:65` |
| `twoFactorEnabled` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordTypes.ts:72`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsTypes.ts:72`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorTypes.ts:72` |
| `valueFormatter` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:36`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:36`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:36` |
| `valueGetter` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:35`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:35`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:35` |
| `width` | `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityChangePasswordSemanticTableTypes.ts:28`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecuritySettingsSemanticTableTypes.ts:28`, `superadmin_settings/settings_profile_security/types/SuperadminProfileSecurityTwoFactorSemanticTableTypes.ts:28` |

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
| `tests/SuperadminProfileSecurityAsyncStateContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityChangePasswordConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityChangePasswordDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityChangePasswordHarness.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityChangePasswordRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityQueryKeys.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecuritySettingsConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileSecuritySettingsDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecuritySettingsRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityTwoFactorConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityTwoFactorDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityTwoFactorHarness.tsx` | Source present; execution not asserted |
| `tests/SuperadminProfileSecurityTwoFactorRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminSettingsProfileSecurityPreviewOnlyApiContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminSettingsProfileSecurityScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/harness/SuperadminProfileSecurityHarness.tsx` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

### Documented component line-ceiling exceptions (2026-10-30)

The canonical rule allows a documented exception when cohesive logic requires it. The following single-route composition/panel files remain cohesive to their owning workflow; shared primitives, typed contracts, state hooks, fixtures and URL configs remain separately owned. No sibling workflow or API contract is added by these exceptions.

| File | Current lines | Rationale |
|---|---:|---|
| `SuperadminProfileSecurityTwoFactorPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |
| `SuperadminProfileSecuritySettingsPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |
| `SuperadminProfileSecurityChangePasswordPageClient.tsx` | 244 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |

### Submodule size review (2026-10-30)

This leaf has 102 total files, including 97 source files. The count includes the mandatory documentation trio, locale catalogs, host contract stubs, tests/harness, fixtures/scenarios and leaf-owned UI components. The Scope and Non-Scope section defines one named capability for this leaf; no independent second/third workflow or cross-feature business ownership was identified in the source inventory. The canonical sizing rule explicitly says a cohesive workflow is not penalized solely by file count, so no split or feature deletion is justified by count alone.

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

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminProfileSecurityHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_settings_profile_security.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. Network-backed error states are deliberately not represented as executable API responses unless a verified module endpoint/auth contract and handler exist.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_settings_profile_security.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.


- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.


> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History
- **RBG60 source audit:** reviewed `profile_security` source coverage and retained the existing contract boundary; static source review only, with host-runtime behavior not asserted.

- V1: extracted the Security Settings workflow into an autonomous route in RBG 6.

---

## Preserved workflow specification: profile_security_change_password

# profile_security_change_password — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Change Password workflow at `/superadmin/superadmin_settings/profile_security?view=change-password`. It was separated from the secondary-navigation workflow in `profile_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `profile_security/page.tsx` (?view=change-password)`; route adapter: `components/SuperadminProfileSecurityChangePasswordScreen.tsx`; client screen: `components/SuperadminProfileSecurityChangePasswordPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/profile_security?view=change-password`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

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
- V1: extracted the Change Password workflow into an autonomous route in RBG 6.

---

## Preserved workflow specification: profile_security_two_factor

# profile_security_two_factor — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable 2FA workflow at `/superadmin/superadmin_settings/profile_security?view=two-factor`. It was separated from the secondary-navigation workflow in `profile_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `profile_security/page.tsx` (?view=two-factor)`; route adapter: `components/SuperadminProfileSecurityTwoFactorScreen.tsx`; client screen: `components/SuperadminProfileSecurityTwoFactorPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/profile_security?view=two-factor`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

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
- V1: extracted the 2FA workflow into an autonomous route in RBG 6.

## RBG 15 — Component Size Exceptions

Static source re-scan (V19, 2026-10-29) found no `.tsx` files in the mapped leaf above the canonical 300-line hard ceiling. No size exceptions are approved. This is a source line-count check only; it does not establish host typecheck, build, test or runtime success.

