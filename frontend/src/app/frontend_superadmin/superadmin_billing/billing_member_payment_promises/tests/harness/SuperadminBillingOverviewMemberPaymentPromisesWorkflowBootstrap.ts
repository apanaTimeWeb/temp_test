// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_PAYMENT_PROMISES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/mocks/handlers/SuperadminBillingOverviewMemberPaymentPromisesMockHandlers';

/** Isolated MSW lifecycle for member_payment_promises; tests opt in by calling setupFinancePaymentPromisesMockServer(). */
export const FINANCE_PAYMENT_PROMISES_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_PAYMENT_PROMISES_MSW_HANDLERS);
/**
 * Performs the setup finance payment promises mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinancePaymentPromisesMockServer(): void {
  beforeAll(() => FINANCE_PAYMENT_PROMISES_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_PAYMENT_PROMISES_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_PAYMENT_PROMISES_MOCK_SERVER.close());
}
