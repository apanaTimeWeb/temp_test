# settings_storage — Theme Contract

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
| `bg-card` | `hooks/useSuperadminSettingsStorageConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `components/SuperadminSettingsStoragePageClient.tsx:219`, `hooks/useSuperadminSettingsStorageConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsStorageErrorFallback.tsx:22`, `components/SuperadminSettingsStoragePageClient.tsx:203` |
| `bg-floating` | `components/SuperadminSettingsStoragePageClient.tsx:126`, `components/SuperadminSettingsStoragePageClient.tsx:134`, `components/SuperadminSettingsStoragePageClient.tsx:212` |
| `bg-info-bg` | `components/SuperadminSettingsStoragePageClient.tsx:187` |
| `bg-overlay` | `hooks/useSuperadminSettingsStorageConfirm.ts:40`, `hooks/useSuperadminSettingsStorageConfirm.ts:46`, `hooks/useSuperadminSettingsStorageConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsStorageConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsStoragePageClient.tsx:89` |
| `bg-skeleton-base` | `components/SuperadminSettingsStorageListSkeleton.tsx:19`, `components/SuperadminSettingsStorageListSkeleton.tsx:21`, `components/SuperadminSettingsStorageListSkeleton.tsx:23`, `components/SuperadminSettingsStorageListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSettingsStoragePageClient.tsx:178` |
| `bg-surface-highlight` | `components/SuperadminSettingsStoragePageClient.tsx:221` |
| `bg-surface-hover` | `components/SuperadminSettingsStoragePageClient.tsx:152`, `components/SuperadminSettingsStoragePageClient.tsx:165`, `components/SuperadminSettingsStoragePageClient.tsx:219`, `components/SuperadminSettingsStoragePageClient.tsx:90`, `hooks/useSuperadminSettingsStorageConfirm.ts:68` |
| `border-border` | `components/SuperadminSettingsStorageErrorFallback.tsx:22`, `components/SuperadminSettingsStoragePageClient.tsx:152`, `components/SuperadminSettingsStoragePageClient.tsx:165`, `components/SuperadminSettingsStoragePageClient.tsx:178`, `components/SuperadminSettingsStoragePageClient.tsx:187`, `components/SuperadminSettingsStoragePageClient.tsx:203`, `components/SuperadminSettingsStoragePageClient.tsx:230`, `components/SuperadminSettingsStoragePageClient.tsx:79`, `hooks/useSuperadminSettingsStorageConfirm.ts:40`, `hooks/useSuperadminSettingsStorageConfirm.ts:46`, `hooks/useSuperadminSettingsStorageConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `border-focus` | `components/SuperadminSettingsStoragePageClient.tsx:89` |
| `ring-primary` | `components/SuperadminSettingsStoragePageClient.tsx:219`, `hooks/useSuperadminSettingsStorageConfirm.ts:68`, `hooks/useSuperadminSettingsStorageConfirm.ts:73`, `hooks/useSuperadminSettingsStorageConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSettingsStoragePageClient.tsx:89` |
| `shadow-dialog` | `hooks/useSuperadminSettingsStorageConfirm.ts:40`, `hooks/useSuperadminSettingsStorageConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsStorageErrorFallback.tsx:22`, `components/SuperadminSettingsStoragePageClient.tsx:117`, `components/SuperadminSettingsStoragePageClient.tsx:122`, `components/SuperadminSettingsStoragePageClient.tsx:204`, `components/SuperadminSettingsStoragePageClient.tsx:208`, `components/SuperadminSettingsStoragePageClient.tsx:234`, `hooks/useSuperadminSettingsStorageConfirm.ts:54` |
| `text-info` | `components/SuperadminSettingsStoragePageClient.tsx:154`, `components/SuperadminSettingsStoragePageClient.tsx:167`, `components/SuperadminSettingsStoragePageClient.tsx:189` |
| `text-on-danger` | `components/SuperadminSettingsStoragePageClient.tsx:219`, `hooks/useSuperadminSettingsStorageConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsStorageConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsStoragePageClient.tsx:110`, `components/SuperadminSettingsStoragePageClient.tsx:115`, `components/SuperadminSettingsStoragePageClient.tsx:120`, `components/SuperadminSettingsStoragePageClient.tsx:125`, `components/SuperadminSettingsStoragePageClient.tsx:133`, `components/SuperadminSettingsStoragePageClient.tsx:148`, `components/SuperadminSettingsStoragePageClient.tsx:155`, `components/SuperadminSettingsStoragePageClient.tsx:168`, `components/SuperadminSettingsStoragePageClient.tsx:181`, `components/SuperadminSettingsStoragePageClient.tsx:190`, `components/SuperadminSettingsStoragePageClient.tsx:214`, `components/SuperadminSettingsStoragePageClient.tsx:227`, `components/SuperadminSettingsStoragePageClient.tsx:243`, `components/SuperadminSettingsStoragePageClient.tsx:70`, `components/SuperadminSettingsStoragePageClient.tsx:89`, `components/SuperadminSettingsStoragePageClient.tsx:90`, `hooks/useSuperadminSettingsStorageConfirm.ts:40`, `hooks/useSuperadminSettingsStorageConfirm.ts:49`, `hooks/useSuperadminSettingsStorageConfirm.ts:68`, `hooks/useSuperadminSettingsStorageConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsStoragePageClient.tsx:111`, `components/SuperadminSettingsStoragePageClient.tsx:149`, `components/SuperadminSettingsStoragePageClient.tsx:157`, `components/SuperadminSettingsStoragePageClient.tsx:170`, `components/SuperadminSettingsStoragePageClient.tsx:183`, `components/SuperadminSettingsStoragePageClient.tsx:192`, `components/SuperadminSettingsStoragePageClient.tsx:215`, `components/SuperadminSettingsStoragePageClient.tsx:242`, `components/SuperadminSettingsStoragePageClient.tsx:90`, `hooks/useSuperadminSettingsStorageConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminSettingsStoragePageClient.tsx:180` |
| `text-warning` | `components/SuperadminSettingsStoragePageClient.tsx:194` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-25)

The immutable local tab is `Storage`. Sibling workflow actions navigate to their canonical routes; sibling-only render branches are not locally reachable and were removed without changing the active route view. This source-only repair does not establish backend behavior.
