// RESPONSIBILITY: Define source-level test coverage for libraries overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_overview/tests/SuperadminLibrariesOverviewSchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_LIBRARIES_EDIT_SCHEMA } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/schemas/SuperadminLibrariesOverviewSchema';

describe('SuperadminLibrariesEditSchema', () => {
  it('accepts a valid sample library edit', () => {
    expect(SUPERADMIN_LIBRARIES_EDIT_SCHEMA.safeParse({ name: 'Sample Library', owner: 'Sample Owner', email: 'owner@example.test', phone: '0000000000', gstNumber: '', location: 'Sample City', plan: 'Starter' }).success).toBe(true);
  });
  it('rejects malformed email and unsupported plan values', () => {
    expect(SUPERADMIN_LIBRARIES_EDIT_SCHEMA.safeParse({ name: 'Sample Library', owner: 'Sample Owner', email: 'not-an-email', phone: '', gstNumber: '', location: 'Sample City', plan: 'Starter' }).success).toBe(false);
    expect(SUPERADMIN_LIBRARIES_EDIT_SCHEMA.safeParse({ name: 'Sample Library', owner: 'Sample Owner', email: 'owner@example.test', phone: '', gstNumber: '', location: 'Sample City', plan: 'Unapproved' }).success).toBe(false);
  });
});
