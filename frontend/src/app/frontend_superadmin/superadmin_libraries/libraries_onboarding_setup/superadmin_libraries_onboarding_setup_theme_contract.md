# libraries_onboarding_setup — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `bg-primary-subtle` | `--primary-subtle` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminLibrariesOnboardingSetupListSkeleton.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx` |
| `border-border` | `--border` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts` |
| `text-primary` | `--text-primary` | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx`, `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx` |
| `border-primary` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx` |

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
| `bg-card` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:23` |
| `bg-danger` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx:22` |
| `bg-overlay` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:40`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:46`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOnboardingSetupListSkeleton.tsx:19`, `components/SuperadminLibrariesOnboardingSetupListSkeleton.tsx:21`, `components/SuperadminLibrariesOnboardingSetupListSkeleton.tsx:23`, `components/SuperadminLibrariesOnboardingSetupListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx:203` |
| `border-border` | `components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx:22`, `components/SuperadminLibrariesOnboardingSetupPageClient.tsx:203`, `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:23`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:40`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:46`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:23` |
| `border-focus` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29` |
| `ring-primary` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:68`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:73`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:40`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:46` |
| `text-danger` | `components/SuperadminLibrariesOnboardingSetupErrorFallback.tsx:22`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:74` |
| `text-primary` | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx:78`, `components/SuperadminLibrariesOnboardingSetupPageClient.tsx:95`, `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:40`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:49`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:68`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29`, `hooks/useSuperadminLibrariesOnboardingSetupConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:23` |
| `text-warning` | `components/SuperadminLibrariesOnboardingSetupPageClient.tsx:203`, `components/SuperadminLibrariesOnboardingSetupPageClient.tsx:214` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-2` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29` |
| `border-transparent` | `components/SuperadminLibrariesOnboardingSetupWorkflowNavigation.tsx:29` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
