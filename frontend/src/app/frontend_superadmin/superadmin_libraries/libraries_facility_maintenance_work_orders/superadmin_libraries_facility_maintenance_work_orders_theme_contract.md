# facility_maintenance_work_orders — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:120`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:167`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:77`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersErrorFallback.tsx:13` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:26` |
| `bg-warning-bg` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:47` |
| `border-border` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:108`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:158`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:47`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:67`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:84` |
| `text-primary` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:101`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:121`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:151`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:168`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:43`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:44`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:60`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:78`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersEmptyState.tsx:16`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:108`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:122`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:128`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:129`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:134`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:158`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:172`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:38`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:46`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:67`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:82`, `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:84`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersPageClient.tsx:47` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
