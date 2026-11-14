# users_overview — Theme Contract

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
| `bg-card` | `components/SuperadminUsersOverviewSemanticTable.tsx:39`, `hooks/useSuperadminUsersOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:23` |
| `bg-danger` | `hooks/useSuperadminUsersOverviewConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminUsersOverviewErrorFallback.tsx:22` |
| `bg-floating` | `components/SuperadminUsersOverviewModal.tsx:192` |
| `bg-input` | `components/SuperadminUsersOverviewSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminUsersOverviewConfirm.ts:40`, `hooks/useSuperadminUsersOverviewConfirm.ts:46`, `hooks/useSuperadminUsersOverviewConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminUsersOverviewConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30` |
| `bg-skeleton-base` | `components/SuperadminUsersOverviewListSkeleton.tsx:19`, `components/SuperadminUsersOverviewListSkeleton.tsx:21`, `components/SuperadminUsersOverviewListSkeleton.tsx:23`, `components/SuperadminUsersOverviewListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminUsersOverviewSemanticTable.tsx:48`, `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30`, `hooks/useSuperadminUsersOverviewConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminUsersOverviewPageClient.tsx:28` |
| `border-border` | `components/SuperadminUsersOverviewErrorFallback.tsx:22`, `components/SuperadminUsersOverviewModal.tsx:192`, `components/SuperadminUsersOverviewModal.tsx:206`, `components/SuperadminUsersOverviewPageClient.tsx:28`, `components/SuperadminUsersOverviewPageClient.tsx:42`, `components/SuperadminUsersOverviewSemanticTable.tsx:37`, `components/SuperadminUsersOverviewSemanticTable.tsx:42`, `components/SuperadminUsersOverviewSemanticTable.tsx:48`, `components/SuperadminUsersOverviewSemanticTable.tsx:57`, `components/SuperadminUsersOverviewWorkflowNavigation.tsx:24`, `hooks/useSuperadminUsersOverviewConfirm.ts:40`, `hooks/useSuperadminUsersOverviewConfirm.ts:46`, `hooks/useSuperadminUsersOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:23` |
| `border-focus` | `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30` |
| `ring-primary` | `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30`, `hooks/useSuperadminUsersOverviewConfirm.ts:68`, `hooks/useSuperadminUsersOverviewConfirm.ts:73`, `hooks/useSuperadminUsersOverviewConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminUsersOverviewConfirm.ts:40`, `hooks/useSuperadminUsersOverviewConfirm.ts:46` |
| `text-danger` | `components/SuperadminUsersOverviewErrorFallback.tsx:22`, `components/SuperadminUsersOverviewModal.tsx:138`, `components/SuperadminUsersOverviewModal.tsx:150`, `components/SuperadminUsersOverviewModal.tsx:164`, `components/SuperadminUsersOverviewModal.tsx:178`, `components/SuperadminUsersOverviewModal.tsx:189`, `hooks/useSuperadminUsersOverviewConfirm.ts:54` |
| `text-info` | `components/SuperadminUsersOverviewPageClient.tsx:35` |
| `text-on-danger` | `hooks/useSuperadminUsersOverviewConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminUsersOverviewConfirm.ts:74` |
| `text-primary` | `components/SuperadminUsersOverviewModal.tsx:112`, `components/SuperadminUsersOverviewModal.tsx:113`, `components/SuperadminUsersOverviewModal.tsx:116`, `components/SuperadminUsersOverviewModal.tsx:194`, `components/SuperadminUsersOverviewPageClient.tsx:35`, `components/SuperadminUsersOverviewPageClient.tsx:38`, `components/SuperadminUsersOverviewPageClient.tsx:42`, `components/SuperadminUsersOverviewSemanticTable.tsx:37`, `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30`, `hooks/useSuperadminUsersOverviewConfirm.ts:40`, `hooks/useSuperadminUsersOverviewConfirm.ts:49`, `hooks/useSuperadminUsersOverviewConfirm.ts:68`, `hooks/useSuperadminUsersOverviewConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminUsersOverviewEmptyState.tsx:16`, `components/SuperadminUsersOverviewModal.tsx:116`, `components/SuperadminUsersOverviewModal.tsx:120`, `components/SuperadminUsersOverviewModal.tsx:128`, `components/SuperadminUsersOverviewModal.tsx:141`, `components/SuperadminUsersOverviewModal.tsx:154`, `components/SuperadminUsersOverviewModal.tsx:168`, `components/SuperadminUsersOverviewModal.tsx:181`, `components/SuperadminUsersOverviewModal.tsx:197`, `components/SuperadminUsersOverviewPageClient.tsx:32`, `components/SuperadminUsersOverviewPageClient.tsx:35`, `components/SuperadminUsersOverviewPageClient.tsx:42`, `components/SuperadminUsersOverviewSemanticTable.tsx:37`, `components/SuperadminUsersOverviewSemanticTable.tsx:39`, `components/SuperadminUsersOverviewSemanticTable.tsx:48`, `components/SuperadminUsersOverviewSemanticTable.tsx:57`, `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30`, `hooks/useSuperadminUsersOverviewConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:23` |
| `text-success` | `components/SuperadminUsersOverviewModal.tsx:195` |
| `text-warning` | `components/SuperadminUsersOverviewPageClient.tsx:28`, `components/SuperadminUsersOverviewPageClient.tsx:35` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminUsersOverviewSemanticTable.tsx:48` |
| `border-b-2` | `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30` |
| `border-collapse` | `components/SuperadminUsersOverviewSemanticTable.tsx:38` |
| `border-transparent` | `components/SuperadminUsersOverviewWorkflowNavigation.tsx:30` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
