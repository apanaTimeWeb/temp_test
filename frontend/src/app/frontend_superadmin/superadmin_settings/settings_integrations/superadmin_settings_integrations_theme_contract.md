# settings_integrations — Theme Contract

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
| `bg-card` | `hooks/useSuperadminSettingsIntegrationsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `components/SuperadminSettingsIntegrationsPageClient.tsx:219`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsIntegrationsErrorFallback.tsx:22`, `components/SuperadminSettingsIntegrationsPageClient.tsx:203` |
| `bg-floating` | `components/SuperadminSettingsIntegrationsPageClient.tsx:126`, `components/SuperadminSettingsIntegrationsPageClient.tsx:134`, `components/SuperadminSettingsIntegrationsPageClient.tsx:212` |
| `bg-info-bg` | `components/SuperadminSettingsIntegrationsPageClient.tsx:187` |
| `bg-overlay` | `hooks/useSuperadminSettingsIntegrationsConfirm.ts:40`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:46`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsIntegrationsConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsIntegrationsPageClient.tsx:89` |
| `bg-skeleton-base` | `components/SuperadminSettingsIntegrationsListSkeleton.tsx:19`, `components/SuperadminSettingsIntegrationsListSkeleton.tsx:21`, `components/SuperadminSettingsIntegrationsListSkeleton.tsx:23`, `components/SuperadminSettingsIntegrationsListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSettingsIntegrationsPageClient.tsx:178` |
| `bg-surface-highlight` | `components/SuperadminSettingsIntegrationsPageClient.tsx:221` |
| `bg-surface-hover` | `components/SuperadminSettingsIntegrationsPageClient.tsx:152`, `components/SuperadminSettingsIntegrationsPageClient.tsx:165`, `components/SuperadminSettingsIntegrationsPageClient.tsx:219`, `components/SuperadminSettingsIntegrationsPageClient.tsx:90`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:68` |
| `border-border` | `components/SuperadminSettingsIntegrationsErrorFallback.tsx:22`, `components/SuperadminSettingsIntegrationsPageClient.tsx:152`, `components/SuperadminSettingsIntegrationsPageClient.tsx:165`, `components/SuperadminSettingsIntegrationsPageClient.tsx:178`, `components/SuperadminSettingsIntegrationsPageClient.tsx:187`, `components/SuperadminSettingsIntegrationsPageClient.tsx:203`, `components/SuperadminSettingsIntegrationsPageClient.tsx:230`, `components/SuperadminSettingsIntegrationsPageClient.tsx:79`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:40`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:46`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `border-focus` | `components/SuperadminSettingsIntegrationsPageClient.tsx:89` |
| `ring-primary` | `components/SuperadminSettingsIntegrationsPageClient.tsx:219`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:68`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:73`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSettingsIntegrationsPageClient.tsx:89` |
| `shadow-dialog` | `hooks/useSuperadminSettingsIntegrationsConfirm.ts:40`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsIntegrationsErrorFallback.tsx:22`, `components/SuperadminSettingsIntegrationsPageClient.tsx:117`, `components/SuperadminSettingsIntegrationsPageClient.tsx:122`, `components/SuperadminSettingsIntegrationsPageClient.tsx:204`, `components/SuperadminSettingsIntegrationsPageClient.tsx:208`, `components/SuperadminSettingsIntegrationsPageClient.tsx:234`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:54` |
| `text-info` | `components/SuperadminSettingsIntegrationsPageClient.tsx:154`, `components/SuperadminSettingsIntegrationsPageClient.tsx:167`, `components/SuperadminSettingsIntegrationsPageClient.tsx:189` |
| `text-on-danger` | `components/SuperadminSettingsIntegrationsPageClient.tsx:219`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsIntegrationsConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsIntegrationsPageClient.tsx:110`, `components/SuperadminSettingsIntegrationsPageClient.tsx:115`, `components/SuperadminSettingsIntegrationsPageClient.tsx:120`, `components/SuperadminSettingsIntegrationsPageClient.tsx:125`, `components/SuperadminSettingsIntegrationsPageClient.tsx:133`, `components/SuperadminSettingsIntegrationsPageClient.tsx:148`, `components/SuperadminSettingsIntegrationsPageClient.tsx:155`, `components/SuperadminSettingsIntegrationsPageClient.tsx:168`, `components/SuperadminSettingsIntegrationsPageClient.tsx:181`, `components/SuperadminSettingsIntegrationsPageClient.tsx:190`, `components/SuperadminSettingsIntegrationsPageClient.tsx:214`, `components/SuperadminSettingsIntegrationsPageClient.tsx:227`, `components/SuperadminSettingsIntegrationsPageClient.tsx:243`, `components/SuperadminSettingsIntegrationsPageClient.tsx:70`, `components/SuperadminSettingsIntegrationsPageClient.tsx:89`, `components/SuperadminSettingsIntegrationsPageClient.tsx:90`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:40`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:49`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:68`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsIntegrationsPageClient.tsx:111`, `components/SuperadminSettingsIntegrationsPageClient.tsx:149`, `components/SuperadminSettingsIntegrationsPageClient.tsx:157`, `components/SuperadminSettingsIntegrationsPageClient.tsx:170`, `components/SuperadminSettingsIntegrationsPageClient.tsx:183`, `components/SuperadminSettingsIntegrationsPageClient.tsx:192`, `components/SuperadminSettingsIntegrationsPageClient.tsx:215`, `components/SuperadminSettingsIntegrationsPageClient.tsx:242`, `components/SuperadminSettingsIntegrationsPageClient.tsx:90`, `hooks/useSuperadminSettingsIntegrationsConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminSettingsIntegrationsPageClient.tsx:180` |
| `text-warning` | `components/SuperadminSettingsIntegrationsPageClient.tsx:194` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-14–23)

The immutable active tab is `APIs & Integrations`. Sibling settings workflows remain available through their canonical navigation routes; sibling panels are not rendered in this leaf. Preserve preview-only semantics and do not infer persistence or API behavior.
