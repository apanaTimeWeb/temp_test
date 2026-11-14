# member_trust_score — Theme Contract

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
| `bg-card` | `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminUsersOverviewMemberTrustScoreErrorFallback.tsx:13` |
| `bg-info-bg` | `components/SuperadminUsersOverviewMemberTrustScorePageClient.tsx:54` |
| `bg-skeleton-base` | `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:14`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:15`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:18`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:21`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:22`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:27`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminUsersOverviewMemberTrustScoreErrorFallback.tsx:13`, `components/SuperadminUsersOverviewMemberTrustScorePageClient.tsx:54`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:18`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:21`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:22`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:24`, `components/SuperadminUsersOverviewMemberTrustScoreRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminUsersOverviewMemberTrustScoreErrorFallback.tsx:13`, `constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants.ts:8` |
| `text-info` | `components/SuperadminUsersOverviewMemberTrustScorePageClient.tsx:54` |
| `text-primary` | `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminUsersOverviewMemberTrustScoreEmptyState.tsx:16`, `not-found.tsx:12`, `page.tsx:15` |
| `text-success` | `constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants.ts:6` |
| `text-warning` | `constants/SuperadminUsersOverviewMemberTrustScoreStaticConstants.ts:7` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
