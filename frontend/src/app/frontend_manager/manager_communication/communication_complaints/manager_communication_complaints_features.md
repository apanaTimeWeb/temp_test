---
feature: "manager_communication_complaints"
owner_role: "manager"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-28"
last_verified_commit: "host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED (host runtime unavailable)"
---
# manager_communication_complaints — Feature Contract

## 1. Scope and Non-Scope

This module is the autonomous primary sidebar owner for **Complaints**. Its canonical route is `/frontend_manager/manager_communication/communication_complaints`. The module-root `page.tsx` delegates to `ManagerComplaintsMain`; the Main renders only this leaf’s assigned screen; query-string values cannot switch to sibling sidebar destinations. Legacy grouped and aggregate route owners are not shipped as active routes. This leaf is the sole owner of its canonical route.

Terminal owner: `communication_complaints`. Current physical inventory: 42 files total (35 non-Markdown, 7 Markdown). Components: 3; API implementations: 1; query-key registries: 1; hooks: 2; schemas: 2; tests: 5; mock/fixture/scenario files: 3; host stubs: 1.

Non-scope: backend implementation, backend authorization enforcement, database persistence and undocumented endpoint invention are outside this supplied frontend ZIP.

## 2. Screen Inventory

- Primary sidebar destination: **Complaints**.
- Canonical entry: `/frontend_manager/manager_communication/communication_complaints`.
- URL builder: `config/manager_communication_complaints.url_config.ts` (`MANAGER_COMMUNICATION_COMPLAINTS_ROUTES.root`).
- Canonical route: `/frontend_manager/manager_communication/communication_complaints`.
- Compatibility: legacy owner roots are not included as active route owners in this release. The active feature implementation is owned by this canonical leaf; callers must use its canonical route.
- View contract: this module's Main renders its assigned primary view; the canonical sidebar does not route to sibling destinations through this module.

Current component inventory (source paths):
- `components/ManagerCommunicationComplaintsMain.tsx`
- `components/manager_communication_complaints_empty_states/ManagerCommunicationComplaintsEmptyState.tsx`
- `components/manager_communication_complaints_views/ManagerCommunicationComplaintsPage.tsx`


## 3. Navigation Contract

- **Owning leaf:** `frontend_manager/manager_communication/communication_complaints/`.
- **Canonical route:** `/frontend_manager/manager_communication/communication_complaints`.
- **Canonical URL config:** `frontend_manager/manager_communication/communication_complaints/config/manager_communication_complaints.url_config.ts`.
- The role shell is owned by `frontend_manager/manager_navigation/navigation/`; this leaf imports no sibling feature implementation.
- Cross-feature navigation targets the frozen canonical route for the destination feature. Domain-root pages are redirect-only and do not own feature views.
- Legacy `/manager/manager_*` paths and aggregate query-view roots are not shipped as active route owners.

## 4. API Contract

- `manager_complaints_api/ManagerCommunicationComplaintsApi.ts` exports: `fetchManagerComplaintsNotices`, `fetchManagerCommunicationComplaints`.

- Exact URL config source: `config/manager_communication_complaints.url_config.ts`.
- If this module has only a folder-contract note, the backend endpoint, method, payload, and response shape are **not supplied**; do not invent them.
- Request/response validation is defined only where the module schemas and API source provide concrete shapes.

Observed API files and exports:
- `api/ManagerCommunicationComplaintsApi.ts: fetchManagerCommunicationComplaints`

Only API behavior supported by current source artifacts is described. Backend correctness is not inferred.

## 5. Query Key Registry

- `constants/ManagerCommunicationComplaintsQueryKeys.ts: MANAGER_COMMUNICATION_QUERY_KEYS`

## 6. Mutation Inventory

- Module-owned API files: 1.
- MSW write handlers (`POST`/`PUT`/`PATCH`/`DELETE`) observed in this submodule: 0.
- Unverified write actions must remain disabled/fail-closed until an authoritative contract is supplied.
- Backend idempotency, ownership checks and persistence are `BACKEND_ENFORCEMENT_REQUIRED_NOT_VERIFIABLE_FROM_FRONTEND`.

## 7. Permissions and Role Rules

- Treat all write-like actions as unavailable unless an authoritative write API contract exists in `manager_complaints_api/`.
- Keep resource identifiers aligned between URL, component state, query key, request and rendered result.
- Validate user-entered draft data using the module schema where present.
- Render user-provided text as text; do not use unsafe HTML rendering.
- Any role-specific permission rule absent from the supplied source is not inferred here and must be confirmed by the product contract.

Frontend permission-denied UX does not prove backend authorization. No backend source/tests were supplied.

## 8. State Ownership

- **Canonical rendered page entry:** `page.tsx` (framework route owner).
- **Primary rendered component import:** `Not resolved from the supplied page.tsx imports; see route source directly.`.
- **Module-owned query-key registry:** `api/manager_communication_complaints.query_keys.ts`.
- **Hooks physically present (2):** `hooks/ManagerCommunicationComplaintsDialogFocus.ts`, `hooks/useManagerCommunicationComplaintsComplaints.ts`.
- **Types physically present (3):** `types/ManagerCommunicationComplaintsComponentTypes.ts`, `types/ManagerCommunicationComplaintsMainTypes.ts`, `types/ManagerCommunicationComplaintsTypes.ts`.
- **Schemas physically present (2):** `schemas/ManagerCommunicationComplaintsNotificationDraftSchema.ts`, `schemas/ManagerCommunicationComplaintsSchema.ts`.
- **Zustand store inventory:** No module-owned `*Store.ts` implementation was found in the supplied module inventory..
- This section describes physical source evidence only. API contracts, persistence and backend behavior are not inferred from local sample state.

- UI data property candidates extracted from component source:

| Field candidate | Evidence | Contract qualification |
|---|---|---|
| `date` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `description` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `id` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `resolvedBy` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `resolvedDate` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `status` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `student` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `title` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |
| `toLowerCase` | Source expressions in module TSX | Display/filter/identity behavior is conditional on the owning component using this field; confirm against the source type before adding to an API contract. |

## 9. Offline and Reconnect Behavior

- Sample fixture files are listed in `manager_complaints_mocks/` and can support a local/demo display only where the source explicitly imports them.
- Offline persistence, service workers, background sync and durable local storage are not claimed unless implemented by an identified source file.
- If the network/API is unavailable, the UI must show an explicit error/empty state rather than presenting sample rows as saved backend data.

No runtime offline/reconnect behavior was executed during this source-only audit.

## 10. Security and PII Rules

- Preserve the documented role/permission and PII requirements above.
- Use module-owned display masking where the source exposes personal phone data.
- Do not expose raw API errors or present synthetic data as live persistence.
- API-contract status: no flagged response-shape mapping in the targeted list.
- Backend enforcement: `BACKEND_ENFORCEMENT_REQUIRED_NOT_VERIFIABLE_FROM_FRONTEND`.

## 11. Accessibility Requirements

- Empty-state components, where wired, use `role="status"`, `aria-live="polite"` and a module-owned `data-testid`.
- Preserve accessible names, keyboard operation, focus restoration and meaningful status feedback.
- Full browser/screen-reader verification remains `DEFERRED_TO_HOST_RUNTIME`.

## 12. Background Tasks

- No scheduled job, worker, polling loop, or background task is declared by this module documentation.
- If a future implementation adds one, document its trigger, cancellation, visibility, retry and cleanup behavior here before claiming it is active.

Source scan found 0 timer/worker/service-worker-like references. No background task is claimed without source evidence.

## 13. Feature Flags

No feature-flag implementation was identified in this module source scan. This is a source observation, not a claim that the host has no flags.

## 14. Cache Invalidation

No explicit query-cache invalidation/update reference was identified in this module source scan. Host cache behavior is not inferred.
- **Sample-data ownership:** This module owns only the sample collections used by its active workflow; unrelated WhatsApp-log, template, or notification-history collections are not re-exported from this module.
- **Component type isolation:** component props and UI/state type declarations are centralized in `types/ManagerCommunicationComplaintsComponentTypes.ts`. Component files import needed types from the module-owned type contract and re-export previously public type names for compatibility.

## 15. Migration and Rollback

- **Immutable baseline:** `frontend-manager-v37-fix(1).zip`; SHA-256 `08368565c582d1e9149bbc9fc84489a5f5cb1d26c94104ef336f6f2bf037f5e5`.
- **Current owner path:** `frontend_manager/manager_communication/communication_complaints/`.
- **Canonical route:** `/frontend_manager/manager_communication/communication_complaints`.
- The eight domain roots contain only their domain layout, redirect page, documentation trio and canonical child leaves. Feature loading/error state is leaf-owned.
- Legacy manager roots were migrated into the frozen leaf owners and are absent from the release application tree; no legacy route root is preserved as a second active owner.
- **Rollback:** reconstruct from the immutable v37 archive and the release change manifest; do not overwrite the baseline archive.
- **Host-dependent gates:** semantic typecheck, lint/test runner, production build, live route resolution, browser E2E, backend persistence/auth/tenant checks remain `DEFERRED_TO_HOST_RUNTIME` because the supplied archive does not include the complete host package/runtime setup.

## 16. Test Coverage Map

Module tests (physical source inventory):
- `tests/ManagerCommunicationComplaintsDisplayValue.test.ts`
- `tests/ManagerCommunicationComplaintsHandlers.test.ts`
- `tests/ManagerCommunicationComplaintsNotificationDraftSchema.test.ts`
- `tests/ManagerCommunicationComplaintsSchema.test.ts`
- `tests/ManagerCommunicationComplaintsUtilities.test.ts`

Module mocks and fixtures (physical source inventory):
- `mocks/manager_communication_complaints_fixtures/ManagerCommunicationComplaintsApiFixtures.ts`
- `mocks/manager_communication_complaints_handlers/ManagerCommunicationComplaintsHandlers.ts`
- `mocks/scenarios/manager_communication_complaints.scenarios.ts`

Relevant Playwright E2E files:
- No module-specific Playwright filename matched this module; role-wide Playwright sources remain under `playwright_E2E/`.

Test execution status: `DEFERRED_TO_HOST_RUNTIME` because the supplied archive has no root package manifest or installed test runner. File presence does not establish passing behavior.

## 17. Architecture Exceptions

No `// architecture-exception:` marker was identified in this module source scan.

## 18. Known Contract Gaps

- Host package/TypeScript/Next config and installed dependencies are not included in the role archive, so semantic typecheck, production build and browser E2E execution require the host project.
- Product-specific write contracts not present in `manager_complaints_api/` remain unavailable; preserve fail-closed UI behavior until supplied.
- Runtime route, keyboard, responsive and accessibility verification remains a host-runtime task.



- Host runtime unavailable: semantic typecheck, lint, unit-test execution, production build, browser E2E and live API verification are deferred.

## 19. Rule Compliance Checklist (35+ Verification Items)

- **1. Domain-root quarantine — PASS.** Domain implementation folders are nested under the terminal submodule; root retains route/framework boundaries and master docs.
- **2. Terminal submodule name — PASS.** `manager_communication_complaints` is the owning terminal submodule.
- **3. Global file prefixes — PASS.** Static architecture audit validates submodule-owned filename prefixes.
- **4. Nested folder prefixes — PASS.** Static architecture audit validates internal folder prefixes and canonical categories.
- **5. No sub-submodules — PASS.** No nested child directory is treated as an autonomous submodule.
- **6. Documentation trio — PASS.** `manager_communication_complaints_features.md`, `manager_communication_complaints_forbidden.md`, `manager_communication_complaints_theme_contract.md` exist.
- **7. 22 canonical feature sections — PASS.** All 22 V2.11 feature-document sections are generated below from source evidence and explicit verification status.
- **8. URL configuration — PASS.** URL config: `config/manager_communication_complaints.url_config.ts`; exports: `MANAGER_COMMUNICATION_COMPLAINTS_ROUTES`, `MANAGER_COMMUNICATION_COMPLAINTS_API`.
- **9. Existing route preservation — PASS.** Current root route: `/frontend_manager/manager_communication/communication_complaints`; query contract retained unless documented otherwise.
- **10. API method/URL ownership — PASS.** 1 API/URL files detected; no backend implementation was supplied.
- **11. Unsupported domain API mapping — NOT_APPLICABLE.** No flagged cross-domain mapping found in the targeted fail-closed set.
- **12. Query Key Registry — PASS.** 1 query-key registry file(s) identified.
- **13. Mutation inventory — PASS.** No module-owned MSW write handler found.
- **14. React Hook Form / Zod schemas — PASS.** 2 schema files identified; form-level semantic verification is runtime-deferred.
- **15. Module-owned mocks — PASS.** 3 mock/fixture files identified.
- **16. Co-located tests — PASS.** 6 test files identified.
- **17. Standalone test harness — PASS.** Module-local harness documentation exists; host test execution is deferred.
- **18. Loading states — NOT_VERIFIED.** Source-only review; full browser loading behavior not executed.
- **19. Empty states — NOT_VERIFIED.** Per-view empty-state reachability remains part of the role-wide UI audit.
- **20. Error/retry states — NOT_VERIFIED.** Browser/API retry flows require host runtime.
- **21. Permissions / role rules — NOT_VERIFIED.** Frontend-only permission UX can be inspected; backend enforcement cannot be verified.
- **22. PII display masking — NOT_VERIFIED.** No claim beyond source scan.
- **23. Accessibility labels / status — NOT_VERIFIED.** Full keyboard/screen-reader checks require host browser.
- **24. Keyboard/focus behavior — NOT_VERIFIED.** Static code cannot establish complete browser focus behavior.
- **25. State ownership — NOT_VERIFIED.** 0 state files identified.
- **26. Offline/reconnect — NOT_VERIFIED.** No runtime offline/reconnect test executed; documented source behavior is quoted below.
- **27. Background tasks — PASS.** 0 timer/worker/service-worker references found.
- **28. Feature flags — PASS.** 0 feature-flag-like references found.
- **29. Cache invalidation — NOT_VERIFIED.** 0 query-cache invalidation/update references found.
- **30. CSV/export formula safety — NOT_VERIFIED.** Not applicable or not verified for this module.
- **31. Stable list keys — PASS.** Targeted static source regression audit reports zero violations.
- **32. No barrel files — PASS.** Targeted static source regression audit reports zero violations.
- **33. No direct fetch/Axios — PASS.** Targeted static source regression audit reports zero violations outside approved tests/mocks.
- **34. Exact-case import resolution — PASS.** Current role-wide static resolver checked 2,201 relative/role-local internal import edges with zero unresolved paths; see `audit_evidence/MGR_V41_FINAL_SOURCE_AUDIT_RECHECK.json`.
- **35. Locale catalog parity — PASS.** Role-wide locale validator passes source catalogs after submodule prefix normalization.
- **36. Semantic typecheck — DEFERRED_TO_HOST_RUNTIME.** No host package.json/tsconfig/package lock supplied.
- **37. Lint — DEFERRED_TO_HOST_RUNTIME.** No host package manifest or lint script supplied.
- **38. Unit/component test execution — DEFERRED_TO_HOST_RUNTIME.** Test files exist, but Vitest/RTL execution requires host dependencies.
- **39. Production build — DEFERRED_TO_HOST_RUNTIME.** No host Next.js package manifest/build configuration supplied.
- **40. Playwright browser E2E — DEFERRED_TO_HOST_RUNTIME.** Playwright source syntax passes; browser execution not run.
- **41. Backend authorization/data isolation — BACKEND_ENFORCEMENT_REQUIRED_NOT_VERIFIABLE_FROM_FRONTEND.** Backend source/tests are not supplied.
- **42. Architecture sizing — PASS_SOURCE_CHECKED (5-gate + Anti-Bloat review).** 44 current physical files. The canonical prompt sets 5–20 files as the target and prohibits a >25-file mega-submodule when multiple distinct operational workflows are combined; it explicitly protects a cohesive workflow with complete tests/types/mocks from count-only penalties. This leaf has one page entry and one URL config; modals, drawers, table views and wizard steps remain internal components. Physical count is recorded for ongoing review, not treated as a stand-alone failure.
- **43. Human architectural decisions — NOT_APPLICABLE.** No unresolved legacy owner decision identified for this module.

## 20. Standalone Run, Mock & Test Harness

- `mocks/`: 3 module-owned TS/TSX/JSON fixture/handler files physically present.
- `tests/`: 5 module-owned test/spec source files physically present (harness support files inventoried separately).
- `tests/harness/`: canonical `bootstrap.ts` exists: yes; harness docs: 2 Markdown files.ts` exists: yes; harness docs: 2 Markdown files.ts` exists: yes; harness docs: 2 Markdown files.
- Host commands after integration: `npx vitest run <module-owned test path>` and `npx playwright test <relevant E2E path>`.
- Current execution status: `DEFERRED_TO_HOST_RUNTIME`; no unit or browser test execution is claimed.

## 21. Module Portability & Host Integration Guide

- Terminal import prefix: `@/app/frontend_manager/manager_communication/communication_complaints/`.
- Canonical category directories: `components/`, `hooks/`, `api/`, `state/`, `types/`, `schemas/`, `mocks/`, `utils/`, `tests/`, `locales/`, `constants/` where applicable.
- Domain compatibility locale catalogs are named `manager_communication_complaints_domain_en.json` and `manager_communication_complaints_domain_hi.json` while retaining the `manager.manager_complaints` translation namespace.
- If module-specific namespace catalogs exist, they are named `manager_communication_complaints_en.json` and `manager_communication_complaints_hi.json`.
- Host providers, locked dependency versions and alias resolution must be verified in the integrating application; no host manifest was supplied.

## 22. Deliverables & Version History (Portability score pending host verification)

- **Release:** v38 canonical Manager Library module rebuild, dated 2026-10-26.
- **Structural portability:** source-level folder, route, import/export and documentation gates are recorded in `RE_AUDIT_CHECKLIST_RESULT.md`.
- **Portability score:** `NOT VERIFIED` until the host dependencies, semantic typecheck, build, test runner and browser checks run in the actual host repository. Do not infer a full 8/8 score from syntax checks alone.
- **Baseline integrity:** original v37 ZIP SHA-256 remains unchanged.
- **API contract policy:** no backend endpoint or mutation behavior is invented where the source archive lacks an authoritative contract.

