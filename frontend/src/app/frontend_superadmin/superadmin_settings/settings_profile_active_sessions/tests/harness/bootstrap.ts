// RESPONSIBILITY: Define source-level test coverage for settings profile active sessions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_active_sessions/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical isolated MSW test-harness lifecycle for this leaf. Only existing feature-local handlers are registered. */
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMINPROFILEACTIVESESSIONS_MOCK_HANDLERS as featureHandlers0_0 } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_active_sessions/mocks/handlers/SuperadminProfileActiveSessionsMockHandlers';
export const SUPERADMIN_FEATURE_MOCK_SERVER = setupServer(...featureHandlers0_0);
/**
 * Performs the setup superadmin feature mock server operation within profile active sessions; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSuperadminFeatureMockServer(): void {
  beforeAll(() => SUPERADMIN_FEATURE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SUPERADMIN_FEATURE_MOCK_SERVER.resetHandlers());
  afterAll(() => SUPERADMIN_FEATURE_MOCK_SERVER.close());
}
