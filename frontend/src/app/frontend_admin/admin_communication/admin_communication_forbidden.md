# Admin Communication — Forbidden Patterns

- **Route aliases:** Do not restore old standalone admin URLs or add compatibility redirects; only `/admin/admin_communication` and the listed child canonical routes are active.
- **Root quarantine:** Do not add business components, hooks, APIs, stores, mocks, utilities, or tests directly to the domain root.
- **Sibling submodules:** Do not import business UI, hooks, state, types, API adapters, or mock data from sibling submodules.
- **Navigation coupling:** Do not hardcode route strings in navigation; consume the `ADMIN_ROUTES` registry and source labels from the role navigation localization namespace.
- **Business ownership:** Do not move forms, CRUD flows, or feature-specific state into the domain layout or global UI primitives.
- **Contract integrity:** Do not invent API endpoints, payload fields, authorization rules, or tenant isolation behavior. Verify each child module's local evidence; mark absent external specifications as `CONTRACT_MISSING`.
- **Feature preservation:** Do not delete incomplete in-scope functionality merely to pass architecture checks; complete it inside its owning submodule.
- **Verification honesty:** Do not claim browser, API, build, or test success without actual execution evidence.
