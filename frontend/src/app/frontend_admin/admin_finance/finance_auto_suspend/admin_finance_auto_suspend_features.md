---
feature: "admin_finance_auto_suspend"
owner_role: "admin"
module_version: 1
api_contract_source: "autonomous-v1"
last_verified_date: "2026-11-27"
documentation_status: "current"
portability_score: "HIGH — self-contained autonomous submodule"
---

# Admin Finance Auto-Suspend — Autonomous Submodule Specification

## 1. Scope and Non-Scope

**Role / business context:** Admin finance reviews overdue student subscriptions eligible for automatic or manual access suspension, configures grace thresholds (`daysBeforeSuspend`), views suspended student ledgers, triggers Kiosk/Biometric suspension/restoration, dispatches WhatsApp fee reminders, and exports suspended roster records.

**Out of scope:** Payment settlement (`finance_payments`), security deposit deductions (`finance_security_deposits`), and refund disbursement (`finance_refunds`).

## 2. Screen Inventory

- Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_finance/finance_auto_suspend`.
- Components:
  - `components/AdminFinanceAutoSuspendPage.tsx`: Main workspace orchestrator with grace policy settings, search/branch filtering, CSV/Excel export, WhatsApp reminder trigger, and manual restore/kiosk controls.
  - `components/AdminFinanceAutoSuspendKpiGrid.tsx`: Summary KPI cards (`Currently Suspended`, `Auto-Restored`, `Manual Restores`, `Grace Period`).
  - `components/AdminFinanceAutoSuspendTable.tsx`: Sortable student suspension ledger table with row selection, dues formatting, and action controls.
  - `components/AdminFinanceAutoSuspendKioskModal.tsx`: Kiosk/turnstile suspension status preview and lock/unlock verification modal.
  - `components/AdminFinanceAutoSuspendWhatsAppModal.tsx`: Interactive WhatsApp overdue reminder preview and dispatch modal.
  - `components/AdminFinanceAutoSuspendEmptyState.tsx`: Accessible zero-state fallback.

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_finance/finance_auto_suspend`.
- Canonical submodule URL configuration: `config/admin_finance_auto_suspend.url_config.ts` (`ADMIN_FINANCE_AUTO_SUSPEND_ROUTES`, `ADMIN_FINANCE_AUTO_SUSPEND_API`).
- Internal navigation stays within documented `ADMIN_ROUTES` constants.

## 4. API Contract

- Adapter surface declared in `config/admin_finance_auto_suspend.url_config.ts`:
  - `GET /api/v1/admin/finance/auto-suspend`
  - `POST /api/v1/admin/finance/auto-suspend/:id/suspend`
  - `POST /api/v1/admin/finance/auto-suspend/:id/reinstate`
  - `GET /api/v1/admin/finance/auto-suspend/export-csv`
- Monetary values (`duesAmount`) follow integer INR / currency formatting contracts; live backend enforcement remains `NOT_VERIFIED` until host API integration.

## 5. Query Key Registry

- Resource key prefix: `['admin_finance_auto_suspend', ...]`.
- Isolated from sibling `admin_finance` query caches so cache invalidations never leak across finance submodules.

## 6. Mutation Inventory

- Update auto-suspend grace period configuration (`daysBeforeSuspend`).
- Manual student restore / access reinstatement (`REINSTATE`) with `Idempotency-Key` support when wired to API.
- Bulk / single WhatsApp fee reminder dispatch & CSV/Excel client export.

## 7. Permissions and Role Rules

- Admin and Finance Admin roles may adjust suspension grace thresholds and reinstate suspended memberships.
- UI controls preserve read-only degradation when permissions are restricted; server authorization remains authoritative.

## 8. State Ownership

- Local workspace filter/search/sort and modal open states belong inside `AdminFinanceAutoSuspendPage` and child components.
- Demo records load via `config/admin_finance_auto_suspend.demo_data.ts` when `isFrontendDemoModeEnabled()` is active.

## 9. Offline and Reconnect Behavior

- Graceful error feedback and toast notifications (deduplicated via toast `id`) when network requests fail; zero background auto-retry storms on mutations.

## 10. Security and PII Rules

- Student contact numbers (`phone`) and smart IDs are handled with display masking/sanitization where appropriate and never logged to console/telemetry.
- CSV exports neutralize formula-injection prefixes (`=`, `+`, `-`, `@`).

## 11. Accessibility Requirements

- Keyboard-focusable controls, semantic table headers with sort states, `aria-label` attributes on icon buttons, and accessible Radix dialogs (`Dialog`) with `Escape` close support.

## 12. Background Tasks

- No polling timers or background intervals are spawned in client components.

## 13. Feature Flags

- Respects `isFrontendDemoModeEnabled()` for deterministic demo fixture rendering vs. live API integration.

## 14. Cache Invalidation

- Mutations invalidate only the module-local suspended student ledger query scope upon confirmation.

## 15. Migration and Rollback

- Canonical route `/admin/admin_finance/finance_auto_suspend` requires no schema migration; removing or replacing fixture fallback leaves live API adapter untouched.

## 16. Test Coverage Map

- `tests/AdminFinanceAutoSuspendComponents.test.tsx`
- `tests/AdminFinanceAutoSuspendStandaloneContract.test.ts`
- `tests/harness/AdminFinanceAutoSuspendHarness.test.tsx`

## 17. Architecture Exceptions

- Strict sibling isolation (WET rule): shared formatting or CSV sanitization helpers live locally under `utils/adminFinanceAutoSuspendExport.ts`.

## 18. Known Contract Gaps

- Live backend webhook callbacks for turnstile/biometric hardware unlock confirmation remain `CONTRACT_MISSING` outside demo mode.

## 19. Rule Compliance Checklist

- [x] Domain-prefixed autonomous submodule structure.
- [x] Documentation trio (`_features.md`, `_forbidden.md`, `_theme_contract.md`).
- [x] Canonical `locales/*_en.json` and `*_hi.json` catalogs with key parity.
- [x] Host stubs (`contracts/host-stubs.d.ts`) and 8-state scenario registry (`mocks/scenarios/`).

## 20. Standalone Run, Mock & Test Harness

- Scenario registry: `mocks/scenarios/admin_finance_auto_suspend.scenarios.ts` (`ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, `INVALID_RESPONSE`).
- Harness component: `tests/harness/AdminFinanceAutoSuspendHarness.tsx`.

## 21. Module Portability & Host Integration Guide

- Copy `admin_finance/finance_auto_suspend/` as a self-contained unit.
- Host requirements: Next.js App Router, `next-intl` namespace `ADMIN_FINANCE_AUTO_SUSPEND`, Sonner toast container, and semantic Tailwind design tokens.

## 22. Deliverables & Version History

- V1 (2026-11-27): Completed autonomous documentation trio, host-stubs contract, and canonical 8-state scenario catalog without removing any UI capability.
