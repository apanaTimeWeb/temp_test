# security_api_keys — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `hooks/useSuperadminSecurityApiKeysConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-info-bg` | `components/SuperadminSecurityApiKeysOperationsPanels.tsx:77` |
| `bg-overlay` | `hooks/useSuperadminSecurityApiKeysConfirm.ts:40`, `hooks/useSuperadminSecurityApiKeysConfirm.ts:46`, `hooks/useSuperadminSecurityApiKeysConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSecurityApiKeysConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSecurityApiKeysListSkeleton.tsx:19`, `components/SuperadminSecurityApiKeysListSkeleton.tsx:21`, `components/SuperadminSecurityApiKeysListSkeleton.tsx:23`, `components/SuperadminSecurityApiKeysListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminSecurityApiKeysOperationsPanels.tsx:122`, `components/SuperadminSecurityApiKeysOperationsPanels.tsx:46`, `components/SuperadminSecurityApiKeysOperationsPanels.tsx:83` |
| `bg-warning-bg` | `components/SuperadminSecurityApiKeysPageClient.tsx:112` |
| `ring-primary` | `hooks/useSuperadminSecurityApiKeysConfirm.ts:68`, `hooks/useSuperadminSecurityApiKeysConfirm.ts:73`, `hooks/useSuperadminSecurityApiKeysConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminSecurityApiKeysConfirm.ts:40`, `hooks/useSuperadminSecurityApiKeysConfirm.ts:46` |
| `text-disabled` | `components/SuperadminSecurityApiKeysOperationsPanels.tsx:117` |
| `text-info` | `components/SuperadminSecurityApiKeysOperationsPanels.tsx:115`, `components/SuperadminSecurityApiKeysOperationsPanels.tsx:77`, `components/SuperadminSecurityApiKeysOperationsPanels.tsx:86` |
| `text-on-primary` | `hooks/useSuperadminSecurityApiKeysConfirm.ts:74` |
| `text-success` | `components/SuperadminSecurityApiKeysOperationsPanels.tsx:122`, `components/SuperadminSecurityApiKeysOperationsPanels.tsx:46`, `components/SuperadminSecurityApiKeysOperationsPanels.tsx:83` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Active route boundary (RBG-14–23)

The route's immutable active tab is `API Keys`. Sibling workflows are navigation-only and must remain in their owning submodules; only the `API Keys` branch is rendered locally. No backend mutation behavior is implied by this route.
