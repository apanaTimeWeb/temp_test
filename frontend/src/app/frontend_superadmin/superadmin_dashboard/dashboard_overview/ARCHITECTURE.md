# Architecture: Dashboard Overview

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files
- Zero browser dialogs
- Deep linking & URL tab preservation (`?tab=health`, `?tab=revenue`, etc.)

## Data Flow
```
page.tsx -> SuperadminDashboardOverviewPageClient
  -> SuperadminDashboardOverviewHeader
  -> SuperadminDashboardOverviewKpiCards (Top 12 KPIs)
  -> SuperadminDashboardOverviewOperationalData (Sections 1-7)
  -> SuperadminDashboardOverviewOperationalActivityData (Sections 8-14)
  -> SuperadminDashboardOverviewFiltersBar
```
