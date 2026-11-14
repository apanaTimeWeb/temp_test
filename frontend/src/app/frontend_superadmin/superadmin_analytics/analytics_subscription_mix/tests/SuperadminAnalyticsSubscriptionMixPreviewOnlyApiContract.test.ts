// RESPONSIBILITY: Define source-level test coverage for analytics subscription mix using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_subscription_mix/tests/SuperadminAnalyticsSubscriptionMixPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_ANALYTICS_SUBSCRIPTION_MIX_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_analytics_subscription_mix.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_analytics/analytics_subscription_mix preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
