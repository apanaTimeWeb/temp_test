---
module: superadmin_analytics
submodule: analytics_usage_reports
role: superadmin
layer: presentation
dependencies:
  - '@/lib/api'
  - '@/lib/logger'
  - '@/lib/display_value'
---

# Superadmin Analytics — Usage Reports

## 1. Scope and Non-Scope
- **Scope:** Complete resource and infrastructure consumption reporting for Superadmin. Tracks enrolled members, active staff, operating branches, cloud storage consumption, API ingress volume, and SMS/WhatsApp transactional messaging quotas.
- **Non-Scope:** Cloud infrastructure provisioning (handled in cloud DevOps consoles).

## 2. Screen Inventory & Component Responsibility Map
- `SuperadminAnalyticsUsageReportsMain.tsx`: Root orchestrator.
- `SuperadminAnalyticsUsageReportsKpiGrid.tsx`: 6 resource usage KPI stat cards.
- `SuperadminAnalyticsUsageReportsCharts.tsx`: API ingress velocity and storage quota progress bars.
- `SuperadminAnalyticsUsageReportsFilterBar.tsx`: 7-point filter bar (Date Range, Library, Branch, Plan, Status, Admin, Payment Status) + Search.
- `SuperadminAnalyticsUsageReportsTable.tsx`: Detailed library usage records table.
- `SuperadminAnalyticsUsageReportsExportModal.tsx`: 5 export modes (Excel, PDF, CSV, Print, Download).
- `SuperadminAnalyticsUsageReportsEmptyState.tsx`: Zero records fallback.

## 3. Navigation Contract & User Flows
- Route: `/superadmin/superadmin_analytics/analytics_usage_reports`
- Tab: "Usage Reports" in `superadmin_analytics/layout.tsx`.

## 4. API Contract & UI Data Requirements
- `GET /api/v1/superadmin/analytics/usage-reports/overview`
- `POST /api/v1/superadmin/analytics/usage-reports/export`

## 5. Query Key Registry
- `superadmin_usage_reports.overview(filters)`

## 6. Approved External Dependencies
- `@/lib/api` (`apiFetch`)
- `@/lib/display_value`
- `lucide-react`
- `sonner` (toast)

## 20. Standalone Run, Mock & Test Harness
- Test harness located at `tests/harness/SuperadminAnalyticsUsageReportsHarness.tsx`.
