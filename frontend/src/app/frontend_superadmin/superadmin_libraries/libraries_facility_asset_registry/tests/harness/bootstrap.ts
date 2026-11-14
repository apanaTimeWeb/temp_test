// RESPONSIBILITY: Define source-level test coverage for libraries facility asset registry using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_facility_asset_registry/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical test bootstrap entrypoint: register the owning leaf's isolated MSW lifecycle. */
import { setupAccountingAssetsMockServer } from './SuperadminLibrariesOverviewFacilityAssetRegistryWorkflowBootstrap';

setupAccountingAssetsMockServer();
