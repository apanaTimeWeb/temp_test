import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';

/** Empty-by-design server: no referral endpoint contract is supplied, so requests fail closed. */
export const managerMembersReferralBonusTestServer = setupServer();

beforeAll(() => managerMembersReferralBonusTestServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => managerMembersReferralBonusTestServer.resetHandlers());
afterAll(() => managerMembersReferralBonusTestServer.close());
