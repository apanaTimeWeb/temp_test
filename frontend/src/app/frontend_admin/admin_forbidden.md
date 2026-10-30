# Frontend Admin — Role-Level Forbidden Patterns (v21)

- Do not move feature business logic into role-wide component, hook, API, store, schema, type, utility, mock, or test buckets.
- Do not create cross-feature business imports, duplicate route registries, or re-export-only facades.
- Do not infer public routes, backend endpoints, DTOs, tenant/branch context, permissions, or success responses absent an authoritative host contract.
- Do not treat fixtures or mock responses as live backend success outside explicit demo mode.
- Do not ship visible no-op controls, silent failure, or unannounced destructive actions.
- Do not use inline style props for dynamic visual values, arbitrary raw hex utilities, unapproved theme tokens, or motion without reduced-motion handling.
- Do not claim runtime, browser, API, RBAC, WCAG, or production-build verification from static checks alone.
- Keep all feature folders module-prefixed; component source files must be grouped under module-prefixed responsibility subfolders and begin with a responsibility comment.
