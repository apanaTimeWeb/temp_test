// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_PAYMENTS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsMockHandlers';

/** Isolated MSW lifecycle for member_payments; tests opt in by calling setupFinancePaymentsMockServer(). */
export const FINANCE_PAYMENTS_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_PAYMENTS_MSW_HANDLERS);
/**
 * Performs the setup finance payments mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinancePaymentsMockServer(): void {
  beforeAll(() => FINANCE_PAYMENTS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_PAYMENTS_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_PAYMENTS_MOCK_SERVER.close());
}
