# subscriptions_overview — Theme Contract

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
| `bg-card` | `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:39`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:24` |
| `bg-danger` | `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSubscriptionsOverviewErrorFallback.tsx:22` |
| `bg-info-bg` | `components/SuperadminSubscriptionsOverviewPageClient.tsx:90` |
| `bg-input` | `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:40`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:46`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31` |
| `bg-skeleton-base` | `components/SuperadminSubscriptionsOverviewListSkeleton.tsx:19`, `components/SuperadminSubscriptionsOverviewListSkeleton.tsx:21`, `components/SuperadminSubscriptionsOverviewListSkeleton.tsx:23`, `components/SuperadminSubscriptionsOverviewListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminSubscriptionsOverviewPageClient.tsx:65`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:90`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:48`, `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminSubscriptionsOverviewPageClient.tsx:74` |
| `border-border` | `components/SuperadminSubscriptionsOverviewErrorFallback.tsx:22`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:65`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:74`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:83`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:90`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:37`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:42`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:48`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:57`, `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:25`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:40`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:46`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:24` |
| `border-focus` | `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31` |
| `ring-primary` | `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:68`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:73`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSubscriptionsOverviewPageClient.tsx:90` |
| `shadow-dialog` | `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:40`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:46` |
| `text-danger` | `components/SuperadminSubscriptionsOverviewErrorFallback.tsx:22`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:74` |
| `text-primary` | `components/SuperadminSubscriptionsOverviewPageClient.tsx:49`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:90`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:37`, `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:40`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:49`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:68`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSubscriptionsOverviewEmptyState.tsx:16`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:50`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:65`, `components/SuperadminSubscriptionsOverviewPageClient.tsx:90`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:37`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:39`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:48`, `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:57`, `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31`, `hooks/useSuperadminSubscriptionsOverviewConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:24` |
| `text-warning` | `components/SuperadminSubscriptionsOverviewPageClient.tsx:74` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:48` |
| `border-b-2` | `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31` |
| `border-collapse` | `components/SuperadminSubscriptionsOverviewSemanticTable.tsx:38` |
| `border-transparent` | `components/SuperadminSubscriptionsOverviewWorkflowNavigation.tsx:31` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
