// RESPONSIBILITY: Define local sample fixtures for settings general; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_general/mocks/fixtures/SuperadminSettingsGeneralPreviewDefaults.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';

/** Illustrative local form defaults for all 11 Global Settings categories. */
export const SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS: SuperadminSettingsFormValues = {
  generalConfig: {
    platformName: 'Library OS',
    platformLogoUrl: '/images/library-os-logo.svg',
    faviconUrl: '/favicon.ico',
    supportEmail: 'support@example.invalid',
    supportPhone: '+91 98765 43210',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata',
    defaultLanguage: 'en',
  },
  branchDefaults: {
    defaultMemberCapacity: 500,
    openingTime: '06:00',
    closingTime: '23:00',
    slotDurationMinutes: 120,
    checkInGraceMinutes: 15,
    autoApproveMembers: true,
    weekendSchedule: 'REGULAR',
  },
  securityPolicy: {
    minPasswordLength: 10,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    mfaEnforcement: 'SUPERADMIN_ONLY',
    sessionTimeoutMinutes: 30,
    maxFailedLogins: 5,
  },
  notificationTemplates: {
    welcomeEmailSubject: 'Welcome to {libraryName} on LibraryOS',
    welcomeEmailBody: 'Dear {memberName},\nWelcome to {libraryName} ({branchName}). Your member portal account has been provisioned.\nLogin URL: {loginUrl}',
    passwordResetBody: 'Hello {memberName},\nUse this secure link to reset your password. It expires in 15 minutes.\nReset Link: {resetUrl}',
    dueReminderBody: 'Hi {memberName}, your plan at {libraryName} expires on {expiryDate}. Amount due: {amountDue}. Please renew on time.',
    announcementBody: 'Important notice for all patrons of {libraryName}: {announcementText}',
    activeTemplate: 'WELCOME',
  },
  uploadRestrictions: {
    allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.xlsx'],
    maxFileSizeMb: 10,
    branchStorageQuotaGb: 25,
    virusScanningEnabled: true,
    autoCompressImages: true,
  },
  maintenance: {
    enabled: false,
    message: 'Example maintenance message for preview only.',
    estimatedDowntime: '30 Minutes',
    whitelistedIps: '103.24.120.0/24, 182.74.88.10/32',
    emergencyBypassKey: 'SYS-OVERRIDE-SECRET-2026',
  },
  dataRetention: {
    memberLogsRetentionDays: 90,
    auditLogsRetentionYears: 3,
    punchLogsRetentionDays: 180,
    autoBackupSchedule: 'DAILY',
    autoPurgeTrashDays: 14,
  },
  subscriptionGrace: {
    defaultTrialDays: 14,
    paymentGracePeriodDays: 7,
    reminderTriggerDaysBefore: 3,
    autoSuspendOverdue: true,
    readOnlyDuringGrace: true,
    proratePlanUpgrades: true,
  },
  apiConfig: {
    emailProvider: 'AWS SES',
    smsProvider: 'Twilio',
  },
};
