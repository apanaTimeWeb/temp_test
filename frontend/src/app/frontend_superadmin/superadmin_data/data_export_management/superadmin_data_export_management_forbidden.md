# Superadmin Data Export Management Forbidden Boundaries

1. **Cross-Tenant Data Leakage:** NEVER include data from one tenant in another tenant's export package.
2. **Missing Audit Reason:** NEVER allow triggering an export without a valid business justification reason.
3. **Sub-submodules:** Strictly prohibited. No directories deeper than `data_export_management/`.
4. **Barrel Files:** No `index.ts` files allowed.
5. **Raw Hex Codes:** Do not hardcode raw hex colors.
6. **Synchronous File Generation in Main Thread:** All exports must be processed asynchronously via the background job queue.
