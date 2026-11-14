# security_login_security — Forbidden Patterns

- Do not import sibling leaf business logic at runtime.
- Do not invent backend endpoints, fields, permissions, persistence, or mutation success.
- Do not present local fixture data as live tenant data.
- Do not route secondary navigation through local-only tab state; use canonical route links.
- Do not bypass host authorization, tenant isolation, or verified API contracts.

## Host and Backend Boundaries

- Do not invent API endpoints, write schemas, permission grants, or persistence behavior absent a verified host contract.
- Keep preview/local state visibly distinct from durable server success.
- Do not log secrets or unnecessary personal data.
