# student_smart_id — Theme Contract

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
| `bg-card` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:24`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger-bg` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdErrorFallback.tsx:13` |
| `bg-info-bg` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:105`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:89` |
| `bg-primary-subtle` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:101`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:54`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:90` |
| `bg-skeleton-base` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:14`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:15`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:27`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:26` |
| `bg-warning-bg` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:119` |
| `border-border` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdErrorFallback.tsx:13`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:105`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:119`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:89`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:18`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:21`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:22`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:24`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton.tsx:26`, `not-found.tsx:10`, `page.tsx:15` |
| `border-focus` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:101`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:54`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:90` |
| `text-danger` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdErrorFallback.tsx:13` |
| `text-info` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:89` |
| `text-primary` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:37`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:38`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:58`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:59`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:90`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:32`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:40`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:60`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:64`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:99`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:115`, `components/SuperadminLibrariesOnboardingSetupStudentSmartIdPageClient.tsx:119` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
