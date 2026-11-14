# accounting_expense_categories — Theme Contract

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
| `bg-card` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts:8`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminAccountingExpenseCategoriesErrorFallback.tsx:22` |
| `bg-info` | `constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts:9` |
| `bg-overlay` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:40`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:46`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:99` |
| `bg-primary` | `constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts:5`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:74` |
| `bg-purple-bg` | `constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts:10` |
| `bg-skeleton-base` | `components/SuperadminAccountingExpenseCategoriesListSkeleton.tsx:19`, `components/SuperadminAccountingExpenseCategoriesListSkeleton.tsx:21`, `components/SuperadminAccountingExpenseCategoriesListSkeleton.tsx:23`, `components/SuperadminAccountingExpenseCategoriesListSkeleton.tsx:25` |
| `bg-success` | `constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts:6` |
| `bg-surface-hover` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:68` |
| `bg-warning` | `constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts:7` |
| `bg-warning-bg` | `components/SuperadminAccountingExpenseCategoriesPageClient.tsx:90` |
| `border-border` | `components/SuperadminAccountingExpenseCategoriesErrorFallback.tsx:22`, `components/SuperadminAccountingExpenseCategoriesPageClient.tsx:90`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:40`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:46`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `border-focus` | `components/SuperadminAccountingExpenseCategoriesPageClient.tsx:148` |
| `ring-primary` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:68`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:73`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:40`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:46` |
| `text-danger` | `components/SuperadminAccountingExpenseCategoriesErrorFallback.tsx:22`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:74` |
| `text-primary` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:40`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:49`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:68`, `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `hooks/useSuperadminAccountingExpenseCategoriesConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |
| `text-warning` | `components/SuperadminAccountingExpenseCategoriesPageClient.tsx:90` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-transparent` | `components/SuperadminAccountingExpenseCategoriesPageClient.tsx:148` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
