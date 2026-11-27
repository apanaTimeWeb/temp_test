# admin_finance_auto_suspend — Forbidden Patterns

## Allowed dependency boundary
- This submodule may import its own local files, the parent domain/app route config, approved shared UI primitives, and documented host contracts.
- Sibling submodules must not be imported or runtime-coupled.

## Prohibitions
- Do not import business logic from sibling finance submodules; duplicate small helpers locally under the strict WET rule.
- Do not hardcode raw hex color values or bypass semantic Tailwind CSS custom properties (`bg-card`, `text-danger-text`, etc.).
- Do not hardcode visible UI strings directly in JSX; place translatable keys in `locales/admin_finance_auto_suspend_en.json` and `*_hi.json` (and host merged locale files).
- Do not copy API server records into persistent global Zustand state as primary source of truth.
- Do not dispatch unguarded `toast.*()` calls without a deduplicating `{ id: ... }` option.
- Do not log student phone numbers, tokens, or credentials.
