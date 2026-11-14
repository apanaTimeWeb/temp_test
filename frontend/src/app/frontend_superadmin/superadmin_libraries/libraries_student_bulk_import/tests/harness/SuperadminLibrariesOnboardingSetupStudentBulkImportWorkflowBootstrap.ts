// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_BULK_IMPORT_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/mocks/handlers/SuperadminLibrariesOnboardingSetupStudentBulkImportMockHandlers';

/** Isolated MSW lifecycle for student_bulk_import; tests opt in by calling setupSystemBulkImportMockServer(). */
export const SYSTEM_BULK_IMPORT_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_BULK_IMPORT_MSW_HANDLERS);
/**
 * Performs the setup system bulk import mock server operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemBulkImportMockServer(): void {
  beforeAll(() => SYSTEM_BULK_IMPORT_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_BULK_IMPORT_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_BULK_IMPORT_MOCK_SERVER.close());
}
