# security_active_sessions — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Canonical Global Semantic Token Inventory

This inventory is generated from source usage across the complete autonomous leaf (production `.ts`, `.tsx`, `.css`, `.scss`, and `.html` files; tests, mocks, and fixtures are excluded). Only token classes mapped in `WEB_FRONTEND_UI_UX_DESIGN.md` are marked canonical. The host `globals.css` / Tailwind `@theme inline` mapping is not present in the isolated ZIP and remains `NOT_VERIFIED`.

| Tailwind token class | Canonical CSS variable | Source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts`, `page.tsx` |
| `bg-info-bg` | `--info-bg` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts` |
| `bg-primary` | `--primary` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminSecurityActiveSessionsListSkeleton.tsx` |
| `bg-success-bg` | `--success-bg` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminSecurityActiveSessionsPageClient.tsx` |
| `ring-primary` | `--focus-ring` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts` |
| `text-disabled` | `--text-disabled` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx` |
| `text-info` | `--info-text` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts` |
| `text-success` | `--success-text` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx` |

### Semantic-like classes without an explicit canonical class-to-variable row

These classes are present in production source but are not named as a class-to-variable mapping in the supplied design table. They are documented rather than silently treated as verified host tokens.

| Source class | Status | Source evidence |
|---|---|---|
| `bg-surface` | `NOT_VERIFIED` — no exact mapping in supplied design table | `not-found.tsx` |
| `border-danger` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminSecurityActiveSessionsErrorFallback.tsx` |
| `border-warning` | `NOT_VERIFIED` — color-token-derived utility; host utility map is outside supplied scope | `components/SuperadminSecurityActiveSessionsPageClient.tsx` |

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
| `bg-card` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-info-bg` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:77` |
| `bg-overlay` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:40`, `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:46`, `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSecurityActiveSessionsListSkeleton.tsx:19`, `components/SuperadminSecurityActiveSessionsListSkeleton.tsx:21`, `components/SuperadminSecurityActiveSessionsListSkeleton.tsx:23`, `components/SuperadminSecurityActiveSessionsListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:122`, `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:46`, `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:83` |
| `bg-warning-bg` | `components/SuperadminSecurityActiveSessionsPageClient.tsx:112` |
| `ring-primary` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:68`, `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:73`, `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:40`, `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:46` |
| `text-disabled` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:117` |
| `text-info` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:115`, `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:77`, `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:86` |
| `text-on-primary` | `hooks/useSuperadminSecurityActiveSessionsConfirm.ts:74` |
| `text-success` | `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:122`, `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:46`, `components/SuperadminSecurityActiveSessionsOperationsPanels.tsx:83` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-14–23)

The route's immutable active tab is `Active Sessions`. Sibling workflows are navigation-only and must remain in their owning submodules; only the `Active Sessions` branch is rendered locally. No backend mutation behavior is implied by this route.
