// RESPONSIBILITY: Define source-level test coverage for settings profile overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewSecurityFixtures.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY, SUPERADMIN_PROFILE_SAMPLE_SESSIONS } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/mocks/fixtures/SuperadminProfileOverviewSecurityMockFixtures';

describe('superadmin profile security sample fixtures', () => {
  it('uses stable unique session IDs and documentation-range IP addresses', () => {
    expect(new Set(SUPERADMIN_PROFILE_SAMPLE_SESSIONS.map((session) => session.id)).size).toBe(SUPERADMIN_PROFILE_SAMPLE_SESSIONS.length);
    expect(SUPERADMIN_PROFILE_SAMPLE_SESSIONS.every((session) => /^sample-session-/.test(session.id))).toBe(true);
    expect(SUPERADMIN_PROFILE_SAMPLE_SESSIONS.every((session) => /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/.test(session.ip))).toBe(true);
  });

  it('uses unique login-history IDs and clearly sample-scoped rows', () => {
    expect(new Set(SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY.map((row) => row.id)).size).toBe(SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY.length);
    expect(SUPERADMIN_PROFILE_SAMPLE_LOGIN_HISTORY.every((row) => row.date.includes('(sample)') && row.location.startsWith('Sample Region '))).toBe(true);
  });
});
