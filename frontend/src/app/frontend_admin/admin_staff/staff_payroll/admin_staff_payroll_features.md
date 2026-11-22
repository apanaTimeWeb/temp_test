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

