---
feature: "superadmin_plans_promotions"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# plans_promotions — Feature Specification

## Scope and Non-Scope
- Scope: independently refreshable Promo Codes & Offers workflow at `/superadmin/superadmin_plans/plans_promotions`. It was separated from the secondary-navigation workflow in `billing_overview`.
- Non-scope: sibling workflow implementation, host authentication/tenant enforcement, and backend behavior not proven by supplied contracts.

## Screen Inventory
- Route page: `plans_promotions/page.tsx`; route adapter: `components/SuperadminPlansPromotionsScreen.tsx`; client screen: `components/SuperadminPlansPromotionsPageClient.tsx`.

## Navigation Contract
- Canonical route: `/superadmin/superadmin_plans/plans_promotions`. Secondary navigation points to sibling canonical routes; this route is directly refreshable.

## API Contract
- Status: `BLOCKED_BY_SUPPLIED_SCOPE` while the authoritative durable request/write contract is outside the supplied scope. No endpoint, field, permission, or persistence behavior is invented.

### UI Data Requirements

The following inventory is derived from this module's local schemas, types, and fixtures. It records the frontend's declared data shape; it does **not** assert that a backend endpoint or durable response contract exists. No backend/OpenAPI source was supplied for this role slice.

The current route renders a local sample-promotion card list and a preview-only form; it does not render a semantic table or provide table sorting/pagination state. The three legacy table-era placeholder files (semantic-table hook, semantic-table type bundle, and stable-row-key utility) were verified to contain comments only and have no source consumer; they are removed from this leaf. The active route renders a promotion card list rather than a semantic table. The existing empty-state component is retained and wired for a zero-row list.

Removed comment-only, unreferenced legacy paths (this leaf):
- `hooks/useSuperadminPlansPromotionsSemanticTableState.ts`
- `types/SuperadminPlansPromotionsSemanticTableTypes.ts`
- `utils/SuperadminPlansPromotionsStableRowKey.ts`


| Field / key | Source file and line |
|---|---|
| `amount` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:6` |
| `code` | `superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema.ts:10`, `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:26` |
| `date` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:5` |
| `discount` | `superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema.ts:13`, `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:27` |
| `discountAmountMinor` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:28` |
| `discountCurrencyCode` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:29` |
| `expiry` | `superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema.ts:20`, `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:30` |
| `filtered` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsEmptyStateTypes.ts:4` |
| `gst` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:9` |
| `maxUses` | `superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema.ts:21`, `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:32` |
| `method` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:8` |
| `status` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:33`, `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:7` |
| `tenant` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:4` |
| `uses` | `superadmin_plans/plans_promotions/types/SuperadminPlansPromotionsTypes.ts:31` |

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
- Keep `billing_overview` as a legacy-compatible entry; workflow tabs now navigate to the canonical child route. Rollback by restoring the pre-split parent page client and removing this child route.

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| `tests/SuperadminCanonicalMockScenarioHarness.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsAsyncStateContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsConfirmHookContract.test.tsx` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsCurrencySubunitContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsPreviewOnlyApiContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsPromoSchema.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsQueryKeys.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsRouteContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminPlansPromotionsScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/harness/SuperadminPlansPromotionsHarness.tsx` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions
- Runtime dependencies are copied locally under Strict WET; no cross-leaf imports are introduced.

### Documented component line-ceiling exceptions (2026-10-30)

The canonical rule allows a documented exception when cohesive logic requires it. The following single-route composition/panel files remain cohesive to their owning workflow; shared primitives, typed contracts, state hooks, fixtures and URL configs remain separately owned. No sibling workflow or API contract is added by these exceptions.

| File | Current lines | Rationale |
|---|---:|---|
| `SuperadminPlansPromotionsPageClient.tsx` | 249 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |

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

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminPlansPromotionsHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_plans_promotions.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. Network-backed error states are deliberately not represented as executable API responses unless a verified module endpoint/auth contract and handler exist.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_plans_promotions.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.


- Use the host project's existing test runner. Local fixture/handler/scenario files are included. Host package configuration is outside this archive.

## Module Portability & Host Integration Guide
- Merge the route folder into the existing `frontend_superadmin` App Router tree. Confirm host rewrites documented in `INTEGRATION_GUIDE.md`.


> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History
- **RBG59 source audit:** reviewed `plans_promotions` source coverage and retained the existing contract boundary; static source review only, with host-runtime behavior not asserted.

- V1: extracted the Promo Codes & Offers workflow into an autonomous route in RBG 6.

## RBG 15 — Component Size Exceptions

Static source re-scan (V19, 2026-10-29) found no `.tsx` files in the mapped leaf above the canonical 300-line hard ceiling. No size exceptions are approved. This is a source line-count check only; it does not establish host typecheck, build, test or runtime success.

