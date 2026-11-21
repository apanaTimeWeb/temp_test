---
module: superadmin_analytics
submodule: analytics_security_reports
role: superadmin
layer: presentation
dependencies:
  - '@/lib/api'
  - '@/lib/logger'
  - '@/lib/display_value'
---

# Superadmin Analytics — Security Reports

## 1. Scope and Non-Scope
- **Scope:** Complete security audit, access control, and anomaly reporting for Superadmin. Tracks total login history, failed login attempts, locked accounts, role/permission changes, tenant data exports, and suspicious activity / IP anomalies across libraries and branches.
- **Non-Scope:** Modifying IAM credentials or resetting user passwords (handled in user security management).

## 2. Screen Inventory & Component Responsibility Map
- `SuperadminAnalyticsSecurityReportsMain.tsx`: Root orchestrator.
- `SuperadminAnalyticsSecurityReportsKpiGrid.tsx`: 6 security KPI stat cards (Total Logins, Failed Logins, Locked Accounts, Permission Changes, Data Exports, Suspicious Activities).
- `SuperadminAnalyticsSecurityReportsCharts.tsx`: Daily authentication trends and threat distribution progress bars.
- `SuperadminAnalyticsSecurityReportsFilterBar.tsx`: 7-point filter bar (Date Range, Library, Branch, Plan, Status, Admin, Payment Status) + Search + Reset.
- `SuperadminAnalyticsSecurityReportsTable.tsx`: Detailed security event records table with severity badges and inspection drawer.
- `SuperadminAnalyticsSecurityReportsExportModal.tsx`: 5 export modes (Excel, PDF, CSV, Print, Download).
- `SuperadminAnalyticsSecurityReportsEmptyState.tsx`: Zero records fallback.

## 3. Navigation Contract & User Flows
- Route: `/superadmin/superadmin_analytics/analytics_security_reports`
- Tab: "Security Reports" in `superadmin_analytics/layout.tsx`.

## 4. API Contract & UI Data Requirements
- `GET /api/v1/superadmin/analytics/security-reports/overview`
- `POST /api/v1/superadmin/analytics/security-reports/export`

## 5. Query Key Registry
- `superadmin_security_reports.overview(filters)`

## 6. Approved External Dependencies
- `@/lib/api` (`apiFetch`)
- `@/lib/display_value`
- `lucide-react`
- `sonner` (toast)

## 20. Standalone Run, Mock & Test Harness
- Test harness located at `tests/harness/SuperadminAnalyticsSecurityReportsHarness.tsx`.
