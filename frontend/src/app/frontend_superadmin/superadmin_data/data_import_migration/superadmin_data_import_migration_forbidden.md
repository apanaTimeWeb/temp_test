# Superadmin Data Import & Migration Forbidden Boundaries

1. **Commit Without Validation:** NEVER commit raw migration data directly into production tables without running pre-flight dry-run validation.
2. **Cross-Tenant Contamination:** NEVER import data for one library tenant into another tenant's schema partition.
3. **Sub-submodules:** Strictly prohibited. No directories deeper than `data_import_migration/`.
4. **Barrel Files:** No `index.ts` files allowed.
5. **Raw Hex Codes:** Do not hardcode arbitrary hex values.
6. **Unreversible Migrations:** Never commit high-volume imports without offering an automated rollback snapshot.
