---
feature: "manager_navigation_navigation"
owner_role: "manager"
module_version: 1
api_contract_source: "web-zip-extraction"
last_verified_date: "2026-10-28"
last_verified_commit: "host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED (host runtime unavailable)"
---
# manager_navigation_navigation — Feature Contract

## 1. Scope and Non-Scope

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.

Terminal owner: `navigation`. Current physical inventory: 27 files total (22 non-Markdown, 5 Markdown). Components: 3; API implementations: 0; query-key registries: 0; hooks: 0; schemas: 0; tests: 1; mock/fixture/scenario files: 1; host stubs: 1.

Non-scope: backend implementation, backend authorization enforcement, database persistence and undocumented endpoint invention are outside this supplied frontend ZIP.

## 2. Screen Inventory

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.

Current component inventory (source paths):
- `components/ManagerNavigationNavigationHeader.tsx`
- `components/ManagerNavigationNavigationRoute.tsx`
- `components/ManagerNavigationNavigationSidebar.tsx`


## 3. Navigation Contract

- Route role: shared manager shell navigation, not a standalone business screen.
- Navigation destinations are sourced from leaf modules’ URL config exports; the shell URL config owns only `ROOT`, `DASHBOARD`, `HELP_SUPPORT`, and `NOTIFICATIONS`.
- Terminal URL config: `config/manager_navigation_navigation.url_config.ts`.
- URL config exports: `MANAGER_NAVIGATION_NAVIGATION_ROUTES` and `MANAGER_NAVIGATION_NAVIGATION_API`. The API object is intentionally empty because no shell-owned backend contract is supplied.
- Legacy query-view mappings remain preserved in their original root pages until canonical sibling screen/API parity is proven. Proposed mappings are not treated as implemented redirects.

```ts
// Host alias pattern for this terminal module
@/app/frontend_manager/manager_navigation/navigation/...
```

## 4. API Contract

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.

Observed API files and exports:
- No API client exports detected. No endpoint is inferred.

Only API behavior supported by current source artifacts is described. Backend correctness is not inferred.

## 5. Query Key Registry

- No module-owned Query Key Registry file was identified in `constants/`; host query behavior is not inferred.

## 6. Mutation Inventory

- Module-owned API files: 0.
- MSW write handlers (`POST`/`PUT`/`PATCH`/`DELETE`) observed in this submodule: 0.
- Unverified write actions must remain disabled/fail-closed until an authoritative contract is supplied.
- Backend idempotency, ownership checks and persistence are `BACKEND_ENFORCEMENT_REQUIRED_NOT_VERIFIABLE_FROM_FRONTEND`.

## 7. Permissions and Role Rules

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.

Frontend permission-denied UX does not prove backend authorization. No backend source/tests were supplied.

## 8. State Ownership

- **Canonical rendered page entry:** `page.tsx` (framework route owner).
- **Primary rendered component import:** `Not resolved from the supplied page.tsx imports; see route source directly.`.
- **Module-owned query-key registry:** None found in the supplied source..
- **Hooks physically present (0):** None..
- **Types physically present (1):** `types/ManagerNavigationNavigationComponentTypes.ts`.
- **Schemas physically present (0):** None..
- **Zustand store inventory:** No module-owned `*Store.ts` implementation was found in the supplied module inventory..
- This section describes physical source evidence only. API contracts, persistence and backend behavior are not inferred from local sample state.

- UI data property candidates were not listed in the previous section; no new fields are inferred by this inventory refresh.

## 9. Offline and Reconnect Behavior

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.

No shell-owned offline/reconnect state machine is present in the inspected components; network recovery behavior belongs to the host and was not runtime-tested.

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

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.

Source scan found 2 timer/worker/service-worker-like references. No background task is claimed without source evidence.

## 13. Feature Flags

No feature-flag implementation was identified in this module source scan. This is a source observation, not a claim that the host has no flags.

## 14. Cache Invalidation

No explicit query-cache invalidation/update reference was identified in this module source scan. Host cache behavior is not inferred.
- **Component type isolation:** component props and UI/state type declarations are centralized in `types/ManagerNavigationNavigationComponentTypes.ts`. Component files import needed types from the module-owned type contract and re-export previously public type names for compatibility.

## 15. Migration and Rollback

- Baseline: supplied `frontend-manager-v36-fix-done.zip`.
- Current source root: `frontend_manager/manager_navigation/navigation/`.
- Route shell remains at `frontend_manager/manager_navigation/page.tsx` where present.
- Rollback: restore only changed paths from the frozen `frontend-manager-v39.zip` baseline using the final change manifest; never overwrite the original archive.
- Legacy routes/query values are retained until a candidate sibling destination has verified screen and contract parity.

## 16. Test Coverage Map

Module tests (physical source inventory):
- `tests/ManagerNavigationNavigationContract.test.ts`

Module mocks and fixtures (physical source inventory):
- `mocks/scenarios/manager_navigation_navigation.scenarios.ts`

Relevant Playwright E2E files:
- `playwright_E2E/frontend_manager_e2e/manager_navigation/manager_navigation_e2e.spec.ts`

Test execution status: `DEFERRED_TO_HOST_RUNTIME` because the supplied archive has no root package manifest or installed test runner. File presence does not establish passing behavior.

## 17. Architecture Exceptions

No `// architecture-exception:` marker was identified in this module source scan.

## 18. Known Contract Gaps

Source-backed contract: this shell provides navigation chrome and route links; it does not own business workflows or backend persistence.



- Host runtime unavailable: semantic typecheck, lint, unit-test execution, production build, browser E2E and live API verification are deferred.

## 19. Rule Compliance Checklist (35+ Verification Items)

- **1. Domain-root quarantine — PASS.** Domain implementation folders are nested under the terminal submodule; root retains route/framework boundaries and master docs.
- **2. Terminal submodule name — PASS.** `manager_navigation_navigation` is the owning terminal submodule.
- **3. Global file prefixes — PASS.** Static architecture audit validates submodule-owned filename prefixes.
- **4. Nested folder prefixes — PASS.** Static architecture audit validates internal folder prefixes and canonical categories.
- **5. No sub-submodules — PASS.** No nested child directory is treated as an autonomous submodule.
- **6. Documentation trio — PASS.** `manager_navigation_navigation_features.md`, `manager_navigation_navigation_forbidden.md`, `manager_navigation_navigation_theme_contract.md` exist.
- **7. 22 canonical feature sections — PASS.** All 22 V2.11 feature-document sections are generated below from source evidence and explicit verification status.
- **8. URL configuration — PASS (source-level).** URL config: `config/manager_navigation_navigation.url_config.ts`; exports: `MANAGER_NAVIGATION_NAVIGATION_ROUTES` and `MANAGER_NAVIGATION_NAVIGATION_API`. Host path resolution remains unverified.
- **9. Existing route preservation — NOT_APPLICABLE.** Current root route: `Navigation shell / no direct page route`; query contract retained unless documented otherwise.
- **10. API method/URL ownership — NOT_VERIFIED.** 0 API/URL files detected; no backend implementation was supplied.
- **11. Unsupported domain API mapping — NOT_APPLICABLE.** No flagged cross-domain mapping found in the targeted fail-closed set.
- **12. Query Key Registry — NOT_VERIFIED.** 0 query-key registry file(s) identified.
- **13. Mutation inventory — PASS.** No module-owned MSW write handler found.
- **14. React Hook Form / Zod schemas — NOT_VERIFIED.** 0 schema files identified; form-level semantic verification is runtime-deferred.
- **15. Module-owned mocks — FAIL.** 0 mock/fixture files identified.
- **16. Co-located tests — PASS.** 1 test files identified.
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
- **27. Background tasks — PARTIAL.** 2 timer/worker/service-worker references found.
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
- **42. Architecture sizing — PASS_SOURCE_CHECKED (5-gate + Anti-Bloat review).** 26 current physical files. Navigation is a single shell capability, owned by `manager_navigation/layout.tsx`; its header/sidebar are internal components and must not be split into nano-modules. Physical count alone is not a failure under the Anti-Bloat Invariant.
- **43. Human architectural decisions — NOT_APPLICABLE.** No unresolved legacy owner decision identified for this module.

## 20. Standalone Run, Mock & Test Harness

- `mocks/`: 1 module-owned TS/TSX/JSON fixture/handler files physically present.
- `tests/`: 1 module-owned test/spec source files physically present (harness support files inventoried separately).
- `tests/harness/`: canonical `bootstrap.ts` exists: yes; harness docs: 2 Markdown files.ts` exists: yes; harness docs: 2 Markdown files.
- Host commands after integration: `npx vitest run <module-owned test path>` and `npx playwright test <relevant E2E path>`.
- Current execution status: `DEFERRED_TO_HOST_RUNTIME`; no unit or browser test execution is claimed.

## 21. Module Portability & Host Integration Guide

- Terminal import prefix: `@/app/frontend_manager/manager_navigation/navigation/`.
- Canonical category directories: `components/`, `hooks/`, `api/`, `state/`, `types/`, `schemas/`, `mocks/`, `utils/`, `tests/`, `locales/`, `constants/` where applicable.
- Domain compatibility locale catalogs are named `manager_navigation_navigation_domain_en.json` and `manager_navigation_navigation_domain_hi.json` while retaining the `manager.manager_navigation` translation namespace.
- If module-specific namespace catalogs exist, they are named `manager_navigation_navigation_en.json` and `manager_navigation_navigation_hi.json`.
- Host providers, locked dependency versions and alias resolution must be verified in the integrating application; no host manifest was supplied.

## 22. Deliverables & Version History (Portability Not Yet Verified)

- Module version: `1` (first terminal-submodule documentation release).
- Current input baseline: `frontend-manager-v39.zip`; repaired output version is `v40-fix` pending final delivery gates.
- Documentation trio: complete at submodule root.
- Portability score: **NOT_VERIFIED** until host package/provider/locale-loader integration is run. Do not claim 8/8 runtime portability from static source checks.
- Version history: v39 frozen input baseline → v40 source-level repair candidate; host integration remains unverified.
