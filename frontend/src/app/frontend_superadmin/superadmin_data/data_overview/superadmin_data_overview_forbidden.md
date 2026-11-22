# Superadmin Data Overview — Forbidden Patterns

- DO NOT import sibling submodules (e.g. `data_backup_operations`, `data_restore_operations`).
- DO NOT create barrel files (`index.ts`).
- DO NOT store API response data in Zustand or `localStorage`.
- DO NOT hardcode colors or arbitrary Tailwind bracket syntax in JSX.
- DO NOT invoke mutations without `Idempotency-Key` header.
