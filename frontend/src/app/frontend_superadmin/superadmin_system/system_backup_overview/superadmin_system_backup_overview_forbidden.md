# superadmin_backup_overview — Forbidden Dependencies and Behaviors

- No imports from sibling sub-modules, including their components, hooks, stores, types, schemas, mocks, or utilities.
- No shared parent `common/` or `shared/` folders.
- No invented endpoints, fields, permissions, feature flags, or response shapes.
- The sub-module root contains only this documentation trio.
- No barrel files or re-export facades.
- No direct inline mutations in JSX; use named feature-local mutation hooks only for evidenced contracts.
- No claim of host authorization, runtime test, build, or accessibility success without execution evidence.
## Module-Specific Guardrails

- Preserve the public route keys and query-parameter behavior documented for `backup_overview`; route changes require an explicit host integration decision.
- Keep every source, mock, test, schema, and fixture owned by `backup_overview` inside this leaf; do not import business code from sibling leaves.
- Use only endpoint paths, request fields, response shapes, and permissions evidenced by this leaf's existing source contracts.
- For actions marked preview-only or unavailable, do not show success feedback that implies a server write or durable persistence.
- Preserve the module's observed UI fields, accessible names, loading/empty/error states, and responsive behavior when refactoring.
- Update this feature map, forbidden list, and theme contract together whenever the module's routes, API contract, or state ownership changes.

---

## Preserved workflow specification: backup_create_flow

# backup_create_flow — Forbidden Patterns

- Do not import sibling leaf business logic at runtime.
- Do not invent backend endpoints, fields, permissions, persistence, or mutation success.
- Do not present local fixture data as live tenant data.
- Do not route secondary navigation through local-only tab state; use canonical route links.
- Do not bypass host authorization, tenant isolation, or verified API contracts.

## Host and Backend Boundaries

- Do not invent API endpoints, write schemas, permission grants, or persistence behavior absent a verified host contract.
- Keep preview/local state visibly distinct from durable server success.
- Do not log secrets or unnecessary personal data.
