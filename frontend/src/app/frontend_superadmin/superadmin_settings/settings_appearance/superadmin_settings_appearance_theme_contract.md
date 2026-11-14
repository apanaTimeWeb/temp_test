# settings_appearance — Theme Contract

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
| `bg-card` | `components/SuperadminSettingsAppearancePageClient.tsx:132`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `components/SuperadminSettingsAppearancePageClient.tsx:251`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsAppearanceErrorFallback.tsx:22`, `components/SuperadminSettingsAppearancePageClient.tsx:235` |
| `bg-floating` | `components/SuperadminSettingsAppearancePageClient.tsx:158`, `components/SuperadminSettingsAppearancePageClient.tsx:166`, `components/SuperadminSettingsAppearancePageClient.tsx:244` |
| `bg-info-bg` | `components/SuperadminSettingsAppearancePageClient.tsx:132`, `components/SuperadminSettingsAppearancePageClient.tsx:219` |
| `bg-overlay` | `hooks/useSuperadminSettingsAppearanceConfirm.ts:40`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:46`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsAppearanceConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsAppearancePageClient.tsx:93` |
| `bg-skeleton-base` | `components/SuperadminSettingsAppearanceListSkeleton.tsx:19`, `components/SuperadminSettingsAppearanceListSkeleton.tsx:21`, `components/SuperadminSettingsAppearanceListSkeleton.tsx:23`, `components/SuperadminSettingsAppearanceListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSettingsAppearancePageClient.tsx:134`, `components/SuperadminSettingsAppearancePageClient.tsx:210` |
| `bg-surface-highlight` | `components/SuperadminSettingsAppearancePageClient.tsx:253` |
| `bg-surface-hover` | `components/SuperadminSettingsAppearancePageClient.tsx:184`, `components/SuperadminSettingsAppearancePageClient.tsx:197`, `components/SuperadminSettingsAppearancePageClient.tsx:251`, `components/SuperadminSettingsAppearancePageClient.tsx:94`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:68` |
| `border-border` | `components/SuperadminSettingsAppearanceErrorFallback.tsx:22`, `components/SuperadminSettingsAppearancePageClient.tsx:132`, `components/SuperadminSettingsAppearancePageClient.tsx:135`, `components/SuperadminSettingsAppearancePageClient.tsx:184`, `components/SuperadminSettingsAppearancePageClient.tsx:197`, `components/SuperadminSettingsAppearancePageClient.tsx:210`, `components/SuperadminSettingsAppearancePageClient.tsx:219`, `components/SuperadminSettingsAppearancePageClient.tsx:235`, `components/SuperadminSettingsAppearancePageClient.tsx:262`, `components/SuperadminSettingsAppearancePageClient.tsx:83`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:40`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:46`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `border-focus` | `components/SuperadminSettingsAppearancePageClient.tsx:93` |
| `ring-primary` | `components/SuperadminSettingsAppearancePageClient.tsx:251`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:68`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:73`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSettingsAppearancePageClient.tsx:93` |
| `shadow-dialog` | `hooks/useSuperadminSettingsAppearanceConfirm.ts:40`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsAppearanceErrorFallback.tsx:22`, `components/SuperadminSettingsAppearancePageClient.tsx:149`, `components/SuperadminSettingsAppearancePageClient.tsx:154`, `components/SuperadminSettingsAppearancePageClient.tsx:236`, `components/SuperadminSettingsAppearancePageClient.tsx:240`, `components/SuperadminSettingsAppearancePageClient.tsx:266`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:54` |
| `text-info` | `components/SuperadminSettingsAppearancePageClient.tsx:186`, `components/SuperadminSettingsAppearancePageClient.tsx:199`, `components/SuperadminSettingsAppearancePageClient.tsx:221` |
| `text-on-danger` | `components/SuperadminSettingsAppearancePageClient.tsx:251`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsAppearanceConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsAppearancePageClient.tsx:113`, `components/SuperadminSettingsAppearancePageClient.tsx:117`, `components/SuperadminSettingsAppearancePageClient.tsx:124`, `components/SuperadminSettingsAppearancePageClient.tsx:133`, `components/SuperadminSettingsAppearancePageClient.tsx:142`, `components/SuperadminSettingsAppearancePageClient.tsx:147`, `components/SuperadminSettingsAppearancePageClient.tsx:152`, `components/SuperadminSettingsAppearancePageClient.tsx:157`, `components/SuperadminSettingsAppearancePageClient.tsx:165`, `components/SuperadminSettingsAppearancePageClient.tsx:180`, `components/SuperadminSettingsAppearancePageClient.tsx:187`, `components/SuperadminSettingsAppearancePageClient.tsx:200`, `components/SuperadminSettingsAppearancePageClient.tsx:213`, `components/SuperadminSettingsAppearancePageClient.tsx:222`, `components/SuperadminSettingsAppearancePageClient.tsx:246`, `components/SuperadminSettingsAppearancePageClient.tsx:259`, `components/SuperadminSettingsAppearancePageClient.tsx:275`, `components/SuperadminSettingsAppearancePageClient.tsx:74`, `components/SuperadminSettingsAppearancePageClient.tsx:93`, `components/SuperadminSettingsAppearancePageClient.tsx:94`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:40`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:49`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:68`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsAppearancePageClient.tsx:114`, `components/SuperadminSettingsAppearancePageClient.tsx:134`, `components/SuperadminSettingsAppearancePageClient.tsx:143`, `components/SuperadminSettingsAppearancePageClient.tsx:181`, `components/SuperadminSettingsAppearancePageClient.tsx:189`, `components/SuperadminSettingsAppearancePageClient.tsx:202`, `components/SuperadminSettingsAppearancePageClient.tsx:215`, `components/SuperadminSettingsAppearancePageClient.tsx:224`, `components/SuperadminSettingsAppearancePageClient.tsx:247`, `components/SuperadminSettingsAppearancePageClient.tsx:274`, `components/SuperadminSettingsAppearancePageClient.tsx:94`, `hooks/useSuperadminSettingsAppearanceConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminSettingsAppearancePageClient.tsx:134`, `components/SuperadminSettingsAppearancePageClient.tsx:212` |
| `text-warning` | `components/SuperadminSettingsAppearancePageClient.tsx:226` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-14–23)

The immutable active tab is `Appearance`. Sibling settings workflows remain available through their canonical navigation routes; sibling panels are not rendered in this leaf. Preserve preview-only semantics and do not infer persistence or API behavior.
