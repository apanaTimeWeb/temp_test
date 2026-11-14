// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_USERS_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_users/users_overview/mocks/handlers/SuperadminUsersOverviewMockHandlers';

/** Isolated MSW lifecycle for users_overview; tests opt in by calling setupUsersOverviewMockServer(). */
export const USERS_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_USERS_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup users overview mock server operation within users overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupUsersOverviewMockServer(): void {
  beforeAll(() => USERS_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => USERS_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => USERS_OVERVIEW_MOCK_SERVER.close());
}
