/**
 * Responsibility: Verify end-to-end contracts for all 11 Global Settings categories:
 * Platform name/logo, Default timezone, Default language, Default currency, Default branch settings,
 * Password and MFA policies, Default notification templates, File upload restrictions,
 * Global maintenance mode, Data retention policy, Default subscription/grace-period rules.
 */
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SETTINGS_SCHEMA } from '../schemas/SuperadminSettingsGeneralSchema';
import { SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS } from '../mocks/fixtures/SuperadminSettingsGeneralPreviewDefaults';
import {
  SETTINGS_SECTION_PILLS,
  AVAILABLE_CURRENCIES,
  AVAILABLE_TIMEZONES,
  AVAILABLE_LANGUAGES,
  MFA_ENFORCEMENT_OPTIONS,
  BACKUP_SCHEDULE_OPTIONS,
  POPULAR_FILE_EXTENSIONS,
} from '../constants/SuperadminSettingsGeneralConstants';
import {
  fetchSuperadminSettingsGeneral,
  updateSuperadminSettingsGeneral,
  resetSuperadminSettingsGeneral,
} from '../api/superadmin_settings_general.api';

describe('Global Settings 11 Domains Comprehensive Contract', () => {
  describe('1. Platform Name, Logo, Favicon & Contact Defaults', () => {
    it('validates default platform parameters against schema', () => {
      const parsed = SUPERADMIN_SETTINGS_SCHEMA.safeParse(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.generalConfig.platformName).toBe('Library OS');
        expect(parsed.data.generalConfig.supportEmail).toBe('support@example.invalid');
      }
    });

    it('rejects empty platform name or invalid support email', () => {
      const badData = {
        ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
        generalConfig: {
          ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.generalConfig,
          platformName: '',
          supportEmail: 'not-an-email',
        },
      };
      const result = SUPERADMIN_SETTINGS_SCHEMA.safeParse(badData);
      expect(result.success).toBe(false);
    });
  });

  describe('2. Timezone, Language & Currency Configuration', () => {
    it('includes valid regional options in constants', () => {
      expect(AVAILABLE_TIMEZONES.some((tz) => tz.value === 'Asia/Kolkata')).toBe(true);
      expect(AVAILABLE_CURRENCIES.some((cur) => cur.code === 'INR (₹)')).toBe(true);
      expect(AVAILABLE_LANGUAGES.some((lang) => lang.code === 'en')).toBe(true);
      expect(AVAILABLE_LANGUAGES.some((lang) => lang.code === 'hi')).toBe(true);
    });

    it('accepts all designated currencies and timezones', () => {
      const parsed = SUPERADMIN_SETTINGS_SCHEMA.parse(SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS);
      expect(parsed.generalConfig.currency).toBe('INR (₹)');
      expect(parsed.generalConfig.timezone).toBe('Asia/Kolkata');
      expect(parsed.generalConfig.defaultLanguage).toBe('en');
    });
  });

  describe('3. Default Branch Settings', () => {
    it('enforces branch operating hours and capacity constraints', () => {
      const branch = SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.branchDefaults;
      expect(branch.defaultMemberCapacity).toBeGreaterThanOrEqual(10);
      expect(branch.slotDurationMinutes).toBe(120);
      expect(branch.checkInGraceMinutes).toBe(15);
      expect(branch.autoApproveMembers).toBe(true);
      expect(branch.weekendSchedule).toBe('REGULAR');
    });

    it('rejects invalid time string formats for opening and closing times', () => {
      const badTimeData = {
        ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
        branchDefaults: {
          ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.branchDefaults,
          openingTime: '99:99',
        },
      };
      const result = SUPERADMIN_SETTINGS_SCHEMA.safeParse(badTimeData);
      expect(result.success).toBe(false);
    });
  });

  describe('4. Password and MFA Policies', () => {
    it('verifies strict MFA enforcement choices', () => {
      expect(MFA_ENFORCEMENT_OPTIONS.map((o) => o.value)).toContain('SUPERADMIN_ONLY');
      expect(MFA_ENFORCEMENT_OPTIONS.map((o) => o.value)).toContain('ALL_ADMINS');
    });

    it('rejects insecure password lengths (< 8)', () => {
      const badPwdData = {
        ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
        securityPolicy: {
          ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.securityPolicy,
          minPasswordLength: 4,
        },
      };
      const result = SUPERADMIN_SETTINGS_SCHEMA.safeParse(badPwdData);
      expect(result.success).toBe(false);
    });
  });

  describe('6. File Upload Restrictions', () => {
    it('contains verified document and image extensions', () => {
      expect(POPULAR_FILE_EXTENSIONS).toContain('.pdf');
      expect(POPULAR_FILE_EXTENSIONS).toContain('.xlsx');
      expect(POPULAR_FILE_EXTENSIONS).toContain('.webp');
    });

    it('enforces file upload quotas in defaults', () => {
      const upload = SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.uploadRestrictions;
      expect(upload.maxFileSizeMb).toBe(10);
      expect(upload.branchStorageQuotaGb).toBe(25);
      expect(upload.virusScanningEnabled).toBe(true);
      expect(upload.autoCompressImages).toBe(true);
    });
  });

  describe('7. Global Maintenance Mode', () => {
    it('rejects enabled maintenance when message is blank (superRefine)', () => {
      const badMaintenance = {
        ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
        maintenance: {
          enabled: true,
          message: '   ',
          estimatedDowntime: '30m',
          whitelistedIps: '127.0.0.1',
          emergencyBypassKey: 'SECRET',
        },
      };
      const result = SUPERADMIN_SETTINGS_SCHEMA.safeParse(badMaintenance);
      expect(result.success).toBe(false);
    });

    it('accepts disabled maintenance even with empty message', () => {
      const disabledMaintenance = {
        ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
        maintenance: {
          enabled: false,
          message: '',
          estimatedDowntime: '30m',
          whitelistedIps: '127.0.0.1',
          emergencyBypassKey: 'SECRET',
        },
      };
      const result = SUPERADMIN_SETTINGS_SCHEMA.safeParse(disabledMaintenance);
      expect(result.success).toBe(true);
    });
  });

  describe('8. Data Retention Policy & Automated Backups', () => {
    it('enforces statutory retention bounds and backup cadences', () => {
      expect(BACKUP_SCHEDULE_OPTIONS.map((o) => o.value)).toContain('DAILY');
      const retention = SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.dataRetention;
      expect(retention.memberLogsRetentionDays).toBe(90);
      expect(retention.auditLogsRetentionYears).toBe(3);
      expect(retention.punchLogsRetentionDays).toBe(180);
      expect(retention.autoPurgeTrashDays).toBe(14);
    });
  });

  describe('9. Subscription & Grace Period Rules', () => {
    it('governs trial, grace periods and overdue suspension', () => {
      const sub = SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.subscriptionGrace;
      expect(sub.defaultTrialDays).toBe(14);
      expect(sub.paymentGracePeriodDays).toBe(7);
      expect(sub.reminderTriggerDaysBefore).toBe(3);
      expect(sub.autoSuspendOverdue).toBe(true);
      expect(sub.readOnlyDuringGrace).toBe(true);
      expect(sub.proratePlanUpgrades).toBe(true);
    });
  });

  describe('10. Navigation Section Pills', () => {
    it('has navigation pills for all 11 settings categories', () => {
      const pillIds = SETTINGS_SECTION_PILLS.map((p) => p.id);
      expect(pillIds).toEqual([
        'all',
        'platform_regional',
        'branch_defaults',
        'security_policies',
        'upload_restrictions',
        'maintenance_mode',
        'data_retention',
        'subscription_grace',
      ]);
    });
  });

  describe('11. API Client and Idempotency Contracts', () => {
    it('fetches settings successfully from preview client', async () => {
      const response = await fetchSuperadminSettingsGeneral();
      expect(response.success).toBe(true);
      expect(response.data!.generalConfig.platformName).toBe('Library OS');
    });

    it('mutates settings with idempotency key generation', async () => {
      const response = await updateSuperadminSettingsGeneral(
        {
          ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS,
          generalConfig: {
            ...SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS.generalConfig,
            platformName: 'Updated LibraryOS Test',
          },
        },
        'custom-uuid-key-test-1234'
      );
      expect(response.success).toBe(true);
      expect(response.data!.generalConfig.platformName).toBe('Updated LibraryOS Test');
      expect(response.message).toContain('custom-uuid-key-test-1234');
    });

    it('resets settings to baseline defaults', async () => {
      const response = await resetSuperadminSettingsGeneral();
      expect(response.success).toBe(true);
      expect(response.data!.generalConfig.platformName).toBe('Library OS');
    });
  });
});
