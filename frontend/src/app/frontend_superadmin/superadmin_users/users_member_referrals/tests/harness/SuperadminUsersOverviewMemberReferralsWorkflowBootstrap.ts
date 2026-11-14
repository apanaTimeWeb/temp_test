// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_REFERRALS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_users/users_member_referrals/mocks/handlers/SuperadminUsersOverviewMemberReferralsMockHandlers';

/** Isolated MSW lifecycle for member_referrals; tests opt in by calling setupFinanceReferralsMockServer(). */
export const FINANCE_REFERRALS_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_REFERRALS_MSW_HANDLERS);
/**
 * Performs the setup finance referrals mock server operation within users overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceReferralsMockServer(): void {
  beforeAll(() => FINANCE_REFERRALS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_REFERRALS_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_REFERRALS_MOCK_SERVER.close());
}
