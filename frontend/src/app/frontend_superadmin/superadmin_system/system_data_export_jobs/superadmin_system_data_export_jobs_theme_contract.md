# data_export_jobs — Theme Contract

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
| `bg-card` | `components/SuperadminDataExportJobsPageClient.tsx:185`, `components/SuperadminDataExportJobsPageClient.tsx:210`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminDataExportJobsErrorFallback.tsx:22` |
| `bg-floating` | `components/SuperadminDataExportJobsPageClient.tsx:213`, `components/SuperadminDataExportJobsPageClient.tsx:224`, `components/SuperadminDataExportJobsPageClient.tsx:234` |
| `bg-primary` | `components/SuperadminDataExportJobsPageClient.tsx:189` |
| `bg-primary-subtle` | `components/SuperadminDataExportJobsPageClient.tsx:129`, `components/SuperadminDataExportJobsPageClient.tsx:184` |
| `bg-skeleton-base` | `components/SuperadminDataExportJobsListSkeleton.tsx:19`, `components/SuperadminDataExportJobsListSkeleton.tsx:21`, `components/SuperadminDataExportJobsListSkeleton.tsx:23`, `components/SuperadminDataExportJobsListSkeleton.tsx:25` |
| `border-border` | `components/SuperadminDataExportJobsErrorFallback.tsx:22`, `components/SuperadminDataExportJobsPageClient.tsx:185`, `components/SuperadminDataExportJobsPageClient.tsx:189`, `components/SuperadminDataExportJobsPageClient.tsx:210`, `components/SuperadminDataExportJobsPageClient.tsx:213`, `components/SuperadminDataExportJobsPageClient.tsx:224`, `components/SuperadminDataExportJobsPageClient.tsx:234`, `not-found.tsx:15`, `page.tsx:22` |
| `border-focus` | `components/SuperadminDataExportJobsPageClient.tsx:127`, `components/SuperadminDataExportJobsPageClient.tsx:184`, `components/SuperadminDataExportJobsPageClient.tsx:185`, `components/SuperadminDataExportJobsPageClient.tsx:189`, `components/SuperadminDataExportJobsPageClient.tsx:224`, `components/SuperadminDataExportJobsPageClient.tsx:234` |
| `text-danger` | `components/SuperadminDataExportJobsErrorFallback.tsx:22` |
| `text-on-primary` | `components/SuperadminDataExportJobsPageClient.tsx:191` |
| `text-primary` | `components/SuperadminDataExportJobsPageClient.tsx:114`, `components/SuperadminDataExportJobsPageClient.tsx:115`, `components/SuperadminDataExportJobsPageClient.tsx:124`, `components/SuperadminDataExportJobsPageClient.tsx:129`, `components/SuperadminDataExportJobsPageClient.tsx:133`, `components/SuperadminDataExportJobsPageClient.tsx:140`, `components/SuperadminDataExportJobsPageClient.tsx:158`, `components/SuperadminDataExportJobsPageClient.tsx:162`, `components/SuperadminDataExportJobsPageClient.tsx:164`, `components/SuperadminDataExportJobsPageClient.tsx:196`, `components/SuperadminDataExportJobsPageClient.tsx:213`, `components/SuperadminDataExportJobsPageClient.tsx:224`, `components/SuperadminDataExportJobsPageClient.tsx:234`, `components/SuperadminDataExportJobsPageClient.tsx:244`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminDataExportJobsPageClient.tsx:111`, `components/SuperadminDataExportJobsPageClient.tsx:117`, `components/SuperadminDataExportJobsPageClient.tsx:119`, `components/SuperadminDataExportJobsPageClient.tsx:134`, `components/SuperadminDataExportJobsPageClient.tsx:163`, `components/SuperadminDataExportJobsPageClient.tsx:164`, `components/SuperadminDataExportJobsPageClient.tsx:197`, `components/SuperadminDataExportJobsPageClient.tsx:199`, `components/SuperadminDataExportJobsPageClient.tsx:212`, `components/SuperadminDataExportJobsPageClient.tsx:215`, `components/SuperadminDataExportJobsPageClient.tsx:218`, `components/SuperadminDataExportJobsPageClient.tsx:228`, `components/SuperadminDataExportJobsPageClient.tsx:243`, `not-found.tsx:17`, `page.tsx:22` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
