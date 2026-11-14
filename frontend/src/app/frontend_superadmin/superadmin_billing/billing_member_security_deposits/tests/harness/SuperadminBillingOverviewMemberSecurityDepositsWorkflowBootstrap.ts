// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_SECURITY_DEPOSITS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/mocks/handlers/SuperadminBillingOverviewMemberSecurityDepositsMockHandlers';

/** Isolated MSW lifecycle for member_security_deposits; tests opt in by calling setupFinanceSecurityDepositsMockServer(). */
export const FINANCE_SECURITY_DEPOSITS_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_SECURITY_DEPOSITS_MSW_HANDLERS);
/**
 * Performs the setup finance security deposits mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceSecurityDepositsMockServer(): void {
  beforeAll(() => FINANCE_SECURITY_DEPOSITS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_SECURITY_DEPOSITS_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_SECURITY_DEPOSITS_MOCK_SERVER.close());
}
