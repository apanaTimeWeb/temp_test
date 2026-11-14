// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_RENEWALS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/mocks/handlers/SuperadminSubscriptionsOverviewMemberRenewalsMockHandlers';

/** Isolated MSW lifecycle for member_renewals; tests opt in by calling setupFinanceRenewalsMockServer(). */
export const FINANCE_RENEWALS_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_RENEWALS_MSW_HANDLERS);
/**
 * Performs the setup finance renewals mock server operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceRenewalsMockServer(): void {
  beforeAll(() => FINANCE_RENEWALS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_RENEWALS_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_RENEWALS_MOCK_SERVER.close());
}
