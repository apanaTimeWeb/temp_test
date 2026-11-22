// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_DASHBOARD_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/mocks/handlers/SuperadminDashboardOverviewMockHandlersFromMocks';

/** Isolated MSW lifecycle for dashboard_overview; tests opt in by calling setupDashboardOverviewMockServer(). */
export const DASHBOARD_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_DASHBOARD_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup dashboard overview mock server operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupDashboardOverviewMockServer(): void {
  beforeAll(() => DASHBOARD_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => DASHBOARD_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => DASHBOARD_OVERVIEW_MOCK_SERVER.close());
}
