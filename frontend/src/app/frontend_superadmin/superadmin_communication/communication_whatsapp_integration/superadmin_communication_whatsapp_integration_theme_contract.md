# communication_whatsapp_integration — Theme Contract

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
| `bg-card` | `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:160`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:206`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:47`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:51`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:22`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminCommunicationWhatsappIntegrationErrorFallback.tsx:22` |
| `bg-floating` | `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:19` |
| `bg-primary-subtle` | `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:93` |
| `bg-skeleton-base` | `components/SuperadminCommunicationWhatsappIntegrationListSkeleton.tsx:19`, `components/SuperadminCommunicationWhatsappIntegrationListSkeleton.tsx:21`, `components/SuperadminCommunicationWhatsappIntegrationListSkeleton.tsx:23`, `components/SuperadminCommunicationWhatsappIntegrationListSkeleton.tsx:25` |
| `bg-warning-bg` | `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:63`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:19`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:22`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:44` |
| `border-border` | `components/SuperadminCommunicationWhatsappIntegrationErrorFallback.tsx:22`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:160`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:206`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:63`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:94`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:33`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:19`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:44`, `not-found.tsx:15`, `page.tsx:22` |
| `border-focus` | `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:93`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:94` |
| `text-danger` | `components/SuperadminCommunicationWhatsappIntegrationErrorFallback.tsx:22` |
| `text-primary` | `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:208`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:56`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:57`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:78`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:93`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:94`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:99`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:26`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:48`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:49`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:28`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminCommunicationWhatsappIntegrationEmptyState.tsx:16`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:143`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:160`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:173`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:209`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:53`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:59`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:94`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:33`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:51`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappMessageLogs.tsx:60`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:35`, `not-found.tsx:17`, `page.tsx:22` |
| `text-warning` | `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:153`, `components/SuperadminCommunicationWhatsappIntegrationPageClient.tsx:63`, `components/SuperadminCommunicationWhatsappIntegrationWhatsappSummary.tsx:44` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
