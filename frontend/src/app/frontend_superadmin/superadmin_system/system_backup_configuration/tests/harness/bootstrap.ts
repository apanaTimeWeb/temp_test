// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_BACKUPS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/mocks/handlers/SuperadminBackupConfigurationMockHandlers';

/** Isolated MSW lifecycle for backup_configuration; tests opt in by calling setupSystemBackupsMockServer(). */
export const SYSTEM_BACKUPS_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_BACKUPS_MSW_HANDLERS);
/**
 * Performs the setup system backups mock server operation within backup configuration; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemBackupsMockServer(): void {
  beforeAll(() => SYSTEM_BACKUPS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_BACKUPS_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_BACKUPS_MOCK_SERVER.close());
}
