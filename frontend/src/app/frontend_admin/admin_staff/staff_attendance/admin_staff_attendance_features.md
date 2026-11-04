---
feature: "admin_staff_attendance"
owner_role: "admin"
module_version: 1
api_contract_source: "autonomous-v1"
last_verified_date: "2026-11-04"
documentation_status: "current"
portability_score: "8/8"
---

# Staff Attendance & Shifts — Autonomous Submodule Specification

## 1. Scope and Non-Scope
Owner: `admin_staff/staff_attendance` (Tier 4 autonomous submodule under `admin_staff`).
Scope: Multi-branch staff shift duty scheduling, daily clock-in/attendance tracking, leave regularization, and cross-branch supervisor oversight.
Non-scope: Student attendance (owned by `manager_attendance`), staff salary calculation and disbursement (owned by `admin_staff/staff_payroll`).

## 2. Screen Inventory
- Canonical route: `/admin/admin_staff/staff_attendance`
- Key views:
  1. `roster`: Shift duty allocations across branches (Morning, Evening, Night).
  2. `logs`: Daily attendance records with clock-in/out stamps, duration, and status.
  3. `regularize`: Admin manual punch regularization and leave authorization.

## 3. Navigation Contract
- Primary module parent: `/admin/admin_staff`
- Submodule route: `/admin/admin_staff/staff_attendance`

