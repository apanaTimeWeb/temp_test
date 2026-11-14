// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_PROFILE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/mocks/handlers/SuperadminLibrariesProfileConfigurationMockHandlers';

/** Isolated MSW lifecycle for libraries_profile_configuration; tests opt in by calling setupSystemProfileMockServer(). */
export const SYSTEM_PROFILE_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_PROFILE_MSW_HANDLERS);
/**
 * Performs the setup system profile mock server operation within libraries profile configuration; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemProfileMockServer(): void {
  beforeAll(() => SYSTEM_PROFILE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_PROFILE_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_PROFILE_MOCK_SERVER.close());
}
