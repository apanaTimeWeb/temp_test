import { setupServer } from 'msw/node';
import { afterAll,afterEach,beforeAll } from 'vitest';

/** Empty-by-design server: no referral endpoint contract is supplied, so requests fail closed. */
export const managerMembersReferralBonusTestServer = setupServer();

beforeAll(() => managerMembersReferralBonusTestServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => managerMembersReferralBonusTestServer.resetHandlers());
afterAll(() => managerMembersReferralBonusTestServer.close());
