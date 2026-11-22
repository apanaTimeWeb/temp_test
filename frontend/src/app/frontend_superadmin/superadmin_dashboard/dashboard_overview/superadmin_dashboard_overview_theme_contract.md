# dashboard_overview — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Observed Consumed Tokens / Classes


Source-path references are not duplicated here; use the machine-auditable `## Module Semantic Token Inventory` below as the canonical token-to-source evidence. The inventory is reconciled to current leaf source. Host `globals.css` / Tailwind `@theme inline` mappings remain `NOT_VERIFIED` because the host theme is outside the supplied ZIP scope.

## Dashboard Semantic Table Row Treatment

- Header: `bg-surface-highlight`.
- Alternating body rows: `bg-card` then `bg-surface-zebra`.
- Hover: `bg-surface-hover`.

## Constraints
- Do not introduce arbitrary hex/RGB colors, new palette entries, or unapproved CSS variables.
- Preserve semantic foreground/background pairing, focus-visible states, reduced-motion behavior, responsive layouts, and contrast.
- Reuse only design-system tokens already present in the supplied web design contract.
- Static token inventory is not a visual accessibility pass; browser verification remains deferred until host runtime is available.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `components/SuperadminDashboardOverviewKpiCard.tsx:64`, `components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminDashboardOverviewErrorFallback.tsx:22` |
| `bg-info-bg` | `components/SuperadminDashboardOverviewKpiCard.tsx:51` |
| `bg-input` | `components/SuperadminDashboardOverviewSemanticTable.tsx:37` |
| `bg-skeleton-base` | `components/SuperadminDashboardOverviewListSkeleton.tsx:19`, `components/SuperadminDashboardOverviewListSkeleton.tsx:21`, `components/SuperadminDashboardOverviewListSkeleton.tsx:23`, `components/SuperadminDashboardOverviewListSkeleton.tsx:25` |
| `bg-surface-highlight` | `components/SuperadminDashboardOverviewSemanticTable.tsx:39` |
| `bg-surface-hover` | `components/SuperadminDashboardOverviewSemanticTable.tsx:48` |
| `bg-surface-zebra` | `components/SuperadminDashboardOverviewSemanticTable.tsx:48` |
| `bg-warning-bg` | `components/SuperadminDashboardOverviewKpiCard.tsx:58`, `components/SuperadminDashboardOverviewMain.tsx:23` |
| `border-border` | `components/SuperadminDashboardOverviewActionItemsPanel.tsx:24`, `components/SuperadminDashboardOverviewActionItemsPanel.tsx:54`, `components/SuperadminDashboardOverviewErrorFallback.tsx:22`, `components/SuperadminDashboardOverviewKpiCard.tsx:51`, `components/SuperadminDashboardOverviewKpiCard.tsx:58`, `components/SuperadminDashboardOverviewMain.tsx:23`, `components/SuperadminDashboardOverviewRecentActivityFeed.tsx:18`, `components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:73`, `components/SuperadminDashboardOverviewSemanticTable.tsx:37`, `components/SuperadminDashboardOverviewSemanticTable.tsx:42`, `components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `components/SuperadminDashboardOverviewSemanticTable.tsx:57`, `components/SuperadminDashboardOverviewSystemHealthPanel.tsx:24`, `components/SuperadminDashboardOverviewSystemHealthPanel.tsx:42`, `not-found.tsx:15`, `page.tsx:22` |
| `text-danger` | `components/SuperadminDashboardOverviewErrorFallback.tsx:22` |
| `text-info` | `components/SuperadminDashboardOverviewKpiCard.tsx:52`, `components/SuperadminDashboardOverviewKpiCard.tsx:53` |
| `text-primary` | `components/SuperadminDashboardOverviewActionItemsPanel.tsx:25`, `components/SuperadminDashboardOverviewActionItemsPanel.tsx:36`, `components/SuperadminDashboardOverviewActionItemsPanel.tsx:46`, `components/SuperadminDashboardOverviewKpiCard.tsx:36`, `components/SuperadminDashboardOverviewKpiCard.tsx:46`, `components/SuperadminDashboardOverviewRecentActivityFeed.tsx:19`, `components/SuperadminDashboardOverviewRecentActivityFeed.tsx:22`, `components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:41`, `components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:50`, `components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:74`, `components/SuperadminDashboardOverviewRecentLibrariesTable.tsx:75`, `components/SuperadminDashboardOverviewSemanticTable.tsx:37`, `components/SuperadminDashboardOverviewSystemHealthPanel.tsx:25`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminDashboardOverviewActionItemsPanel.tsx:36`, `components/SuperadminDashboardOverviewActionItemsPanel.tsx:37`, `components/SuperadminDashboardOverviewActionItemsPanel.tsx:59`, `components/SuperadminDashboardOverviewEmptyState.tsx:16`, `components/SuperadminDashboardOverviewKpiCard.tsx:41`, `components/SuperadminDashboardOverviewKpiCard.tsx:56`, `components/SuperadminDashboardOverviewRecentActivityFeed.tsx:26`, `components/SuperadminDashboardOverviewSemanticTable.tsx:37`, `components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `components/SuperadminDashboardOverviewSemanticTable.tsx:48`, `components/SuperadminDashboardOverviewSemanticTable.tsx:57`, `not-found.tsx:17`, `page.tsx:22` |
| `text-warning` | `components/SuperadminDashboardOverviewKpiCard.tsx:59`, `components/SuperadminDashboardOverviewKpiCard.tsx:60`, `components/SuperadminDashboardOverviewMain.tsx:23` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminDashboardOverviewSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminDashboardOverviewSemanticTable.tsx:38` |
| `shadow-inner` | `components/SuperadminDashboardOverviewKpiCard.tsx:64` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
