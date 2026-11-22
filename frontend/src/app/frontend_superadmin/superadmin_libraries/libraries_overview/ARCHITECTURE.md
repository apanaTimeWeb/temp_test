# Architecture: Libraries Overview

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files
- Zero browser dialogs
- Multi-tenant workspace isolation.

## Data Flow
```
page.tsx -> SuperadminLibrariesOverviewPageClient
  -> SuperadminLibrariesOverviewHeaderKpis
  -> Filter & Search Controls
  -> SuperadminLibrariesOverviewSemanticTable
  -> Modals & Panels:
     - SuperadminLibrariesOverviewPanel
       -> SuperadminLibrariesOverviewPanelEditForm
       -> SuperadminLibrariesOverviewPanelViewContent
     - SuperadminLibrariesBranchManagerModal
       -> SuperadminLibrariesBranchAddForm
     - SuperadminLibrariesManagerModulesModal
       -> SuperadminLibrariesManagerModulesCatalog
```
