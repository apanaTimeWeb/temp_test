// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_TRUST_SCORE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_users/users_member_trust_score/mocks/handlers/SuperadminUsersOverviewMemberTrustScoreMockHandlers';

/** Isolated MSW lifecycle for member_trust_score; tests opt in by calling setupFinanceTrustScoreMockServer(). */
export const FINANCE_TRUST_SCORE_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_TRUST_SCORE_MSW_HANDLERS);
/**
 * Performs the setup finance trust score mock server operation within users overview; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceTrustScoreMockServer(): void {
  beforeAll(() => FINANCE_TRUST_SCORE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_TRUST_SCORE_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_TRUST_SCORE_MOCK_SERVER.close());
}
