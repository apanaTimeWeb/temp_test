// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_AUTO_SUSPEND_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_auto_suspend_policy/mocks/handlers/SuperadminSubscriptionsOverviewMemberAutoSuspendPolicyMockHandlers';

/** Isolated MSW lifecycle for member_auto_suspend_policy; tests opt in by calling setupFinanceAutoSuspendMockServer(). */
export const FINANCE_AUTO_SUSPEND_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_AUTO_SUSPEND_MSW_HANDLERS);
/**
 * Performs the setup finance auto suspend mock server operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceAutoSuspendMockServer(): void {
  beforeAll(() => FINANCE_AUTO_SUSPEND_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_AUTO_SUSPEND_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_AUTO_SUSPEND_MOCK_SERVER.close());
}
