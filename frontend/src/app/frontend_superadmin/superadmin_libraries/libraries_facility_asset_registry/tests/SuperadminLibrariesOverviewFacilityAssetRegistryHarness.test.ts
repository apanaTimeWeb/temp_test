// RESPONSIBILITY: Define source-level test coverage for libraries facility asset registry using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_asset_registry/tests/SuperadminLibrariesOverviewFacilityAssetRegistryHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES as __SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/config/libraries_facility_asset_registry.url_config";
import { SUPERADMIN_ACCOUNTING_ASSETS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/api/superadmin_libraries_overview_facility_asset_registry.query_keys';

describe('facility_asset_registry standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_REGISTRY_ACCOUNTING_ASSETS_URLS.PAGE).toContain('/superadmin/superadmin_accounting');
    expect(__SUPERADMIN_LIBRARIES_FACILITY_ASSET_REGISTRY_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_REGISTRY_ACCOUNTING_ASSETS_URLS.SCREEN).toBe("/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_registry");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_ACCOUNTING_ASSETS_QUERY_KEYS.all[0]).toBe('superadmin_facility_asset_registry');
  });
});
