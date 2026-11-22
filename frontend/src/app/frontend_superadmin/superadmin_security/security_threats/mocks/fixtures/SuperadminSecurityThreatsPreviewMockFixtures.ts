// RESPONSIBILITY: Define local sample fixtures for security threats; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_threats/mocks/fixtures/SuperadminSecurityThreatsPreviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Sample failed-login rows for the Audit & Threats preview only; not live audit data. */
export const SUPERADMIN_SECURITY_FAILED_LOGINS = [
  { id: 1, ip: '203.0.113.11', user: 'sample-admin@example.invalid', time: 'SAMPLE_TIME_10_MINUTES_AGO', reason: 'REASON_INVALID_PASSWORD' },
  { id: 2, ip: '198.51.100.9', user: 'unknown', time: 'SAMPLE_TIME_1_HOUR_AGO', reason: 'REASON_USER_NOT_FOUND' },
] as const;
