# analytics_financials — Theme Contract

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
| `bg-card` | `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:27`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:39`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger-bg` | `components/SuperadminAnalyticsFinancialsErrorFallback.tsx:21` |
| `bg-input` | `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:37` |
| `bg-primary` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:130` |
| `bg-skeleton-base` | `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:20`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:21`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:24`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:25`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:30`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:35` |
| `bg-surface-highlight` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:129` |
| `bg-surface-hover` | `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:29`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:130`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:48` |
| `bg-warning-bg` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:101` |
| `border-border` | `components/SuperadminAnalyticsFinancialsErrorFallback.tsx:21`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:24`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:25`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:27`, `components/SuperadminAnalyticsFinancialsListSkeleton.tsx:29`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:101`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:129`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:37`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:42`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:48`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:57`, `not-found.tsx:15`, `page.tsx:17` |
| `text-danger` | `components/SuperadminAnalyticsFinancialsErrorFallback.tsx:21` |
| `text-on-primary` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:130` |
| `text-primary` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:107`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:122`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:123`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:124`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:37`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAnalyticsFinancialsEmptyState.tsx:16`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:108`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:112`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:122`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:123`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:124`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:125`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:130`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:134`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:141`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:155`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:37`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:39`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:48`, `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:57`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:124`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:93` |
| `text-warning` | `components/SuperadminAnalyticsFinancialsPageClient.tsx:101`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:125`, `components/SuperadminAnalyticsFinancialsPageClient.tsx:93` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAnalyticsFinancialsSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
