// RESPONSIBILITY: Define source-level test coverage for support tickets using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_tickets/tests/SuperadminSupportTicketsQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS } from '../api/superadmin_support_tickets.query_keys';

describe('support_tickets canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_support', 'support_tickets']);
    expect(SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_SUPPORT_TICKETS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
