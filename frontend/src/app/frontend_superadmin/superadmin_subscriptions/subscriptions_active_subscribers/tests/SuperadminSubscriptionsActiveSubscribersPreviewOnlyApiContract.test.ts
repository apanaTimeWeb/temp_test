// RESPONSIBILITY: Define source-level test coverage for subscriptions active subscribers using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_active_subscribers/tests/SuperadminSubscriptionsActiveSubscribersPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_subscriptions_active_subscribers.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_subscriptions/subscriptions_active_subscribers preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
