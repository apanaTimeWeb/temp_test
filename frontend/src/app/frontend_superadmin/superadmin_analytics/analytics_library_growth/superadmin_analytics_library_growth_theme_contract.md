# analytics_library_growth — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:27`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:39`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger-bg` | `components/SuperadminAnalyticsLibraryGrowthErrorFallback.tsx:21` |
| `bg-input` | `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:37` |
| `bg-primary` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:130` |
| `bg-skeleton-base` | `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:20`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:21`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:24`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:25`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:30`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:35` |
| `bg-surface-highlight` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:129` |
| `bg-surface-hover` | `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:29`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:130`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:48` |
| `bg-warning-bg` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:101` |
| `border-border` | `components/SuperadminAnalyticsLibraryGrowthErrorFallback.tsx:21`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:24`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:25`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:27`, `components/SuperadminAnalyticsLibraryGrowthListSkeleton.tsx:29`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:101`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:129`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:37`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:42`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:48`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:57`, `not-found.tsx:15`, `page.tsx:17` |
| `text-danger` | `components/SuperadminAnalyticsLibraryGrowthErrorFallback.tsx:21` |
| `text-on-primary` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:130` |
| `text-primary` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:107`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:122`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:123`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:124`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:37`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAnalyticsLibraryGrowthEmptyState.tsx:16`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:108`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:112`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:122`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:123`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:124`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:125`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:130`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:134`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:141`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:155`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:37`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:39`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:48`, `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:57`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:124`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:93` |
| `text-warning` | `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:101`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:125`, `components/SuperadminAnalyticsLibraryGrowthPageClient.tsx:93` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAnalyticsLibraryGrowthSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
