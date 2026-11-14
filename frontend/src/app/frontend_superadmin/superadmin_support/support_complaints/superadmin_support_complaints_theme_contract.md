# support_complaints — Theme Contract

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
| `bg-card` | `components/SuperadminSupportComplaintsListSkeleton.tsx:29`, `hooks/useSuperadminSupportComplaintsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `hooks/useSuperadminSupportComplaintsConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSupportComplaintsErrorFallback.tsx:24` |
| `bg-overlay` | `hooks/useSuperadminSupportComplaintsConfirm.ts:40`, `hooks/useSuperadminSupportComplaintsConfirm.ts:46`, `hooks/useSuperadminSupportComplaintsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSupportComplaintsConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSupportComplaintsListSkeleton.tsx:22`, `components/SuperadminSupportComplaintsListSkeleton.tsx:23`, `components/SuperadminSupportComplaintsListSkeleton.tsx:26`, `components/SuperadminSupportComplaintsListSkeleton.tsx:27`, `components/SuperadminSupportComplaintsListSkeleton.tsx:32`, `components/SuperadminSupportComplaintsListSkeleton.tsx:37` |
| `bg-surface-hover` | `components/SuperadminSupportComplaintsListSkeleton.tsx:31`, `hooks/useSuperadminSupportComplaintsConfirm.ts:68` |
| `border-border` | `components/SuperadminSupportComplaintsErrorFallback.tsx:24`, `components/SuperadminSupportComplaintsListSkeleton.tsx:26`, `components/SuperadminSupportComplaintsListSkeleton.tsx:27`, `components/SuperadminSupportComplaintsListSkeleton.tsx:29`, `components/SuperadminSupportComplaintsListSkeleton.tsx:31`, `hooks/useSuperadminSupportComplaintsConfirm.ts:40`, `hooks/useSuperadminSupportComplaintsConfirm.ts:46`, `hooks/useSuperadminSupportComplaintsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `ring-primary` | `hooks/useSuperadminSupportComplaintsConfirm.ts:68`, `hooks/useSuperadminSupportComplaintsConfirm.ts:73`, `hooks/useSuperadminSupportComplaintsConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminSupportComplaintsConfirm.ts:40`, `hooks/useSuperadminSupportComplaintsConfirm.ts:46` |
| `text-danger` | `components/SuperadminSupportComplaintsErrorFallback.tsx:24`, `components/SuperadminSupportComplaintsPageClient.tsx:115`, `components/SuperadminSupportComplaintsPageClient.tsx:124`, `components/SuperadminSupportComplaintsPageClient.tsx:129`, `hooks/useSuperadminSupportComplaintsConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSupportComplaintsConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSupportComplaintsConfirm.ts:74` |
| `text-primary` | `hooks/useSuperadminSupportComplaintsConfirm.ts:40`, `hooks/useSuperadminSupportComplaintsConfirm.ts:49`, `hooks/useSuperadminSupportComplaintsConfirm.ts:68`, `hooks/useSuperadminSupportComplaintsConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSupportComplaintsEmptyState.tsx:16`, `hooks/useSuperadminSupportComplaintsConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
