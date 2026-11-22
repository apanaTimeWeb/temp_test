# backup_schedules — Theme Contract

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
| `bg-card` | `components/SuperadminBackupSchedulesCreatePanel.tsx:20`, `components/SuperadminBackupSchedulesCreatePanel.tsx:26`, `not-found.tsx:15`, `page.tsx:17` |
| `bg-danger` | `components/SuperadminBackupSchedulesRestorePanel.tsx:19` |
| `bg-danger-bg` | `components/SuperadminBackupSchedulesErrorFallback.tsx:22` |
| `bg-floating` | `components/SuperadminBackupSchedulesHistoryPanel.tsx:19`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:33` |
| `bg-skeleton-base` | `components/SuperadminBackupSchedulesListSkeleton.tsx:19`, `components/SuperadminBackupSchedulesListSkeleton.tsx:21`, `components/SuperadminBackupSchedulesListSkeleton.tsx:23`, `components/SuperadminBackupSchedulesListSkeleton.tsx:25` |
| `bg-success-bg` | `components/SuperadminBackupSchedulesPageClient.tsx:53` |
| `bg-surface-hover` | `components/SuperadminBackupSchedulesHistoryPanel.tsx:21`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:30`, `components/SuperadminBackupSchedulesPageClient.tsx:53`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:23`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:27`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:31` |
| `bg-warning-bg` | `components/SuperadminBackupSchedulesPageClient.tsx:41`, `components/SuperadminBackupSchedulesRestorePanel.tsx:14`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:41` |
| `border-border` | `components/SuperadminBackupSchedulesCreatePanel.tsx:20`, `components/SuperadminBackupSchedulesCreatePanel.tsx:26`, `components/SuperadminBackupSchedulesErrorFallback.tsx:22`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:19`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:22`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:23`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:24`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:25`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:26`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:27`, `components/SuperadminBackupSchedulesPageClient.tsx:41`, `components/SuperadminBackupSchedulesPageClient.tsx:43`, `components/SuperadminBackupSchedulesPageClient.tsx:53`, `components/SuperadminBackupSchedulesPageClient.tsx:60`, `components/SuperadminBackupSchedulesRestorePanel.tsx:14`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:23`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:27`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:31`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:41`, `not-found.tsx:15`, `page.tsx:17` |
| `shadow-card` | `components/SuperadminBackupSchedulesPageClient.tsx:53` |
| `text-danger` | `components/SuperadminBackupSchedulesErrorFallback.tsx:22` |
| `text-info` | `components/SuperadminBackupSchedulesCreatePanel.tsx:27`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:28` |
| `text-on-danger` | `components/SuperadminBackupSchedulesRestorePanel.tsx:19` |
| `text-primary` | `components/SuperadminBackupSchedulesCreatePanel.tsx:16`, `components/SuperadminBackupSchedulesCreatePanel.tsx:22`, `components/SuperadminBackupSchedulesCreatePanel.tsx:28`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:17`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:32`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:33`, `components/SuperadminBackupSchedulesPageClient.tsx:53`, `components/SuperadminBackupSchedulesRestorePanel.tsx:16`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:20`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:24`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:28`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:32`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminBackupSchedulesCreatePanel.tsx:17`, `components/SuperadminBackupSchedulesCreatePanel.tsx:23`, `components/SuperadminBackupSchedulesCreatePanel.tsx:24`, `components/SuperadminBackupSchedulesCreatePanel.tsx:29`, `components/SuperadminBackupSchedulesCreatePanel.tsx:30`, `components/SuperadminBackupSchedulesEmptyState.tsx:16`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:21`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:29`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:34`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:35`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:36`, `components/SuperadminBackupSchedulesPageClient.tsx:53`, `components/SuperadminBackupSchedulesRestorePanel.tsx:17`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:21`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:24`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:28`, `not-found.tsx:17`, `page.tsx:17` |
| `text-success` | `components/SuperadminBackupSchedulesCreatePanel.tsx:21`, `components/SuperadminBackupSchedulesHistoryPanel.tsx:31`, `components/SuperadminBackupSchedulesPageClient.tsx:39`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:24` |
| `text-warning` | `components/SuperadminBackupSchedulesHistoryPanel.tsx:18`, `components/SuperadminBackupSchedulesPageClient.tsx:41`, `components/SuperadminBackupSchedulesRestorePanel.tsx:15`, `components/SuperadminBackupSchedulesRestorePanel.tsx:18`, `components/SuperadminBackupSchedulesSchedulePanel.tsx:41` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
