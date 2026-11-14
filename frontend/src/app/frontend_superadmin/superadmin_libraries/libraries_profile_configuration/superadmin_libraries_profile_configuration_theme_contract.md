# libraries_profile_configuration — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminLibrariesProfileConfigurationErrorFallback.tsx` |
| `bg-overlay` | `--bg-overlay` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `bg-primary-subtle` | `--primary-subtle` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminLibrariesProfileConfigurationListSkeleton.tsx` |
| `bg-surface-hover` | `--surface-hover` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx` |
| `border-border` | `--border` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts`, `page.tsx` |
| `border-focus` | `--border-focus` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx` |
| `ring-primary` | `--focus-ring` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminLibrariesProfileConfigurationErrorFallback.tsx`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts` |
| `text-primary` | `--text-primary` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesProfileConfigurationErrorFallback.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx` |

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
| `bg-card` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminLibrariesProfileConfigurationErrorFallback.tsx:22` |
| `bg-overlay` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:80`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:40`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:46`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:72` |
| `bg-skeleton-base` | `components/SuperadminLibrariesProfileConfigurationListSkeleton.tsx:19`, `components/SuperadminLibrariesProfileConfigurationListSkeleton.tsx:21`, `components/SuperadminLibrariesProfileConfigurationListSkeleton.tsx:23`, `components/SuperadminLibrariesProfileConfigurationListSkeleton.tsx:25` |
| `bg-surface-hover` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:103`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:57` |
| `border-border` | `components/SuperadminLibrariesProfileConfigurationErrorFallback.tsx:22`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:103`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:57`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:40`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:46`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `border-focus` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:72` |
| `ring-primary` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:68`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:73`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:40`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:46` |
| `text-danger` | `components/SuperadminLibrariesProfileConfigurationErrorFallback.tsx:22`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:100`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:88`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:90`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:95`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:98`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:74` |
| `text-primary` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:115`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:53`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:54`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:72`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:40`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:49`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:68`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:133`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:48`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:56`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:80`, `hooks/useSuperadminLibrariesProfileConfigurationConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |
| `text-warning` | `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:103`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:120`, `components/SuperadminLibrariesProfileConfigurationPageClient.tsx:57` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
