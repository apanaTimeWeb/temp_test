# Manager Frontend v41 — Post-Repair Integration Guide

## 1. Changelog

### 2026-10-28 — V41 Mode B deep audit and source-level repair

- Frozen input: `frontend-manager-v41-complete.zip` (SHA-256 `64ae64314dd0ffb236f8680ed4798aad835269909ae812db9b23907a123f6ef1`). The original input archive was not modified.
- Executed the user-approved RBG plan in bounded sub-batches; every recorded batch is at or below the V2.11 limit of 18 affected files. The execution plan and frozen baseline are included under `audit_evidence/`.
- Reconciled route ownership and the five-gate module qualification matrix. A file count above 25 triggered review, not an automatic split. No sibling split was justified without separate route/navigation or independent lifecycle evidence. The navigation shell is a role-shell exception.
- Removed verified-unreferenced duplicate finance/communication artifacts, moved refund-request ownership to the canonical `finance_refunds` route, and removed duplicate cross-workflow sample-data exports while retaining each owning module's active collection.
- Corrected six API response-envelope/contract regression surfaces so failures are surfaced and successful data is parsed from `ApiResponse.data`; unknown write contracts remain fail-closed.
- Debounced active live-search filters at 300 ms, preserved URL-backed receipt/invoice search state, and disabled the inert locker-assignment search input until a real assignment/read contract exists.
- Extracted repeated unsaved-draft browser-exit/link guards into six module-local prefixed hooks. Admission forms retain anchor replay, and existing confirmation dialogs and translated labels remain in place.
- Refreshed affected module documentation inventories and added source-contract regression tests. Updated the Playwright finance regression to expect canonical refund routing.
- Re-audited the complete module tree, imports, API envelopes, locale parity, file ceilings, route owners, documentation inventories, and source syntax. Host-runtime execution remains explicitly deferred.

## 2. Release state

- **Source-level state:** `SOURCE_LEVEL_REPAIR_COMPLETE_RUNTIME_AND_EXTERNAL_CONTRACTS_DEFERRED`.
- **Delivered archive:** `frontend-manager-v42-ALL-RBGS-COMPLETE.zip`; RBG-26/RBG-27 source-level and package-integrity gates are closed. Runtime verification remains deferred.
- **Scope:** the supplied `frontend_manager/` role tree, its module-local tests/harnesses/contracts, `playwright_E2E/`, and audit evidence. No host application files, backend implementation, package manifest, or CI configuration were invented.
- **Runtime limitation:** the input has no root `package.json`, `tsconfig.json`, `playwright.config.*`, or installed project dependencies. Syntax parsing is not a semantic typecheck or build.
- **Backend limitation:** authoritative authorization, persistence, and mutation contracts were not supplied. Financial/write actions whose contracts are absent remain disabled or fail closed; no endpoint or payload was invented.

## 3. Post-repair source verification

- 9 domain containers and 49 module roots; 2,346 physical files within those module roots at the final inventory checkpoint.
- All 49 module roots have the three documentation files, all 22 feature-spec sections, `contracts/host-stubs.d.ts`, `tests/harness/bootstrap.ts`, a harness component, and at least one test file.
- 48 module roots exceed 25 files; this was reviewed through the five-gate matrix and did not by itself trigger a split. No module root has fewer than 3 files.
- 48 navigation-to-URL-config imports are allowed routing references; 0 cross-feature business imports were found. Host-alias imports have matching module-local ambient declarations.
- 16 API implementation files using `apiFetch` were rechecked; 0 response-envelope issues remain in that audited set, and no direct production `fetch()` calls or active write HTTP methods were found.
- 1,867 TypeScript/TSX/JavaScript/JSX files across the module tree and Playwright suite were parsed with 0 syntax errors. This is syntax-only evidence.
- 0 feature-document inventory mismatches and 0 stale source-path references remain in the 49 feature specs.
- 105 locale JSON files parsed; 50 EN/HI pairs have matching keys and value types, with 0 parity issues.
- No production `console.*`, `any` type, raw browser alert/confirm, direct storage access, inline style object, arbitrary Tailwind value, raw CSS color syntax, Google Fonts CDN reference, raw WebSocket constructor, or secret-like literal was found by the final static scans. All three production toast calls have stable IDs.
- All source file-size ceilings pass. No generated or fixture-backed array over 100 rows was found in the list-size scan.
- The Playwright suite contains 22 spec files. It has not been executed because the host runner/configuration/dependencies are not included in the ZIP.

## 4. Required delivery contents

- `INTEGRATION_GUIDE.md` — this integration and release-status guide.
- `RE_AUDIT_CHECKLIST_RESULT.md` — current 181-item Section 43P disposition, with source-level passes and explicit runtime/scope/product-contract deferrals.
- `playwright_E2E/` — 22-spec browser suite and host integration instructions.
- `audit_evidence/MGR_V41_RBG_CLOSURE_LEDGER.json` — per-batch closure and file-count ledger.
- `audit_evidence/MGR_V41_SUBMODULE_PHYSICAL_LEDGER.md` — current physical inventory.
- `audit_evidence/MGR_V41_ARCHITECTURE_QUALIFICATION_RECHECK.json` — five-gate decision per module root.
- `audit_evidence/MGR_V41_CANONICAL_RULES_SWEEP.md` — current canonical rules evidence/status sweep.
- `audit_evidence/MGR_V41_FINAL_SOURCE_AUDIT_RECHECK.json` and `MGR_V41_FINAL_SYNTAX_AUDIT.json` — current source evidence.
- `audit_evidence/MGR_V41_SOURCE_REPAIR_DELETION_LEDGER.json` — evidence-backed deletions/edits and original hashes where applicable.

## 5. Host integration steps

1. Integrate this module tree into the actual owning Next.js repository; preserve the host's canonical aliases, auth/session context, `apiFetch`, logging, i18n, theme, and shared UI infrastructure.
2. Use the host's existing package manifest and scripts. Run semantic TypeScript checking, lint/format checks, unit tests, and the production build with the host's configured versions.
3. Run the 22 Playwright specs with the host's actual Playwright config, base URL, auth fixtures, and browser versions. Record actual pass/fail/skipped results; do not treat syntax parsing as E2E verification.
4. Run responsive/visual checks at 320px where applicable and at 375px, 768px, and 1280px+, plus automated/manual WCAG 2.2 AA checks.
5. Confirm backend contracts for the blocked read/write flows. Only then enable the associated mutations, define stable idempotency keys for actual mutation requests, and verify server authorization/persistence/reconciliation.
6. Record host commands, versions, logs, screenshots, and backend contract evidence in the host release record. This ZIP does not claim those external checks passed.

## 5A. Five-gate architecture decision

The current physical ledger contains 49 roots, including the navigation role shell. The qualification matrix evaluates route/navigation ownership, lifecycle independence, file granularity, standalone testability/mockability, and backend-entity alignment. The only cross-root import edges are navigation-to-URL-config references; no cross-feature business import was found. Internal tabs and wizard steps remain inside their cohesive route owner unless the supplied source establishes a separately routable/independently lived workflow. File count alone is not a split trigger.

## 6. Manager navigation CSS and theme-token integration contract

### 6.1 Exact stylesheet entry point and scope

- **Navigation stylesheet:** `frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css`
- **Import owner:** `frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationRoute.tsx` imports the stylesheet. Keep the import within the Manager navigation route boundary unless the host's verified Next.js/CSS policy requires moving it to an approved role layout entry point.
- **Style scope:** the stylesheet's theme setup is scoped under `.mgr-theme`. Confirm the rendered Manager navigation root includes this class; do not add broad, unscoped global selectors to compensate for missing scope.
- **Font ownership:** the stylesheet explicitly documents font loading as owned by the host Next.js root through `next/font/google`. Do not add a duplicate `@import` or a second font-loading mechanism here. Verify the host root actually provides the intended font before integration.
- **Host boundary:** this role stylesheet consumes the host Tailwind v4 theme contract. It does not define the host's canonical theme values. Do not copy guessed token values into the role stylesheet or silently modify host `globals.css`.

### 6.2 Complete theme token inventory consumed by the stylesheet

The following inventory was extracted from `theme(...)` references in the stylesheet above. It contains **41 distinct host theme tokens**; keep this list synchronized with the stylesheet during future changes.

**Color tokens (35):**

`--color-border`, `--color-border-focus`, `--color-card`, `--color-danger`, `--color-danger-bg`, `--color-danger-text`, `--color-focus-ring`, `--color-header`, `--color-info`, `--color-info-bg`, `--color-info-text`, `--color-input`, `--color-on-danger`, `--color-on-primary`, `--color-overlay`, `--color-page`, `--color-primary`, `--color-primary-hover`, `--color-primary-subtle`, `--color-purple-bg`, `--color-purple-text`, `--color-sidebar`, `--color-skeleton-base`, `--color-success`, `--color-success-bg`, `--color-success-text`, `--color-surface-highlight`, `--color-surface-hover`, `--color-surface-zebra`, `--color-text-disabled`, `--color-text-primary`, `--color-text-secondary`, `--color-warning`, `--color-warning-bg`, `--color-warning-text`.

**Motion, shape, spacing and shadow tokens (6):**

`--animate-duration-fast`, `--animate-duration-slow`, `--radius-full`, `--radius-md`, `--shadow-dialog`, `--spacing`.

The stylesheet references these tokens through Tailwind's `theme(...)` function. Their presence in the stylesheet is evidence of consumption, **not proof that the host defines them correctly**. Confirm each token exists in the host theme and that its value is appropriate for the Smart Gym 360 semantic gold-on-dark design system. If a token is absent, report it as `HOST_TOKEN_NOT_VERIFIED` and obtain the host's canonical value from the owning design system; do not infer or invent one.

### 6.3 Safe host integration sequence

1. Copy the `frontend_manager/` role tree into the host repository without overwriting unrelated application files.
2. Confirm the canonical route layout imports `@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationRoute` from `frontend_manager/layout.tsx` and that the renamed directory is included in the host's TypeScript alias/build scope.
3. Confirm the route component imports `@/app/frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css` exactly once.
4. Inspect the host root `globals.css` and Tailwind v4 theme configuration. Verify all 41 tokens listed above are defined by the host's canonical theme layer. Do not create a second competing theme layer inside this role module.
5. Verify CSS processing supports the `theme(...)` syntax used by the stylesheet and that the global Tailwind entry point is loaded according to the host's actual Next.js version/configuration. If this cannot be checked from the host repository, mark it `NOT_VERIFIED`.
6. Confirm `.mgr-theme` wraps the role content and inspect computed colors, focus rings, dialogs, overlays, skeletons, hover states and motion preferences in the integrated browser.
7. Confirm the host root owns the Inter/system font loading policy and that there is no duplicate font request introduced by this role.
8. Run the host's semantic typecheck, lint, unit/component tests, production build and Playwright/accessibility checks. Source-level checks in this archive are not substitutes for those runtime gates.

### 6.4 Source-level verification commands

Run these from the integrated host repository, adapting package-manager scripts to the host's actual `package.json`:

```bash
# Confirm no active source path retains the legacy navigation root
rg -n 'frontend_manager/_shell/' frontend_manager

# Inventory the exact tokens currently consumed by the stylesheet
rg -o 'theme\\(--[A-Za-z0-9_-]+\\)' frontend_manager/manager_navigation/navigation/components/ManagerNavigationNavigationManager_navigation.css | sort -u

# Verify the canonical navigation import and CSS entry point
rg -n 'ManagerNavigationNavigationRoute|ManagerNavigationNavigationManager_navigation.css' frontend_manager/layout.tsx frontend_manager/manager_navigation/navigation

# Host-owned checks (run only with the actual host project/dependencies available)
npm run typecheck
npm run lint
npm test
npm run build
npx playwright test --config=playwright.manager.config.ts
```

The `rg` command for `_shell` is expected to return no matches in active source. Historical reports and manifests intentionally preserve original path evidence and should not be bulk-rewritten as though they described the new tree.

### 6.5 Integration verification status

- The CSS token contract and the 41-token inventory remain the source of truth for the navigation shell.
- Current source scan: 37 CSS files and zero raw hex/RGB/HSL color declarations; no arbitrary Tailwind values or inline style objects were found in production source.
- The module tree's theme-contract documentation is present in all 49 module roots. The source-level CSS token checks passed.
- Host-rendered color contrast, responsive breakpoints, hover/focus states, and visual regression remain `DEFERRED_TO_HOST_RUNTIME`; they require the actual application shell and browser.

## 7. Final V42 completion disposition

The source-level audit and repair work has completed its RBG-26/RBG-27 delivery gates. `audit_evidence/MGR_V42_PACKAGE_VERIFICATION.md` records the final archive checks, and the external `MGR_V42_FINAL_PACKAGE_VERIFICATION.json` records the verified ZIP integrity, manifest hashes, and required-member results. The delivered archive is `frontend-manager-v42-ALL-RBGS-COMPLETE.zip`. Host-runtime and external backend contract checks remain explicitly deferred/blocked as documented.

This disposition does **not** claim semantic typecheck, lint, unit-test execution, Next.js build, Playwright execution, visual/responsive testing, automated accessibility testing, backend authorization, or persistence verification. These remain explicitly `DEFERRED_TO_HOST_RUNTIME` or `EXTERNAL_PRODUCT_DECISION_BLOCKED` as recorded in `RE_AUDIT_CHECKLIST_RESULT.md` and the final audit JSON.
