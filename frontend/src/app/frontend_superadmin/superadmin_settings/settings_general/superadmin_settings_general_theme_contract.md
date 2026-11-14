# settings_general — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `hooks/useSuperadminSettingsGeneralConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `components/SuperadminSettingsGeneralPageClient.tsx:219`, `hooks/useSuperadminSettingsGeneralConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsGeneralErrorFallback.tsx:22`, `components/SuperadminSettingsGeneralPageClient.tsx:203` |
| `bg-floating` | `components/SuperadminSettingsGeneralPageClient.tsx:126`, `components/SuperadminSettingsGeneralPageClient.tsx:134`, `components/SuperadminSettingsGeneralPageClient.tsx:212` |
| `bg-info-bg` | `components/SuperadminSettingsGeneralPageClient.tsx:187` |
| `bg-overlay` | `hooks/useSuperadminSettingsGeneralConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralConfirm.ts:46`, `hooks/useSuperadminSettingsGeneralConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsGeneralConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsGeneralPageClient.tsx:89`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29` |
| `bg-skeleton-base` | `components/SuperadminSettingsGeneralListSkeleton.tsx:19`, `components/SuperadminSettingsGeneralListSkeleton.tsx:21`, `components/SuperadminSettingsGeneralListSkeleton.tsx:23`, `components/SuperadminSettingsGeneralListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSettingsGeneralPageClient.tsx:178` |
| `bg-surface-highlight` | `components/SuperadminSettingsGeneralPageClient.tsx:221` |
| `bg-surface-hover` | `components/SuperadminSettingsGeneralPageClient.tsx:152`, `components/SuperadminSettingsGeneralPageClient.tsx:165`, `components/SuperadminSettingsGeneralPageClient.tsx:219`, `components/SuperadminSettingsGeneralPageClient.tsx:90`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29`, `hooks/useSuperadminSettingsGeneralConfirm.ts:68` |
| `border-border` | `components/SuperadminSettingsGeneralErrorFallback.tsx:22`, `components/SuperadminSettingsGeneralPageClient.tsx:152`, `components/SuperadminSettingsGeneralPageClient.tsx:165`, `components/SuperadminSettingsGeneralPageClient.tsx:178`, `components/SuperadminSettingsGeneralPageClient.tsx:187`, `components/SuperadminSettingsGeneralPageClient.tsx:203`, `components/SuperadminSettingsGeneralPageClient.tsx:230`, `components/SuperadminSettingsGeneralPageClient.tsx:79`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:23`, `hooks/useSuperadminSettingsGeneralConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralConfirm.ts:46`, `hooks/useSuperadminSettingsGeneralConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `border-focus` | `components/SuperadminSettingsGeneralPageClient.tsx:89`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29` |
| `ring-primary` | `components/SuperadminSettingsGeneralPageClient.tsx:219`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29`, `hooks/useSuperadminSettingsGeneralConfirm.ts:68`, `hooks/useSuperadminSettingsGeneralConfirm.ts:73`, `hooks/useSuperadminSettingsGeneralConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSettingsGeneralPageClient.tsx:89` |
| `shadow-dialog` | `hooks/useSuperadminSettingsGeneralConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsGeneralErrorFallback.tsx:22`, `components/SuperadminSettingsGeneralPageClient.tsx:117`, `components/SuperadminSettingsGeneralPageClient.tsx:122`, `components/SuperadminSettingsGeneralPageClient.tsx:204`, `components/SuperadminSettingsGeneralPageClient.tsx:208`, `components/SuperadminSettingsGeneralPageClient.tsx:234`, `hooks/useSuperadminSettingsGeneralConfirm.ts:54` |
| `text-info` | `components/SuperadminSettingsGeneralPageClient.tsx:154`, `components/SuperadminSettingsGeneralPageClient.tsx:167`, `components/SuperadminSettingsGeneralPageClient.tsx:189` |
| `text-on-danger` | `components/SuperadminSettingsGeneralPageClient.tsx:219`, `hooks/useSuperadminSettingsGeneralConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsGeneralConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsGeneralPageClient.tsx:110`, `components/SuperadminSettingsGeneralPageClient.tsx:115`, `components/SuperadminSettingsGeneralPageClient.tsx:120`, `components/SuperadminSettingsGeneralPageClient.tsx:125`, `components/SuperadminSettingsGeneralPageClient.tsx:133`, `components/SuperadminSettingsGeneralPageClient.tsx:148`, `components/SuperadminSettingsGeneralPageClient.tsx:155`, `components/SuperadminSettingsGeneralPageClient.tsx:168`, `components/SuperadminSettingsGeneralPageClient.tsx:181`, `components/SuperadminSettingsGeneralPageClient.tsx:190`, `components/SuperadminSettingsGeneralPageClient.tsx:214`, `components/SuperadminSettingsGeneralPageClient.tsx:227`, `components/SuperadminSettingsGeneralPageClient.tsx:243`, `components/SuperadminSettingsGeneralPageClient.tsx:70`, `components/SuperadminSettingsGeneralPageClient.tsx:89`, `components/SuperadminSettingsGeneralPageClient.tsx:90`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29`, `hooks/useSuperadminSettingsGeneralConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralConfirm.ts:49`, `hooks/useSuperadminSettingsGeneralConfirm.ts:68`, `hooks/useSuperadminSettingsGeneralConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsGeneralPageClient.tsx:111`, `components/SuperadminSettingsGeneralPageClient.tsx:149`, `components/SuperadminSettingsGeneralPageClient.tsx:157`, `components/SuperadminSettingsGeneralPageClient.tsx:170`, `components/SuperadminSettingsGeneralPageClient.tsx:183`, `components/SuperadminSettingsGeneralPageClient.tsx:192`, `components/SuperadminSettingsGeneralPageClient.tsx:215`, `components/SuperadminSettingsGeneralPageClient.tsx:242`, `components/SuperadminSettingsGeneralPageClient.tsx:90`, `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29`, `hooks/useSuperadminSettingsGeneralConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |
| `text-success` | `components/SuperadminSettingsGeneralPageClient.tsx:180` |
| `text-warning` | `components/SuperadminSettingsGeneralPageClient.tsx:194` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-2` | `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29` |
| `border-transparent` | `components/SuperadminSettingsGeneralWorkflowNavigation.tsx:29` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-14–23)

The immutable active tab is `General`. Sibling settings workflows remain available through their canonical navigation routes; sibling panels are not rendered in this leaf. Preserve preview-only semantics and do not infer persistence or API behavior.
