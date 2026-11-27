# admin_finance_security_deposits — Forbidden Patterns

## Allowed dependency boundary
- This submodule may import its own local files, domain/app route configuration, approved shared UI primitives, and documented host contracts.
- Sibling submodules must not be imported or runtime-coupled.

## Prohibitions
- Do not import business logic from sibling finance submodules; duplicate helpers locally under the strict WET rule.
- Do not hardcode hex colors or non-semantic styling classes outside global theme tokens.
- Do not leave hardcoded English JSX text when locale translation keys belong in `locales/`.
- Do not cache server response arrays as primary source of truth inside global Zustand state.
- Do not trigger `toast.*()` notifications without a deduplicating `{ id: ... }` option.
- Do not allow negative net refund calculations or floating-point rounding drift in currency totals.
