# accounting_expenses — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Observed Consumed Tokens / Classes


Source-path references are not duplicated here; use the machine-auditable `## Module Semantic Token Inventory` below as the canonical token-to-source evidence. The inventory is reconciled to current leaf source. Host `globals.css` / Tailwind `@theme inline` mappings remain `NOT_VERIFIED` because the host theme is outside the supplied ZIP scope.

## Constraints
- Do not introduce arbitrary hex/RGB colors, new palette entries, or unapproved CSS variables.
- Preserve semantic foreground/background pairing, focus-visible states, reduced-motion behavior, responsive layouts, and contrast.
- Reuse only design-system tokens already present in the supplied web design contract.
- Static token inventory is not a visual accessibility pass; browser verification remains deferred until host runtime is available.

---

## Preserved workflow specification: accounting_expenses_add

# accounting_expenses_add — Theme Contract

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
| `bg-card` | `components/SuperadminAccountingExpensesListSkeleton.tsx:27`, `components/SuperadminAccountingExpensesPageClient.tsx:190`, `components/SuperadminAccountingExpensesPageClient.tsx:231`, `components/SuperadminAccountingExpensesPageClient.tsx:245`, `components/SuperadminAccountingExpensesSemanticTable.tsx:39`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:25` |
| `bg-danger` | `components/SuperadminAccountingExpensesPageClient.tsx:145`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:73`, `hooks/useSuperadminAccountingExpensesConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminAccountingExpensesErrorFallback.tsx:21` |
| `bg-input` | `components/SuperadminAccountingExpensesSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminAccountingExpensesAddConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:46`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:99`, `hooks/useSuperadminAccountingExpensesConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesConfirm.ts:46`, `hooks/useSuperadminAccountingExpensesConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminAccountingExpensesAddConfirm.ts:74`, `hooks/useSuperadminAccountingExpensesConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminAccountingExpensesListSkeleton.tsx:20`, `components/SuperadminAccountingExpensesListSkeleton.tsx:21`, `components/SuperadminAccountingExpensesListSkeleton.tsx:24`, `components/SuperadminAccountingExpensesListSkeleton.tsx:25`, `components/SuperadminAccountingExpensesListSkeleton.tsx:30`, `components/SuperadminAccountingExpensesListSkeleton.tsx:35` |
| `bg-success` | `components/SuperadminAccountingExpensesPageClient.tsx:246` |
| `bg-surface-hover` | `components/SuperadminAccountingExpensesListSkeleton.tsx:29`, `components/SuperadminAccountingExpensesSemanticTable.tsx:48`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminAccountingExpensesAddPageClient.tsx:45`, `components/SuperadminAccountingExpensesPageClient.tsx:159`, `components/SuperadminAccountingExpensesPageClient.tsx:160` |
| `border-border` | `components/SuperadminAccountingExpensesAddPageClient.tsx:45`, `components/SuperadminAccountingExpensesErrorFallback.tsx:21`, `components/SuperadminAccountingExpensesListSkeleton.tsx:24`, `components/SuperadminAccountingExpensesListSkeleton.tsx:25`, `components/SuperadminAccountingExpensesListSkeleton.tsx:27`, `components/SuperadminAccountingExpensesListSkeleton.tsx:29`, `components/SuperadminAccountingExpensesPageClient.tsx:159`, `components/SuperadminAccountingExpensesPageClient.tsx:160`, `components/SuperadminAccountingExpensesPageClient.tsx:190`, `components/SuperadminAccountingExpensesPageClient.tsx:245`, `components/SuperadminAccountingExpensesSemanticTable.tsx:37`, `components/SuperadminAccountingExpensesSemanticTable.tsx:42`, `components/SuperadminAccountingExpensesSemanticTable.tsx:48`, `components/SuperadminAccountingExpensesSemanticTable.tsx:57`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:46`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesConfirm.ts:46`, `hooks/useSuperadminAccountingExpensesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:25` |
| `border-focus` | `components/SuperadminAccountingExpensesPageClient.tsx:166`, `components/SuperadminAccountingExpensesPageClient.tsx:198` |
| `ring-primary` | `hooks/useSuperadminAccountingExpensesAddConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:73`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:74`, `hooks/useSuperadminAccountingExpensesConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesConfirm.ts:73`, `hooks/useSuperadminAccountingExpensesConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminAccountingExpensesAddConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:46`, `hooks/useSuperadminAccountingExpensesConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesConfirm.ts:46` |
| `text-danger` | `components/SuperadminAccountingExpensesErrorFallback.tsx:21`, `components/SuperadminAccountingExpensesPageClient.tsx:233`, `components/SuperadminAccountingExpensesPageClient.tsx:235`, `components/SuperadminAccountingExpensesPageClient.tsx:237`, `components/SuperadminAccountingExpensesPageClient.tsx:238`, `components/SuperadminAccountingExpensesPageClient.tsx:239`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:54`, `hooks/useSuperadminAccountingExpensesConfirm.ts:54` |
| `text-on-danger` | `components/SuperadminAccountingExpensesPageClient.tsx:145`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:73`, `hooks/useSuperadminAccountingExpensesConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminAccountingExpensesAddConfirm.ts:74`, `hooks/useSuperadminAccountingExpensesConfirm.ts:74` |
| `text-on-success` | `components/SuperadminAccountingExpensesPageClient.tsx:246` |
| `text-primary` | `components/SuperadminAccountingExpensesPageClient.tsx:232`, `components/SuperadminAccountingExpensesPageClient.tsx:245`, `components/SuperadminAccountingExpensesSemanticTable.tsx:37`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:49`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:99`, `hooks/useSuperadminAccountingExpensesConfirm.ts:40`, `hooks/useSuperadminAccountingExpensesConfirm.ts:49`, `hooks/useSuperadminAccountingExpensesConfirm.ts:68`, `hooks/useSuperadminAccountingExpensesConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminAccountingExpensesEmptyState.tsx:16`, `components/SuperadminAccountingExpensesPageClient.tsx:243`, `components/SuperadminAccountingExpensesSemanticTable.tsx:37`, `components/SuperadminAccountingExpensesSemanticTable.tsx:39`, `components/SuperadminAccountingExpensesSemanticTable.tsx:48`, `components/SuperadminAccountingExpensesSemanticTable.tsx:57`, `hooks/useSuperadminAccountingExpensesAddConfirm.ts:62`, `hooks/useSuperadminAccountingExpensesConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:25` |
| `text-warning` | `components/SuperadminAccountingExpensesAddPageClient.tsx:45`, `components/SuperadminAccountingExpensesPageClient.tsx:159`, `components/SuperadminAccountingExpensesPageClient.tsx:160` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminAccountingExpensesSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminAccountingExpensesSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
