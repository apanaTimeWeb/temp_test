// FLOW: Feature preview/test -> superadmin_security/security_mfa/mocks/fixtures/SuperadminSecurityMfaPreviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
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
export const SUPERADMIN_SECURITY_MFA_PREVIEW = {
  enabled: true,
  method: 'Authenticator App (Google/Authy)',
  enforceSuperadminsOnly: true,
  requireForAdmins: true,
  stepUpAuth: true,
  gracePeriodDays: 7,
  recoveryCodesGenerated: true,
  recoveryCodes: [
    'A9F2-K41P-9921',
    'M39A-77L0-4412',
    '88BC-12QX-5531',
    'KL99-01WW-7823',
    'Z55P-9988-1209',
    'V771-4402-9981',
    'B221-6677-3310',
    'QQ44-8899-2211',
    'X009-5511-7788',
    'R332-1144-8899',
  ],
};

export const SUPERADMIN_MFA_ACCOUNTS_PREVIEW = [
  { id: 'usr-sa-001', name: 'Chief Security Officer', email: 'cso@libraryos.com', role: 'SuperAdmin' as const, mfaEnabled: true, method: 'TOTP (Google Authenticator)', enrolledAt: '2026-01-10', lastVerified: 'Active today, 08:30 AM', status: 'Enforced' as const },
  { id: 'usr-sa-002', name: 'Emergency SuperAdmin 1 (Break-Glass)', email: 'emergency.sa1@libraryos.com', role: 'SuperAdmin' as const, mfaEnabled: true, method: 'FIDO2 Security Key (YubiKey)', enrolledAt: '2026-01-01', lastVerified: '2026-11-19 14:22', status: 'Enforced' as const },
  { id: 'usr-sa-003', name: 'Emergency SuperAdmin 2 (Break-Glass)', email: 'emergency.sa2@libraryos.com', role: 'SuperAdmin' as const, mfaEnabled: true, method: 'Hardware Token + TOTP', enrolledAt: '2026-01-01', lastVerified: '2026-11-15 11:10', status: 'Enforced' as const },
  { id: 'usr-sa-004', name: 'Operations SuperAdmin', email: 'ops.superadmin@libraryos.com', role: 'SuperAdmin' as const, mfaEnabled: true, method: 'TOTP (Authy)', enrolledAt: '2026-03-12', lastVerified: 'Active today, 09:15 AM', status: 'Enforced' as const },
  { id: 'usr-adm-005', name: 'Library Central Admin', email: 'admin.delhi@libraryos.com', role: 'Admin' as const, mfaEnabled: true, method: 'SMS OTP (+91 98*** **210)', enrolledAt: '2026-05-18', lastVerified: 'Yesterday, 17:40', status: 'Active' as const },
  { id: 'usr-adm-006', name: 'Mumbai Branch Lead', email: 'admin.mumbai@libraryos.com', role: 'Admin' as const, mfaEnabled: false, method: 'Pending Setup', enrolledAt: '—', lastVerified: 'Never', status: 'Pending_Grace' as const },
];
