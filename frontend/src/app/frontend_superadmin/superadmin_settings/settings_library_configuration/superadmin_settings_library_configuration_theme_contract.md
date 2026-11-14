# settings_library_configuration — Theme Contract

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
| `bg-card` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:123`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:162`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:169`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:223`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:24`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:68`, `not-found.tsx:10`, `page.tsx:15` |
| `bg-danger` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:73` |
| `bg-danger-bg` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback.tsx:13`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:63` |
| `bg-floating` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:23` |
| `bg-overlay` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:46`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:99` |
| `bg-primary` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:74` |
| `bg-primary-subtle` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:23` |
| `bg-skeleton-base` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:14`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:15`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:18`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:21`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:22`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:27`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:32` |
| `bg-surface-hover` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:26`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:68` |
| `bg-warning-bg` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:62` |
| `border-border` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback.tsx:13`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:102`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:123`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:162`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:169`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:201`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:223`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:62`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:63`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:80`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:95`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:18`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:21`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:22`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:24`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton.tsx:26`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:46`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:68`, `not-found.tsx:10`, `page.tsx:15` |
| `border-focus` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:23` |
| `ring-primary` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:68`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:73`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:74` |
| `shadow-dialog` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:46` |
| `text-danger` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback.tsx:13`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:63`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:54` |
| `text-on-danger` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:73` |
| `text-on-primary` | `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:74` |
| `text-primary` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:20`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:23`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:125`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:164`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:171`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:225`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:82`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:40`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:49`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:68`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:99`, `not-found.tsx:10` |
| `text-secondary` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:19`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:21`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNavigation.tsx:23`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanel.tsx:30`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:126`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:135`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:141`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:165`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:172`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:180`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:202`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:203`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:82`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:83`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:84`, `hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts:62`, `not-found.tsx:12`, `page.tsx:15` |
| `text-warning` | `components/SuperadminSettingsGeneralSettingsLibraryConfigurationNotificationsSettingsPanel.tsx:40`, `components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient.tsx:62` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

- No additional semantic-like utility outside the canonical mapping was observed by this scanner.

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
