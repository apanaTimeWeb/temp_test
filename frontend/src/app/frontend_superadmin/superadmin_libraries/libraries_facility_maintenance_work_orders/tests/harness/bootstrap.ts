// RESPONSIBILITY: Define source-level test coverage for libraries facility maintenance work orders using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_maintenance_work_orders/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical test bootstrap entrypoint: register the owning leaf's isolated MSW lifecycle. */
import { setupSystemMaintenanceMockServer } from './SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersWorkflowBootstrap';

setupSystemMaintenanceMockServer();
