# backup_configuration — Theme Contract

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
| `bg-card` | `components/SuperadminBackupConfigurationBackupHistory.tsx:26`, `components/SuperadminBackupConfigurationPageClient.tsx:104`, `components/SuperadminBackupConfigurationPageClient.tsx:122`, `components/SuperadminBackupConfigurationPageClient.tsx:141`, `components/SuperadminBackupConfigurationPageClient.tsx:153`, `components/SuperadminBackupConfigurationPageClient.tsx:178`, `components/SuperadminBackupConfigurationPageClient.tsx:87`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminBackupConfigurationErrorFallback.tsx:22` |
| `bg-skeleton-base` | `components/SuperadminBackupConfigurationListSkeleton.tsx:19`, `components/SuperadminBackupConfigurationListSkeleton.tsx:21`, `components/SuperadminBackupConfigurationListSkeleton.tsx:23`, `components/SuperadminBackupConfigurationListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminBackupConfigurationPageClient.tsx:160`, `components/SuperadminBackupConfigurationPageClient.tsx:161` |
| `bg-surface-hover` | `components/SuperadminBackupConfigurationBackupHistory.tsx:26` |
| `bg-warning-bg` | `components/SuperadminBackupConfigurationPageClient.tsx:45` |
| `border-border` | `components/SuperadminBackupConfigurationBackupHistory.tsx:26`, `components/SuperadminBackupConfigurationErrorFallback.tsx:22`, `components/SuperadminBackupConfigurationPageClient.tsx:104`, `components/SuperadminBackupConfigurationPageClient.tsx:122`, `components/SuperadminBackupConfigurationPageClient.tsx:141`, `components/SuperadminBackupConfigurationPageClient.tsx:153`, `components/SuperadminBackupConfigurationPageClient.tsx:160`, `components/SuperadminBackupConfigurationPageClient.tsx:45`, `components/SuperadminBackupConfigurationPageClient.tsx:87`, `not-found.tsx:15`, `page.tsx:22` |
| `border-focus` | `components/SuperadminBackupConfigurationPageClient.tsx:104`, `components/SuperadminBackupConfigurationPageClient.tsx:122`, `components/SuperadminBackupConfigurationPageClient.tsx:153` |
| `text-danger` | `components/SuperadminBackupConfigurationErrorFallback.tsx:22` |
| `text-primary` | `components/SuperadminBackupConfigurationBackupHistory.tsx:26`, `components/SuperadminBackupConfigurationPageClient.tsx:104`, `components/SuperadminBackupConfigurationPageClient.tsx:122`, `components/SuperadminBackupConfigurationPageClient.tsx:137`, `components/SuperadminBackupConfigurationPageClient.tsx:143`, `components/SuperadminBackupConfigurationPageClient.tsx:153`, `components/SuperadminBackupConfigurationPageClient.tsx:176`, `components/SuperadminBackupConfigurationPageClient.tsx:52`, `components/SuperadminBackupConfigurationPageClient.tsx:53`, `components/SuperadminBackupConfigurationPageClient.tsx:83`, `components/SuperadminBackupConfigurationPageClient.tsx:89`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminBackupConfigurationBackupHistory.tsx:26`, `components/SuperadminBackupConfigurationEmptyState.tsx:16`, `components/SuperadminBackupConfigurationPageClient.tsx:106`, `components/SuperadminBackupConfigurationPageClient.tsx:111`, `components/SuperadminBackupConfigurationPageClient.tsx:124`, `components/SuperadminBackupConfigurationPageClient.tsx:144`, `components/SuperadminBackupConfigurationPageClient.tsx:152`, `components/SuperadminBackupConfigurationPageClient.tsx:166`, `components/SuperadminBackupConfigurationPageClient.tsx:174`, `components/SuperadminBackupConfigurationPageClient.tsx:181`, `components/SuperadminBackupConfigurationPageClient.tsx:47`, `components/SuperadminBackupConfigurationPageClient.tsx:55`, `components/SuperadminBackupConfigurationPageClient.tsx:90`, `components/SuperadminBackupConfigurationPageClient.tsx:96`, `not-found.tsx:17`, `page.tsx:22` |
| `text-success` | `components/SuperadminBackupConfigurationPageClient.tsx:162`, `components/SuperadminBackupConfigurationPageClient.tsx:165` |
| `text-warning` | `components/SuperadminBackupConfigurationPageClient.tsx:45` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
