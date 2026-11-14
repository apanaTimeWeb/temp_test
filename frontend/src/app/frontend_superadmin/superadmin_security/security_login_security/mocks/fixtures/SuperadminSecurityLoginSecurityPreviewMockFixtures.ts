// FLOW: Feature preview/test -> superadmin_security/security_login_security/mocks/fixtures/SuperadminSecurityLoginSecurityPreviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin Security Preview Fixtures; supplies module-owned mock fixtures or handler behavior only. */
export const SUPERADMIN_SECURITY_IP_RULES = [
  { id: 1, ip: '203.0.113.11', type: 'BLOCKED', reason: 'REASON_BRUTE_FORCE_RULE', date: '2026-09-28' },
  { id: 2, ip: '192.0.2.0/24', type: 'ALLOWED', reason: 'REASON_OFFICE_NETWORK', date: '2026-01-15' },
] as const;

export const SUPERADMIN_SECURITY_API_KEYS = [
  { id: 'key_1', name: 'Example biometric sync service', prefix: 'SAMPLE_KEY_REDACTED_01', lastUsed: 'SAMPLE_TIME_2_MINUTES_AGO', status: 'STATUS_SAMPLE' },
  { id: 'key_2', name: 'Example SMS gateway webhook', prefix: 'SAMPLE_KEY_REDACTED_02', lastUsed: 'SAMPLE_TIME_5_DAYS_AGO', status: 'STATUS_SAMPLE' },
] as const;

export const SUPERADMIN_SECURITY_SESSIONS = [
  { id: 1, ip: '192.0.2.45', device: 'SAMPLE_DESKTOP_BROWSER', time: 'SAMPLE_ACTIVE', location: 'SAMPLE_REGION_A', user: 'SAMPLE_SUPER_ADMIN' },
  { id: 2, ip: '198.51.100.12', device: 'SAMPLE_MOBILE_BROWSER', time: 'SAMPLE_TIME_2_HOURS_AGO', location: 'SAMPLE_REGION_B', user: 'SAMPLE_ADMIN' },
] as const;

export const SUPERADMIN_SECURITY_FAILED_LOGINS = [
  { id: 1, ip: '203.0.113.11', user: 'sample-admin@example.invalid', time: 'SAMPLE_TIME_10_MINUTES_AGO', reason: 'REASON_INVALID_PASSWORD' },
  { id: 2, ip: '198.51.100.9', user: 'unknown', time: 'SAMPLE_TIME_1_HOUR_AGO', reason: 'REASON_USER_NOT_FOUND' },
] as const;

export const SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS = { maxFailed: 5, lockDuration: 30, sessionTimeout: 60, forceLogout: false };
export const SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS = { upper: true, symbol: true, length: 12, expiry: 90 };
export const SUPERADMIN_SECURITY_MFA_PREVIEW = { enabled: true, method: 'Authenticator App (Google/Authy)' };
