# facility_power_management — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:148`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:83`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewFacilityPowerManagementErrorFallback.tsx:13` |
| `bg-info-bg` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:116`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:119` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:32` |
| `bg-success` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:116` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminLibrariesOverviewFacilityPowerManagementErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:102`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:119`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:138`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:83`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewFacilityPowerManagementRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminLibrariesOverviewFacilityPowerManagementErrorFallback.tsx:13` |
| `text-info` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:114`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:119` |
| `text-on-success` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:116` |
| `text-primary` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:106`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:150`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:151`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:52`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:53`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:80`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:85`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOverviewFacilityPowerManagementEmptyState.tsx:16`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:107`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:112`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:138`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:149`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:153`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:47`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:55`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:79`, `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:86`, `not-found.tsx:12`, `page.tsx:15` |
| `text-success` | `components/SuperadminLibrariesOverviewFacilityPowerManagementPageClient.tsx:114` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
