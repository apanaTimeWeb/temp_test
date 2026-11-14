# member_payments_collection — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx` |
| `border-border` | `--border` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback.tsx`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts` |
| `text-primary` | `--text-primary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts`, `not-found.tsx`, `page.tsx` |
| `text-warning` | `--warning-text` | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx`, `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx` |

### Token inventory verification boundary

- Source-to-inventory matching is static and scoped to this autonomous leaf; generated tokens are not proof that the host CSS defines them.
- Any row marked `NOT_VERIFIED` requires the host stylesheet/Tailwind mapping before host-level token compliance can be claimed.
- Keep the existing semantic foreground/background pairing, focus visibility, responsive behavior, and reduced-motion alternatives; no palette or global stylesheet changes are in this repair scope.

## Constraints
- Do not introduce arbitrary hex/RGB colors, new palette entries, or unapproved CSS variables.
- Preserve semantic foreground/background pairing, focus-visible states, reduced-motion behavior, responsive layouts, and contrast.
- Reuse only design-system tokens already present in the supplied web design contract.
- Static token inventory is not a visual accessibility pass; browser verification remains deferred until host runtime is available.

## Route preservation note (RBG8 checkpoint)

The canonical leaf route is `/superadmin/superadmin_billing/billing_member_payments_collection`. The public legacy route `/superadmin/superadmin_billing/billing_overview?view=member_payments_collection` remains supported by the parent dispatcher. Host-level direct-refresh behavior requires verification in the host application.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:24`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:68`, `not-found.tsx:10`, `page.tsx:16` |
| `bg-danger` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback.tsx:13` |
| `bg-overlay` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:40`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:46`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:14`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:15`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:18`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:21`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:22`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:27`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:26`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx:157` |
| `border-border` | `components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback.tsx:13`, `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx:157`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:18`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:21`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:22`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:24`, `components/SuperadminBillingOverviewMemberPaymentsCollectionRouteSkeleton.tsx:26`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:40`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:46`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:68`, `not-found.tsx:10`, `page.tsx:16` |
| `ring-primary` | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx:232`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:68`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:73`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:40`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:46` |
| `text-danger` | `components/SuperadminBillingOverviewMemberPaymentsCollectionErrorFallback.tsx:13`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:74` |
| `text-primary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:40`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:49`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:68`, `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:99`, `not-found.tsx:10` |
| `text-secondary` | `hooks/useSuperadminBillingOverviewMemberPaymentsCollectionConfirm.ts:62`, `not-found.tsx:12`, `page.tsx:16` |
| `text-warning` | `components/SuperadminBillingOverviewMemberPaymentsCollectionPageClient.tsx:157` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
