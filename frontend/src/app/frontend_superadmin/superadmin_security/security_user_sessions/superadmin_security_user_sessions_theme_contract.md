# security_user_sessions — Theme Contract

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
| `bg-card` | `components/SuperadminSecurityUserSessionsListSkeleton.tsx:29`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:39`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSecurityUserSessionsErrorFallback.tsx:24`, `components/SuperadminSecurityUserSessionsPageClient.tsx:39` |
| `bg-info-bg` | `components/SuperadminSecurityUserSessionsPageClient.tsx:65` |
| `bg-input` | `components/SuperadminSecurityUserSessionsSemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:40`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:46`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSecurityUserSessionsListSkeleton.tsx:22`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:23`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:26`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:27`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:32`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:37` |
| `bg-success-bg` | `components/SuperadminSecurityUserSessionsPageClient.tsx:39` |
| `bg-surface-hover` | `components/SuperadminSecurityUserSessionsListSkeleton.tsx:31`, `components/SuperadminSecurityUserSessionsPageClient.tsx:65`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:48`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminSecurityUserSessionsPageClient.tsx:60` |
| `border-border` | `components/SuperadminSecurityUserSessionsErrorFallback.tsx:24`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:26`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:27`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:29`, `components/SuperadminSecurityUserSessionsListSkeleton.tsx:31`, `components/SuperadminSecurityUserSessionsPageClient.tsx:47`, `components/SuperadminSecurityUserSessionsPageClient.tsx:60`, `components/SuperadminSecurityUserSessionsPageClient.tsx:61`, `components/SuperadminSecurityUserSessionsPageClient.tsx:65`, `components/SuperadminSecurityUserSessionsPageClient.tsx:69`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:37`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:42`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:48`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:57`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:40`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:46`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `ring-primary` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:68`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:73`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:74` |
| `shadow-card` | `components/SuperadminSecurityUserSessionsPageClient.tsx:65` |
| `shadow-dialog` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:40`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:46` |
| `text-danger` | `components/SuperadminSecurityUserSessionsErrorFallback.tsx:24`, `components/SuperadminSecurityUserSessionsPageClient.tsx:39`, `components/SuperadminSecurityUserSessionsPageClient.tsx:47`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSecurityUserSessionsConfirm.ts:74` |
| `text-primary` | `components/SuperadminSecurityUserSessionsPageClient.tsx:65`, `components/SuperadminSecurityUserSessionsPageClient.tsx:69`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:37`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:40`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:49`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:68`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSecurityUserSessionsEmptyState.tsx:16`, `components/SuperadminSecurityUserSessionsPageClient.tsx:50`, `components/SuperadminSecurityUserSessionsPageClient.tsx:65`, `components/SuperadminSecurityUserSessionsPageClient.tsx:69`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:37`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:39`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:48`, `components/SuperadminSecurityUserSessionsSemanticTable.tsx:57`, `hooks/useSuperadminSecurityUserSessionsConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminSecurityUserSessionsPageClient.tsx:39` |
| `text-warning` | `components/SuperadminSecurityUserSessionsPageClient.tsx:60`, `components/SuperadminSecurityUserSessionsPageClient.tsx:69` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminSecurityUserSessionsSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminSecurityUserSessionsSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
