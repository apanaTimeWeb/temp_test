// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_LATE_FEES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/mocks/handlers/SuperadminBillingOverviewMemberLateFeesMockHandlers';

/** Isolated MSW lifecycle for member_late_fees; tests opt in by calling setupFinanceLateFeesMockServer(). */
export const FINANCE_LATE_FEES_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_LATE_FEES_MSW_HANDLERS);
/**
 * Performs the setup finance late fees mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceLateFeesMockServer(): void {
  beforeAll(() => FINANCE_LATE_FEES_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_LATE_FEES_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_LATE_FEES_MOCK_SERVER.close());
}
