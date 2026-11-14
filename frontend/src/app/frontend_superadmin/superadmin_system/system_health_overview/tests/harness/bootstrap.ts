// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_system/system_health_overview/mocks/handlers/SuperadminSystemHealthOverviewMockHandlers';

/** Isolated MSW lifecycle for system_health_overview; tests opt in by calling setupSystemHealthOverviewMockServer(). */
export const SYSTEM_HEALTH_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup system health overview mock server operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemHealthOverviewMockServer(): void {
  beforeAll(() => SYSTEM_HEALTH_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_HEALTH_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_HEALTH_OVERVIEW_MOCK_SERVER.close());
}
