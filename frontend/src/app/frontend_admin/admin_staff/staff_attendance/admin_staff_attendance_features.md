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

## 4. API Contract
- Consumes staff roster & daily punch muster endpoints declared in `config/admin_staff_attendance.url_config.ts`.

## 5. Query Key Registry
- Scoped under `['admin_staff_attendance', ...]`.

## 6. Mutation Inventory
- Manual punch regularization (`REGULARIZE`), shift duty roster updates, and CSV monthly muster-roll export.

## 7. Permissions and Role Rules
- Admin and Operations Admin roles may regularize attendance punches and modify duty rosters.

## 8. State Ownership
- Month selection, search/branch filters, and regularization drawer state reside in local component state / demo fixtures.

## 9. Offline and Reconnect Behavior
- Preserves editable draft states on error and avoids background mutation retries.

## 10. Security and PII Rules
- Staff contact details are excluded from diagnostic logs and CSV exports sanitize formula-injection prefixes.

## 11. Accessibility Requirements
- Keyboard-accessible muster table cells, filter inputs with labels, and accessible confirmation dialogs.

## 12. Background Tasks
- No client polling intervals.

## 13. Feature Flags
- Honors `isFrontendDemoModeEnabled()`.

## 14. Cache Invalidation
- Attendance regularization updates invalidate only `admin_staff_attendance` queries.

## 15. Migration and Rollback
- Non-breaking canonical route `/admin/admin_staff/staff_attendance`.

## 16. Test Coverage Map
- `tests/AdminStaffAttendanceMusterRoll.test.ts`
- Local submodule component/harness tests under `tests/`.

## 17. Architecture Exceptions
- Follows strict WET isolation from `staff_directory` and `staff_payroll`.

## 18. Known Contract Gaps
- Live biometric hardware webhook stream sync remains `CONTRACT_MISSING` outside demo mode.

## 19. Rule Compliance Checklist
- [x] Full 22-section specification, `_forbidden.md`, `_theme_contract.md`, and `locales/`.

## 20. Standalone Run, Mock & Test Harness
- Standalone fixtures and 8-state scenario registry inside `mocks/`.

## 21. Module Portability & Host Integration Guide
- Portable autonomous submodule under `admin_staff/staff_attendance/`.

## 22. Deliverables & Version History
- V1.1 (2026-11-27): Expanded specification to full 22 sections and relocated muster-roll tests into `staff_attendance/tests/`.

