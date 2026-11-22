# billing_overview — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `components/SuperadminBillingOverviewListSkeleton.tsx`, `components/SuperadminBillingOverviewSemanticTable.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminBillingOverviewErrorFallback.tsx`, `components/SuperadminBillingOverviewPageClient.tsx` |
| `bg-floating` | `--bg-floating` | `components/SuperadminBillingOverviewPageClient.tsx` |
| `bg-info-bg` | `--info-bg` | `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewPageClient.tsx` |
| `bg-input` | `--bg-input` | `components/SuperadminBillingOverviewSemanticTable.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `bg-primary-subtle` | `--primary-subtle` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminBillingOverviewListSkeleton.tsx` |
| `bg-success` | `--success` | `components/SuperadminBillingOverviewPageClient.tsx` |
| `bg-success-bg` | `--success-bg` | `components/SuperadminBillingOverviewPageClient.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminBillingOverviewListSkeleton.tsx`, `components/SuperadminBillingOverviewPageClient.tsx`, `components/SuperadminBillingOverviewSemanticTable.tsx`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminBillingOverviewPageClient.tsx` |
| `border-border` | `--border` | `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewListSkeleton.tsx`, `components/SuperadminBillingOverviewPageClient.tsx`, `components/SuperadminBillingOverviewSemanticTable.tsx`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `shadow-card` | `--shadow-card` | `components/SuperadminBillingOverviewPageClient.tsx` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminBillingOverviewErrorFallback.tsx`, `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewPageClient.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `text-info` | `--info-text` | `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewPageClient.tsx` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminBillingOverviewConfirm.ts` |
| `text-on-success` | `--text-on-success` | `components/SuperadminBillingOverviewPageClient.tsx` |
| `text-primary` | `--text-primary` | `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewPageClient.tsx`, `components/SuperadminBillingOverviewSemanticTable.tsx`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminBillingOverviewEmptyState.tsx`, `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewPageClient.tsx`, `components/SuperadminBillingOverviewSemanticTable.tsx`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx`, `hooks/useSuperadminBillingOverviewConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-success` | `--success-text` | `components/SuperadminBillingOverviewKpiCards.tsx`, `components/SuperadminBillingOverviewPageClient.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminBillingOverviewPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingOverviewErrorFallback.tsx` |
| `border-primary` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingOverviewWorkflowNavigation.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingOverviewPageClient.tsx` |

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
| `bg-card` | `components/SuperadminBillingOverviewListSkeleton.tsx:30`, `components/SuperadminBillingOverviewSemanticTable.tsx:40`, `hooks/useSuperadminBillingOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:28` |
| `bg-danger` | `hooks/useSuperadminBillingOverviewConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminBillingOverviewErrorFallback.tsx:21`, `components/SuperadminBillingOverviewPageClient.tsx:232` |
| `bg-floating` | `components/SuperadminBillingOverviewPageClient.tsx:228` |
| `bg-info-bg` | `components/SuperadminBillingOverviewKpiCards.tsx:28`, `components/SuperadminBillingOverviewPageClient.tsx:190` |
| `bg-input` | `components/SuperadminBillingOverviewSemanticTable.tsx:38` |
| `bg-overlay` | `hooks/useSuperadminBillingOverviewConfirm.ts:40`, `hooks/useSuperadminBillingOverviewConfirm.ts:46`, `hooks/useSuperadminBillingOverviewConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminBillingOverviewConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35` |
| `bg-skeleton-base` | `components/SuperadminBillingOverviewListSkeleton.tsx:20`, `components/SuperadminBillingOverviewListSkeleton.tsx:21`, `components/SuperadminBillingOverviewListSkeleton.tsx:24`, `components/SuperadminBillingOverviewListSkeleton.tsx:27`, `components/SuperadminBillingOverviewListSkeleton.tsx:28`, `components/SuperadminBillingOverviewListSkeleton.tsx:33`, `components/SuperadminBillingOverviewListSkeleton.tsx:38` |
| `bg-success` | `components/SuperadminBillingOverviewPageClient.tsx:173`, `components/SuperadminBillingOverviewPageClient.tsx:283` |
| `bg-success-bg` | `components/SuperadminBillingOverviewPageClient.tsx:217`, `components/SuperadminBillingOverviewPageClient.tsx:232` |
| `bg-surface-hover` | `components/SuperadminBillingOverviewListSkeleton.tsx:32`, `components/SuperadminBillingOverviewPageClient.tsx:191`, `components/SuperadminBillingOverviewPageClient.tsx:215`, `components/SuperadminBillingOverviewSemanticTable.tsx:49`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35`, `hooks/useSuperadminBillingOverviewConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminBillingOverviewPageClient.tsx:181` |
| `border-border` | `components/SuperadminBillingOverviewErrorFallback.tsx:21`, `components/SuperadminBillingOverviewKpiCards.tsx:28`, `components/SuperadminBillingOverviewListSkeleton.tsx:24`, `components/SuperadminBillingOverviewListSkeleton.tsx:27`, `components/SuperadminBillingOverviewListSkeleton.tsx:28`, `components/SuperadminBillingOverviewListSkeleton.tsx:30`, `components/SuperadminBillingOverviewListSkeleton.tsx:32`, `components/SuperadminBillingOverviewPageClient.tsx:143`, `components/SuperadminBillingOverviewPageClient.tsx:181`, `components/SuperadminBillingOverviewPageClient.tsx:183`, `components/SuperadminBillingOverviewPageClient.tsx:190`, `components/SuperadminBillingOverviewPageClient.tsx:215`, `components/SuperadminBillingOverviewPageClient.tsx:217`, `components/SuperadminBillingOverviewPageClient.tsx:281`, `components/SuperadminBillingOverviewSemanticTable.tsx:38`, `components/SuperadminBillingOverviewSemanticTable.tsx:43`, `components/SuperadminBillingOverviewSemanticTable.tsx:49`, `components/SuperadminBillingOverviewSemanticTable.tsx:58`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx:29`, `hooks/useSuperadminBillingOverviewConfirm.ts:40`, `hooks/useSuperadminBillingOverviewConfirm.ts:46`, `hooks/useSuperadminBillingOverviewConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:28` |
| `border-focus` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35` |
| `ring-primary` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35`, `hooks/useSuperadminBillingOverviewConfirm.ts:68`, `hooks/useSuperadminBillingOverviewConfirm.ts:73`, `hooks/useSuperadminBillingOverviewConfirm.ts:74` |
| `shadow-card` | `components/SuperadminBillingOverviewPageClient.tsx:190` |
| `shadow-dialog` | `hooks/useSuperadminBillingOverviewConfirm.ts:40`, `hooks/useSuperadminBillingOverviewConfirm.ts:46` |
| `text-danger` | `components/SuperadminBillingOverviewErrorFallback.tsx:21`, `components/SuperadminBillingOverviewKpiCards.tsx:26`, `components/SuperadminBillingOverviewPageClient.tsx:232`, `components/SuperadminBillingOverviewPageClient.tsx:260`, `components/SuperadminBillingOverviewPageClient.tsx:266`, `components/SuperadminBillingOverviewPageClient.tsx:271`, `components/SuperadminBillingOverviewPageClient.tsx:277`, `hooks/useSuperadminBillingOverviewConfirm.ts:54` |
| `text-info` | `components/SuperadminBillingOverviewKpiCards.tsx:30`, `components/SuperadminBillingOverviewPageClient.tsx:143` |
| `text-on-danger` | `hooks/useSuperadminBillingOverviewConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminBillingOverviewConfirm.ts:74` |
| `text-on-success` | `components/SuperadminBillingOverviewPageClient.tsx:173`, `components/SuperadminBillingOverviewPageClient.tsx:283` |
| `text-primary` | `components/SuperadminBillingOverviewKpiCards.tsx:20`, `components/SuperadminBillingOverviewKpiCards.tsx:25`, `components/SuperadminBillingOverviewPageClient.tsx:190`, `components/SuperadminBillingOverviewPageClient.tsx:191`, `components/SuperadminBillingOverviewPageClient.tsx:210`, `components/SuperadminBillingOverviewPageClient.tsx:221`, `components/SuperadminBillingOverviewPageClient.tsx:227`, `components/SuperadminBillingOverviewPageClient.tsx:248`, `components/SuperadminBillingOverviewPageClient.tsx:276`, `components/SuperadminBillingOverviewSemanticTable.tsx:38`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35`, `hooks/useSuperadminBillingOverviewConfirm.ts:40`, `hooks/useSuperadminBillingOverviewConfirm.ts:49`, `hooks/useSuperadminBillingOverviewConfirm.ts:68`, `hooks/useSuperadminBillingOverviewConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminBillingOverviewEmptyState.tsx:16`, `components/SuperadminBillingOverviewKpiCards.tsx:31`, `components/SuperadminBillingOverviewPageClient.tsx:170`, `components/SuperadminBillingOverviewPageClient.tsx:191`, `components/SuperadminBillingOverviewPageClient.tsx:211`, `components/SuperadminBillingOverviewPageClient.tsx:222`, `components/SuperadminBillingOverviewPageClient.tsx:227`, `components/SuperadminBillingOverviewPageClient.tsx:258`, `components/SuperadminBillingOverviewPageClient.tsx:264`, `components/SuperadminBillingOverviewPageClient.tsx:269`, `components/SuperadminBillingOverviewPageClient.tsx:275`, `components/SuperadminBillingOverviewSemanticTable.tsx:38`, `components/SuperadminBillingOverviewSemanticTable.tsx:40`, `components/SuperadminBillingOverviewSemanticTable.tsx:49`, `components/SuperadminBillingOverviewSemanticTable.tsx:58`, `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35`, `hooks/useSuperadminBillingOverviewConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:28` |
| `text-success` | `components/SuperadminBillingOverviewKpiCards.tsx:21`, `components/SuperadminBillingOverviewPageClient.tsx:129`, `components/SuperadminBillingOverviewPageClient.tsx:218`, `components/SuperadminBillingOverviewPageClient.tsx:222`, `components/SuperadminBillingOverviewPageClient.tsx:232`, `components/SuperadminBillingOverviewPageClient.tsx:249` |
| `text-warning` | `components/SuperadminBillingOverviewPageClient.tsx:181`, `components/SuperadminBillingOverviewPageClient.tsx:253` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminBillingOverviewSemanticTable.tsx:49` |
| `border-b-2` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35` |
| `border-collapse` | `components/SuperadminBillingOverviewSemanticTable.tsx:39` |
| `border-transparent` | `components/SuperadminBillingOverviewWorkflowNavigation.tsx:35` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-27)

The immutable local tab is `invoices`. Sibling workflow actions navigate to their canonical routes; sibling-only render branches are not locally reachable and were removed without changing the active route view. This source-only repair does not establish backend behavior.

## Promotions ownership boundary (RBG-27)

The canonical Promotions workflow is owned by `superadmin_plans/plans_promotions`; this leaf's theme inventory covers only the invoice preview flow.
