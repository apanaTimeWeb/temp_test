# settings_branding — Theme Contract

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
| `bg-card` | `components/SuperadminSettingsBrandingPageClient.tsx:218`, `components/SuperadminSettingsBrandingPageClient.tsx:219`, `components/SuperadminSettingsBrandingPageClient.tsx:237`, `hooks/useSuperadminSettingsBrandingConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `bg-danger` | `hooks/useSuperadminSettingsBrandingConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsBrandingErrorFallback.tsx:22` |
| `bg-overlay` | `hooks/useSuperadminSettingsBrandingConfirm.ts:40`, `hooks/useSuperadminSettingsBrandingConfirm.ts:46`, `hooks/useSuperadminSettingsBrandingConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsBrandingConfirm.ts:74` |
| `bg-skeleton-base` | `components/SuperadminSettingsBrandingListSkeleton.tsx:19`, `components/SuperadminSettingsBrandingListSkeleton.tsx:21`, `components/SuperadminSettingsBrandingListSkeleton.tsx:23`, `components/SuperadminSettingsBrandingListSkeleton.tsx:25` |
| `bg-surface-hover` | `components/SuperadminSettingsBrandingPageClient.tsx:230`, `hooks/useSuperadminSettingsBrandingConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminSettingsBrandingPageClient.tsx:166` |
| `border-border` | `components/SuperadminSettingsBrandingErrorFallback.tsx:22`, `components/SuperadminSettingsBrandingPageClient.tsx:116`, `components/SuperadminSettingsBrandingPageClient.tsx:146`, `components/SuperadminSettingsBrandingPageClient.tsx:159`, `components/SuperadminSettingsBrandingPageClient.tsx:166`, `components/SuperadminSettingsBrandingPageClient.tsx:209`, `components/SuperadminSettingsBrandingPageClient.tsx:228`, `hooks/useSuperadminSettingsBrandingConfirm.ts:40`, `hooks/useSuperadminSettingsBrandingConfirm.ts:46`, `hooks/useSuperadminSettingsBrandingConfirm.ts:68`, `not-found.tsx:15`, `page.tsx:22` |
| `ring-primary` | `hooks/useSuperadminSettingsBrandingConfirm.ts:68`, `hooks/useSuperadminSettingsBrandingConfirm.ts:73`, `hooks/useSuperadminSettingsBrandingConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminSettingsBrandingConfirm.ts:40`, `hooks/useSuperadminSettingsBrandingConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsBrandingErrorFallback.tsx:22`, `components/SuperadminSettingsBrandingPageClient.tsx:129`, `components/SuperadminSettingsBrandingPageClient.tsx:137`, `components/SuperadminSettingsBrandingPageClient.tsx:148`, `components/SuperadminSettingsBrandingPageClient.tsx:161`, `hooks/useSuperadminSettingsBrandingConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSettingsBrandingConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsBrandingConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsBrandingPageClient.tsx:193`, `components/SuperadminSettingsBrandingPageClient.tsx:214`, `components/SuperadminSettingsBrandingPageClient.tsx:239`, `components/SuperadminSettingsBrandingPageClient.tsx:94`, `components/SuperadminSettingsBrandingPageClient.tsx:95`, `hooks/useSuperadminSettingsBrandingConfirm.ts:40`, `hooks/useSuperadminSettingsBrandingConfirm.ts:49`, `hooks/useSuperadminSettingsBrandingConfirm.ts:68`, `hooks/useSuperadminSettingsBrandingConfirm.ts:99`, `not-found.tsx:15` |
| `text-secondary` | `components/SuperadminSettingsBrandingPageClient.tsx:121`, `components/SuperadminSettingsBrandingPageClient.tsx:134`, `components/SuperadminSettingsBrandingPageClient.tsx:186`, `components/SuperadminSettingsBrandingPageClient.tsx:194`, `components/SuperadminSettingsBrandingPageClient.tsx:198`, `components/SuperadminSettingsBrandingPageClient.tsx:208`, `components/SuperadminSettingsBrandingPageClient.tsx:215`, `components/SuperadminSettingsBrandingPageClient.tsx:227`, `components/SuperadminSettingsBrandingPageClient.tsx:240`, `components/SuperadminSettingsBrandingPageClient.tsx:241`, `components/SuperadminSettingsBrandingPageClient.tsx:91`, `components/SuperadminSettingsBrandingPageClient.tsx:97`, `hooks/useSuperadminSettingsBrandingConfirm.ts:62`, `not-found.tsx:17`, `page.tsx:22` |
| `text-warning` | `components/SuperadminSettingsBrandingPageClient.tsx:166` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).

## Scenario catalog ownership (RBG-31)

The six-key `mocks/scenarios/superadmin_settings_branding.scenarios.ts` registry is canonical for harness selection. The eight-state traceability inventory is documentation-only in `superadmin_settings_branding_features.md`; network/auth/mutation cases remain non-runnable until verified host contracts and handlers exist.
