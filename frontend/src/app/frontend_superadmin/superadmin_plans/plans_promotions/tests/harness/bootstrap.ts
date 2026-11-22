// RESPONSIBILITY: Define source-level test coverage for plans promotions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_plans/plans_promotions/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical isolated MSW test-harness lifecycle for this leaf. Only existing feature-local handlers are registered. */
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMINBILLINGPROMOCODES_MOCK_HANDLERS as featureHandlers0_0 } from '@/app/frontend_superadmin/superadmin_plans/plans_promotions/mocks/handlers/SuperadminPlansPromotionsMockHandlers';
export const SUPERADMIN_FEATURE_MOCK_SERVER = setupServer(...featureHandlers0_0);
/**
 * Performs the setup superadmin feature mock server operation within plans promotions; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupSuperadminFeatureMockServer(): void {
  beforeAll(() => SUPERADMIN_FEATURE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => SUPERADMIN_FEATURE_MOCK_SERVER.resetHandlers());
  afterAll(() => SUPERADMIN_FEATURE_MOCK_SERVER.close());
}
