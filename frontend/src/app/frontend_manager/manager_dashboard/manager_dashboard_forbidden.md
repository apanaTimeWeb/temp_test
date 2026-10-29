# Dashboard — Forbidden Root Responsibilities

The domain root `frontend_manager/manager_dashboard/` must not contain feature business logic.

- Do not add API clients, hooks, state stores, forms, tables, mocks, schemas, or feature-specific CSS to this root.
- Do not keep legacy manager roots, aggregate screens, view-switch routers, or query-based feature ownership here.
- Do not import another leaf's implementation or create `common`, `shared`, `utils`, or `types` business buckets at the domain root.
- Do not add sub-submodules, route groups, or barrel/re-export files.
- Do not add hard-coded palette values, inline styling, fabricated API endpoints, persistence behavior, or unverified authorization claims.
- Do not duplicate navigation or global shell logic; use `frontend_manager/manager_navigation/navigation/`.
- Do not change the frozen child list without updating the canonical scope and audit ledger first.
