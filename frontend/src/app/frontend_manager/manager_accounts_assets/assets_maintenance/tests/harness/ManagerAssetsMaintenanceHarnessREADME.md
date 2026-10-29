# assets_maintenance isolated harness

This harness boundary is owned by `assets_maintenance` and is physically located in `frontend_manager/manager_accounts_assets/assets_maintenance/tests/harness/`. Keep harness code, fixtures, handlers, and tests within this module; do not import sibling feature implementations or invent backend contracts.

## Harness entry points

- Provider wrapper: `ManagerAssetsMaintenanceHarness.tsx`. It supplies the module's declared test providers and scenario controls; host auth, tenant, and backend behavior remain host-owned unless source explicitly supplies them.
- Canonical bootstrap: `bootstrap.ts`. This file is preserved at the V2.11-required path. The provider wrapper imports it directly. The bootstrap exports worker lifecycle helpers. 
## Host verification

Run this module's tests using the integrating host project's configured Vitest and Playwright commands. The supplied archive does not include the root package manifest or installed dependencies, so runtime execution is `DEFERRED_TO_HOST_RUNTIME`; this README does not claim a test pass.
