# libraries_overview — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `components/SuperadminLibrariesOverviewListSkeleton.tsx`, `components/SuperadminLibrariesOverviewSemanticTable.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminLibrariesOverviewErrorFallback.tsx`, `components/SuperadminLibrariesOverviewPageClient.tsx`, `components/SuperadminLibrariesOverviewPanel.tsx` |
| `bg-input` | `--bg-input` | `components/SuperadminLibrariesOverviewSemanticTable.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `bg-primary-subtle` | `--primary-subtle` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminLibrariesOverviewListSkeleton.tsx` |
| `bg-success-bg` | `--success-bg` | `components/SuperadminLibrariesOverviewPanel.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminLibrariesOverviewListSkeleton.tsx`, `components/SuperadminLibrariesOverviewPanel.tsx`, `components/SuperadminLibrariesOverviewSemanticTable.tsx`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminLibrariesOverviewPageClient.tsx` |
| `border-border` | `--border` | `components/SuperadminLibrariesOverviewListSkeleton.tsx`, `components/SuperadminLibrariesOverviewPanel.tsx`, `components/SuperadminLibrariesOverviewSemanticTable.tsx`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminLibrariesOverviewErrorFallback.tsx`, `components/SuperadminLibrariesOverviewPageClient.tsx`, `components/SuperadminLibrariesOverviewPanel.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `text-info` | `--info-text` | `components/SuperadminLibrariesOverviewPanel.tsx` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminLibrariesOverviewConfirm.ts` |
| `text-primary` | `--text-primary` | `components/SuperadminLibrariesOverviewPageClient.tsx`, `components/SuperadminLibrariesOverviewPanel.tsx`, `components/SuperadminLibrariesOverviewSemanticTable.tsx`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminLibrariesOverviewEmptyState.tsx`, `components/SuperadminLibrariesOverviewPageClient.tsx`, `components/SuperadminLibrariesOverviewPanel.tsx`, `components/SuperadminLibrariesOverviewSemanticTable.tsx`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminLibrariesOverviewConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-success` | `--success-text` | `components/SuperadminLibrariesOverviewPanel.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminLibrariesOverviewPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOverviewErrorFallback.tsx`, `components/SuperadminLibrariesOverviewPageClient.tsx` |
| `border-primary` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminLibrariesOverviewPageClient.tsx` |

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
| `bg-card` | `components/SuperadminLibrariesOverviewListSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:39`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:31` |
| `bg-danger` | `hooks/useSuperadminLibrariesOverviewConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewErrorFallback.tsx:21`, `components/SuperadminLibrariesOverviewPageClient.tsx:128`, `components/SuperadminLibrariesOverviewPanel.tsx:214` |
| `bg-input` | `components/SuperadminLibrariesOverviewSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminLibrariesOverviewConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:46`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminLibrariesOverviewConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewListSkeleton.tsx:20`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:25`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:30`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:35` |
| `bg-success-bg` | `components/SuperadminLibrariesOverviewPanel.tsx:190`, `components/SuperadminLibrariesOverviewPanel.tsx:214` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewListSkeleton.tsx:29`, `components/SuperadminLibrariesOverviewPanel.tsx:210`, `components/SuperadminLibrariesOverviewPanel.tsx:211`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:48`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminLibrariesOverviewPageClient.tsx:125` |
| `border-border` | `components/SuperadminLibrariesOverviewErrorFallback.tsx:21`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:25`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewListSkeleton.tsx:29`, `components/SuperadminLibrariesOverviewPageClient.tsx:125`, `components/SuperadminLibrariesOverviewPageClient.tsx:128`, `components/SuperadminLibrariesOverviewPanel.tsx:190`, `components/SuperadminLibrariesOverviewPanel.tsx:208`, `components/SuperadminLibrariesOverviewPanel.tsx:210`, `components/SuperadminLibrariesOverviewPanel.tsx:211`, `components/SuperadminLibrariesOverviewPanel.tsx:214`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:37`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:42`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:48`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:57`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:32`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:46`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:31` |
| `border-focus` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38` |
| `ring-primary` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:68`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:73`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminLibrariesOverviewConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:46` |
| `text-danger` | `components/SuperadminLibrariesOverviewErrorFallback.tsx:21`, `components/SuperadminLibrariesOverviewPageClient.tsx:128`, `components/SuperadminLibrariesOverviewPanel.tsx:137`, `components/SuperadminLibrariesOverviewPanel.tsx:145`, `components/SuperadminLibrariesOverviewPanel.tsx:150`, `components/SuperadminLibrariesOverviewPanel.tsx:157`, `components/SuperadminLibrariesOverviewPanel.tsx:162`, `components/SuperadminLibrariesOverviewPanel.tsx:168`, `components/SuperadminLibrariesOverviewPanel.tsx:174`, `components/SuperadminLibrariesOverviewPanel.tsx:214`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:54` |
| `text-info` | `components/SuperadminLibrariesOverviewPanel.tsx:205` |
| `text-on-danger` | `hooks/useSuperadminLibrariesOverviewConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminLibrariesOverviewConfirm.ts:74` |
| `text-primary` | `components/SuperadminLibrariesOverviewPageClient.tsx:149`, `components/SuperadminLibrariesOverviewPageClient.tsx:75`, `components/SuperadminLibrariesOverviewPageClient.tsx:85`, `components/SuperadminLibrariesOverviewPanel.tsx:128`, `components/SuperadminLibrariesOverviewPanel.tsx:198`, `components/SuperadminLibrariesOverviewPanel.tsx:210`, `components/SuperadminLibrariesOverviewPanel.tsx:211`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:37`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:40`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:49`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:68`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminLibrariesOverviewEmptyState.tsx:16`, `components/SuperadminLibrariesOverviewPageClient.tsx:149`, `components/SuperadminLibrariesOverviewPageClient.tsx:152`, `components/SuperadminLibrariesOverviewPageClient.tsx:157`, `components/SuperadminLibrariesOverviewPageClient.tsx:76`, `components/SuperadminLibrariesOverviewPageClient.tsx:86`, `components/SuperadminLibrariesOverviewPageClient.tsx:93`, `components/SuperadminLibrariesOverviewPanel.tsx:129`, `components/SuperadminLibrariesOverviewPanel.tsx:136`, `components/SuperadminLibrariesOverviewPanel.tsx:209`, `components/SuperadminLibrariesOverviewPanel.tsx:210`, `components/SuperadminLibrariesOverviewPanel.tsx:211`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:37`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:39`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:48`, `components/SuperadminLibrariesOverviewSemanticTable.tsx:57`, `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38`, `hooks/useSuperadminLibrariesOverviewConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:31` |
| `text-success` | `components/SuperadminLibrariesOverviewPanel.tsx:194`, `components/SuperadminLibrariesOverviewPanel.tsx:214` |
| `text-warning` | `components/SuperadminLibrariesOverviewPageClient.tsx:125` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminLibrariesOverviewSemanticTable.tsx:48` |
| `border-b-2` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38` |
| `border-collapse` | `components/SuperadminLibrariesOverviewSemanticTable.tsx:38` |
| `border-transparent` | `components/SuperadminLibrariesOverviewWorkflowNavigation.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
