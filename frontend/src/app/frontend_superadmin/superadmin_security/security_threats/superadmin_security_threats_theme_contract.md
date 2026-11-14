# security_threats — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v20 after RBG-13)

This inventory cites implementation source only (route entries, components, hooks, and other non-test runtime source). Test fixtures, documentation, types, and schemas are excluded from token-use evidence. It is static source evidence; host `globals.css` / Tailwind mapping, contrast, responsive behavior, and assistive-technology verification remain unverified without the host runtime.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `hooks/useSuperadminSecurityThreatsConfirm.ts:68`, `not-found.tsx:14`, `page.tsx:17` |
| `bg-danger` | `hooks/useSuperadminSecurityThreatsConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSecurityThreatsErrorFallback.tsx:22`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:23`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:24`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:26`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:35`, `components/SuperadminSecurityThreatsPageClient.tsx:69`, `components/SuperadminSecurityThreatsPageClient.tsx:85` |
| `bg-overlay` | `hooks/useSuperadminSecurityThreatsConfirm.ts:40`, `hooks/useSuperadminSecurityThreatsConfirm.ts:46`, `hooks/useSuperadminSecurityThreatsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSecurityThreatsConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSecurityThreatsListSkeleton.tsx:19`, `components/SuperadminSecurityThreatsListSkeleton.tsx:21`, `components/SuperadminSecurityThreatsListSkeleton.tsx:23`, `components/SuperadminSecurityThreatsListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminSecurityThreatsPageClient.tsx:86`, `hooks/useSuperadminSecurityThreatsConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminSecurityThreatsPageClient.tsx:59` |
| `border-border` | `components/SuperadminSecurityThreatsErrorFallback.tsx:22`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:23`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:35`, `components/SuperadminSecurityThreatsPageClient.tsx:59`, `components/SuperadminSecurityThreatsPageClient.tsx:69`, `components/SuperadminSecurityThreatsPageClient.tsx:76`, `components/SuperadminSecurityThreatsPageClient.tsx:85`, `components/SuperadminSecurityThreatsPageClient.tsx:95`, `hooks/useSuperadminSecurityThreatsConfirm.ts:40`, `hooks/useSuperadminSecurityThreatsConfirm.ts:46`, `hooks/useSuperadminSecurityThreatsConfirm.ts:68`, `not-found.tsx:14`, `page.tsx:17` |
| `ring-primary` | `hooks/useSuperadminSecurityThreatsConfirm.ts:68`, `hooks/useSuperadminSecurityThreatsConfirm.ts:73`, `hooks/useSuperadminSecurityThreatsConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSecurityThreatsPageClient.tsx:85` |
| `shadow-dialog` | `hooks/useSuperadminSecurityThreatsConfirm.ts:40`, `hooks/useSuperadminSecurityThreatsConfirm.ts:46` |
| `text-danger` | `components/SuperadminSecurityThreatsErrorFallback.tsx:22`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:15`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:16`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:26`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:30`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:31`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:35`, `components/SuperadminSecurityThreatsPageClient.tsx:67`, `components/SuperadminSecurityThreatsPageClient.tsx:69`, `hooks/useSuperadminSecurityThreatsConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSecurityThreatsConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSecurityThreatsConfirm.ts:74` |
| `text-primary` | `components/SuperadminSecurityThreatsPageClient.tsx:85`, `components/SuperadminSecurityThreatsPageClient.tsx:86`, `hooks/useSuperadminSecurityThreatsConfirm.ts:40`, `hooks/useSuperadminSecurityThreatsConfirm.ts:49`, `hooks/useSuperadminSecurityThreatsConfirm.ts:68`, `hooks/useSuperadminSecurityThreatsConfirm.ts:99`, `not-found.tsx:14` |
| `text-secondary` | `components/SuperadminSecurityThreatsEmptyState.tsx:16`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:31`, `components/SuperadminSecurityThreatsOperationsPanels.tsx:36`, `components/SuperadminSecurityThreatsPageClient.tsx:86`, `hooks/useSuperadminSecurityThreatsConfirm.ts:62`, `not-found.tsx:16`, `page.tsx:17` |
| `text-warning` | `components/SuperadminSecurityThreatsPageClient.tsx:59` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
