# Superadmin Data Archive & Retention Rules Forbidden Boundaries

1. **Purging Records Under Legal Hold:** NEVER delete, purge, or auto-expire records while `isLegalHold: true`.
2. **Global Cross-Tenant Purge:** Retention rules must NEVER purge records without tenant scoping and partition isolation.
3. **Sub-submodules:** Strictly prohibited. No directories deeper than `data_archive_retention/`.
4. **Barrel Files:** No `index.ts` files allowed.
5. **Raw Hex Codes:** Do not hardcode raw hex color codes.
6. **Hard Deletions Without Statutory Window:** Primary entities cannot be purged with retention duration lower than 30 days.
