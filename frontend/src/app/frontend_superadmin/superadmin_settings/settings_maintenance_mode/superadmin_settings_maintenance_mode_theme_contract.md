# settings_maintenance_mode — Theme Contract

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
| `bg-card` | `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:219`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsMaintenanceModeErrorFallback.tsx:22`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:203` |
| `bg-floating` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:126`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:134`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:212` |
| `bg-info-bg` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:187` |
| `bg-overlay` | `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:40`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:46`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:89` |
| `bg-skeleton-base` | `components/SuperadminSettingsMaintenanceModeListSkeleton.tsx:19`, `components/SuperadminSettingsMaintenanceModeListSkeleton.tsx:21`, `components/SuperadminSettingsMaintenanceModeListSkeleton.tsx:23`, `components/SuperadminSettingsMaintenanceModeListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:178` |
| `bg-surface-highlight` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:221` |
| `bg-surface-hover` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:152`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:165`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:219`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:90`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:68` |
| `border-border` | `components/SuperadminSettingsMaintenanceModeErrorFallback.tsx:22`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:152`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:165`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:178`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:187`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:203`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:230`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:79`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:40`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:46`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `border-focus` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:89` |
| `ring-primary` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:219`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:68`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:73`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:89` |
| `shadow-dialog` | `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:40`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsMaintenanceModeErrorFallback.tsx:22`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:117`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:122`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:204`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:208`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:234`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:54` |
| `text-info` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:154`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:167`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:189` |
| `text-on-danger` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:219`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:110`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:115`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:120`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:125`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:133`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:148`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:155`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:168`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:181`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:190`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:214`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:227`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:243`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:70`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:89`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:90`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:40`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:49`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:68`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:111`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:149`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:157`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:170`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:183`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:192`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:215`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:242`, `components/SuperadminSettingsMaintenanceModePageClient.tsx:90`, `hooks/useSuperadminSettingsMaintenanceModeConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:180` |
| `text-warning` | `components/SuperadminSettingsMaintenanceModePageClient.tsx:194` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-14–23)

The immutable active tab is `Maintenance Mode`. Sibling settings workflows remain available through their canonical navigation routes; sibling panels are not rendered in this leaf. Preserve preview-only semantics and do not infer persistence or API behavior.
