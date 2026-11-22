# superadmin_navigation — Domain-Level Forbidden Rules

These constraints apply to the domain root and all leaf sub-modules.

- Do not place business components, hooks, stores, API clients, mocks, fixtures, or tests directly in the domain root.
- Do not import components, hooks, stores, API clients, types, schemas, fixtures, or mocks from sibling leaf modules. Duplicate small helpers locally under the WET rule.
- Do not invent endpoints, request/response fields, permissions, feature flags, backend persistence, or authorization semantics.
- Do not treat local preview state as a successful server mutation.
- Do not rename, remove, or relocate existing public `PAGE` aliases or view query keys without an explicit host integration decision.
- Do not bypass the role guard for client UX, and do not treat it as server authorization.
- Do not add hard-coded hex colors, unapproved theme tokens, missing accessible names, or unstable test selectors.
- Do not remove loading, empty, error, retry, unavailable, or validation states when extracting a sub-module.
- Do not place files in unprefixed category folders; use only the canonical `navigation_<category>/` naming pattern.
- Do not claim build, tests, browser accessibility, or server authorization passed unless executed against the host runtime and recorded in the re-audit result.
