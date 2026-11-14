// RESPONSIBILITY: Define source-level test coverage for support complaints using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_complaints/tests/SuperadminSupportComplaintsQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS } from '../api/superadmin_support_complaints.query_keys';

describe('support_complaints canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_support', 'support_complaints']);
    expect(SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
