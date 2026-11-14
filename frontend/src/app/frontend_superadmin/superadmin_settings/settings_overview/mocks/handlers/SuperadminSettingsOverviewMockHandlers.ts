// RESPONSIBILITY: Define isolated mock handlers for settings overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_overview/mocks/handlers/SuperadminSettingsOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import type { RequestHandler } from 'msw';

/** No settings handlers are registered because the supplied source contains no approved settings API contract. */
export const SUPERADMIN_SETTINGS_MOCK_HANDLERS: RequestHandler[] = [];
