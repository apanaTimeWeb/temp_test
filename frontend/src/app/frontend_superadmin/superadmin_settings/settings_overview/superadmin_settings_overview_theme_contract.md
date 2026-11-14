# settings_overview — Theme Contract

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
| `bg-card` | `hooks/useSuperadminSettingsOverviewConfirm.ts:68`, `not-found.tsx:15` |
| `bg-danger` | `components/SuperadminSettingsOverviewPageClient.tsx:219`, `hooks/useSuperadminSettingsOverviewConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsOverviewErrorFallback.tsx:22`, `components/SuperadminSettingsOverviewPageClient.tsx:203` |
| `bg-floating` | `components/SuperadminSettingsOverviewPageClient.tsx:126`, `components/SuperadminSettingsOverviewPageClient.tsx:134`, `components/SuperadminSettingsOverviewPageClient.tsx:212` |
| `bg-info-bg` | `components/SuperadminSettingsOverviewPageClient.tsx:187` |
| `bg-overlay` | `hooks/useSuperadminSettingsOverviewConfirm.ts:40`, `hooks/useSuperadminSettingsOverviewConfirm.ts:46`, `hooks/useSuperadminSettingsOverviewConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsOverviewConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsOverviewPageClient.tsx:89` |
| `bg-skeleton-base` | `components/SuperadminSettingsOverviewListSkeleton.tsx:19`, `components/SuperadminSettingsOverviewListSkeleton.tsx:21`, `components/SuperadminSettingsOverviewListSkeleton.tsx:23`, `components/SuperadminSettingsOverviewListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSettingsOverviewPageClient.tsx:178` |
| `bg-surface-highlight` | `components/SuperadminSettingsOverviewPageClient.tsx:221` |
| `bg-surface-hover` | `components/SuperadminSettingsOverviewPageClient.tsx:152`, `components/SuperadminSettingsOverviewPageClient.tsx:165`, `components/SuperadminSettingsOverviewPageClient.tsx:219`, `components/SuperadminSettingsOverviewPageClient.tsx:90`, `hooks/useSuperadminSettingsOverviewConfirm.ts:68` |
| `border-border` | `components/SuperadminSettingsOverviewErrorFallback.tsx:22`, `components/SuperadminSettingsOverviewPageClient.tsx:152`, `components/SuperadminSettingsOverviewPageClient.tsx:165`, `components/SuperadminSettingsOverviewPageClient.tsx:178`, `components/SuperadminSettingsOverviewPageClient.tsx:187`, `components/SuperadminSettingsOverviewPageClient.tsx:203`, `components/SuperadminSettingsOverviewPageClient.tsx:230`, `components/SuperadminSettingsOverviewPageClient.tsx:79`, `hooks/useSuperadminSettingsOverviewConfirm.ts:40`, `hooks/useSuperadminSettingsOverviewConfirm.ts:46`, `hooks/useSuperadminSettingsOverviewConfirm.ts:68`, `not-found.tsx:15` |
| `border-focus` | `components/SuperadminSettingsOverviewPageClient.tsx:89` |
| `ring-primary` | `components/SuperadminSettingsOverviewPageClient.tsx:219`, `hooks/useSuperadminSettingsOverviewConfirm.ts:68`, `hooks/useSuperadminSettingsOverviewConfirm.ts:73`, `hooks/useSuperadminSettingsOverviewConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSettingsOverviewPageClient.tsx:89` |
| `shadow-dialog` | `hooks/useSuperadminSettingsOverviewConfirm.ts:40`, `hooks/useSuperadminSettingsOverviewConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsOverviewErrorFallback.tsx:22`, `components/SuperadminSettingsOverviewPageClient.tsx:117`, `components/SuperadminSettingsOverviewPageClient.tsx:122`, `components/SuperadminSettingsOverviewPageClient.tsx:204`, `components/SuperadminSettingsOverviewPageClient.tsx:208`, `components/SuperadminSettingsOverviewPageClient.tsx:234`, `hooks/useSuperadminSettingsOverviewConfirm.ts:54` |
| `text-info` | `components/SuperadminSettingsOverviewPageClient.tsx:154`, `components/SuperadminSettingsOverviewPageClient.tsx:167`, `components/SuperadminSettingsOverviewPageClient.tsx:189` |
| `text-on-danger` | `components/SuperadminSettingsOverviewPageClient.tsx:219`, `hooks/useSuperadminSettingsOverviewConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsOverviewConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsOverviewPageClient.tsx:110`, `components/SuperadminSettingsOverviewPageClient.tsx:115`, `components/SuperadminSettingsOverviewPageClient.tsx:120`, `components/SuperadminSettingsOverviewPageClient.tsx:125`, `components/SuperadminSettingsOverviewPageClient.tsx:133`, `components/SuperadminSettingsOverviewPageClient.tsx:148`, `components/SuperadminSettingsOverviewPageClient.tsx:155`, `components/SuperadminSettingsOverviewPageClient.tsx:168`, `components/SuperadminSettingsOverviewPageClient.tsx:181`, `components/SuperadminSettingsOverviewPageClient.tsx:190`, `components/SuperadminSettingsOverviewPageClient.tsx:214`, `components/SuperadminSettingsOverviewPageClient.tsx:227`, `components/SuperadminSettingsOverviewPageClient.tsx:243`, `components/SuperadminSettingsOverviewPageClient.tsx:70`, `components/SuperadminSettingsOverviewPageClient.tsx:89`, `components/SuperadminSettingsOverviewPageClient.tsx:90`, `hooks/useSuperadminSettingsOverviewConfirm.ts:40`, `hooks/useSuperadminSettingsOverviewConfirm.ts:49`, `hooks/useSuperadminSettingsOverviewConfirm.ts:68`, `hooks/useSuperadminSettingsOverviewConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsOverviewPageClient.tsx:111`, `components/SuperadminSettingsOverviewPageClient.tsx:149`, `components/SuperadminSettingsOverviewPageClient.tsx:157`, `components/SuperadminSettingsOverviewPageClient.tsx:170`, `components/SuperadminSettingsOverviewPageClient.tsx:183`, `components/SuperadminSettingsOverviewPageClient.tsx:192`, `components/SuperadminSettingsOverviewPageClient.tsx:215`, `components/SuperadminSettingsOverviewPageClient.tsx:242`, `components/SuperadminSettingsOverviewPageClient.tsx:90`, `hooks/useSuperadminSettingsOverviewConfirm.ts:62`, `not-found.tsx:17` |
| `text-success` | `components/SuperadminSettingsOverviewPageClient.tsx:180` |
| `text-warning` | `components/SuperadminSettingsOverviewPageClient.tsx:194` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-24)

The immutable local tab is `General`. Sibling workflow actions navigate to their canonical routes; sibling-only render branches are not locally reachable and were removed without changing the active route view. This source-only repair does not establish backend behavior.
