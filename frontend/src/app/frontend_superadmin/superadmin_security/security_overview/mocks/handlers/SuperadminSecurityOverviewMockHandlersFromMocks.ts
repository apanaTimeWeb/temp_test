// RESPONSIBILITY: Define isolated mock handlers for security overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_overview/mocks/handlers/SuperadminSecurityOverviewMockHandlersFromMocks.ts -> module fixtures and declared mock routes -> isolated test response.
import type { RequestHandler } from 'msw';

/** No security handlers are registered because the supplied source contains no approved security API contract. */
export const SUPERADMIN_SECURITY_MOCK_HANDLERS: RequestHandler[] = [];
