# Component Tree: Feature & Module Control

```
SuperadminFeaturesOverviewPage (page.tsx - Server Route)
  │
  └── Suspense (fallback: SuperadminFeaturesOverviewListSkeleton)
        │
        └── SuperadminFeaturesOverviewPageClient (Client Orchestrator)
              │
              ├── [Floating Notification Toast]
              │
              ├── SuperadminFeaturesOverviewHeaderKpis
              │     ├── Total Modules KPI
              │     ├── Globally Active KPI
              │     ├── Platform Killswitch KPI
              │     └── Active Overrides KPI
              │
              ├── SuperadminFeaturesOverviewScopeSelector
              │     ├── Tenant Select Dropdown
              │     ├── Branch Select Dropdown
              │     └── Scope & Hierarchy Status Pill
              │
              ├── SuperadminFeaturesOverviewCategoryTabs
              │     ├── Search Input
              │     ├── View Mode Toggle (Grid / Table)
              │     └── Category Filter Buttons (All 16, Core, Operations, Finance, Engagement, Developer)
              │
              ├── [Conditional View Rendering]
              │     │
              │     ├── [View Mode == 'grid']
              │     │     └── SuperadminFeaturesOverviewModuleCard (× 16)
              │     │           ├── Module Header (Icon, Name, Key, Min Tier)
              │     │           ├── Level 1: Platform Switch Toggle
              │     │           ├── API Endpoint Badges
              │     │           ├── Level 2: Tier Entitlement Badges (Starter, Pro, Enterprise)
              │     │           ├── Level 3: Effective Status Badge & Reason
              │     │           └── Action Buttons (Set Override, Test API Guard)
              │     │
              │     └── [View Mode == 'table']
              │           └── SuperadminFeaturesOverviewMatrixTable
              │                 ├── 16 Module Rows
              │                 ├── Interactive Level 1 Toggles
              │                 ├── Interactive Level 2 Tier Checkboxes
              │                 └── Level 3 Effective Access Badges
              │
              ├── SuperadminFeaturesOverviewOverrideModal (Level 3 Custom Exception Modal)
              │     ├── Tenant & Branch Selector
              │     ├── Force_Enabled / Force_Disabled Action Buttons
              │     ├── Audit Justification Textarea
              │     ├── Optional Expiry Date Input
              │     └── Active Exceptions Table with Delete Button
              │
              ├── SuperadminFeaturesOverviewApiGuardSimulatorModal (Backend Denial Simulator)
              │     ├── Target Info & Effective Status Card
              │     ├── API Endpoint Selector
              │     ├── Live Request Probe Button
              │     ├── 3-Level Governance Hierarchy Trace Breakdown
              │     └── Live HTTP 200 / 403 Response Pre with Copy Button
              │
              └── SuperadminFeaturesOverviewConfirmModal (Safe Non-Blocking Dialog)
```
