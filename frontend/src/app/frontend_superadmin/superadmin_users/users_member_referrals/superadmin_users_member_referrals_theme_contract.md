# member_referrals — Theme Contract

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
| `bg-card` | `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminUsersOverviewMemberReferralsErrorFallback.tsx:13` |
| `bg-info-bg` | `components/SuperadminUsersOverviewMemberReferralsPageClient.tsx:38` |
| `bg-skeleton-base` | `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:14`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:15`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:18`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:21`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:22`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:27`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminUsersOverviewMemberReferralsErrorFallback.tsx:13`, `components/SuperadminUsersOverviewMemberReferralsPageClient.tsx:38`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:18`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:21`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:22`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:24`, `components/SuperadminUsersOverviewMemberReferralsRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminUsersOverviewMemberReferralsErrorFallback.tsx:13` |
| `text-info` | `components/SuperadminUsersOverviewMemberReferralsPageClient.tsx:38` |
| `text-primary` | `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminUsersOverviewMemberReferralsEmptyState.tsx:16`, `not-found.tsx:12`, `page.tsx:15` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
