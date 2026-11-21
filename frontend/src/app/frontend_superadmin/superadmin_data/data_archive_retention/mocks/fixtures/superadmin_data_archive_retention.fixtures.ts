// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/mocks/fixtures/superadmin_data_archive_retention.fixtures.ts
/**
 * @file superadmin_data_archive_retention.fixtures.ts
 * @description Standard fixtures for Retention Rules (Feature 8) and Data Archive Catalog (Feature 7).
 */

import type {
  RetentionRuleRecord,
  ArchivedRecordItem,
  ArchiveRetentionOverview,
} from '../../types/superadmin_data_archive_retention.types';

export const MOCK_ARCHIVE_OVERVIEW: ArchiveRetentionOverview = {
  totalArchivedRecords: 412890,
  totalColdStorageBytes: 137438953472, // 128 GB
  activeRetentionRulesCount: 5,
  activeLegalHoldsCount: 3,
};

export const MOCK_RETENTION_RULES: RetentionRuleRecord[] = [
  {
    id: 'rule-001',
    entityType: 'CLOSED_PATRONS',
    description: 'Purge or cold-archive inactive patron accounts closed > 3 years',
    retentionPeriodDays: 1095, // 3 years
    postRetentionAction: 'ARCHIVE_TO_COLD_STORAGE',
    targetStorageTier: 'COLD_GLACIER_VAULT',
    isEnabled: true,
    legalHoldCount: 2,
    autoPurgeSchedule: 'Monthly on 1st at 02:00 UTC',
    lastRunAt: '2026-11-01T02:00:00.000Z',
    nextRunAt: '2026-12-01T02:00:00.000Z',
  },
  {
    id: 'rule-002',
    entityType: 'EXPIRED_CIRCULATION_LOGS',
    description: 'Retain checkout transactions for 7 years per statutory compliance',
    retentionPeriodDays: 2555, // 7 years
    postRetentionAction: 'ARCHIVE_TO_COLD_STORAGE',
    targetStorageTier: 'WARM_S3_STANDARD',
    isEnabled: true,
    legalHoldCount: 1,
    autoPurgeSchedule: 'Weekly on Sunday at 01:00 UTC',
    lastRunAt: '2026-11-15T01:00:00.000Z',
    nextRunAt: '2026-11-22T01:00:00.000Z',
  },
  {
    id: 'rule-003',
    entityType: 'SECURITY_AUDIT_TRAILS',
    description: 'Hard purge access audit logs older than 365 days',
    retentionPeriodDays: 365,
    postRetentionAction: 'HARD_PURGE',
    targetStorageTier: 'HOT_POSTGRES',
    isEnabled: true,
    legalHoldCount: 0,
    autoPurgeSchedule: 'Daily at 03:00 UTC',
    lastRunAt: '2026-11-20T03:00:00.000Z',
    nextRunAt: '2026-11-21T03:00:00.000Z',
  },
  {
    id: 'rule-004',
    entityType: 'INACTIVE_FINANCIAL_INVOICES',
    description: 'Retain settled invoices and fine receipts for 5 years',
    retentionPeriodDays: 1825,
    postRetentionAction: 'ARCHIVE_TO_COLD_STORAGE',
    targetStorageTier: 'COLD_GLACIER_VAULT',
    isEnabled: true,
    legalHoldCount: 0,
    autoPurgeSchedule: 'Monthly on 15th at 04:00 UTC',
    lastRunAt: '2026-11-15T04:00:00.000Z',
    nextRunAt: '2026-12-15T04:00:00.000Z',
  },
];

export const MOCK_ARCHIVED_RECORDS: ArchivedRecordItem[] = [
  {
    id: 'arc-001',
    entityType: 'CLOSED_PATRONS',
    tenantId: 'tnt-delhi-central',
    tenantName: 'Delhi Central Library',
    recordIdentifier: 'PAT-ARCH-2022-0941',
    summary: 'Patron account closed due to graduation (Batch 2022)',
    archivedAt: '2025-10-14T08:00:00.000Z',
    storageTier: 'COLD_GLACIER_VAULT',
    isLegalHold: true,
    sizeBytes: 14500,
    originalCreatedAt: '2019-07-10T10:00:00.000Z',
    purgeScheduledAt: null, // Exempt due to legal hold
  },
  {
    id: 'arc-002',
    entityType: 'EXPIRED_CIRCULATION_LOGS',
    tenantId: 'tnt-delhi-central',
    tenantName: 'Delhi Central Library',
    recordIdentifier: 'TXN-CIRC-2018-88120',
    summary: 'Circulation checkout bundle for Academic Year 2018-19',
    archivedAt: '2026-04-01T12:00:00.000Z',
    storageTier: 'WARM_S3_STANDARD',
    isLegalHold: false,
    sizeBytes: 894000,
    originalCreatedAt: '2018-09-01T14:30:00.000Z',
    purgeScheduledAt: '2028-09-01T00:00:00.000Z',
  },
  {
    id: 'arc-003',
    entityType: 'ARCHIVED_SEAT_LOGS',
    tenantId: 'tnt-mumbai-suburb',
    tenantName: 'Mumbai Metro Library Network',
    recordIdentifier: 'CAT-WEED-2023-412',
    summary: 'Damaged and lost catalog titles weeded from circulation',
    archivedAt: '2026-01-10T16:20:00.000Z',
    storageTier: 'COLD_GLACIER_VAULT',
    isLegalHold: false,
    sizeBytes: 120500,
    originalCreatedAt: '2015-03-20T11:00:00.000Z',
    purgeScheduledAt: '2029-01-10T00:00:00.000Z',
  },
];
