// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewStableRowKey.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_users/users_overview/utils/SuperadminUsersOverviewStableRowKey';

describe('SuperadminUsersStableRowKey', () => {
  it('uses the first supported stable domain identifier', () => {
    expect(stableRowKey({ id: 'row-1', uuid: 'uuid-1' })).toBe('id:row-1');
    expect(stableRowKey({ uuid: 'uuid-2' })).toBe('uuid:uuid-2');
  });
  it('falls back deterministically when no supported identifier exists', () => {
    expect(stableRowKey({ label: 'sample', count: 2 })).toBe('{"count":2,"label":"sample"}');
    expect(stableRowKey({ nested: { z: 1, a: 2 }, label: 'sample' })).toBe(stableRowKey({ label: 'sample', nested: { a: 2, z: 1 } }));
  });
});
