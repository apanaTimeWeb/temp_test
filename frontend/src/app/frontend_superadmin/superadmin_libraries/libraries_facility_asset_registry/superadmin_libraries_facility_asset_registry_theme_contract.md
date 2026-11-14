# facility_asset_registry — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx` |
| `border-border` | `--border` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts` |
| `text-primary` | `--text-primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState.tsx`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx`, `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx` |

### Token inventory verification boundary

- Source-to-inventory matching is static and scoped to this autonomous leaf; generated tokens are not proof that the host CSS defines them.
- Any row marked `NOT_VERIFIED` requires the host stylesheet/Tailwind mapping before host-level token compliance can be claimed.
- Keep the existing semantic foreground/background pairing, focus visibility, responsive behavior, and reduced-motion alternatives; no palette or global stylesheet changes are in this repair scope.

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
| `bg-card` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:24`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:68`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx:13` |
| `bg-overlay` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:46`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:26`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:84` |
| `border-border` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:84`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryRouteSkeleton.tsx:26`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:46`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:68`, `not-found.tsx:10`, `page.tsx:15` |
| `ring-primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:68`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:73`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:46` |
| `text-danger` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:141`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:143`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:144`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:145`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:74` |
| `text-primary` | `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:49`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:68`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:99`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState.tsx:16`, `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:139`, `hooks/useSuperadminLibrariesOverviewFacilityAssetRegistryConfirm.ts:62`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminLibrariesOverviewFacilityAssetRegistryPageClient.tsx:84` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
