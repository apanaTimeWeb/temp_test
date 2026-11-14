// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_DATA_EXPORT_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/mocks/handlers/SuperadminDataExportJobsMockHandlers';

/** Isolated MSW lifecycle for data_export_jobs; tests opt in by calling setupSystemDataExportMockServer(). */
export const SYSTEM_DATA_EXPORT_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_DATA_EXPORT_MSW_HANDLERS);
/**
 * Performs the setup system data export mock server operation within data export jobs; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemDataExportMockServer(): void {
  beforeAll(() => SYSTEM_DATA_EXPORT_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_DATA_EXPORT_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_DATA_EXPORT_MOCK_SERVER.close());
}
