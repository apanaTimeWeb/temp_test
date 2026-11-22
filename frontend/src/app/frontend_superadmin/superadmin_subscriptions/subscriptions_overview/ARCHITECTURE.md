# Architecture: Subscriptions Overview

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files
- Zero browser dialogs (`window.alert`, `window.confirm`, `window.prompt`)
- Library Finance vs Platform Billing isolation strictly enforced.

## Data Flow
```
page.tsx -> SuperadminSubscriptionsOverviewPageClient
  -> SuperadminSubscriptionsOverviewKpis (Total MRR, Active, Grace, Suspended)
  -> Status Filter Pills
  -> SuperadminSubscriptionsOverviewSemanticTable (Paginated listing & horizontal actions)
  -> Modals:
     - SuperadminSubscriptionsOverviewActionModal (Upgrade, Grace, Auto-Renewal)
     - SuperadminSubscriptionsOverviewNewModal (New Tenant Provisioning)
     - SuperadminSubscriptionsOverviewHistoryModal (Audit Timeline)
```
