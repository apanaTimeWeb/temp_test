# communication_whatsapp_logs — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Observed Consumed Tokens / Classes


Source-path references are not duplicated here; use the machine-auditable `## Module Semantic Token Inventory` below as the canonical token-to-source evidence. The inventory is reconciled to current leaf source. Host `globals.css` / Tailwind `@theme inline` mappings remain `NOT_VERIFIED` because the host theme is outside the supplied ZIP scope.

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
| `bg-card` | `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:29`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:172`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:195`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:39`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminCommunicationWhatsappLogsErrorFallback.tsx:24`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:192`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:246` |
| `bg-input` | `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:37` |
| `bg-page` | `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:179`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:189`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:195` |
| `bg-primary` | `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:159` |
| `bg-skeleton-base` | `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:22`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:23`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:26`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:27`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:32`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:37` |
| `bg-surface-hover` | `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:31`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:48` |
| `border-border` | `components/SuperadminCommunicationWhatsappLogsErrorFallback.tsx:24`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:26`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:27`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:29`, `components/SuperadminCommunicationWhatsappLogsListSkeleton.tsx:31`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:189`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:192`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:195`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:210`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:246`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:37`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:42`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:48`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:57`, `not-found.tsx:15`, `page.tsx:22` |
| `text-danger` | `components/SuperadminCommunicationWhatsappLogsErrorFallback.tsx:24`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:173`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:192`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:246` |
| `text-on-primary` | `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:159` |
| `text-primary` | `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:174`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:183`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:189`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:195`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:253`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:37`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminCommunicationWhatsappLogsEmptyState.tsx:16`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:182`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:213`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:224`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:232`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:236`, `components/SuperadminCommunicationWhatsappLogsPageClient.tsx:240`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:37`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:39`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:48`, `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:57`, `not-found.tsx:17`, `page.tsx:22` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-b-0` | `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:48` |
| `border-collapse` | `components/SuperadminCommunicationWhatsappLogsSemanticTable.tsx:38` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
