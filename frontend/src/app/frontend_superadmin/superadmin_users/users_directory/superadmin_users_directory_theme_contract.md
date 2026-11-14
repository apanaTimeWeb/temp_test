# users_directory — Theme Contract

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
| `bg-card` | `components/SuperadminUsersDirectoryContent.tsx:72`, `components/SuperadminUsersDirectoryListSkeleton.tsx:29`, `components/SuperadminUsersDirectorySemanticTable.tsx:39`, `hooks/useSuperadminUsersDirectoryConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `hooks/useSuperadminUsersDirectoryConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminUsersDirectoryErrorFallback.tsx:24`, `components/SuperadminUsersDirectoryPageClient.tsx:199` |
| `bg-floating` | `components/SuperadminUsersDirectoryModal.tsx:192` |
| `bg-info-bg` | `components/SuperadminUsersDirectoryPageClient.tsx:125`, `components/SuperadminUsersDirectoryPageClient.tsx:250` |
| `bg-input` | `components/SuperadminUsersDirectorySemanticTable.tsx:37` |
| `bg-overlay` | `hooks/useSuperadminUsersDirectoryConfirm.ts:40`, `hooks/useSuperadminUsersDirectoryConfirm.ts:46`, `hooks/useSuperadminUsersDirectoryConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminUsersDirectoryConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminUsersDirectoryListSkeleton.tsx:22`, `components/SuperadminUsersDirectoryListSkeleton.tsx:23`, `components/SuperadminUsersDirectoryListSkeleton.tsx:26`, `components/SuperadminUsersDirectoryListSkeleton.tsx:27`, `components/SuperadminUsersDirectoryListSkeleton.tsx:32`, `components/SuperadminUsersDirectoryListSkeleton.tsx:37` |
| `bg-success-bg` | `components/SuperadminUsersDirectoryPageClient.tsx:126`, `components/SuperadminUsersDirectoryPageClient.tsx:199` |
| `bg-surface-hover` | `components/SuperadminUsersDirectoryContent.tsx:74`, `components/SuperadminUsersDirectoryContent.tsx:84`, `components/SuperadminUsersDirectoryListSkeleton.tsx:31`, `components/SuperadminUsersDirectoryPageClient.tsx:251`, `components/SuperadminUsersDirectorySemanticTable.tsx:48`, `hooks/useSuperadminUsersDirectoryConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminUsersDirectoryPageClient.tsx:127`, `components/SuperadminUsersDirectoryPageClient.tsx:236` |
| `border-border` | `components/SuperadminUsersDirectoryContent.tsx:42`, `components/SuperadminUsersDirectoryContent.tsx:72`, `components/SuperadminUsersDirectoryContent.tsx:76`, `components/SuperadminUsersDirectoryContent.tsx:77`, `components/SuperadminUsersDirectoryContent.tsx:78`, `components/SuperadminUsersDirectoryContent.tsx:79`, `components/SuperadminUsersDirectoryErrorFallback.tsx:24`, `components/SuperadminUsersDirectoryListSkeleton.tsx:26`, `components/SuperadminUsersDirectoryListSkeleton.tsx:27`, `components/SuperadminUsersDirectoryListSkeleton.tsx:29`, `components/SuperadminUsersDirectoryListSkeleton.tsx:31`, `components/SuperadminUsersDirectoryModal.tsx:192`, `components/SuperadminUsersDirectoryModal.tsx:206`, `components/SuperadminUsersDirectoryPageClient.tsx:125`, `components/SuperadminUsersDirectoryPageClient.tsx:126`, `components/SuperadminUsersDirectoryPageClient.tsx:127`, `components/SuperadminUsersDirectoryPageClient.tsx:209`, `components/SuperadminUsersDirectoryPageClient.tsx:236`, `components/SuperadminUsersDirectoryPageClient.tsx:239`, `components/SuperadminUsersDirectoryPageClient.tsx:250`, `components/SuperadminUsersDirectorySemanticTable.tsx:37`, `components/SuperadminUsersDirectorySemanticTable.tsx:42`, `components/SuperadminUsersDirectorySemanticTable.tsx:48`, `components/SuperadminUsersDirectorySemanticTable.tsx:57`, `hooks/useSuperadminUsersDirectoryConfirm.ts:40`, `hooks/useSuperadminUsersDirectoryConfirm.ts:46`, `hooks/useSuperadminUsersDirectoryConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:17` |
| `ring-primary` | `hooks/useSuperadminUsersDirectoryConfirm.ts:68`, `hooks/useSuperadminUsersDirectoryConfirm.ts:73`, `hooks/useSuperadminUsersDirectoryConfirm.ts:74` |
| `shadow-card` | `components/SuperadminUsersDirectoryPageClient.tsx:250` |
| `shadow-dialog` | `hooks/useSuperadminUsersDirectoryConfirm.ts:40`, `hooks/useSuperadminUsersDirectoryConfirm.ts:46` |
| `text-danger` | `components/SuperadminUsersDirectoryErrorFallback.tsx:24`, `components/SuperadminUsersDirectoryModal.tsx:138`, `components/SuperadminUsersDirectoryModal.tsx:150`, `components/SuperadminUsersDirectoryModal.tsx:164`, `components/SuperadminUsersDirectoryModal.tsx:178`, `components/SuperadminUsersDirectoryModal.tsx:189`, `components/SuperadminUsersDirectoryPageClient.tsx:139`, `components/SuperadminUsersDirectoryPageClient.tsx:147`, `components/SuperadminUsersDirectoryPageClient.tsx:199`, `components/SuperadminUsersDirectoryPageClient.tsx:209`, `hooks/useSuperadminUsersDirectoryConfirm.ts:54` |
| `text-info` | `components/SuperadminUsersDirectoryContent.tsx:77`, `components/SuperadminUsersDirectoryPageClient.tsx:125`, `components/SuperadminUsersDirectoryPageClient.tsx:164`, `components/SuperadminUsersDirectoryPageClient.tsx:168` |
| `text-on-danger` | `hooks/useSuperadminUsersDirectoryConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminUsersDirectoryConfirm.ts:74` |
| `text-primary` | `components/SuperadminUsersDirectoryContent.tsx:44`, `components/SuperadminUsersDirectoryContent.tsx:68`, `components/SuperadminUsersDirectoryContent.tsx:85`, `components/SuperadminUsersDirectoryModal.tsx:112`, `components/SuperadminUsersDirectoryModal.tsx:113`, `components/SuperadminUsersDirectoryModal.tsx:116`, `components/SuperadminUsersDirectoryModal.tsx:194`, `components/SuperadminUsersDirectoryPageClient.tsx:250`, `components/SuperadminUsersDirectoryPageClient.tsx:251`, `components/SuperadminUsersDirectorySemanticTable.tsx:37`, `hooks/useSuperadminUsersDirectoryConfirm.ts:40`, `hooks/useSuperadminUsersDirectoryConfirm.ts:49`, `hooks/useSuperadminUsersDirectoryConfirm.ts:68`, `hooks/useSuperadminUsersDirectoryConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminUsersDirectoryContent.tsx:45`, `components/SuperadminUsersDirectoryContent.tsx:69`, `components/SuperadminUsersDirectoryContent.tsx:74`, `components/SuperadminUsersDirectoryContent.tsx:88`, `components/SuperadminUsersDirectoryContent.tsx:92`, `components/SuperadminUsersDirectoryContent.tsx:96`, `components/SuperadminUsersDirectoryEmptyState.tsx:16`, `components/SuperadminUsersDirectoryModal.tsx:116`, `components/SuperadminUsersDirectoryModal.tsx:120`, `components/SuperadminUsersDirectoryModal.tsx:128`, `components/SuperadminUsersDirectoryModal.tsx:141`, `components/SuperadminUsersDirectoryModal.tsx:154`, `components/SuperadminUsersDirectoryModal.tsx:168`, `components/SuperadminUsersDirectoryModal.tsx:181`, `components/SuperadminUsersDirectoryModal.tsx:197`, `components/SuperadminUsersDirectoryPageClient.tsx:114`, `components/SuperadminUsersDirectoryPageClient.tsx:180`, `components/SuperadminUsersDirectoryPageClient.tsx:190`, `components/SuperadminUsersDirectoryPageClient.tsx:212`, `components/SuperadminUsersDirectoryPageClient.tsx:227`, `components/SuperadminUsersDirectoryPageClient.tsx:251`, `components/SuperadminUsersDirectorySemanticTable.tsx:37`, `components/SuperadminUsersDirectorySemanticTable.tsx:39`, `components/SuperadminUsersDirectorySemanticTable.tsx:48`, `components/SuperadminUsersDirectorySemanticTable.tsx:57`, `hooks/useSuperadminUsersDirectoryConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminUsersDirectoryContent.tsx:78`, `components/SuperadminUsersDirectoryContent.tsx:88`, `components/SuperadminUsersDirectoryContent.tsx:92`, `components/SuperadminUsersDirectoryContent.tsx:96`, `components/SuperadminUsersDirectoryModal.tsx:195`, `components/SuperadminUsersDirectoryPageClient.tsx:126`, `components/SuperadminUsersDirectoryPageClient.tsx:139`, `components/SuperadminUsersDirectoryPageClient.tsx:147`, `components/SuperadminUsersDirectoryPageClient.tsx:199` |
| `text-warning` | `components/SuperadminUsersDirectoryContent.tsx:79`, `components/SuperadminUsersDirectoryPageClient.tsx:127`, `components/SuperadminUsersDirectoryPageClient.tsx:165`, `components/SuperadminUsersDirectoryPageClient.tsx:236` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminUsersDirectorySemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminUsersDirectorySemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
