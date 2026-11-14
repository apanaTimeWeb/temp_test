# analytics_overview — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Observed Consumed Tokens / Classes


Source-path references are not duplicated here; use the machine-auditable `## Module Semantic Token Inventory` below as the canonical token-to-source evidence. The inventory is reconciled to current leaf source. Host `globals.css` / Tailwind `@theme inline` mappings remain `NOT_VERIFIED` because the host theme is outside the supplied ZIP scope.

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
| `bg-card` | `components/SuperadminAnalyticsOverviewListSkeleton.tsx:30`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:39`, `not-found.tsx:15` |
| `bg-danger-bg` | `components/SuperadminAnalyticsOverviewErrorFallback.tsx:21` |
| `bg-input` | `components/SuperadminAnalyticsOverviewSemanticTable.tsx:37` |
| `bg-primary` | `components/SuperadminAnalyticsOverviewPageClient.tsx:130` |
| `bg-skeleton-base` | `components/SuperadminAnalyticsOverviewListSkeleton.tsx:20`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:21`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:24`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:27`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:28`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:33`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:38` |
| `bg-surface-highlight` | `components/SuperadminAnalyticsOverviewPageClient.tsx:129` |
| `bg-surface-hover` | `components/SuperadminAnalyticsOverviewListSkeleton.tsx:32`, `components/SuperadminAnalyticsOverviewPageClient.tsx:130`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:48` |
| `bg-warning-bg` | `components/SuperadminAnalyticsOverviewPageClient.tsx:101` |
| `border-border` | `components/SuperadminAnalyticsOverviewErrorFallback.tsx:21`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:24`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:27`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:28`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:30`, `components/SuperadminAnalyticsOverviewListSkeleton.tsx:32`, `components/SuperadminAnalyticsOverviewPageClient.tsx:101`, `components/SuperadminAnalyticsOverviewPageClient.tsx:129`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:37`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:42`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:48`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:57`, `not-found.tsx:15` |
| `text-danger` | `components/SuperadminAnalyticsOverviewErrorFallback.tsx:21` |
| `text-on-primary` | `components/SuperadminAnalyticsOverviewPageClient.tsx:130` |
| `text-primary` | `components/SuperadminAnalyticsOverviewPageClient.tsx:107`, `components/SuperadminAnalyticsOverviewPageClient.tsx:122`, `components/SuperadminAnalyticsOverviewPageClient.tsx:123`, `components/SuperadminAnalyticsOverviewPageClient.tsx:124`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:37`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAnalyticsOverviewEmptyState.tsx:16`, `components/SuperadminAnalyticsOverviewPageClient.tsx:108`, `components/SuperadminAnalyticsOverviewPageClient.tsx:112`, `components/SuperadminAnalyticsOverviewPageClient.tsx:122`, `components/SuperadminAnalyticsOverviewPageClient.tsx:123`, `components/SuperadminAnalyticsOverviewPageClient.tsx:124`, `components/SuperadminAnalyticsOverviewPageClient.tsx:125`, `components/SuperadminAnalyticsOverviewPageClient.tsx:130`, `components/SuperadminAnalyticsOverviewPageClient.tsx:134`, `components/SuperadminAnalyticsOverviewPageClient.tsx:141`, `components/SuperadminAnalyticsOverviewPageClient.tsx:155`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:37`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:39`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:48`, `components/SuperadminAnalyticsOverviewSemanticTable.tsx:57`, `not-found.tsx:17` |
| `text-success` | `components/SuperadminAnalyticsOverviewPageClient.tsx:124`, `components/SuperadminAnalyticsOverviewPageClient.tsx:93` |
| `text-warning` | `components/SuperadminAnalyticsOverviewPageClient.tsx:101`, `components/SuperadminAnalyticsOverviewPageClient.tsx:125`, `components/SuperadminAnalyticsOverviewPageClient.tsx:93` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAnalyticsOverviewSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAnalyticsOverviewSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
