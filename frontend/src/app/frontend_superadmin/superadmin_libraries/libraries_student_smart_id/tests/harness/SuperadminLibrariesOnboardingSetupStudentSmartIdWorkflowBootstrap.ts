// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SYSTEM_SMART_ID_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_smart_id/mocks/handlers/SuperadminLibrariesOnboardingSetupStudentSmartIdMockHandlers';

/** Isolated MSW lifecycle for student_smart_id; tests opt in by calling setupSystemSmartIdMockServer(). */
export const SYSTEM_SMART_ID_MOCK_SERVER = setupServer(...SUPERADMIN_SYSTEM_SMART_ID_MSW_HANDLERS);
/**
 * Performs the setup system smart id mock server operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSystemSmartIdMockServer(): void {
  beforeAll(() => SYSTEM_SMART_ID_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SYSTEM_SMART_ID_MOCK_SERVER.resetHandlers());
  afterAll(() => SYSTEM_SMART_ID_MOCK_SERVER.close());
}
