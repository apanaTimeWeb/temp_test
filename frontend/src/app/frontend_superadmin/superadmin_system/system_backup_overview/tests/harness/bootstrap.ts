// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_BACKUP_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/mocks/handlers/SuperadminBackupOverviewMockHandlers';

/** Isolated MSW lifecycle for backup_overview; tests opt in by calling setupBackupOverviewMockServer(). */
export const BACKUP_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_BACKUP_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup backup overview mock server operation within backup overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupBackupOverviewMockServer(): void {
  beforeAll(() => BACKUP_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => BACKUP_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => BACKUP_OVERVIEW_MOCK_SERVER.close());
}
