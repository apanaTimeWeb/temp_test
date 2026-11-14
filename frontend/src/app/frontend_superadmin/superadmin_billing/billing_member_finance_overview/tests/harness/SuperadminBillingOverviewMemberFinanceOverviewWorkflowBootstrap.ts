// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_FINANCE_DASHBOARD_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/mocks/handlers/SuperadminBillingOverviewMemberFinanceOverviewMockHandlers';

/** Isolated MSW lifecycle for member_finance_overview; tests opt in by calling setupFinanceFinanceDashboardMockServer(). */
export const FINANCE_FINANCE_DASHBOARD_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_FINANCE_DASHBOARD_MSW_HANDLERS);
/**
 * Performs the setup finance finance dashboard mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceFinanceDashboardMockServer(): void {
  beforeAll(() => FINANCE_FINANCE_DASHBOARD_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_FINANCE_DASHBOARD_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_FINANCE_DASHBOARD_MOCK_SERVER.close());
}
