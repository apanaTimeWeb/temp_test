// RESPONSIBILITY: Define isolated mock handlers for libraries onboarding setup; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_libraries/libraries_onboarding_setup/mocks/handlers/SuperadminLibrariesOnboardingSetupMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import type { RequestHandler } from 'msw';

/** No wizard handlers are registered because the supplied source contains no approved setup persistence API contract. */
export const SUPERADMIN_SETUP_WIZARD_MOCK_HANDLERS: RequestHandler[] = [];
