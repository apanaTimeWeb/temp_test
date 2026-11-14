// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_OFFLINE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_offline_operations/mocks/handlers/SuperadminLibrariesOverviewLibraryOfflineOperationsMockHandlers';

/** Isolated MSW lifecycle for library_offline_operations; tests opt in by calling setupSystemOfflineMockServer(). */
export const SYSTEM_OFFLINE_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_OFFLINE_MSW_HANDLERS);
/**
 * Performs the setup system offline mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemOfflineMockServer(): void {
  beforeAll(() => SYSTEM_OFFLINE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_OFFLINE_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_OFFLINE_MOCK_SERVER.close());
}
