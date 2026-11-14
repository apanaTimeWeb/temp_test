# billing_invoices — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `components/SuperadminBillingInvoicesListSkeleton.tsx`, `components/SuperadminBillingInvoicesSemanticTable.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminBillingInvoicesErrorFallback.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx` |
| `bg-floating` | `--bg-floating` | `components/SuperadminBillingInvoicesPageClient.tsx` |
| `bg-info-bg` | `--info-bg` | `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx` |
| `bg-input` | `--bg-input` | `components/SuperadminBillingInvoicesSemanticTable.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `bg-primary-subtle` | `--primary-subtle` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminBillingInvoicesListSkeleton.tsx` |
| `bg-success` | `--success` | `components/SuperadminBillingInvoicesPageClient.tsx` |
| `bg-success-bg` | `--success-bg` | `components/SuperadminBillingInvoicesPageClient.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminBillingInvoicesListSkeleton.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx`, `components/SuperadminBillingInvoicesSemanticTable.tsx`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminBillingInvoicesPageClient.tsx` |
| `border-border` | `--border` | `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesListSkeleton.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx`, `components/SuperadminBillingInvoicesSemanticTable.tsx`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `shadow-card` | `--shadow-card` | `components/SuperadminBillingInvoicesPageClient.tsx` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminBillingInvoicesErrorFallback.tsx`, `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `text-info` | `--info-text` | `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminBillingInvoicesConfirm.ts` |
| `text-on-success` | `--text-on-success` | `components/SuperadminBillingInvoicesPageClient.tsx` |
| `text-primary` | `--text-primary` | `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx`, `components/SuperadminBillingInvoicesSemanticTable.tsx`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminBillingInvoicesEmptyState.tsx`, `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx`, `components/SuperadminBillingInvoicesSemanticTable.tsx`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx`, `hooks/useSuperadminBillingInvoicesConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-success` | `--success-text` | `components/SuperadminBillingInvoicesKpiCards.tsx`, `components/SuperadminBillingInvoicesPageClient.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminBillingInvoicesPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingInvoicesErrorFallback.tsx` |
| `border-primary` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingInvoicesPageClient.tsx` |

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
| `bg-card` | `components/SuperadminBillingInvoicesListSkeleton.tsx:32`, `components/SuperadminBillingInvoicesSemanticTable.tsx:40`, `hooks/useSuperadminBillingInvoicesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:46` |
| `bg-danger` | `hooks/useSuperadminBillingInvoicesConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminBillingInvoicesErrorFallback.tsx:24`, `components/SuperadminBillingInvoicesPageClient.tsx:232` |
| `bg-floating` | `components/SuperadminBillingInvoicesPageClient.tsx:228` |
| `bg-info-bg` | `components/SuperadminBillingInvoicesKpiCards.tsx:28`, `components/SuperadminBillingInvoicesPageClient.tsx:190` |
| `bg-input` | `components/SuperadminBillingInvoicesSemanticTable.tsx:38` |
| `bg-overlay` | `hooks/useSuperadminBillingInvoicesConfirm.ts:40`, `hooks/useSuperadminBillingInvoicesConfirm.ts:46`, `hooks/useSuperadminBillingInvoicesConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminBillingInvoicesConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29` |
| `bg-skeleton-base` | `components/SuperadminBillingInvoicesListSkeleton.tsx:22`, `components/SuperadminBillingInvoicesListSkeleton.tsx:23`, `components/SuperadminBillingInvoicesListSkeleton.tsx:26`, `components/SuperadminBillingInvoicesListSkeleton.tsx:29`, `components/SuperadminBillingInvoicesListSkeleton.tsx:30`, `components/SuperadminBillingInvoicesListSkeleton.tsx:35`, `components/SuperadminBillingInvoicesListSkeleton.tsx:40` |
| `bg-success` | `components/SuperadminBillingInvoicesPageClient.tsx:173`, `components/SuperadminBillingInvoicesPageClient.tsx:283` |
| `bg-success-bg` | `components/SuperadminBillingInvoicesPageClient.tsx:217`, `components/SuperadminBillingInvoicesPageClient.tsx:232` |
| `bg-surface-hover` | `components/SuperadminBillingInvoicesListSkeleton.tsx:34`, `components/SuperadminBillingInvoicesPageClient.tsx:191`, `components/SuperadminBillingInvoicesPageClient.tsx:215`, `components/SuperadminBillingInvoicesSemanticTable.tsx:49`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29`, `hooks/useSuperadminBillingInvoicesConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminBillingInvoicesPageClient.tsx:181` |
| `border-border` | `components/SuperadminBillingInvoicesErrorFallback.tsx:24`, `components/SuperadminBillingInvoicesKpiCards.tsx:28`, `components/SuperadminBillingInvoicesListSkeleton.tsx:26`, `components/SuperadminBillingInvoicesListSkeleton.tsx:29`, `components/SuperadminBillingInvoicesListSkeleton.tsx:30`, `components/SuperadminBillingInvoicesListSkeleton.tsx:32`, `components/SuperadminBillingInvoicesListSkeleton.tsx:34`, `components/SuperadminBillingInvoicesPageClient.tsx:143`, `components/SuperadminBillingInvoicesPageClient.tsx:181`, `components/SuperadminBillingInvoicesPageClient.tsx:183`, `components/SuperadminBillingInvoicesPageClient.tsx:190`, `components/SuperadminBillingInvoicesPageClient.tsx:215`, `components/SuperadminBillingInvoicesPageClient.tsx:217`, `components/SuperadminBillingInvoicesPageClient.tsx:281`, `components/SuperadminBillingInvoicesSemanticTable.tsx:38`, `components/SuperadminBillingInvoicesSemanticTable.tsx:43`, `components/SuperadminBillingInvoicesSemanticTable.tsx:49`, `components/SuperadminBillingInvoicesSemanticTable.tsx:58`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:23`, `hooks/useSuperadminBillingInvoicesConfirm.ts:40`, `hooks/useSuperadminBillingInvoicesConfirm.ts:46`, `hooks/useSuperadminBillingInvoicesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:46` |
| `border-focus` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29` |
| `ring-primary` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29`, `hooks/useSuperadminBillingInvoicesConfirm.ts:68`, `hooks/useSuperadminBillingInvoicesConfirm.ts:73`, `hooks/useSuperadminBillingInvoicesConfirm.ts:74` |
| `shadow-card` | `components/SuperadminBillingInvoicesPageClient.tsx:190` |
| `shadow-dialog` | `hooks/useSuperadminBillingInvoicesConfirm.ts:40`, `hooks/useSuperadminBillingInvoicesConfirm.ts:46` |
| `text-danger` | `components/SuperadminBillingInvoicesErrorFallback.tsx:24`, `components/SuperadminBillingInvoicesKpiCards.tsx:26`, `components/SuperadminBillingInvoicesPageClient.tsx:232`, `components/SuperadminBillingInvoicesPageClient.tsx:260`, `components/SuperadminBillingInvoicesPageClient.tsx:266`, `components/SuperadminBillingInvoicesPageClient.tsx:271`, `components/SuperadminBillingInvoicesPageClient.tsx:277`, `hooks/useSuperadminBillingInvoicesConfirm.ts:54` |
| `text-info` | `components/SuperadminBillingInvoicesKpiCards.tsx:30`, `components/SuperadminBillingInvoicesPageClient.tsx:143` |
| `text-on-danger` | `hooks/useSuperadminBillingInvoicesConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminBillingInvoicesConfirm.ts:74` |
| `text-on-success` | `components/SuperadminBillingInvoicesPageClient.tsx:173`, `components/SuperadminBillingInvoicesPageClient.tsx:283` |
| `text-primary` | `components/SuperadminBillingInvoicesKpiCards.tsx:20`, `components/SuperadminBillingInvoicesKpiCards.tsx:25`, `components/SuperadminBillingInvoicesPageClient.tsx:190`, `components/SuperadminBillingInvoicesPageClient.tsx:191`, `components/SuperadminBillingInvoicesPageClient.tsx:210`, `components/SuperadminBillingInvoicesPageClient.tsx:221`, `components/SuperadminBillingInvoicesPageClient.tsx:227`, `components/SuperadminBillingInvoicesPageClient.tsx:248`, `components/SuperadminBillingInvoicesPageClient.tsx:276`, `components/SuperadminBillingInvoicesSemanticTable.tsx:38`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29`, `hooks/useSuperadminBillingInvoicesConfirm.ts:40`, `hooks/useSuperadminBillingInvoicesConfirm.ts:49`, `hooks/useSuperadminBillingInvoicesConfirm.ts:68`, `hooks/useSuperadminBillingInvoicesConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminBillingInvoicesEmptyState.tsx:16`, `components/SuperadminBillingInvoicesKpiCards.tsx:31`, `components/SuperadminBillingInvoicesPageClient.tsx:170`, `components/SuperadminBillingInvoicesPageClient.tsx:191`, `components/SuperadminBillingInvoicesPageClient.tsx:211`, `components/SuperadminBillingInvoicesPageClient.tsx:222`, `components/SuperadminBillingInvoicesPageClient.tsx:227`, `components/SuperadminBillingInvoicesPageClient.tsx:258`, `components/SuperadminBillingInvoicesPageClient.tsx:264`, `components/SuperadminBillingInvoicesPageClient.tsx:269`, `components/SuperadminBillingInvoicesPageClient.tsx:275`, `components/SuperadminBillingInvoicesSemanticTable.tsx:38`, `components/SuperadminBillingInvoicesSemanticTable.tsx:40`, `components/SuperadminBillingInvoicesSemanticTable.tsx:49`, `components/SuperadminBillingInvoicesSemanticTable.tsx:58`, `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29`, `hooks/useSuperadminBillingInvoicesConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:46` |
| `text-success` | `components/SuperadminBillingInvoicesKpiCards.tsx:21`, `components/SuperadminBillingInvoicesPageClient.tsx:129`, `components/SuperadminBillingInvoicesPageClient.tsx:218`, `components/SuperadminBillingInvoicesPageClient.tsx:222`, `components/SuperadminBillingInvoicesPageClient.tsx:232`, `components/SuperadminBillingInvoicesPageClient.tsx:249` |
| `text-warning` | `components/SuperadminBillingInvoicesPageClient.tsx:181`, `components/SuperadminBillingInvoicesPageClient.tsx:253` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminBillingInvoicesSemanticTable.tsx:49` |
| `border-b-2` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29` |
| `border-collapse` | `components/SuperadminBillingInvoicesSemanticTable.tsx:39` |
| `border-transparent` | `components/SuperadminBillingInvoicesWorkflowNavigation.tsx:29` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-26)

The immutable local tab is `invoices`. Sibling workflow actions navigate to their canonical routes; sibling-only render branches are not locally reachable and were removed without changing the active route view. This source-only repair does not establish backend behavior.

## Promotions ownership boundary (RBG-26)

The canonical Promotions workflow is owned by `superadmin_plans/plans_promotions`; this leaf's theme inventory covers only the invoice preview flow.
