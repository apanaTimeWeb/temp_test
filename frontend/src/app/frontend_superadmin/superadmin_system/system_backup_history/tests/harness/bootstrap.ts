// RESPONSIBILITY: Define source-level test coverage for system backup history using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_backup_history/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical isolated MSW test-harness lifecycle for this leaf. Only existing feature-local handlers are registered. */
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMINBACKUPHISTORY_MOCK_HANDLERS as featureHandlers0_0 } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/mocks/handlers/SuperadminBackupHistoryMockHandlers';
import { SUPERADMINBACKUPRESTORE_MOCK_HANDLERS as featureHandlers1_0 } from '@/app/frontend_superadmin/superadmin_system/system_backup_history/mocks/handlers/SuperadminBackupHistoryRestoreFlowMockHandlers';
export const SUPERADMIN_FEATURE_MOCK_SERVER = setupServer(...featureHandlers0_0, ...featureHandlers1_0);
/**
 * Performs the setup superadmin feature mock server operation within backup history; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSuperadminFeatureMockServer(): void {
  beforeAll(() => SUPERADMIN_FEATURE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SUPERADMIN_FEATURE_MOCK_SERVER.resetHandlers());
  afterAll(() => SUPERADMIN_FEATURE_MOCK_SERVER.close());
}
