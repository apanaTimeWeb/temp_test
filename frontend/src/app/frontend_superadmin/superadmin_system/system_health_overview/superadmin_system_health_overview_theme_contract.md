# system_health_overview — Theme Contract

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
| `bg-card` | `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminSystemHealthOverviewErrorFallback.tsx:22` |
| `bg-floating` | `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:22` |
| `bg-skeleton-base` | `components/SuperadminSystemHealthOverviewListSkeleton.tsx:19`, `components/SuperadminSystemHealthOverviewListSkeleton.tsx:21`, `components/SuperadminSystemHealthOverviewListSkeleton.tsx:23`, `components/SuperadminSystemHealthOverviewListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:21`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:22`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:24` |
| `bg-surface-highlight` | `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:18` |
| `bg-surface-hover` | `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:19` |
| `bg-warning-bg` | `components/SuperadminSystemHealthOverviewIntegrations.tsx:22` |
| `border-border` | `components/SuperadminSystemHealthOverviewErrorFallback.tsx:22`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:21`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:24`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:15`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:20`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:22`, `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:18`, `not-found.tsx:15`, `page.tsx:22` |
| `text-danger` | `components/SuperadminSystemHealthOverviewErrorFallback.tsx:22`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:15`, `constants/SuperadminSystemHealthOverviewConstants.ts:14` |
| `text-disabled` | `components/SuperadminSystemHealthOverviewInfrastructure.tsx:19`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:21` |
| `text-info` | `components/SuperadminSystemHealthOverviewInfrastructure.tsx:15`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:26`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:29`, `constants/SuperadminSystemHealthOverviewConstants.ts:13`, `constants/SuperadminSystemHealthOverviewConstants.ts:15` |
| `text-primary` | `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:27`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:15`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:19`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:26`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:29`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:15`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:20`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:22`, `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:21`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:18`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:27`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:15`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:19`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:26`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:29`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:22`, `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:19`, `components/SuperadminSystemHealthOverviewNetworkMetrics.tsx:20`, `not-found.tsx:17`, `page.tsx:22` |
| `text-success` | `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:17`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:24`, `components/SuperadminSystemHealthOverviewHeaderStatus.tsx:25`, `components/SuperadminSystemHealthOverviewInfrastructure.tsx:19` |
| `text-warning` | `components/SuperadminSystemHealthOverviewInfrastructure.tsx:19`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:17`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:20`, `components/SuperadminSystemHealthOverviewIntegrations.tsx:22`, `constants/SuperadminSystemHealthOverviewConstants.ts:12` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
