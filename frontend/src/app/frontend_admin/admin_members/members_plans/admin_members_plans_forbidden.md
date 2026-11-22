# admin_plans_main — Forbidden Patterns

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
- **Forbidden regression (V43/RBG31–35 route-navigation follow-up):** Do not regress `useAdminMembersPlansUnsavedChangesGuard` to `beforeunload` only. Preserve same-origin anchor interception, pass navigation through the owning confirmation state, clear pending destinations when the user chooses Keep Editing, and reset the draft only after explicit discard. Keep its co-located regression test.
