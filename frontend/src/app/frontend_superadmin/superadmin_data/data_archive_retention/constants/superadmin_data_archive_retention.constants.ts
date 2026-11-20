// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/constants/superadmin_data_archive_retention.constants.ts
/**
 * @file superadmin_data_archive_retention.constants.ts
 * @description Constants for Data Retention Policies, Cold Storage Tiers, and Auto-Purge Rules.
 */

export const RETENTION_ENTITY_TYPES = {
  CLOSED_PATRONS: 'CLOSED_PATRONS',
  EXPIRED_CIRCULATION_LOGS: 'EXPIRED_CIRCULATION_LOGS',
  INACTIVE_FINANCIAL_INVOICES: 'INACTIVE_FINANCIAL_INVOICES',
  SECURITY_AUDIT_TRAILS: 'SECURITY_AUDIT_TRAILS',
  WEEDED_BOOK_CATALOGS: 'WEEDED_BOOK_CATALOGS',
} as const;

export const RETENTION_ACTIONS = {
  ARCHIVE_TO_COLD_STORAGE: 'ARCHIVE_TO_COLD_STORAGE',
  HARD_PURGE: 'HARD_PURGE',
  LEGAL_HOLD: 'LEGAL_HOLD',
} as const;

export const STORAGE_TIERS = {
  HOT_POSTGRES: 'HOT_POSTGRES',
  WARM_S3_STANDARD: 'WARM_S3_STANDARD',
  COLD_GLACIER_VAULT: 'COLD_GLACIER_VAULT',
} as const;

export const RETENTION_SCHEDULE_INTERVALS = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
} as const;
