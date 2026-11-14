// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_PROFILE_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/mocks/handlers/SuperadminProfileOverviewMockHandlers';

/** Isolated MSW lifecycle for profile_overview; tests opt in by calling setupProfileOverviewMockServer(). */
export const PROFILE_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_PROFILE_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup profile overview mock server operation within profile overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupProfileOverviewMockServer(): void {
  beforeAll(() => PROFILE_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => PROFILE_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => PROFILE_OVERVIEW_MOCK_SERVER.close());
}
