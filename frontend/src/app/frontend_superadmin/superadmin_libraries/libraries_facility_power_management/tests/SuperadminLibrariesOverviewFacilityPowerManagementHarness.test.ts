// RESPONSIBILITY: Define source-level test coverage for libraries facility power management using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_power_management/tests/SuperadminLibrariesOverviewFacilityPowerManagementHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES as __SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/config/libraries_facility_power_management.url_config";
import { SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/api/superadmin_libraries_overview_facility_power_management.query_keys';

describe('facility_power_management standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS.PAGE).toBe('/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management');
    expect(__SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS.SCREEN).toBe("/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS.all[0]).toBe('superadmin_facility_power_management');
  });
});
