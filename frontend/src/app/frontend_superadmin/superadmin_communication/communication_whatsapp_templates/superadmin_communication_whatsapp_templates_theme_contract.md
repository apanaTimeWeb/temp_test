# communication_whatsapp_templates — Theme Contract

This inventory is derived from literal classes observed in the current module source. Class names are not claimed to be semantic design tokens without CSS/theme mapping evidence.

## Observed Consumed Tokens / Classes


Source-path references are not duplicated here; use the machine-auditable `## Module Semantic Token Inventory` below as the canonical token-to-source evidence. The inventory is reconciled to current leaf source. Host `globals.css` / Tailwind `@theme inline` mappings remain `NOT_VERIFIED` because the host theme is outside the supplied ZIP scope.

## Constraints
- Do not introduce arbitrary hex/RGB colors, new palette entries, or unapproved CSS variables.
- Preserve semantic foreground/background pairing, focus-visible states, reduced-motion behavior, responsive layouts, and contrast.
- Reuse only design-system tokens already present in the supplied web design contract when a mapping is verified.
- This inventory is lexical source evidence only; it does not prove semantic token mapping, rendered contrast, focus behavior, reduced-motion behavior, or responsive/accessibility conformance.
- Browser verification remains deferred until host runtime is available.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger-bg` | `components/SuperadminCommunicationWhatsappTemplatesErrorFallback.tsx:22` |
| `bg-skeleton-base` | `components/SuperadminCommunicationWhatsappTemplatesListSkeleton.tsx:19`, `components/SuperadminCommunicationWhatsappTemplatesListSkeleton.tsx:21`, `components/SuperadminCommunicationWhatsappTemplatesListSkeleton.tsx:23`, `components/SuperadminCommunicationWhatsappTemplatesListSkeleton.tsx:25` |
| `border-border` | `components/SuperadminCommunicationWhatsappTemplatesErrorFallback.tsx:22`, `not-found.tsx:15`, `page.tsx:22` |
| `text-danger` | `components/SuperadminCommunicationWhatsappTemplatesErrorFallback.tsx:22` |
| `text-primary` | `not-found.tsx:15` |
| `text-secondary` | `not-found.tsx:17`, `page.tsx:22` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
