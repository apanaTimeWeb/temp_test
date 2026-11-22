# superadmin_dashboard — Domain Theme Contract

## Authority

Use `WEB_FRONTEND_UI_UX_DESIGN.md` for the global visual language and `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md` for implementation constraints. Security/privacy and WCAG 2.2 AA take precedence over visual preference.

## Domain boundary

This domain root is a route shell and does not declare new business-specific visual tokens. Each leaf must use its own co-located `[role]_[submodule]_theme_contract.md` to enumerate the exact global semantic tokens it consumes.

## Consumption rules

- Use approved semantic Tailwind utilities mapped through the canonical global CSS theme.
- Do not add inline styles, arbitrary CSS-variable utility classes, or raw hex values in business UI when semantic tokens exist.
- Do not use opacity modifiers on semantic status/background classes when an explicit `-bg` or `-subtle` token exists.
- Pair solid semantic backgrounds with their corresponding `text-on-*` contrast token.
- Respect WCAG 2.2 AA, keyboard/focus requirements, responsive behavior, touch targets, and reduced-motion behavior.
- Do not assume the Smart Gym 360 visual product identity is authoritative for a mismatched product without resolving the supplied product-context conflict.

## Leaf contracts

`dashboard_overview`

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:64`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:39`, `dashboard_overview/not-found.tsx:15`, `dashboard_overview/page.tsx:22` |
| `bg-danger-bg` | `dashboard_overview/components/SuperadminDashboardOverviewErrorFallback.tsx:22` |
| `bg-info-bg` | `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:51` |
| `bg-input` | `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:37` |
| `bg-primary-subtle` | `layout.tsx:32` |
| `bg-skeleton-base` | `dashboard_overview/components/SuperadminDashboardOverviewListSkeleton.tsx:19`, `dashboard_overview/components/SuperadminDashboardOverviewListSkeleton.tsx:21`, `dashboard_overview/components/SuperadminDashboardOverviewListSkeleton.tsx:23`, `dashboard_overview/components/SuperadminDashboardOverviewListSkeleton.tsx:25` |
| `bg-surface-hover` | `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `layout.tsx:32` |
| `bg-warning-bg` | `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:58`, `dashboard_overview/components/SuperadminDashboardOverviewMain.tsx:23` |
| `border-border` | `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:24`, `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:54`, `dashboard_overview/components/SuperadminDashboardOverviewErrorFallback.tsx:22`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:51`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:58`, `dashboard_overview/components/SuperadminDashboardOverviewMain.tsx:23`, `dashboard_overview/components/SuperadminDashboardOverviewRecentActivityFeed.tsx:18`, `dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:73`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:37`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:42`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:57`, `dashboard_overview/components/SuperadminDashboardOverviewSystemHealthPanel.tsx:24`, `dashboard_overview/components/SuperadminDashboardOverviewSystemHealthPanel.tsx:42`, `dashboard_overview/not-found.tsx:15`, `dashboard_overview/page.tsx:22`, `layout.tsx:26` |
| `border-focus` | `layout.tsx:32` |
| `ring-primary` | `layout.tsx:32` |
| `text-danger` | `dashboard_overview/components/SuperadminDashboardOverviewErrorFallback.tsx:22` |
| `text-info` | `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:52`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:53` |
| `text-primary` | `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:25`, `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:36`, `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:46`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:36`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:46`, `dashboard_overview/components/SuperadminDashboardOverviewRecentActivityFeed.tsx:19`, `dashboard_overview/components/SuperadminDashboardOverviewRecentActivityFeed.tsx:22`, `dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:41`, `dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:50`, `dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:74`, `dashboard_overview/components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:75`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:37`, `dashboard_overview/components/SuperadminDashboardOverviewSystemHealthPanel.tsx:25`, `dashboard_overview/not-found.tsx:15`, `layout.tsx:32` |
| `text-secondary` | `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:36`, `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:37`, `dashboard_overview/components/SuperadminDashboardOverviewActionItemsPanel.tsx:59`, `dashboard_overview/components/SuperadminDashboardOverviewEmptyState.tsx:16`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:41`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:56`, `dashboard_overview/components/SuperadminDashboardOverviewRecentActivityFeed.tsx:26`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:37`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:39`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:57`, `dashboard_overview/not-found.tsx:17`, `dashboard_overview/page.tsx:22`, `layout.tsx:32` |
| `text-warning` | `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:59`, `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:60`, `dashboard_overview/components/SuperadminDashboardOverviewMain.tsx:23` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:48` |
| `border-b-2` | `layout.tsx:32` |
| `border-collapse` | `dashboard_overview/components/SuperadminDashboardOverviewSemanticTable.tsx:38` |
| `border-transparent` | `layout.tsx:32` |
| `shadow-inner` | `dashboard_overview/components/SuperadminDashboardOverviewKpiCard.tsx:64` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
