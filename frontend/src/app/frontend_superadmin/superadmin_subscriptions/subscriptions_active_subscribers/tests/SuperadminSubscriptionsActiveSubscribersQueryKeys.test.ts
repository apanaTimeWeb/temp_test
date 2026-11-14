// RESPONSIBILITY: Define source-level test coverage for subscriptions active subscribers using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_active_subscribers/tests/SuperadminSubscriptionsActiveSubscribersQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS } from '../api/superadmin_subscriptions_active_subscribers.query_keys';

describe('subscriptions_active_subscribers canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_subscriptions', 'subscriptions_active_subscribers']);
    expect(SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
