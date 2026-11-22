# admin_accounting_expenses — Forbidden Patterns

## Allowed dependency boundary
- This submodule may import its own local files, the parent domain URL config, approved shared UI primitives, and documented host contracts.
- Sibling submodules must not be imported or runtime-coupled.

## Prohibitions
- Do not import business code from sibling submodules; duplicate small shared logic locally under the strict WET rule.
- Do not add or guess API endpoints, DTO fields, permission names, amount units, or pagination envelopes.
- Do not store server response data as the primary source in a Zustand/UI store.
- Do not hardcode visible UI text; use the existing `next-intl` namespace and locale keys.
- Do not bypass the domain URL config or hardcode a new public route.
- Do not log tokens, credentials, secrets, or unnecessary PII.
- Do not remove keyboard, focus, reduced-motion, or semantic accessibility behavior.


- FORBIDDEN: persist expense/financial-ledger records in `localStorage` or `sessionStorage`; use only transient React state until a verified API contract is available.
- FORBIDDEN: import a sibling accounting module's business types, route registry, or stylesheet.
