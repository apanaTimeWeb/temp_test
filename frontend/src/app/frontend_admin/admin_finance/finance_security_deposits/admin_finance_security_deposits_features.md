---
feature: "admin_finance_security_deposits"
owner_role: "admin"
module_version: 1
api_contract_source: "autonomous-v1"
last_verified_date: "2026-11-27"
documentation_status: "current"
portability_score: "HIGH — self-contained autonomous submodule"
---

# Admin Finance Security Deposits — Autonomous Submodule Specification

## 1. Scope and Non-Scope

**Role / business context:** Admin finance tracks refundable student security deposits (`held`, `refunded`, `forfeited`), applies itemized damage/late-fee deductions prior to settlement, processes deposit refunds, filters across time horizons (`today`, `this_week`, `this_month`, `custom`), and exports deposit audit logs.

**Out of scope:** Fee collection invoices (`finance_payments`), referral payout vouchers (`finance_referrals`), and standalone refund requests (`finance_refunds`).

## 2. Screen Inventory

- Canonical route entry: `page.tsx`; canonical URL: `/admin/admin_finance/finance_security_deposits`.
- Components:
  - `components/AdminFinanceSecurityDepositsPage.tsx`: Primary container with branch context, time-horizon bar, search/status filters, export actions, and modals.
  - `components/AdminFinanceSecurityDepositsKpis.tsx`: 4 summary KPI tiles (Held Deposits, Refunded, Deductions/Forfeited, Pending Net Settlement).
  - `components/AdminFinanceSecurityDepositsTimeHorizonBar.tsx`: Quick horizon presets (`All`, `Today`, `This Week`, `This Month`, `Custom`) with date range inputs.
  - `components/AdminFinanceSecurityDepositsTable.tsx`: Sortable deposits ledger table with deduction & refund action buttons.
  - `components/AdminFinanceSecurityDepositsDeductionModal.tsx`: Damage/dues deduction entry dialog with audit reason capture.
  - `components/AdminFinanceSecurityDepositsRefundModal.tsx`: Deposit refund confirmation dialog calculating net refundable payout.
  - `components/AdminFinanceSecurityDepositsEmptyState.tsx`: Accessible zero-state component.

## 3. Navigation Contract

- Canonical UI route: `/admin/admin_finance/finance_security_deposits`.
- Canonical submodule URL configuration: `config/admin_finance_security_deposits.url_config.ts` (`ADMIN_FINANCE_SECURITY_DEPOSITS_ROUTES`, `ADMIN_FINANCE_SECURITY_DEPOSITS_API`).
- Navigation stays inside canonical `ADMIN_ROUTES` constants.

## 4. API Contract

- Adapter endpoints declared in `config/admin_finance_security_deposits.url_config.ts`:
  - `GET /api/v1/admin/finance/security-deposits`
  - `POST /api/v1/admin/finance/security-deposits/:id/refund`
  - `POST /api/v1/admin/finance/security-deposits/:id/deduct`
  - `GET /api/v1/admin/finance/security-deposits/export-csv`
- All deduction/refund math respects net refundable amount `Math.max(0, depositAmount - deductionAmount)`.

## 5. Query Key Registry

- Resource key prefix: `['admin_finance_security_deposits', ...]`.
- Scoped strictly to security deposits so sibling query caches remain independent.

## 6. Mutation Inventory

- Record Deduction (`DEDUCT`): applies deduction amount + reason against an active held deposit.
- Process Deposit Refund (`REFUND`): marks deposit `refunded`, records `refundedDate`, and prevents double disbursement.
- Local CSV/Excel export of filtered deposit audit rows.

## 7. Permissions and Role Rules

- Only `SUPER_ADMIN` and `FINANCE_ADMIN` roles may finalize deposit deductions or issue refunds.
- Server-side authorization checks remain authoritative.

## 8. State Ownership

- Filter tabs, search queries, date range state, and active modal selection are managed locally within `AdminFinanceSecurityDepositsPage`.
- Demo mode reads initial fixture data from `config/admin_finance_security_deposits.demo_data.ts`.

## 9. Offline and Reconnect Behavior

- Mutations surface immediate error notifications if offline and never retry financial transfers silently in the background.

## 10. Security and PII Rules

- Student phones and smart IDs avoid telemetry/console logging; CSV export sanitizes leading formula characters (`=`, `+`, `-`, `@`).

## 11. Accessibility Requirements

- Accessible modal dialogs (`Dialog`), labeled form controls, sortable table columns, and non-color-only status pills (`Held`, `Refunded`, `Forfeited`).

## 12. Background Tasks

- None; no polling timers or background intervals are registered.

## 13. Feature Flags

- Honors `isFrontendDemoModeEnabled()` for sandbox/demo presentation.

## 14. Cache Invalidation

- Refund and deduction actions invalidate/update only the local security-deposit ledger state.

## 15. Migration and Rollback

- Route `/admin/admin_finance/finance_security_deposits` introduces no database breaking change and preserves all existing workflows.

## 16. Test Coverage Map

- `tests/AdminFinanceSecurityDepositsComponents.test.tsx`
- `tests/AdminFinanceSecurityDepositsStandaloneContract.test.ts`
- `tests/harness/AdminFinanceSecurityDepositsHarness.test.tsx`

## 17. Architecture Exceptions

- Adheres to WET isolation: local CSV/Excel export helpers live under `utils/adminFinanceSecurityDepositsExports.ts` without cross-submodule imports.

## 18. Known Contract Gaps

- Live gateway payout settlement reference validation (`NEFT/UPI UTR`) awaits host backend confirmation outside demo mode.

## 19. Rule Compliance Checklist

- [x] Domain-prefixed autonomous submodule structure.
- [x] Documentation trio (`_features.md`, `_forbidden.md`, `_theme_contract.md`).
- [x] Canonical `locales/*_en.json` and `*_hi.json` catalogs with key parity.
- [x] Host stubs (`contracts/host-stubs.d.ts`) and 8-state scenario registry (`mocks/scenarios/`).

## 20. Standalone Run, Mock & Test Harness

- Scenario registry: `mocks/scenarios/admin_finance_security_deposits.scenarios.ts` (`ACTIVE_RECORDS`, `EMPTY_DATA`, `SERVER_500_ERROR`, `NETWORK_TIMEOUT`, `UNAUTHORIZED_401`, `FORBIDDEN_403`, `NETWORK_ERROR`, `INVALID_RESPONSE`).
- Harness component: `tests/harness/AdminFinanceSecurityDepositsHarness.tsx`.

## 21. Module Portability & Host Integration Guide

- Copy `admin_finance/finance_security_deposits/` as a self-contained module.
- Host requirements: Next.js App Router, `next-intl` namespace `ADMIN_FINANCE_SECURITY_DEPOSITS`, Sonner toast container, and semantic Tailwind design tokens.

## 22. Deliverables & Version History

- V1 (2026-11-27): Added complete autonomous documentation trio, host stubs declaration, and 8-state scenario catalog.
