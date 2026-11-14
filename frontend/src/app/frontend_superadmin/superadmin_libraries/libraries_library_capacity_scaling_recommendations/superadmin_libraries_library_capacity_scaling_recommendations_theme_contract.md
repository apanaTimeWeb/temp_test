# library_capacity_scaling_recommendations — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:130`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:154`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:174` |
| `bg-info-bg` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:155`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:175` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:32` |
| `bg-success-bg` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:156`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:176` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:26` |
| `bg-warning-bg` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:73` |
| `border-border` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:130`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:154`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:155`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:156`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:174`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:175`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:176`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:73`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsErrorFallback.tsx:13` |
| `text-primary` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:132`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:147`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:162`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:182`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:67`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:68`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:107`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:126`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:133`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:62`, `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:70`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsPageClient.tsx:73` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
