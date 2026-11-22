# audit_logs — Theme Contract

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
| `bg-card` | `components/SuperadminAuditLogsOverviewSemanticTable.tsx:39`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminAuditLogsErrorFallback.tsx:22` |
| `bg-input` | `components/SuperadminAuditLogsOverviewSemanticTable.tsx:37` |
| `bg-skeleton-base` | `components/SuperadminAuditLogsListSkeleton.tsx:19`, `components/SuperadminAuditLogsListSkeleton.tsx:21`, `components/SuperadminAuditLogsListSkeleton.tsx:23`, `components/SuperadminAuditLogsListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminAuditLogsOverviewSemanticTable.tsx:48` |
| `border-border` | `components/SuperadminAuditLogsErrorFallback.tsx:22`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:37`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:42`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:48`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:57`, `not-found.tsx:15`, `page.tsx:22` |
| `text-danger` | `components/SuperadminAuditLogsErrorFallback.tsx:22` |
| `text-primary` | `components/SuperadminAuditLogsOverviewDetailDrawer.tsx:68`, `components/SuperadminAuditLogsOverviewPageClient.tsx:135`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:37`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAuditLogsOverviewDetailDrawer.tsx:69`, `components/SuperadminAuditLogsOverviewDetailDrawer.tsx:73`, `components/SuperadminAuditLogsOverviewEmptyState.tsx:16`, `components/SuperadminAuditLogsOverviewPageClient.tsx:134`, `components/SuperadminAuditLogsOverviewPageClient.tsx:165`, `components/SuperadminAuditLogsOverviewPageClient.tsx:176`, `components/SuperadminAuditLogsOverviewPageClient.tsx:177`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:37`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:39`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:48`, `components/SuperadminAuditLogsOverviewSemanticTable.tsx:57`, `not-found.tsx:17`, `page.tsx:22` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAuditLogsOverviewSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAuditLogsOverviewSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
