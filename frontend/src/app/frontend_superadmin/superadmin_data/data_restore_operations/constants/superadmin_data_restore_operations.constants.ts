// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/constants/superadmin_data_restore_operations.constants.ts
/**
 * @file superadmin_data_restore_operations.constants.ts
 * @description Constant definitions for Backup History, Point-in-time Restore,
 * Regular Sandbox Drills, and Multi-Tenant Isolation Enforcement.
 */

export const RESTORE_TARGET_TYPES = {
  FULL_PLATFORM: 'FULL_PLATFORM',
  SPECIFIC_TENANT: 'SPECIFIC_TENANT',
  SANDBOX_DRILL: 'SANDBOX_DRILL',
} as const;

export const BACKUP_VERIFICATION_STATUS = {
  VERIFIED: 'VERIFIED',
  TESTING: 'TESTING',
  FAILED: 'FAILED',
  UNTESTED: 'UNTESTED',
} as const;

export const RESTORE_STATUS = {
  IDLE: 'IDLE',
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export const RESTORE_TYPE_CONFIRM_KEY = 'CONFIRM-RESTORE' as const;

export const DRILL_STATUS = {
  PASSED: 'PASSED',
  RUNNING: 'RUNNING',
  FAILED: 'FAILED',
  SCHEDULED: 'SCHEDULED',
} as const;

export const SLA_TARGETS = {
  MAX_RTO_MINUTES: 30,
  TARGET_DRILL_FREQUENCY_DAYS: 7,
} as const;
