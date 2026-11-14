// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SETTINGS_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_settings/settings_overview/mocks/handlers/SuperadminSettingsOverviewMockHandlersFromMocks';

/** Isolated MSW lifecycle for settings_overview; tests opt in by calling setupSettingsOverviewMockServer(). */
export const SETTINGS_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_SETTINGS_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup settings overview mock server operation within settings overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSettingsOverviewMockServer(): void {
  beforeAll(() => SETTINGS_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SETTINGS_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => SETTINGS_OVERVIEW_MOCK_SERVER.close());
}
