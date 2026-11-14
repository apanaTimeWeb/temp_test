// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SETUP_WIZARD_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_onboarding_setup/mocks/handlers/SuperadminLibrariesOnboardingSetupMockHandlersFromMocks';

/** Isolated MSW lifecycle for libraries_onboarding_setup; tests opt in by calling setupSetupWizardOverviewMockServer(). */
export const SETUP_WIZARD_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_SETUP_WIZARD_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup setup wizard overview mock server operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSetupWizardOverviewMockServer(): void {
  beforeAll(() => SETUP_WIZARD_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SETUP_WIZARD_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => SETUP_WIZARD_OVERVIEW_MOCK_SERVER.close());
}
