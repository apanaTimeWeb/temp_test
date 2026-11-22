# analytics_subscription_mix — Theme Contract

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
| `bg-card` | `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:27`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:39`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger-bg` | `components/SuperadminAnalyticsSubscriptionMixErrorFallback.tsx:21` |
| `bg-input` | `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:37` |
| `bg-primary` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:130` |
| `bg-skeleton-base` | `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:20`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:21`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:24`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:25`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:30`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:35` |
| `bg-surface-highlight` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:129` |
| `bg-surface-hover` | `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:29`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:130`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:48` |
| `bg-warning-bg` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:101` |
| `border-border` | `components/SuperadminAnalyticsSubscriptionMixErrorFallback.tsx:21`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:24`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:25`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:27`, `components/SuperadminAnalyticsSubscriptionMixListSkeleton.tsx:29`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:101`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:129`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:37`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:42`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:48`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:57`, `not-found.tsx:15`, `page.tsx:17` |
| `text-danger` | `components/SuperadminAnalyticsSubscriptionMixErrorFallback.tsx:21` |
| `text-on-primary` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:130` |
| `text-primary` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:107`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:122`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:123`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:124`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:37`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAnalyticsSubscriptionMixEmptyState.tsx:16`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:108`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:112`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:122`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:123`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:124`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:125`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:130`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:134`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:141`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:155`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:37`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:39`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:48`, `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:57`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:124`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:93` |
| `text-warning` | `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:101`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:125`, `components/SuperadminAnalyticsSubscriptionMixPageClient.tsx:93` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAnalyticsSubscriptionMixSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
