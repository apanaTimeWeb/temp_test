---
module: superadmin_analytics
submodule: analytics_billing_reports
role: superadmin
layer: presentation
dependencies:
  - '@/lib/api'
  - '@/lib/logger'
  - '@/lib/display_value'
---

# Superadmin Analytics — Billing Reports

## 1. Scope and Non-Scope
- **Scope:** Complete financial and billing reporting for Superadmin. Tracks platform revenue, MRR (Monthly Recurring Revenue), ARR/YRR (Yearly Recurring Revenue), pending invoices, failed payments, refunds, and plan-wise income breakdown.
- **Non-Scope:** Payment gateway webhook execution (handled in backend billing service).

## 2. Screen Inventory & Component Responsibility Map
- `SuperadminAnalyticsBillingReportsMain.tsx`: Root orchestrator.
- `SuperadminAnalyticsBillingReportsKpiGrid.tsx`: 6 financial KPI summary cards.
- `SuperadminAnalyticsBillingReportsCharts.tsx`: Revenue trend and plan-wise income charts.
- `SuperadminAnalyticsBillingReportsFilterBar.tsx`: 7-point filter bar (Date Range, Library, Branch, Plan, Status, Admin, Payment Status) + Search.
- `SuperadminAnalyticsBillingReportsTable.tsx`: Detailed invoice records table.
- `SuperadminAnalyticsBillingReportsExportModal.tsx`: 5 export modes (Excel, PDF, CSV, Print, Download).
- `SuperadminAnalyticsBillingReportsEmptyState.tsx`: Zero records fallback.

## 3. Navigation Contract & User Flows
- Route: `/superadmin/superadmin_analytics/analytics_billing_reports`
- Tab: "Billing Reports" in `superadmin_analytics/layout.tsx`.

## 4. API Contract & UI Data Requirements
- `GET /api/v1/superadmin/analytics/billing-reports/overview`
- `POST /api/v1/superadmin/analytics/billing-reports/export`

## 5. Query Key Registry
- `superadmin_billing_reports.overview(filters)`

## 6. Approved External Dependencies
- `@/lib/api` (`apiFetch`)
- `@/lib/display_value`
- `lucide-react`
- `sonner` (toast)

## 20. Standalone Run, Mock & Test Harness
- Test harness located at `tests/harness/SuperadminAnalyticsBillingReportsHarness.tsx`.
