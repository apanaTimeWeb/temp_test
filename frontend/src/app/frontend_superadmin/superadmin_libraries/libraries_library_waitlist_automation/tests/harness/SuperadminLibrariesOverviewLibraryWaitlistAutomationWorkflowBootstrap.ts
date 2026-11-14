// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_WAITLIST_AUTOMATION_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/mocks/handlers/SuperadminLibrariesOverviewLibraryWaitlistAutomationMockHandlers';

/** Isolated MSW lifecycle for library_waitlist_automation; tests opt in by calling setupSystemWaitlistAutomationMockServer(). */
export const SYSTEM_WAITLIST_AUTOMATION_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_WAITLIST_AUTOMATION_MSW_HANDLERS);
/**
 * Performs the setup system waitlist automation mock server operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemWaitlistAutomationMockServer(): void {
  beforeAll(() => SYSTEM_WAITLIST_AUTOMATION_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_WAITLIST_AUTOMATION_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_WAITLIST_AUTOMATION_MOCK_SERVER.close());
}
