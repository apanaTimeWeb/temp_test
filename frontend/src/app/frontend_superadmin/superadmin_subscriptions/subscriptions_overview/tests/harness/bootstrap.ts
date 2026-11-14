// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/mocks/handlers/SuperadminSubscriptionsOverviewMockHandlers';

/** Isolated MSW lifecycle for subscriptions_overview; tests opt in by calling setupSubscriptionsOverviewMockServer(). */
export const SUBSCRIPTIONS_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup subscriptions overview mock server operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSubscriptionsOverviewMockServer(): void {
  beforeAll(() => SUBSCRIPTIONS_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SUBSCRIPTIONS_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => SUBSCRIPTIONS_OVERVIEW_MOCK_SERVER.close());
}
