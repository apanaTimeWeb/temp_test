// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_COLLECT_FEE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/mocks/handlers/SuperadminBillingOverviewMemberPaymentsCollectionMockHandlers';

/** Isolated MSW lifecycle for member_payments_collection; tests opt in by calling setupFinanceCollectFeeMockServer(). */
export const FINANCE_COLLECT_FEE_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_COLLECT_FEE_MSW_HANDLERS);
/**
 * Performs the setup finance collect fee mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceCollectFeeMockServer(): void {
  beforeAll(() => FINANCE_COLLECT_FEE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_COLLECT_FEE_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_COLLECT_FEE_MOCK_SERVER.close());
}
