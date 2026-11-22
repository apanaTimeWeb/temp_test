# security_overview — Theme Contract

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
| `bg-card` | `hooks/useSuperadminSecurityOverviewConfirm.ts:68`, `not-found.tsx:15` |
| `bg-danger` | `hooks/useSuperadminSecurityOverviewConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSecurityOverviewErrorFallback.tsx:22`, `components/SuperadminSecurityOverviewPageClient.tsx:35` |
| `bg-overlay` | `hooks/useSuperadminSecurityOverviewConfirm.ts:40`, `hooks/useSuperadminSecurityOverviewConfirm.ts:46`, `hooks/useSuperadminSecurityOverviewConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSecurityOverviewConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSecurityOverviewListSkeleton.tsx:19`, `components/SuperadminSecurityOverviewListSkeleton.tsx:21`, `components/SuperadminSecurityOverviewListSkeleton.tsx:23`, `components/SuperadminSecurityOverviewListSkeleton.tsx:25` |
| `bg-surface-hover` | `hooks/useSuperadminSecurityOverviewConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminSecurityOverviewPageClient.tsx:30` |
| `border-border` | `components/SuperadminSecurityOverviewErrorFallback.tsx:22`, `components/SuperadminSecurityOverviewPageClient.tsx:30`, `components/SuperadminSecurityOverviewPageClient.tsx:35`, `components/SuperadminSecurityOverviewPageClient.tsx:49`, `hooks/useSuperadminSecurityOverviewConfirm.ts:40`, `hooks/useSuperadminSecurityOverviewConfirm.ts:46`, `hooks/useSuperadminSecurityOverviewConfirm.ts:68`, `not-found.tsx:15` |
| `ring-primary` | `hooks/useSuperadminSecurityOverviewConfirm.ts:68`, `hooks/useSuperadminSecurityOverviewConfirm.ts:73`, `hooks/useSuperadminSecurityOverviewConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminSecurityOverviewConfirm.ts:40`, `hooks/useSuperadminSecurityOverviewConfirm.ts:46` |
| `text-danger` | `components/SuperadminSecurityOverviewErrorFallback.tsx:22`, `components/SuperadminSecurityOverviewPageClient.tsx:34`, `components/SuperadminSecurityOverviewPageClient.tsx:35`, `hooks/useSuperadminSecurityOverviewConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSecurityOverviewConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSecurityOverviewConfirm.ts:74` |
| `text-primary` | `components/SuperadminSecurityOverviewPageClient.tsx:41`, `components/SuperadminSecurityOverviewPageClient.tsx:45`, `components/SuperadminSecurityOverviewPageClient.tsx:50`, `hooks/useSuperadminSecurityOverviewConfirm.ts:40`, `hooks/useSuperadminSecurityOverviewConfirm.ts:49`, `hooks/useSuperadminSecurityOverviewConfirm.ts:68`, `hooks/useSuperadminSecurityOverviewConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSecurityOverviewPageClient.tsx:37`, `components/SuperadminSecurityOverviewPageClient.tsx:41`, `components/SuperadminSecurityOverviewPageClient.tsx:51`, `hooks/useSuperadminSecurityOverviewConfirm.ts:62`, `not-found.tsx:17` |
| `text-warning` | `components/SuperadminSecurityOverviewPageClient.tsx:30`, `components/SuperadminSecurityOverviewPageClient.tsx:41` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
