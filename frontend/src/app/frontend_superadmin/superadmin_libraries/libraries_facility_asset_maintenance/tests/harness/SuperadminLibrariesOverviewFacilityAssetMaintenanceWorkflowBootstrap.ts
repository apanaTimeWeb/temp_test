// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_ASSET_MAINTENANCE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_maintenance/mocks/handlers/SuperadminLibrariesOverviewFacilityAssetMaintenanceMockHandlers';

/** Isolated MSW lifecycle for facility_asset_maintenance; tests opt in by calling setupAccountingAssetMaintenanceMockServer(). */
export const ACCOUNTING_ASSET_MAINTENANCE_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_ASSET_MAINTENANCE_MSW_HANDLERS);
/**
 * Performs the setup accounting asset maintenance mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingAssetMaintenanceMockServer(): void {
  beforeAll(() => ACCOUNTING_ASSET_MAINTENANCE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_ASSET_MAINTENANCE_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_ASSET_MAINTENANCE_MOCK_SERVER.close());
}
