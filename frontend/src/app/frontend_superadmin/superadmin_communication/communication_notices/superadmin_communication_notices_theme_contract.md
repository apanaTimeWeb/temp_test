# communication_notices — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `components/SuperadminCommunicationNoticesSemanticTable.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts`, `page.tsx` |
| `bg-danger` | `--danger` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminCommunicationNoticesErrorFallback.tsx` |
| `bg-input` | `--bg-input` | `components/SuperadminCommunicationNoticesSemanticTable.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `bg-primary` | `--primary` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `bg-primary-hover` | `--primary-hover` | `components/SuperadminCommunicationNoticesPageClient.tsx` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminCommunicationNoticesListSkeleton.tsx` |
| `bg-surface-hover` | `--surface-hover` | `components/SuperadminCommunicationNoticesSemanticTable.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `border-border` | `--border` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `components/SuperadminCommunicationNoticesSemanticTable.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts`, `page.tsx` |
| `ring-primary` | `--focus-ring` | `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `text-danger` | `--danger-text` | `components/SuperadminCommunicationNoticesErrorFallback.tsx`, `components/SuperadminCommunicationNoticesPageClient.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `text-on-danger` | `--text-on-danger` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `text-on-primary` | `--text-on-primary` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts` |
| `text-primary` | `--text-primary` | `components/SuperadminCommunicationNoticesPageClient.tsx`, `components/SuperadminCommunicationNoticesSemanticTable.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts`, `not-found.tsx` |
| `text-secondary` | `--text-secondary` | `components/SuperadminCommunicationNoticesEmptyState.tsx`, `components/SuperadminCommunicationNoticesPageClient.tsx`, `components/SuperadminCommunicationNoticesSemanticTable.tsx`, `hooks/useSuperadminCommunicationNoticesConfirm.ts`, `not-found.tsx`, `page.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminCommunicationNoticesErrorFallback.tsx` |

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
| `bg-card` | `components/SuperadminCommunicationNoticesPageClient.tsx:121`, `components/SuperadminCommunicationNoticesPageClient.tsx:143`, `components/SuperadminCommunicationNoticesPageClient.tsx:156`, `components/SuperadminCommunicationNoticesPageClient.tsx:160`, `components/SuperadminCommunicationNoticesPageClient.tsx:170`, `components/SuperadminCommunicationNoticesPageClient.tsx:174`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:39`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `components/SuperadminCommunicationNoticesPageClient.tsx:106`, `components/SuperadminCommunicationNoticesPageClient.tsx:161`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminCommunicationNoticesErrorFallback.tsx:22` |
| `bg-input` | `components/SuperadminCommunicationNoticesSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminCommunicationNoticesConfirm.ts:40`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:46`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:99` |
| `bg-primary` | `components/SuperadminCommunicationNoticesPageClient.tsx:104`, `components/SuperadminCommunicationNoticesPageClient.tsx:105`, `components/SuperadminCommunicationNoticesPageClient.tsx:144`, `components/SuperadminCommunicationNoticesPageClient.tsx:175`, `components/SuperadminCommunicationNoticesPageClient.tsx:189`, `components/SuperadminCommunicationNoticesPageClient.tsx:199`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:74` |
| `bg-primary-hover` | `components/SuperadminCommunicationNoticesPageClient.tsx:144`, `components/SuperadminCommunicationNoticesPageClient.tsx:175`, `components/SuperadminCommunicationNoticesPageClient.tsx:189`, `components/SuperadminCommunicationNoticesPageClient.tsx:199` |
| `bg-skeleton-base` | `components/SuperadminCommunicationNoticesListSkeleton.tsx:19`, `components/SuperadminCommunicationNoticesListSkeleton.tsx:21`, `components/SuperadminCommunicationNoticesListSkeleton.tsx:23`, `components/SuperadminCommunicationNoticesListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminCommunicationNoticesSemanticTable.tsx:48`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:68` |
| `border-border` | `components/SuperadminCommunicationNoticesErrorFallback.tsx:22`, `components/SuperadminCommunicationNoticesPageClient.tsx:143`, `components/SuperadminCommunicationNoticesPageClient.tsx:160`, `components/SuperadminCommunicationNoticesPageClient.tsx:174`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:37`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:42`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:48`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:57`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:40`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:46`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `ring-primary` | `hooks/useSuperadminCommunicationNoticesConfirm.ts:68`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:73`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminCommunicationNoticesConfirm.ts:40`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:46` |
| `text-danger` | `components/SuperadminCommunicationNoticesErrorFallback.tsx:22`, `components/SuperadminCommunicationNoticesPageClient.tsx:122`, `components/SuperadminCommunicationNoticesPageClient.tsx:127`, `components/SuperadminCommunicationNoticesPageClient.tsx:129`, `components/SuperadminCommunicationNoticesPageClient.tsx:132`, `components/SuperadminCommunicationNoticesPageClient.tsx:134`, `components/SuperadminCommunicationNoticesPageClient.tsx:137`, `components/SuperadminCommunicationNoticesPageClient.tsx:139`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:54` |
| `text-on-danger` | `components/SuperadminCommunicationNoticesPageClient.tsx:106`, `components/SuperadminCommunicationNoticesPageClient.tsx:161`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:73` |
| `text-on-primary` | `components/SuperadminCommunicationNoticesPageClient.tsx:104`, `components/SuperadminCommunicationNoticesPageClient.tsx:105`, `components/SuperadminCommunicationNoticesPageClient.tsx:144`, `components/SuperadminCommunicationNoticesPageClient.tsx:175`, `components/SuperadminCommunicationNoticesPageClient.tsx:189`, `components/SuperadminCommunicationNoticesPageClient.tsx:199`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:74` |
| `text-primary` | `components/SuperadminCommunicationNoticesPageClient.tsx:123`, `components/SuperadminCommunicationNoticesPageClient.tsx:143`, `components/SuperadminCommunicationNoticesPageClient.tsx:157`, `components/SuperadminCommunicationNoticesPageClient.tsx:160`, `components/SuperadminCommunicationNoticesPageClient.tsx:171`, `components/SuperadminCommunicationNoticesPageClient.tsx:174`, `components/SuperadminCommunicationNoticesPageClient.tsx:186`, `components/SuperadminCommunicationNoticesPageClient.tsx:198`, `components/SuperadminCommunicationNoticesPageClient.tsx:83`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:37`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:40`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:49`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:68`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminCommunicationNoticesEmptyState.tsx:16`, `components/SuperadminCommunicationNoticesPageClient.tsx:158`, `components/SuperadminCommunicationNoticesPageClient.tsx:172`, `components/SuperadminCommunicationNoticesPageClient.tsx:187`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:37`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:39`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:48`, `components/SuperadminCommunicationNoticesSemanticTable.tsx:57`, `hooks/useSuperadminCommunicationNoticesConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminCommunicationNoticesSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminCommunicationNoticesSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
