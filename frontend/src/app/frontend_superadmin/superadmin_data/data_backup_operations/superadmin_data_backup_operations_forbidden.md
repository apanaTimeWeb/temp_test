# Superadmin Data Backup Operations — Forbidden Patterns

- DO NOT import sibling submodules (`data_overview`, `data_restore_operations`).
- DO NOT create barrel files (`index.ts`).
- DO NOT execute restore logic in this module (owned by `data_restore_operations`).
- DO NOT mutate without `Idempotency-Key` header.
