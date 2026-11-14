# member_invoices — Theme Contract

This contract is derived from the current module source, not from a new palette. Existing semantic tokens must be preserved.

## Observed Consumed Tokens / Classes


Source-path references are not duplicated here; use the machine-auditable `## Module Semantic Token Inventory` below as the canonical token-to-source evidence. The inventory is reconciled to current leaf source. Host `globals.css` / Tailwind `@theme inline` mappings remain `NOT_VERIFIED` because the host theme is outside the supplied ZIP scope.

## Constraints
- Do not introduce arbitrary hex/RGB colors, new palette entries, or unapproved CSS variables.
- Preserve semantic foreground/background pairing, focus-visible states, reduced-motion behavior, responsive layouts, and contrast.
- Reuse only design-system tokens already present in the supplied web design contract.
- Static token inventory is not a visual accessibility pass; browser verification remains deferred until host runtime is available.

---

## Legacy Workflow Migration Note — member_invoice_detail

The historical token table for `member_invoice_detail` has been retired as duplicate documentation. Its UI is now owned by this leaf's canonical `invoice` detail workflow and is covered by the source inventory above; there is no separate nested sub-module.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles when a semantic token exists.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:17` |
| `bg-danger-bg` | `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailErrorFallback.tsx:13` |
| `bg-skeleton-base` | `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:14`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:15`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:18`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:21`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:22`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:27`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailErrorFallback.tsx:13`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:18`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:21`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:22`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:24`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:17` |
| `text-danger` | `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailErrorFallback.tsx:13` |
| `text-primary` | `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminBillingInvoicesMemberInvoicesEmptyState.tsx:16`, `components/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailEmptyState.tsx:16`, `not-found.tsx:12`, `page.tsx:17` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
