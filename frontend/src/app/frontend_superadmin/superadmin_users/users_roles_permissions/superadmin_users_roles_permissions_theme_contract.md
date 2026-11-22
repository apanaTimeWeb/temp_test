# users_roles_permissions — Theme Contract

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
| `bg-card` | `components/SuperadminUsersRolesPermissionsContent.tsx:27`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminUsersRolesPermissionsErrorFallback.tsx:22` |
| `bg-info-bg` | `components/SuperadminUsersRolesPermissionsPageClient.tsx:51` |
| `bg-overlay` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:40`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:46`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminUsersRolesPermissionsListSkeleton.tsx:19`, `components/SuperadminUsersRolesPermissionsListSkeleton.tsx:21`, `components/SuperadminUsersRolesPermissionsListSkeleton.tsx:23`, `components/SuperadminUsersRolesPermissionsListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminUsersRolesPermissionsContent.tsx:29`, `components/SuperadminUsersRolesPermissionsContent.tsx:39`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:51`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminUsersRolesPermissionsPageClient.tsx:40` |
| `border-border` | `components/SuperadminUsersRolesPermissionsContent.tsx:27`, `components/SuperadminUsersRolesPermissionsContent.tsx:31`, `components/SuperadminUsersRolesPermissionsContent.tsx:32`, `components/SuperadminUsersRolesPermissionsContent.tsx:33`, `components/SuperadminUsersRolesPermissionsContent.tsx:34`, `components/SuperadminUsersRolesPermissionsErrorFallback.tsx:22`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:40`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:44`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:51`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:40`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:46`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `ring-primary` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:68`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:73`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:74` |
| `shadow-card` | `components/SuperadminUsersRolesPermissionsPageClient.tsx:51` |
| `shadow-dialog` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:40`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:46` |
| `text-danger` | `components/SuperadminUsersRolesPermissionsErrorFallback.tsx:22`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:54` |
| `text-info` | `components/SuperadminUsersRolesPermissionsContent.tsx:32` |
| `text-on-danger` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:74` |
| `text-primary` | `components/SuperadminUsersRolesPermissionsContent.tsx:24`, `components/SuperadminUsersRolesPermissionsContent.tsx:40`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:51`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:40`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:49`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:68`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminUsersRolesPermissionsContent.tsx:25`, `components/SuperadminUsersRolesPermissionsContent.tsx:29`, `components/SuperadminUsersRolesPermissionsContent.tsx:41`, `components/SuperadminUsersRolesPermissionsContent.tsx:42`, `components/SuperadminUsersRolesPermissionsContent.tsx:43`, `components/SuperadminUsersRolesPermissionsEmptyState.tsx:16`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:51`, `hooks/useSuperadminUsersRolesPermissionsConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminUsersRolesPermissionsContent.tsx:33`, `components/SuperadminUsersRolesPermissionsContent.tsx:41`, `components/SuperadminUsersRolesPermissionsContent.tsx:42`, `components/SuperadminUsersRolesPermissionsContent.tsx:43` |
| `text-warning` | `components/SuperadminUsersRolesPermissionsContent.tsx:34`, `components/SuperadminUsersRolesPermissionsPageClient.tsx:40` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
