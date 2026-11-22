// RESPONSIBILITY: Define source-level test coverage for navigation shell using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_navigation/navigation_shell/tests/harness/SuperadminNavigationShellMockServerBootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_NAVIGATION_SHELL_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/mocks/handlers/SuperadminNavigationShellMockHandlers';

/** Isolated MSW lifecycle for navigation_shell; tests opt in by calling setupNavigationShellMockServer(). */
export const NAVIGATION_SHELL_MOCK_SERVER = setupServer(...SUPERADMIN_NAVIGATION_SHELL_MSW_HANDLERS);
/**
 * Performs the setup navigation shell mock server operation within the Superadmin navigation shell; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupNavigationShellMockServer(): void {
  beforeAll(() => NAVIGATION_SHELL_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => NAVIGATION_SHELL_MOCK_SERVER.resetHandlers());
  afterAll(() => NAVIGATION_SHELL_MOCK_SERVER.close());
}
