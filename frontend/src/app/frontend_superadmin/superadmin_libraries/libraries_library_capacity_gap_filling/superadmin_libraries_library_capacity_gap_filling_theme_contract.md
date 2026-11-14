# library_capacity_gap_filling — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingErrorFallback.tsx:13` |
| `bg-info-bg` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:80` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:80`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:110` |
| `text-info` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:80` |
| `text-primary` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:117`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:125`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:130`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:141`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:161`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:76`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:77`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:142`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:162`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:73`, `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:79`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminLibrariesOverviewLibraryCapacityGapFillingPageClient.tsx:135` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
