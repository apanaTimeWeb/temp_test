// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_REFUNDS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/mocks/handlers/SuperadminBillingOverviewMemberRefundsMockHandlers';

/** Isolated MSW lifecycle for member_refunds; tests opt in by calling setupFinanceRefundsMockServer(). */
export const FINANCE_REFUNDS_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_REFUNDS_MSW_HANDLERS);
/**
 * Performs the setup finance refunds mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceRefundsMockServer(): void {
  beforeAll(() => FINANCE_REFUNDS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_REFUNDS_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_REFUNDS_MOCK_SERVER.close());
}
