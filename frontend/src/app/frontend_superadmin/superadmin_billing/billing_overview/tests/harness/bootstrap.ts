// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_BILLING_OVERVIEW_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/mocks/handlers/SuperadminBillingOverviewMockHandlers';

/** Isolated MSW lifecycle for billing_overview; tests opt in by calling setupBillingOverviewMockServer(). */
export const BILLING_OVERVIEW_MOCK_SERVER = setupServer(...SUPERADMIN_BILLING_OVERVIEW_MSW_HANDLERS);
/**
 * Performs the setup billing overview mock server operation within billing overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupBillingOverviewMockServer(): void {
  beforeAll(() => BILLING_OVERVIEW_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => BILLING_OVERVIEW_MOCK_SERVER.resetHandlers());
  afterAll(() => BILLING_OVERVIEW_MOCK_SERVER.close());
}
