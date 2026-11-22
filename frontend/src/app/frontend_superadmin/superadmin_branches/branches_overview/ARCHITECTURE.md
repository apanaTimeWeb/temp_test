# Architecture: Branches Overview

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files
- Zero browser native dialogs
- Soft deletion with policy-based restore; no hard deletes of operational records.

## Data Flow
```
page.tsx -> SuperadminBranchesOverviewPageClient
  -> SuperadminBranchesOverviewListSkeleton (Suspense fallback)
  -> SuperadminBranchesOverviewErrorFallback (Error boundary)
  -> Branch Filters & Search Bar
  -> Branches Table with horizontal action buttons
  -> Modals:
     - Branch Create / Edit Modal
     - SuperadminBranchesOverviewSuspendModal (Reason & duration)
     - Branch Profile & Details Modal
```
