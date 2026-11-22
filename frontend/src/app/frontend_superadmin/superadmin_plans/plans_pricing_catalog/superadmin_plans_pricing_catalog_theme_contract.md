# plans_pricing_catalog — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminPlansPricingCatalogErrorFallback.tsx` |
| `bg-info` | `--info` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |
| `bg-info-bg` | `--info-bg` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminPlansPricingCatalogListSkeleton.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminPlansPricingCatalogPageClient.tsx`, `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |
| `border-border` | `--border` | `components/SuperadminPlansPricingCatalogPageClient.tsx`, `hooks/useSuperadminPlansPricingCatalogConfirm.ts`, `page.tsx` |
| `border-focus` | `--border-focus` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |
| `ring-primary` | `--focus-ring` | `components/SuperadminPlansPricingCatalogPageClient.tsx`, `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `shadow-card` | `--shadow-card` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminPlansPricingCatalogErrorFallback.tsx`, `components/SuperadminPlansPricingCatalogPageClient.tsx`, `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `text-on-info` | `--text-on-info` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminPlansPricingCatalogConfirm.ts` |
| `text-primary` | `--text-primary` | `components/SuperadminPlansPricingCatalogPageClient.tsx`, `hooks/useSuperadminPlansPricingCatalogConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminPlansPricingCatalogPageClient.tsx`, `hooks/useSuperadminPlansPricingCatalogConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminPlansPricingCatalogPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminPlansPricingCatalogErrorFallback.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminPlansPricingCatalogPageClient.tsx` |

### Token inventory verification boundary

- Source-to-inventory matching is static and scoped to this autonomous leaf; generated tokens are not proof that the host CSS defines them.
- Any row marked `NOT_VERIFIED` requires the host stylesheet/Tailwind mapping before host-level token compliance can be claimed.
- Keep the existing semantic foreground/background pairing, focus visibility, responsive behavior, and reduced-motion alternatives; no palette or global stylesheet changes are in this repair scope.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

### Canonical inventory reference

The canonical semantic token inventory is maintained once above under **Canonical Global Semantic Token Inventory**. This section intentionally does not duplicate that table; source observations and any noncanonical semantic-like utilities are recorded in the preceding canonical inventory and its adjacent unverified-utility section.

### Unverified semantic-like classes and source-level hazards

Use the populated **Semantic-like classes without an explicit canonical class-to-variable row** table above as the single source of noncanonical utility evidence. No second empty placeholder inventory is maintained.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (preserved in v21)

The immutable local tab is `SaaS Pricing Plans`. Sibling workflow actions navigate to their canonical routes; sibling-only render branches are not locally reachable and were removed without changing the active route view. This source-only repair does not establish backend behavior.
