// RESPONSIBILITY: Define source-level test coverage for dashboard overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_dashboard/dashboard_overview/tests/SuperadminDashboardOverviewStableRowKey.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/utils/SuperadminDashboardOverviewStableRowKey';

describe('SuperadminDashboardStableRowKey', () => {
  it('uses the first supported stable domain identifier', () => {
    expect(stableRowKey({ id: 'row-1', uuid: 'uuid-1' })).toBe('id:row-1');
    expect(stableRowKey({ uuid: 'uuid-2' })).toBe('uuid:uuid-2');
  });
  it('falls back deterministically when no supported identifier exists', () => {
    expect(stableRowKey({ label: 'sample', count: 2 })).toBe('{"count":2,"label":"sample"}');
  });
  it('canonicalizes equivalent records regardless of property insertion order', () => {
    expect(stableRowKey({ label: 'sample', count: 2 })).toBe(stableRowKey({ count: 2, label: 'sample' }));
  });
});
