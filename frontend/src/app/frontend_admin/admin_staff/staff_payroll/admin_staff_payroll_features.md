---
feature: "admin_staff_payroll"
owner_role: "admin"
module_version: 1
api_contract_source: "autonomous-v1"
last_verified_date: "2026-11-04"
documentation_status: "current"
portability_score: "8/8"
---

# Staff Payroll & Salaries — Autonomous Submodule Specification

## 1. Scope and Non-Scope
Owner: `admin_staff/staff_payroll` (Tier 4 autonomous submodule under `admin_staff`).
Scope: Multi-branch staff monthly salary structures, attendance-linked deduction calculations, double-verification salary disbursal workflows, and printable/downloadable monthly pay slips.
Non-scope: Staff profiles/credentials (owned by `admin_staff/staff_directory`), daily clock-in/out stamps (owned by `admin_staff/staff_attendance`), and general company accounting (owned by `admin_accounts_assets`).

## 2. Screen Inventory
- Canonical route: `/admin/admin_staff/staff_payroll`
- Key capabilities:
  1. `payroll_kpis`: Monthly total compensation, disbursed amount, pending payouts, and deductions summary.
  2. `payroll_table`: Staff salary records, base pay, shift allowances, absence deductions, and payment status.
  3. `disburse_modal`: Mandatory double-verification confirmation dialog for fiscal disbursal.
  4. `salary_slip_modal`: Printable monthly employee compensation slip with full earnings/deductions breakdown.

## 3. Navigation Contract
- Primary module parent: `/admin/admin_staff`
- Submodule route: `/admin/admin_staff/staff_payroll`

## 4. API Contract
- Payroll monthly cycle fetch and disbursement endpoints declared in `config/admin_staff_payroll.url_config.ts`.

## 5. Query Key Registry
- Scoped under `['admin_staff_payroll', ...]`.

## 6. Mutation Inventory
- Single/bulk salary disbursement (`DISBURSE`) with UTR/payment mode recording, WhatsApp salary slip generation, and CSV payroll register export.

## 7. Permissions and Role Rules
- Restricted to `SUPER_ADMIN` / `FINANCE_ADMIN`; double-verification modal prevents accidental fiscal disbursement.

## 8. State Ownership
- Selected salary cycle, search/filter state, and active slip/disburse modals reside in local component state.

## 9. Offline and Reconnect Behavior
- Financial disbursement prevents duplicate submission while offline and never retries automatically.

## 10. Security and PII Rules
- Bank account numbers remain masked (`•••• •••• 4819`) in UI lists, slips, and CSV exports.

## 11. Accessibility Requirements
- High-contrast status pills (`DISBURSED`, `PENDING`), keyboard-accessible modal focus traps, and `aria-label` action buttons.

## 12. Background Tasks
- None; no background polling timers.

## 13. Feature Flags
- Honors `isFrontendDemoModeEnabled()`.

## 14. Cache Invalidation
- Disbursement actions update/invalidate only the `admin_staff_payroll` ledger cache.

## 15. Migration and Rollback
- Canonical route `/admin/admin_staff/staff_payroll` remains unchanged.

## 16. Test Coverage Map
- `tests/AdminStaffPayrollDisburseControls.test.ts`
- Local submodule harness and component tests under `tests/`.

## 17. Architecture Exceptions
- Adheres to WET sibling isolation with local slip formatting & CSV export helpers.

## 18. Known Contract Gaps
- Automated NEFT bank payout batch webhook integration awaits backend gateway specification.

## 19. Rule Compliance Checklist
- [x] Full 22-section specification, `_forbidden.md`, `_theme_contract.md`, and masked bank details.

## 20. Standalone Run, Mock & Test Harness
- Standalone fixtures and 8-state scenario registry under `mocks/`.

## 21. Module Portability & Host Integration Guide
- Portable autonomous submodule under `admin_staff/staff_payroll/`.

## 22. Deliverables & Version History
- V1.1 (2026-11-27): Expanded specification to full 22 sections and relocated payroll disbursement tests into `staff_payroll/tests/`.

