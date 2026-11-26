// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/types/superadmin_data_archive_retention.types.ts
/**
 * @file superadmin_data_archive_retention.types.ts
 * @description Types for Data Archive Catalog, Retention Policies, and Legal Hold Contracts.
 */

import type {
  RETENTION_ENTITY_TYPES,
  RETENTION_ACTIONS,
  STORAGE_TIERS,
} from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/constants/superadmin_data_archive_retention.constants';

export type RetentionEntityType = keyof typeof RETENTION_ENTITY_TYPES;
export type RetentionAction = keyof typeof RETENTION_ACTIONS;
export type StorageTier = keyof typeof STORAGE_TIERS;

export interface RetentionRuleRecord {
  id: string;
  entityType: RetentionEntityType;
  description: string;
  retentionPeriodDays: number;
  postRetentionAction: RetentionAction;
  targetStorageTier: StorageTier;
  isEnabled: boolean;
  legalHoldCount: number;
  autoPurgeSchedule: string;
  lastRunAt: string | null;
  nextRunAt: string;
}

export interface ArchivedRecordItem {
  id: string;
  entityType: RetentionEntityType;
  tenantId: string;
  tenantName: string;
  recordIdentifier: string;
  summary: string;
  archivedAt: string;
  storageTier: StorageTier;
  isLegalHold: boolean;
  sizeBytes: number;
  originalCreatedAt: string;
  purgeScheduledAt: string | null;
}

export interface UpdateRetentionRulePayload {
  ruleId: string;
  retentionPeriodDays: number;
  postRetentionAction: RetentionAction;
  targetStorageTier: StorageTier;
  isEnabled: boolean;
}

export interface ArchiveRetentionOverview {
  totalArchivedRecords: number;
  totalColdStorageBytes: number;
  activeRetentionRulesCount: number;
  activeLegalHoldsCount: number;
}
