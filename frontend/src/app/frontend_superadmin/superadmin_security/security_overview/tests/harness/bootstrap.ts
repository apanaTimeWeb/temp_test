// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SECURITY_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_security/security_overview/mocks/handlers/SuperadminSecurityOverviewMockHandlers';

/** Isolated MSW lifecycle for security_overview; tests opt in by calling setupSecurityOverviewMockServer(). */
export const SECURITY_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_SECURITY_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup security overview mock server operation within security overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSecurityOverviewMockServer(): void {
  beforeAll(() => SECURITY_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SECURITY_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => SECURITY_OVERVIEW_MOCK_SERVER.close());
}
