// RESPONSIBILITY: Define source-level test coverage for settings profile overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewSchema.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_PROFILE_EDIT_SCHEMA, SUPERADMIN_PROFILE_PASSWORD_SCHEMA } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema';

describe('Superadmin profile local-preview schemas', () => {
  it('accepts valid profile details', () => {
    expect(SUPERADMIN_PROFILE_EDIT_SCHEMA.safeParse({ firstName: 'Sample', lastName: 'Admin', email: 'admin@example.invalid', phone: '0000000000' }).success).toBe(true);
  });

  it('rejects malformed email and missing names', () => {
    expect(SUPERADMIN_PROFILE_EDIT_SCHEMA.safeParse({ firstName: '', lastName: 'Admin', email: 'invalid', phone: '0000000000' }).success).toBe(false);
  });

  it('enforces password length, uppercase, symbol and confirmation', () => {
    const base = { currentPassword: 'Old-password-123', newPassword: 'Strong-password-123!', confirmPassword: 'Strong-password-123!' };
    expect(SUPERADMIN_PROFILE_PASSWORD_SCHEMA.safeParse(base).success).toBe(true);
    expect(SUPERADMIN_PROFILE_PASSWORD_SCHEMA.safeParse({ ...base, confirmPassword: 'different-password' }).success).toBe(false);
    expect(SUPERADMIN_PROFILE_PASSWORD_SCHEMA.safeParse({ ...base, newPassword: 'short', confirmPassword: 'short' }).success).toBe(false);
  });
});
