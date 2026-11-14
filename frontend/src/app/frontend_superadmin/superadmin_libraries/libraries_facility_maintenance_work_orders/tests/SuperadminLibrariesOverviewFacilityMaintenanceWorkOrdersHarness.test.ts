// RESPONSIBILITY: Define source-level test coverage for libraries facility maintenance work orders using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_maintenance_work_orders/tests/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_FACILITY_MAINTENANCE_WORK_ORDERS_ROUTES as __SUPERADMIN_LIBRARIES_FACILITY_MAINTENANCE_WORK_ORDERS_ROUTES } from "@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/config/libraries_facility_maintenance_work_orders.url_config";
import { SUPERADMIN_SYSTEM_MAINTENANCE_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/api/superadmin_libraries_overview_facility_maintenance_work_orders.query_keys';

describe('facility_maintenance_work_orders standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_LIBRARIES_FACILITY_MAINTENANCE_WORK_ORDERS_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_MAINTENANCE_WORK_ORDERS_SYSTEM_MAINTENANCE_URLS.PAGE).toBe('/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders');
    expect(__SUPERADMIN_LIBRARIES_FACILITY_MAINTENANCE_WORK_ORDERS_ROUTES.SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_MAINTENANCE_WORK_ORDERS_SYSTEM_MAINTENANCE_URLS.SCREEN).toBe("/superadmin/superadmin_libraries/libraries_overview?view=facility_maintenance_work_orders");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SYSTEM_MAINTENANCE_QUERY_KEYS.all[0]).toBe('superadmin_facility_maintenance_work_orders');
  });
});
