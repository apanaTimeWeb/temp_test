// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_MAINTENANCE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/mocks/handlers/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersMockHandlers';

/** Isolated MSW lifecycle for facility_maintenance_work_orders; tests opt in by calling setupSystemMaintenanceMockServer(). */
export const SYSTEM_MAINTENANCE_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_MAINTENANCE_MSW_HANDLERS);
/**
 * Performs the setup system maintenance mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemMaintenanceMockServer(): void {
  beforeAll(() => SYSTEM_MAINTENANCE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_MAINTENANCE_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_MAINTENANCE_MOCK_SERVER.close());
}
