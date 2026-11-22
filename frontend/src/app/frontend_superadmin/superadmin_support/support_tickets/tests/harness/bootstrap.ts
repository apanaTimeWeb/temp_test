// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_support/support_tickets/mocks/handlers/SuperadminSupportTicketsOverviewMockHandlersFromMocks';

/** Isolated MSW lifecycle for support_tickets; tests opt in by calling setupSupportTicketsOverviewMockServer(). */
export const SUPPORT_TICKETS_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_SUPPORT_TICKETS_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup support tickets overview mock server operation within support tickets; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSupportTicketsOverviewMockServer(): void {
  beforeAll(() => SUPPORT_TICKETS_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SUPPORT_TICKETS_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => SUPPORT_TICKETS_OVERVIEW_MOCK_SERVER.close());
}
