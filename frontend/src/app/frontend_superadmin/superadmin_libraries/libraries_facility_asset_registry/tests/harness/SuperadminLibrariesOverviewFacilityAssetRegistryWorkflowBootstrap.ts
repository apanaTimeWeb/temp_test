// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_ASSETS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/mocks/handlers/SuperadminLibrariesOverviewFacilityAssetRegistryMockHandlers';

/** Isolated MSW lifecycle for facility_asset_registry; tests opt in by calling setupAccountingAssetsMockServer(). */
export const ACCOUNTING_ASSETS_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_ASSETS_MSW_HANDLERS);
/**
 * Performs the setup accounting assets mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingAssetsMockServer(): void {
  beforeAll(() => ACCOUNTING_ASSETS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_ASSETS_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_ASSETS_MOCK_SERVER.close());
}
