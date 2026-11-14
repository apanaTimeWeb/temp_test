// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_GAP_FILLING_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/mocks/handlers/SuperadminLibrariesOverviewLibraryCapacityGapFillingMockHandlers';

/** Isolated MSW lifecycle for library_capacity_gap_filling; tests opt in by calling setupSystemGapFillingMockServer(). */
export const SYSTEM_GAP_FILLING_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_GAP_FILLING_MSW_HANDLERS);
/**
 * Performs the setup system gap filling mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemGapFillingMockServer(): void {
  beforeAll(() => SYSTEM_GAP_FILLING_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_GAP_FILLING_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_GAP_FILLING_MOCK_SERVER.close());
}
