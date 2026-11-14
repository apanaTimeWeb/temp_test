# accounting_daily_settlement — Theme Contract

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
| `bg-card` | `components/SuperadminAccountingDailySettlementListSkeleton.tsx:27`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:39`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminAccountingDailySettlementErrorFallback.tsx:21` |
| `bg-input` | `components/SuperadminAccountingDailySettlementSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:40`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:46`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminAccountingDailySettlementListSkeleton.tsx:20`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:21`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:24`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:25`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:30`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:35` |
| `bg-success` | `components/SuperadminAccountingDailySettlementPageClient.tsx:121` |
| `bg-surface-hover` | `components/SuperadminAccountingDailySettlementListSkeleton.tsx:29`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:48`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminAccountingDailySettlementPageClient.tsx:136` |
| `border-border` | `components/SuperadminAccountingDailySettlementErrorFallback.tsx:21`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:24`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:25`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:27`, `components/SuperadminAccountingDailySettlementListSkeleton.tsx:29`, `components/SuperadminAccountingDailySettlementPageClient.tsx:136`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:37`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:42`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:48`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:57`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:40`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:46`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `ring-primary` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:68`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:73`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:40`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:46` |
| `text-danger` | `components/SuperadminAccountingDailySettlementErrorFallback.tsx:21`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminAccountingDailySettlementConfirm.ts:74` |
| `text-on-success` | `components/SuperadminAccountingDailySettlementPageClient.tsx:121` |
| `text-primary` | `components/SuperadminAccountingDailySettlementSemanticTable.tsx:37`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:40`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:49`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:68`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAccountingDailySettlementEmptyState.tsx:16`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:37`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:39`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:48`, `components/SuperadminAccountingDailySettlementSemanticTable.tsx:57`, `hooks/useSuperadminAccountingDailySettlementConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |
| `text-warning` | `components/SuperadminAccountingDailySettlementPageClient.tsx:136` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAccountingDailySettlementSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAccountingDailySettlementSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
