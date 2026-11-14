// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_SUBSCRIPTIONS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/mocks/handlers/SuperadminSubscriptionsOverviewMemberSubscriptionsMockHandlers';

/** Isolated MSW lifecycle for member_subscriptions; tests opt in by calling setupFinanceSubscriptionsMockServer(). */
export const FINANCE_SUBSCRIPTIONS_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_SUBSCRIPTIONS_MSW_HANDLERS);
/**
 * Performs the setup finance subscriptions mock server operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceSubscriptionsMockServer(): void {
  beforeAll(() => FINANCE_SUBSCRIPTIONS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_SUBSCRIPTIONS_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_SUBSCRIPTIONS_MOCK_SERVER.close());
}
