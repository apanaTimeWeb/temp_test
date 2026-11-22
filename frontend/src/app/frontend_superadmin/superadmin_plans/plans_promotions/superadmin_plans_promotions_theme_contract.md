# plans_promotions — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminPlansPromotionsConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminPlansPromotionsErrorFallback.tsx`, `components/SuperadminPlansPromotionsPageClient.tsx` |
| `bg-floating` | `--bg-floating` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `bg-info-bg` | `--info-bg` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminPlansPromotionsListSkeleton.tsx` |
| `bg-success` | `--success` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `bg-success-bg` | `--success-bg` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminPlansPromotionsPageClient.tsx`, `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `border-border` | `--border` | `components/SuperadminPlansPromotionsPageClient.tsx`, `hooks/useSuperadminPlansPromotionsConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `shadow-card` | `--shadow-card` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminPlansPromotionsErrorFallback.tsx`, `components/SuperadminPlansPromotionsPageClient.tsx`, `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminPlansPromotionsConfirm.ts` |
| `text-on-success` | `--text-on-success` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `text-primary` | `--text-primary` | `components/SuperadminPlansPromotionsPageClient.tsx`, `hooks/useSuperadminPlansPromotionsConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminPlansPromotionsEmptyState.tsx`, `components/SuperadminPlansPromotionsPageClient.tsx`, `hooks/useSuperadminPlansPromotionsConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-success` | `--success-text` | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminPlansPromotionsPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminPlansPromotionsErrorFallback.tsx` |
| `border-info` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminPlansPromotionsPageClient.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminPlansPromotionsPageClient.tsx` |

### Token inventory verification boundary

- Source-to-inventory matching is static and scoped to this autonomous leaf; generated tokens are not proof that the host CSS defines them.
- Any row marked `NOT_VERIFIED` requires the host stylesheet/Tailwind mapping before host-level token compliance can be claimed.
- Keep the existing semantic foreground/background pairing, focus visibility, responsive behavior, and reduced-motion alternatives; no palette or global stylesheet changes are in this repair scope.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `hooks/useSuperadminPlansPromotionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `hooks/useSuperadminPlansPromotionsConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminPlansPromotionsErrorFallback.tsx:22`, `components/SuperadminPlansPromotionsPageClient.tsx:188` |
| `bg-floating` | `components/SuperadminPlansPromotionsPageClient.tsx:184` |
| `bg-info-bg` | `components/SuperadminPlansPromotionsPageClient.tsx:155` |
| `bg-overlay` | `hooks/useSuperadminPlansPromotionsConfirm.ts:40`, `hooks/useSuperadminPlansPromotionsConfirm.ts:46`, `hooks/useSuperadminPlansPromotionsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminPlansPromotionsConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminPlansPromotionsListSkeleton.tsx:19`, `components/SuperadminPlansPromotionsListSkeleton.tsx:21`, `components/SuperadminPlansPromotionsListSkeleton.tsx:23`, `components/SuperadminPlansPromotionsListSkeleton.tsx:25` |
| `bg-success` | `components/SuperadminPlansPromotionsPageClient.tsx:121`, `components/SuperadminPlansPromotionsPageClient.tsx:238` |
| `bg-success-bg` | `components/SuperadminPlansPromotionsPageClient.tsx:173`, `components/SuperadminPlansPromotionsPageClient.tsx:188` |
| `bg-surface-hover` | `components/SuperadminPlansPromotionsPageClient.tsx:156`, `components/SuperadminPlansPromotionsPageClient.tsx:171`, `hooks/useSuperadminPlansPromotionsConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminPlansPromotionsPageClient.tsx:128` |
| `border-border` | `components/SuperadminPlansPromotionsErrorFallback.tsx:22`, `components/SuperadminPlansPromotionsPageClient.tsx:128`, `components/SuperadminPlansPromotionsPageClient.tsx:131`, `components/SuperadminPlansPromotionsPageClient.tsx:148`, `components/SuperadminPlansPromotionsPageClient.tsx:155`, `components/SuperadminPlansPromotionsPageClient.tsx:171`, `components/SuperadminPlansPromotionsPageClient.tsx:173`, `components/SuperadminPlansPromotionsPageClient.tsx:236`, `hooks/useSuperadminPlansPromotionsConfirm.ts:40`, `hooks/useSuperadminPlansPromotionsConfirm.ts:46`, `hooks/useSuperadminPlansPromotionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `ring-primary` | `hooks/useSuperadminPlansPromotionsConfirm.ts:68`, `hooks/useSuperadminPlansPromotionsConfirm.ts:73`, `hooks/useSuperadminPlansPromotionsConfirm.ts:74` |
| `shadow-card` | `components/SuperadminPlansPromotionsPageClient.tsx:155` |
| `shadow-dialog` | `hooks/useSuperadminPlansPromotionsConfirm.ts:40`, `hooks/useSuperadminPlansPromotionsConfirm.ts:46` |
| `text-danger` | `components/SuperadminPlansPromotionsErrorFallback.tsx:22`, `components/SuperadminPlansPromotionsPageClient.tsx:188`, `components/SuperadminPlansPromotionsPageClient.tsx:215`, `components/SuperadminPlansPromotionsPageClient.tsx:221`, `components/SuperadminPlansPromotionsPageClient.tsx:226`, `components/SuperadminPlansPromotionsPageClient.tsx:232`, `hooks/useSuperadminPlansPromotionsConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminPlansPromotionsConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminPlansPromotionsConfirm.ts:74` |
| `text-on-success` | `components/SuperadminPlansPromotionsPageClient.tsx:121`, `components/SuperadminPlansPromotionsPageClient.tsx:238` |
| `text-primary` | `components/SuperadminPlansPromotionsPageClient.tsx:134`, `components/SuperadminPlansPromotionsPageClient.tsx:140`, `components/SuperadminPlansPromotionsPageClient.tsx:142`, `components/SuperadminPlansPromotionsPageClient.tsx:143`, `components/SuperadminPlansPromotionsPageClient.tsx:155`, `components/SuperadminPlansPromotionsPageClient.tsx:156`, `components/SuperadminPlansPromotionsPageClient.tsx:166`, `components/SuperadminPlansPromotionsPageClient.tsx:177`, `components/SuperadminPlansPromotionsPageClient.tsx:183`, `components/SuperadminPlansPromotionsPageClient.tsx:203`, `components/SuperadminPlansPromotionsPageClient.tsx:231`, `hooks/useSuperadminPlansPromotionsConfirm.ts:40`, `hooks/useSuperadminPlansPromotionsConfirm.ts:49`, `hooks/useSuperadminPlansPromotionsConfirm.ts:68`, `hooks/useSuperadminPlansPromotionsConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminPlansPromotionsEmptyState.tsx:16`, `components/SuperadminPlansPromotionsPageClient.tsx:140`, `components/SuperadminPlansPromotionsPageClient.tsx:141`, `components/SuperadminPlansPromotionsPageClient.tsx:142`, `components/SuperadminPlansPromotionsPageClient.tsx:143`, `components/SuperadminPlansPromotionsPageClient.tsx:156`, `components/SuperadminPlansPromotionsPageClient.tsx:167`, `components/SuperadminPlansPromotionsPageClient.tsx:178`, `components/SuperadminPlansPromotionsPageClient.tsx:183`, `components/SuperadminPlansPromotionsPageClient.tsx:213`, `components/SuperadminPlansPromotionsPageClient.tsx:219`, `components/SuperadminPlansPromotionsPageClient.tsx:224`, `components/SuperadminPlansPromotionsPageClient.tsx:230`, `hooks/useSuperadminPlansPromotionsConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminPlansPromotionsPageClient.tsx:141`, `components/SuperadminPlansPromotionsPageClient.tsx:174`, `components/SuperadminPlansPromotionsPageClient.tsx:178`, `components/SuperadminPlansPromotionsPageClient.tsx:188`, `components/SuperadminPlansPromotionsPageClient.tsx:204` |
| `text-warning` | `components/SuperadminPlansPromotionsPageClient.tsx:128`, `components/SuperadminPlansPromotionsPageClient.tsx:135`, `components/SuperadminPlansPromotionsPageClient.tsx:208` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
