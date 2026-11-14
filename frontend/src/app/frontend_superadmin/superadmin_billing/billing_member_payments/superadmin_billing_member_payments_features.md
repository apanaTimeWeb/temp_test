---
feature: "superadmin_billing_member_payments"
owner_role: "superadmin"
module_version: 2
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# member_payments — Feature Specification

## Scope and Non-Scope

- Scope: autonomous, directly refreshable route `/superadmin/superadmin_billing/billing_overview?view=member_payments` owned by `superadmin_billing/billing_overview/page.tsx`, rendered by `superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsScreen.tsx` and `superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsPageClient.tsx`.
- Non-scope: sibling sub-modules, host authentication/tenant enforcement, backend behavior not evidenced in the supplied archive, and host-level build/test configuration.

## Screen Inventory

- Screen adapter: `superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsScreen.tsx`.
- Main client component: `superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsPageClient.tsx`.
- Route view key: `payments`.

## Navigation Contract

- Public route: `/superadmin/superadmin_billing/billing_overview?view=member_payments`.
- Expected route marker: `payments`.
- Role route registry: `superadmin_navigation/navigation_shell/config/superadmin_navigation_shell.url_config.ts` (domain route maps); API endpoints remain leaf-owned.
- Module URL contract: `superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config.ts`.
- Legacy `?view=` URLs are mapped by the domain redirect adapter, and non-view query parameters (including `id`) are preserved. Hyphenated public aliases require the host rewrite entries in `INTEGRATION_GUIDE.md` because host routing config is outside this ZIP.

## API Contract

- Module API boundary: `superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments_read.api.ts`.
- Source-backed API files: `superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments_read.api.ts`.
- Endpoint constants referenced by the client: `PAYMENTS_LIST`, `REFUNDS_LIST`.
- Exported API methods: `fetchSuperadminBillingOverviewMemberPayments`, `fetchSuperadminFinanceRefunds`.

### UI Data Requirements

The inventory below is derived from files in this module. It is not a claim that a backend response exists unless the field is present in a supplied schema or verified API contract.

| Field / key | Source file |
|---|---|
| `amountMinor` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `cellClass` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `cellRenderer` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `className` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `columnDefs` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `currencyCode` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `date` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `deductionAmountMinor` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `defaultColDef` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `deletionReason` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `depositHeldMinor` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `domLayout` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `exitDate` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `field` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `filtered` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `flex` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `getRowId` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `headerHeight` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `headerName` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `hide` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `id` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `lateFeeMinor` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `minWidth` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `mode` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `name` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts` |
| `netRefundMinor` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `pagination` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `paginationPageSize` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `paginationPageSizeSelector` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `paymentMethod` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `processedDate` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `receiptNumber` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `receivedBy` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `rejectionReason` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `remark` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `requestedDate` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `rowClassRules` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `rowData` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `rowHeight` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `smartId` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `sortable` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `status` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `studentName` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `suppressCellFocus` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `suppressPaginationPanel` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `theme` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `txnId` | `superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts, superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `valueFormatter` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `valueGetter` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |
| `width` | `superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types.ts` |

Screen/component evidence:
- `superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsScreen.tsx`
- `superadmin_billing/billing_member_payments/components/SuperadminBillingOverviewMemberPaymentsPageClient.tsx`

## Query Key Registry

- Registry: `superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments.query_keys.ts`.
- Resource identity: `superadmin_member_payments`; existing domain resource keys are retained locally where required to preserve cache identity.
- Query keys must remain resource-specific; sibling modules must not import this registry.

## Mutation Inventory

- No verified write method is declared in this module API boundary.
- Write controls must remain disabled/read-only or explicitly preview/unavailable; local state changes must not be presented as durable server success.

## Permissions and Role Rules

- Owner role: Superadmin. Client-side route guards are UX protection only; server authorization is outside the supplied frontend archive.
- Do not infer new permissions or role grants.

## State Ownership

- Local hooks: `superadmin_billing/billing_member_payments/hooks/useSuperadminBillingOverviewMemberPaymentsQueries.ts`, `superadmin_billing/billing_member_payments/hooks/useSuperadminBillingOverviewMemberPaymentsSemanticTableState.ts`, `superadmin_billing/billing_member_payments/hooks/useSuperadminBillingOverviewMemberPaymentsUrlFilter.ts`.
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
| `tests/SuperadminBillingMemberPaymentsScaleFixtureTiers.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsCurrencySubunitContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsDateTimeFormatting.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsDisplayValue.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsHarness.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsMockScenarioCatalog.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsRouteBoundaryContract.test.ts` | Source present; execution not asserted |
| `tests/SuperadminBillingOverviewMemberPaymentsCanonicalMockScenarioHarness.test.tsx` | Source present; execution not asserted |
| `tests/harness/SuperadminBillingOverviewMemberPaymentsHarness.tsx` | Source present; execution not asserted |
| `tests/harness/SuperadminBillingOverviewMemberPaymentsWorkflowBootstrap.ts` | Source present; execution not asserted |
| `tests/harness/bootstrap.ts` | Source present; execution not asserted |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Architecture Exceptions

- None approved. Small helpers and fixtures are duplicated locally under the WET rule; no sibling business imports are allowed.
- Status-only API boundaries are deliberate contract blockers, not permission to invent endpoints.

### Documented component line-ceiling exceptions (2026-10-30)

The canonical rule allows a documented exception when cohesive logic requires it. The following single-route composition/panel files remain cohesive to their owning workflow; shared primitives, typed contracts, state hooks, fixtures and URL configs remain separately owned. No sibling workflow or API contract is added by these exceptions.

| File | Current lines | Rationale |
|---|---:|---|
| `SuperadminBillingOverviewMemberPaymentsPageClient.tsx` | 252 | Single-route screen composition keeps the leaf-owned table/form/filter/preview layout together; remaining UI primitives and state/contract boundaries are module-local. Splitting solely for line count would create one-use fragments without an independent workflow. |

### Submodule size review (2026-10-30)

This leaf has 50 total files, including 45 source files. The count includes the mandatory documentation trio, locale catalogs, host contract stubs, tests/harness, fixtures/scenarios and leaf-owned UI components. The Scope and Non-Scope section defines one named capability for this leaf; no independent second/third workflow or cross-feature business ownership was identified in the source inventory. The canonical sizing rule explicitly says a cohesive workflow is not penalized solely by file count, so no split or feature deletion is justified by count alone.

## Known Contract Gaps

- Backend behavior, server authorization, tenant isolation, and runtime idempotency must be verified in the host application.
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
- NOT_VERIFIED — static portability criteria have not been independently host-verified.
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
- [ ] Rule 78: Nullable primitive values use the host `@/lib/display_value` contract; ReactNode cell renderers are preserved
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

**Canonical scenario selector (source audit update):** `tests/harness/SuperadminBillingOverviewMemberPaymentsHarness.tsx` exposes `ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, and `FORBIDDEN_403` through the local registry `mocks/scenarios/superadmin_billing_member_payments.scenarios.ts`. The selected key is reflected in the isolated harness state and test-visible data attributes. For the verified `payments` list endpoint, the selector switches module-owned MSW handlers for active records, empty data, HTTP 500, delayed network error, HTTP 401, and HTTP 403; the corresponding contract tests are present but were not executed in this environment.

**Deterministic scale tiers:** `mocks/fixtures/superadmin_billing_member_payments.scale-stress-fixtures.ts` provides deterministic 10/100/500 synthetic preview tiers derived from this module's existing local fixture values or static UI options. These are isolated test fixtures; they do not represent production records or establish a backend API contract.



- Module tests: `tests/`.
- Harness files: `superadmin_billing/billing_member_payments/tests/SuperadminBillingOverviewMemberPaymentsHarness.tsx`.
- Fixtures: `mocks/fixtures/`; handlers: `mocks/handlers/`; scenarios: `mocks/scenarios/`.
- No run command is invented because this role archive does not include a package manifest or test-runner config.

## Module Portability & Host Integration Guide

- Copy this leaf as an isolated unit; it has no sibling business imports.
- Configure host alias `@/app/frontend_superadmin` and the preserved Next.js route rewrites.
- Static portability status: NOT_VERIFIED; host build/runtime evidence is unavailable.


> **Portability evidence status:** `NOT_VERIFIED`. No numeric portability score is claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History

- **V24:** route-specific autonomous sub-module; module-owned URL/query-key/API boundary, locale pair, mocks, tests, and documentation trio.
- **Verification:** static architecture and syntax checks only; host runtime gates remain deferred.

### Reviewed source-size exceptions (2026-10-28)

The following line-ceiling exceptions are explicit and reviewable; they are not represented as files under the nominal size limit.

- `SuperadminBillingOverviewMemberPaymentsPageClient.tsx` — 252 lines (canonical component ceiling 300 lines; source count verified 2026-10-29). Cohesive-exception rationale: this page-client/modal/panel owns its tightly coupled local state, event handlers, focus behavior, and rendered view; splitting it without host semantic typecheck and UI tests would create an unverified prop contract. Keep this exception visible and re-evaluate during host integration.
