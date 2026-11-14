// RESPONSIBILITY: Define source-level test coverage for libraries facility asset maintenance using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_asset_maintenance/tests/SuperadminLibrariesOverviewFacilityAssetMaintenanceHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_ROUTES as __SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/config/libraries_facility_asset_maintenance.url_config";
import { SUPERADMIN_ACCOUNTING_ASSET_MAINTENANCE_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/api/superadmin_libraries_overview_facility_asset_maintenance.query_keys';

describe('facility_asset_maintenance standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS.PAGE).toContain('/superadmin/superadmin_accounting');
    expect(__SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS.SCREEN).toBe("/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_ACCOUNTING_ASSET_MAINTENANCE_QUERY_KEYS.all[0]).toBe('superadmin_facility_asset_maintenance');
  });
});
