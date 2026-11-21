// FLOW: Feature form/API boundary -> superadmin_settings/settings_general/schemas/SuperadminSettingsGeneralSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Settings Schema; defines runtime validation for all 11 Global Settings categories. */
import { z } from 'zod';

export const SUPERADMIN_SETTINGS_SCHEMA = z.object({
  generalConfig: z.object({
    platformName: z.string({ message: "SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" })
      .trim().min(1, "SUPERADMIN_SETTINGS.VALIDATION.PLATFORM_NAME_IS_REQUIRED").max(80, "SUPERADMIN_SETTINGS.VALIDATION.PLATFORM_NAME_MUST_BE_80_CHARACTERS_OR_FEWER"),
    platformLogoUrl: z.string().trim().max(500).default(''),
    faviconUrl: z.string().trim().max(500).default(''),
    supportEmail: z.string({ message: "SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" })
      .trim().email("SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_SUPPORT_EMAIL").max(254, "SUPERADMIN_SETTINGS.VALIDATION.SUPPORT_EMAIL_MUST_BE_254_CHARACTERS_OR_FEWER"),
    supportPhone: z.string().trim().max(30).default('+91 98765 43210'),
    currency: z.enum(['INR (₹)', 'USD ($)', 'AED (د.إ)', 'EUR (€)', 'GBP (£)'], { message: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
    timezone: z.enum(['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai'], { message: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
    defaultLanguage: z.enum(['en', 'hi', 'fr', 'es', 'de', 'ar', 'nl']).default('en'),
  }, { message: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" }),

  branchDefaults: z.object({
    defaultMemberCapacity: z.number().int().min(10).max(50000).default(500),
    openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Enter a valid 24h time (HH:MM)").default('06:00'),
    closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Enter a valid 24h time (HH:MM)").default('23:00'),
    slotDurationMinutes: z.number().int().min(30).max(1440).default(120),
    checkInGraceMinutes: z.number().int().min(0).max(120).default(15),
    autoApproveMembers: z.boolean().default(true),
    weekendSchedule: z.enum(['REGULAR', 'HALF_DAY', 'CLOSED']).default('REGULAR'),
  }).default({
    defaultMemberCapacity: 500,
    openingTime: '06:00',
    closingTime: '23:00',
    slotDurationMinutes: 120,
    checkInGraceMinutes: 15,
    autoApproveMembers: true,
    weekendSchedule: 'REGULAR',
  }),

  securityPolicy: z.object({
    minPasswordLength: z.number().int().min(8).max(32).default(10),
    requireUppercase: z.boolean().default(true),
    requireNumbers: z.boolean().default(true),
    requireSpecialChars: z.boolean().default(true),
    passwordExpiryDays: z.number().int().min(0).max(365).default(90),
    mfaEnforcement: z.enum(['DISABLED', 'OPTIONAL', 'SUPERADMIN_ONLY', 'ALL_ADMINS']).default('SUPERADMIN_ONLY'),
    sessionTimeoutMinutes: z.number().int().min(5).max(480).default(30),
    maxFailedLogins: z.number().int().min(3).max(20).default(5),
  }).default({
    minPasswordLength: 10,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    mfaEnforcement: 'SUPERADMIN_ONLY',
    sessionTimeoutMinutes: 30,
    maxFailedLogins: 5,
  }),

  uploadRestrictions: z.object({
    allowedExtensions: z.array(z.string()).default(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.xlsx']),
    maxFileSizeMb: z.number().int().min(1).max(100).default(10),
    branchStorageQuotaGb: z.number().int().min(1).max(500).default(25),
    virusScanningEnabled: z.boolean().default(true),
    autoCompressImages: z.boolean().default(true),
  }).default({
    allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.xlsx'],
    maxFileSizeMb: 10,
    branchStorageQuotaGb: 25,
    virusScanningEnabled: true,
    autoCompressImages: true,
  }),

  maintenance: z.object({
    enabled: z.boolean({ message: "SUPERADMIN_SETTINGS.VALIDATION.CHOOSE_A_VALID_BOOLEAN_VALUE" }),
    message: z.string({ message: "SUPERADMIN_SETTINGS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" })
      .trim().max(500, "SUPERADMIN_SETTINGS.VALIDATION.MAINTENANCE_MESSAGE_MUST_BE_500_CHARACTERS_OR_FEWER"),
    estimatedDowntime: z.string().trim().max(100).default('30 Minutes'),
    whitelistedIps: z.string().trim().max(500).default('103.24.120.0/24, 182.74.88.10/32'),
    emergencyBypassKey: z.string().trim().max(100).default('SYS-OVERRIDE-SECRET-2026'),
  }, { message: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" }).superRefine((maintenance, context) => {
    if (maintenance.enabled && !maintenance.message.trim()) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ['message'], message: "SUPERADMIN_SETTINGS.VALIDATION.MAINTENANCE_MESSAGE_IS_REQUIRED" });
    }
  }),

  dataRetention: z.object({
    memberLogsRetentionDays: z.number().int().min(7).max(3650).default(90),
    auditLogsRetentionYears: z.number().int().min(1).max(10).default(3),
    punchLogsRetentionDays: z.number().int().min(30).max(1825).default(180),
    autoBackupSchedule: z.enum(['HOURLY', 'DAILY', 'WEEKLY']).default('DAILY'),
    autoPurgeTrashDays: z.number().int().min(1).max(90).default(14),
  }).default({
    memberLogsRetentionDays: 90,
    auditLogsRetentionYears: 3,
    punchLogsRetentionDays: 180,
    autoBackupSchedule: 'DAILY',
    autoPurgeTrashDays: 14,
  }),

  subscriptionGrace: z.object({
    defaultTrialDays: z.number().int().min(0).max(90).default(14),
    paymentGracePeriodDays: z.number().int().min(0).max(60).default(7),
    reminderTriggerDaysBefore: z.number().int().min(1).max(30).default(3),
    autoSuspendOverdue: z.boolean().default(true),
    readOnlyDuringGrace: z.boolean().default(true),
    proratePlanUpgrades: z.boolean().default(true),
  }).default({
    defaultTrialDays: 14,
    paymentGracePeriodDays: 7,
    reminderTriggerDaysBefore: 3,
    autoSuspendOverdue: true,
    readOnlyDuringGrace: true,
    proratePlanUpgrades: true,
  }),

  apiConfig: z.object({
    emailProvider: z.enum(['AWS SES', 'SendGrid', 'SMTP Custom'], { message: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
    smsProvider: z.enum(['Twilio', 'Fast2SMS', 'Msg91'], { message: "SUPERADMIN_SETTINGS.VALIDATION.SELECT_A_VALID_OPTION" }),
  }, { message: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" }),
}, { message: "SUPERADMIN_SETTINGS.VALIDATION.PROVIDE_VALID_FORM_DATA" });

export type SuperadminSettingsSchemaType = z.infer<typeof SUPERADMIN_SETTINGS_SCHEMA>;
