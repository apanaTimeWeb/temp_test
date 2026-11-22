# Frontend Admin V45 — Integration Guide

## 1. Changelog

- **V45.0.0 — Forensic audit repair and topology refactor.** Repairs the 124 findings identified in the supplied V6.5 forensic audit through 15 dependency-ordered repair groups. The original `frontend-admin-v44.zip` was retained as an immutable baseline; the current source SHA-256 is recorded in `audit_reports/DEEP-VERIFICATION-REPORT_V45_FINAL.md`.
- Brought every one of the 67 autonomous submodules to **25 or fewer physical files** while retaining their route entry paths and module-owned documentation/harness contracts. The canonical physical ledger records current counts for each leaf module.
- Corrected Profile form error localization and unsaved-navigation coverage; aligned the Reports schema/formatter boundaries and all eight MSW scenario states; corrected current error/loading locale key references; localized the Admin navigation names; restored the error-boundary retry remount contract; and added/fixed display fallback and DataGrid virtualization behavior for desktop and mobile cards.
- Reconciled 67 feature inventories with the actual current tree. A deleted-file safety audit and deterministic changed-path manifest are included. The safety audit is static evidence; it does not replace runtime tests.
- Added `audit_reports/SOURCE_CONFLICTS.md` to preserve unresolved token-semantic and app-brand conflicts without choosing between contradictory supplied contracts. ISSUE-121 (neutral UI primitive ownership) is explicitly `OUTSIDE_SUPPLIED_SCOPE` because it requires the host application's global `src/components/ui/` path, which is not in this isolated role ZIP.
- Added root `playwright.config.ts` and retained the existing 24 Playwright specs. The project runner was not executed because dependencies could not be installed in this environment.
- **Runtime honesty:** All 17 dependency-light source checkers passed; syntax-only parsing reports zero parse diagnostics; the local import resolver reports zero unresolved local imports; 68 EN/HI locale pairs parse with key parity; and 132 error/loading boundaries have zero missing locale keys. Typecheck, Vitest, ESLint, Prettier, Next production build, Playwright/browser E2E, live API and production checks are `DEFERRED_TO_HOST_RUNTIME` or `OUTSIDE_SUPPLIED_SCOPE` and are not claimed as passed.

## 2. Package layout

- `frontend_admin/` — repaired Admin frontend source, feature documentation, module-local tests/mocks, checkers and configuration.
- `playwright_E2E/` — the existing 24 Playwright spec files, retained for host execution.
- `playwright.config.ts` — root Playwright project configuration; it assumes the host application is started separately at `PLAYWRIGHT_BASE_URL` or the default `http://127.0.0.1:3000`.
- `RE_AUDIT_CHECKLIST_RESULT.md` — all 181 web-mode Section 43P checklist items individually dispositioned.
- `RBG_CLOSURE_LEDGER.csv` — 15 repair groups covering all 124 canonical issues.
- `FINDING_CLOSURE_LEDGER.csv` — issue-by-issue dispositions and evidence notes.
- `AUTONOMOUS_SUBMODULE_PHYSICAL_FILE_LEDGER.csv` — current physical count of every autonomous submodule.
- `CANONICAL_RULES_VERIFICATION_SWEEP.csv` — current disposition of the forensic audit's 54 normalized control families.
- `DELETED_FILE_SAFETY_AUDIT.csv`, `CHANGED_PATH_MANIFEST.csv`, `ROUTE_PRESERVATION_MATRIX.csv`, `DELIVERY_MANIFEST.csv` — cleanup, source-diff, route-path, and package integrity evidence.
- `audit_reports/` — copied governing documents, source conflict register, final verification report, source audit, and validation logs.

## 3. Integration requirements

1. Use the host application's approved Node/npm versions and dependency registry. The supplied feature package uses Next.js App Router conventions, TypeScript, Tailwind CSS v4, TanStack Query v5, Zustand, React Hook Form v7, Zod, `next-intl`, MSW, Vitest and Playwright.
2. Integrate `frontend_admin/` using the host application's established App Router and alias conventions. Before deployment, reconcile any host-owned global UI primitives and shared theme/token aliases against the host's actual `src/components/ui/`, `src/lib/`, `globals.css` and `@theme inline` mappings. Do not silently choose a resolution for `SRC-CONFLICT-01` or `SRC-CONFLICT-02`.
3. Public route entry paths are preserved: `ROUTE_PRESERVATION_MATRIX.csv` compares all 75 `page.tsx` route file paths between the frozen v44 baseline and the current source tree. Runtime route behavior must still be confirmed in the host application.
4. Do not treat demo fixtures as live backend data. Several feature docs intentionally retain `CONTRACT_MISSING` for business/API contracts not provided in the ZIP. Do not invent endpoints, response fields, tenant behavior, financial formulas or backend authorization rules.

## 4. Source-level checks already executed

Run from `frontend_admin/`:

```bash
npm run check:architecture
npm run check:env-contract
npm run check:scenarios
npm run check:scenario-runtime
npm run check:query-keys
npm run check:boundaries
npm run check:boundaries:negative
npm run check:tokens
npm run check:feature-styles
npm run check:feature-styles:negative
npm run check:finance-style-ownership
npm run check:type-isolation
npm run check:motion-safety
npm run check:motion-safety:negative
npm run check:unsaved-changes
npm run check:duplicate-class-tokens
npm run check:duplicate-class-tokens:negative
```

All 17 commands above passed in the repair environment. Exact exit codes and output logs are in `audit_reports/final_validation/`. A separate global TypeScript parser pass checked 1,383 TS/TSX/JS/JSX/MJS files, reporting zero syntax-error files. The source-only local-import resolver checked 2,524 relative/alias imports and found zero unresolved imports. Locale JSON/parity and error/loading key validation summaries are included.

## 5. Host-runtime verification still required

A network dependency-install attempt timed out after 240 seconds; a second offline install failed with `ENOTCACHED` because required packages were absent from the local npm cache. No `node_modules` was created. Do not treat this package as runtime-tested. In the intended host workspace, install the project's approved dependencies and run:

```bash
npm run typecheck
npm test
npm run lint
npm run format:check
npm run test:e2e
```

Run `test:e2e` only after the host app is started and accessible at `PLAYWRIGHT_BASE_URL` (or the configured local default). Perform the seven required responsive viewport checks and a rendered WCAG 2.2 AA audit. Record real command results before deployment. Server-side authorization, tenant isolation, CI branch protection, production secrets, and live API enforcement must be validated in their owning host/backend environments.

## 6. Source conflicts and scope boundaries

- **`SRC-CONFLICT-01` / ISSUE-096:** `text-primary` foreground semantics conflict with Tailwind v4's default `--color-primary` utility mapping. A global rename needs product/design-owner sign-off; the conflict is not hidden.
- **`SRC-CONFLICT-02` / ISSUE-122:** app config identifies the product as “Smart Library Management” while the design document contains the “SMART GYM 360” example. Existing app brand configuration is preserved.
- **ISSUE-121:** host-global neutral UI primitive ownership cannot be changed solely inside the isolated role ZIP. The scope limitation is documented; no unrelated host files were requested or fabricated.
- Unprovided backend contracts and runtime/environment requirements remain documented as `CONTRACT_MISSING`, `OUTSIDE_SUPPLIED_SCOPE`, `EXTERNAL_PRODUCT_DECISION_BLOCKED` or `DEFERRED_TO_HOST_RUNTIME` as applicable.

## 7. Artifact status

**Status:** `SOURCE_COMPLETE_RUNTIME_VERIFICATION_DEFERRED`

All 124 audit finding IDs are assigned exactly once across 15 RBGs. Source-level fixes are statically closed except documented external conflicts/scope boundaries. No claim is made that the app compiles, passes Vitest, passes browser E2E, or is production-ready until those host checks are executed.
