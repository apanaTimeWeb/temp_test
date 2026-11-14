// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_POWER_SAVING_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/mocks/handlers/SuperadminLibrariesOverviewFacilityPowerManagementMockHandlers';

/** Isolated MSW lifecycle for facility_power_management; tests opt in by calling setupSystemPowerSavingMockServer(). */
export const SYSTEM_POWER_SAVING_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_POWER_SAVING_MSW_HANDLERS);
/**
 * Performs the setup system power saving mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemPowerSavingMockServer(): void {
  beforeAll(() => SYSTEM_POWER_SAVING_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_POWER_SAVING_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_POWER_SAVING_MOCK_SERVER.close());
}
