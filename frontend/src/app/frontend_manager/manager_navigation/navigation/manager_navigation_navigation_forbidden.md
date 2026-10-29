# manager_navigation_navigation — Forbidden Rules

# Manager Navigation Forbidden Boundaries

- Do not place feature business components, hooks, API clients, schemas, stores, fixtures, or business tests in this shell module.
- Do not recreate business behavior owned by sibling modules.
- Do not introduce role-wide business buckets.
- Do not hardcode feature navigation paths in shell components; use `constants/ManagerNavigationNavigationConstants.ts`.
- Keep shell-owned labels inside `locales/`.


## v34 URL Contract Guard

- Do not hardcode `/manager/manager_*` paths in navigation constants. Import route exports from the owning module `*_url_config.ts`.
- Do not create fake navigation route configs or import business components into the navigation shell.

## Infrastructure exemption and ownership contract

- `manager_navigation` is the role shell/infrastructure module, not a business feature. It is intentionally exempt from business-domain `_api`, `_schemas`, `_store`, `_mocks`, and domain-test requirements when no shell-owned domain contract exists; do not add empty placeholder clients or stores just to satisfy business-module folder symmetry.
- The infrastructure module still owns its required feature/forbidden/theme documentation, URL config, locales, components, constants, hooks, and utilities.
- Business modules own their own canonical URL config and page/view behavior. The navigation shell may import route constants only; it must not import sibling business UI or domain behavior.


## Autonomous Submodule Boundary

- Owning terminal submodule: `manager_navigation_navigation/`.
- This document is scoped to the `manager_navigation` primary route and its current supplied behavior.
- Sibling submodules must not be imported or used as shared runtime dependencies. Duplicate small helpers locally when needed.
- API operations not supported by the supplied contract remain disabled or explicitly blocked; no endpoint is inferred.


## V2.11 Terminal Boundary

- Do not place business implementation at `manager_navigation/` root.
- Do not import sibling business components, hooks, stores, schemas, fixtures or tests.
- Do not invent API endpoints, request/response fields, persistence or backend authorization guarantees.
- Do not treat mock/sample repositories as live backend data.
- Do not enable unverified finance, payment, refund, admission or messaging writes.
- Do not remove a legacy view until its screen/API contract parity and canonical owner are evidenced.
- Do not claim semantic typecheck, lint, unit tests, production build, browser E2E or accessibility runtime checks passed unless executed.
