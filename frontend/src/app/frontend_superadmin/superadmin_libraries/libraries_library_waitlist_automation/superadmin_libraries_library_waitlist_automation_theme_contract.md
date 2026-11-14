# library_waitlist_automation — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:126`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:56`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationErrorFallback.tsx:13` |
| `bg-info-bg` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:48` |
| `bg-primary-subtle` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:129`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:133` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:32` |
| `bg-success` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:56` |
| `bg-surface-hover` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationErrorFallback.tsx:13`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:126`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:48`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationErrorFallback.tsx:13` |
| `text-info` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:48` |
| `text-on-success` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:56` |
| `text-primary` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:129`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:133`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:138`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:44`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:45`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:60`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:91`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:106`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:139`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:39`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:47`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:61`, `components/SuperadminLibrariesOverviewLibraryWaitlistAutomationPageClient.tsx:91`, `not-found.tsx:12`, `page.tsx:15` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
