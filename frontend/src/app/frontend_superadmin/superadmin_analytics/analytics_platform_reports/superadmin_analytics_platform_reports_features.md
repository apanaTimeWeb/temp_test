---
feature: "superadmin_analytics_platform_reports"
owner_role: "superadmin"
module_version: 1
api_contract_source: "verified-api-contract"
last_verified_date: "2026-11-21"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "8/8"
---

# Superadmin Analytics Platform Reports — Feature Map (ALL 22 CANONICAL SECTIONS)

## 1. Scope and Non-Scope (Module Purpose, System Context & Dependencies)
Superadmin Analytics Platform Reports provides enterprise-grade visibility into macro SaaS operational metrics across all registered library accounts. SuperAdmins use this module to inspect total libraries, branch expansion, active accounts, growth velocity, new account creations, and cancellation/churn trends. It includes multi-dimensional filtering and universal multi-format data exports (Excel, PDF, CSV, Print, Download). Off-limits: Direct database mutations or manual account deletions (governed by `superadmin_libraries`).

### Feature Ownership & System Context
- **Feature / Role Owner:** SuperAdmin / Platform Operations Team
- **Backend Microservice / API Base:** `/api/v1/superadmin/analytics/platform-reports`
- **Authoritative Database Tables:** `libraries`, `branches`, `subscriptions`, `tenant_lifecycle_events`
- **Background / Queued Jobs:** `platform_metrics_aggregation_cron`, `report_export_worker`

### Dependency Manifest
- **State Pattern:** TanStack Query v5 (server state) + Local filter state
- **Form & Validation:** Zod runtime schemas
- **Icons & Primitives:** Lucide React (18px, strokeWidth 2)

### Autonomous Sub-Module Directory Structure
| Folder | Responsibility | Key Files |
|---|---|---|
| `components/` | Renders Main orchestrator, KPI cards, charts, filter bar, table, export modal | `SuperadminAnalyticsPlatformReportsMain.tsx`, `SuperadminAnalyticsPlatformReportsTable.tsx` |
| `hooks/` | Filter state, search debounce, query execution | `useSuperadminAnalyticsPlatformReports.ts` |
| `api/` | Typed API transport & query key factory | `superadmin_analytics_platform_reports.api.ts` |
| `types/` | TypeScript interfaces for KPIs, filters, records | `SuperadminAnalyticsPlatformReportsTypes.ts` |
| `schemas/` | Zod validation schemas for filters and exports | `SuperadminAnalyticsPlatformReportsSchemas.ts` |
| `constants/` | Constant options, date ranges, status badges | `SuperadminAnalyticsPlatformReportsConstants.ts` |
| `utils/` | Export formatters (Excel, CSV, PDF, Print, Download) | `SuperadminAnalyticsPlatformReportsFormatters.ts` |
| `mocks/` | MSW fixtures, handlers & 5 canonical scenarios | `superadmin_analytics_platform_reports.fixtures.ts` |
| `tests/` | Unit, component & standalone harness tests | `superadmin_analytics_platform_reports.test.tsx` |

### Approved External Dependencies & Expected Host Contract
- `@/lib/api` — `apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>`
- `@/lib/logger` — `logger.info(msg, meta)`, `logger.error(msg, error)`
- `@/lib/display_value` — `displayValue(val: unknown): string`

## 2. Screen Inventory & Component Responsibility Map
| Feature / Screen | Route | What the User Can Do | Key Components | Main API Calls | Status |
|---|---|---|---|---|---|
| Platform Reports Overview | `/superadmin/superadmin_analytics/analytics_platform_reports` | View 6 KPIs, growth timeline, filter by 7 criteria, search, inspect library records, export | `SuperadminAnalyticsPlatformReportsMain.tsx` | `fetchPlatformReportsOverview()` | Complete |
| Export Dialog | Inline modal | Select export format (Excel, PDF, CSV, Print, Download) | `SuperadminAnalyticsPlatformReportsExportModal.tsx` | `requestPlatformReportExport()` | Complete |

### Component Responsibility Map
- `SuperadminAnalyticsPlatformReportsMain.tsx`: Root client orchestrator assembling KPIs, charts, filters, and table.
- `SuperadminAnalyticsPlatformReportsKpiGrid.tsx`: Displays 6 primary metrics (Libraries, Branches, Active Accounts, Growth, Creations, Cancellations).
- `SuperadminAnalyticsPlatformReportsCharts.tsx`: Renders platform expansion bar chart and status distribution progress bars.
- `SuperadminAnalyticsPlatformReportsFilterBar.tsx`: Manages debounced search and 7 dropdown filters.
- `SuperadminAnalyticsPlatformReportsTable.tsx`: Renders paginated audit rows with detail action.
- `SuperadminAnalyticsPlatformReportsExportModal.tsx`: Provides Excel, PDF, CSV, Print, and Download triggers.
- `SuperadminAnalyticsPlatformReportsEmptyState.tsx`: Accessible fallback UI when zero records match filters.

## 3. Navigation Contract & User Flows
- SuperAdmin opens Reports & Analytics from sidebar (`code: 10`) -> Tab 1 "Platform Reports" is active by default.
- User selects Date Range, Library, Branch, Plan, Status, Admin, or Payment Status -> URL/State updates, debounced query refetches.
- User clicks "Export & Print" -> Modal opens with 5 actionable options. Selecting any option triggers instant download or print preview with toast feedback.

## 4. API Contract & UI Data Requirements
- `GET /api/v1/superadmin/analytics/platform-reports?dateRange&libraryId&branchId&plan&status&adminId&paymentStatus&searchQuery`
- Response: `ApiResponse<PlatformReportsOverviewData>` with `kpis`, `growthTimeline`, `statusDistribution`, `items`, and `filterOptions`.
- `POST /api/v1/superadmin/analytics/platform-reports/export` with `Idempotency-Key: UUIDv4`.

## 5. Query Key Registry
- `SUPERADMIN_PLATFORM_REPORTS_QUERY_KEYS.all`: `['superadmin_platform_reports']`
- `SUPERADMIN_PLATFORM_REPORTS_QUERY_KEYS.overview(filters)`: `['superadmin_platform_reports', 'overview', filters]`

## 6. Mutation Inventory
- Report generation is primarily read-only. Async export request attaches `Idempotency-Key` and uses `useMutation` / API trigger.

## 7. Permissions and Role Rules
- SuperAdmin role only (`role === 'SUPERADMIN'`). Unauthorized roles redirected with 403 status.

## 8. State Ownership
- Server state in TanStack Query v5 cache (`reportData`).
- Filter and search state in React local hook state (`useSuperadminAnalyticsPlatformReports`).

## 9. Offline, Loading, Empty, and Error States
- Loading: `loading.tsx` renders skeleton matching exact UI cards, charts, and table.
- Empty: `SuperadminAnalyticsPlatformReportsEmptyState.tsx` with reset CTA.
- Error: `error.tsx` boundary with retry button.

## 10. Security and PII Rules
- Admin email and contact data masked where required; export logs audited.

## 11. Accessibility Requirements (WCAG 2.2 AA)
- High-contrast badges (`emerald`, `amber`, `rose`, `sky`).
- Full keyboard navigation for selects and export buttons.

## 12. Background Tasks & Realtime Events
- Long exports (>100k rows) trigger async email dispatch with notification toast.

## 13. Feature Flags & Tenant Settings
- Multi-currency and date-format localized to tenant configuration.

## 14. Cache Invalidation & Consistency
- Active filters invalidate query keys specifically per filter payload.

## 15. Migration, Rollback & Edge Cases (AI Warnings)
- Never use `window.alert()` or raw prompt dialogs.
- Minor unit handling for monetary values.

## 16. Test Coverage Map & Quality Gates
- `superadmin_analytics_platform_reports.test.tsx` verifying KPI rendering, filter updating, and export triggers.
- Standalone harness in `tests/harness/`.

## 17. Architecture Exceptions (ADRs)
- Pure client-side export fallback when backend export microservice is offline.

## 18. Known Contract Gaps & Bug Log
- None.

## 19. Rule Compliance Checklist
- [x] Universal Day-1 Sub-Module Architecture at depth = 1
- [x] Sub-module root quarantined
- [x] File prefixing `[Role][Submodule][Name]` applied
- [x] Zero barrel files, absolute imports only
- [x] React Hook Form v7 & Zod schemas
- [x] TanStack Query v5 (`isPending`)
- [x] 5 canonical MSW scenarios & 3 scale tiers
- [x] Standalone mounting harness present

## 20. Standalone Run, Mock & Test Harness
- Primary Route: `/superadmin/superadmin_analytics/analytics_platform_reports`
- Test Suite: `npx vitest run src/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/tests/`
- Harness: `tests/harness/SuperadminAnalyticsPlatformReportsHarness.tsx`

## 21. Module Portability & Host Integration Guide
- Copy `analytics_platform_reports/` directory into any compatible host application.
- Connect host router to `superadmin_analytics_platform_reports.url_config.ts`.

## 22. Deliverables & Version History (8/8 Portability Score)
- v1.0.0 (2026-11-21): Initial implementation with full KPI metrics, charts, 7 filters, search, and 5-mode export suite.
