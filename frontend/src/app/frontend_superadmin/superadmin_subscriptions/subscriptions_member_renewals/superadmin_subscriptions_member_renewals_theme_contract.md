# member_renewals — Theme Contract

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
| `bg-card` | `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:24`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:40`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminSubscriptionsOverviewMemberRenewalsErrorFallback.tsx:13` |
| `bg-input` | `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:38` |
| `bg-skeleton-base` | `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:14`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:15`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:18`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:21`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:22`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:27`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:26`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:49` |
| `border-border` | `components/SuperadminSubscriptionsOverviewMemberRenewalsErrorFallback.tsx:13`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:18`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:21`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:22`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:24`, `components/SuperadminSubscriptionsOverviewMemberRenewalsRouteSkeleton.tsx:26`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:38`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:43`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:49`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:58`, `not-found.tsx:10`, `page.tsx:15` |
| `border-focus` | `components/SuperadminSubscriptionsOverviewMemberRenewalsPageClient.tsx:116` |
| `text-danger` | `components/SuperadminSubscriptionsOverviewMemberRenewalsErrorFallback.tsx:13` |
| `text-primary` | `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:38`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminSubscriptionsOverviewMemberRenewalsEmptyState.tsx:16`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:38`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:40`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:49`, `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:58`, `not-found.tsx:12`, `page.tsx:15` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:49` |
| `border-collapse` | `components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable.tsx:39` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
