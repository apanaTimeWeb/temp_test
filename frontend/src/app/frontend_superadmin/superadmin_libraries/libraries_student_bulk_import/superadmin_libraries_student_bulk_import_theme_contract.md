# student_bulk_import — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback.tsx:13`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:124` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:26` |
| `border-border` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback.tsx:13`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:124`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:146`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `text-danger` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportErrorFallback.tsx:13`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:124`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:136` |
| `text-primary` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:116`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:134`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:140`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyState.tsx:16`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:117`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:123`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:129`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:134`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:135`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:136`, `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:141`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient.tsx:135` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
