// RESPONSIBILITY: Define source-level test coverage for subscriptions overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_subscriptions/subscriptions_overview/tests/SuperadminSubscriptionsOverviewStableRowKey.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewStableRowKey';

describe('SuperadminSubscriptionsStableRowKey', () => {
  it('uses the first supported stable domain identifier', () => {
    expect(stableRowKey({ id: 'row-1', uuid: 'uuid-1' })).toBe('id:row-1');
    expect(stableRowKey({ uuid: 'uuid-2' })).toBe('uuid:uuid-2');
  });
  it('falls back deterministically when no supported identifier exists', () => {
    expect(stableRowKey({ label: 'sample', count: 2 })).toBe('{"label":"sample","count":2}');
  });
  it('returns the same fallback key regardless of property insertion order', () => {
    expect(stableRowKey({ alpha: 1, beta: { z: 2, a: 1 } })).toBe(stableRowKey({ beta: { a: 1, z: 2 }, alpha: 1 }));
  });
});
