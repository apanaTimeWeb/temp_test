# Superadmin Data Restore Operations Forbidden Boundaries

1. **Cross-Tenant Mutation (Zero-Bleed Law):** NEVER allow a single-tenant restore operation to modify tables, schemas, or rows belonging to another tenant.
2. **Unconfirmed Restores:** NEVER execute a restore operation without user typing `CONFIRM-RESTORE` and providing an audit reason.
3. **Sub-submodules:** Strictly prohibited. No directories deeper than `data_restore_operations/`.
4. **Barrel Files:** No `index.ts` files allowed.
5. **Raw Hex Codes:** Do not hardcode arbitrary hex values; use semantic Tailwind CSS design system classes.
6. **Live Data Drills:** Never run automated restore drills directly against production databases without sandbox isolation.
