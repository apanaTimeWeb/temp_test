// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_LIBRARIES_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/mocks/handlers/SuperadminLibrariesOverviewMockHandlersFromMocks';

/** Isolated MSW lifecycle for libraries_overview; tests opt in by calling setupLibrariesOverviewMockServer(). */
export const LIBRARIES_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_LIBRARIES_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup libraries overview mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupLibrariesOverviewMockServer(): void {
  beforeAll(() => LIBRARIES_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => LIBRARIES_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => LIBRARIES_OVERVIEW_MOCK_SERVER.close());
}
