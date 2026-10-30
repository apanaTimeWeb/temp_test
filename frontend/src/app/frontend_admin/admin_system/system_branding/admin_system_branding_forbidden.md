# admin_system_branding — Forbidden Patterns

## Allowed dependency boundary
- This submodule may import its own local files, the parent domain URL config, approved shared UI primitives, and documented host contracts.
- Sibling submodules must not be imported or runtime-coupled.

## Prohibitions
- Do not reintroduce unstyled legacy presentation hooks `sys-*`. Use semantic Tailwind utility classes and the global token contract; the feature-style checker rejects those hooks.
- Do not import business code from sibling submodules; duplicate small shared logic locally under the strict WET rule.
- Do not add or guess API endpoints, DTO fields, permission names, amount units, or pagination envelopes.
- Do not store server response data as the primary source in a Zustand/UI store.
- Do not hardcode visible UI text; use the existing `next-intl` namespace and locale keys.
- Do not bypass the domain URL config or hardcode a new public route.
- Do not log tokens, credentials, secrets, or unnecessary PII.
- Do not remove keyboard, focus, reduced-motion, or semantic accessibility behavior.
- **Forbidden regression (V43/RBG31–35 Rule 79):** Do not remove/skip the branding dirty-state guard, route confirmation, discard confirmation for Reset, localized EN/HI labels or co-located test. Do not imply that the local preview is persisted.
