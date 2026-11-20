// schemas/superadmin_data_overview.schemas.ts
// Zod runtime validation schemas for Superadmin Data Overview

import { z } from 'zod';

export const SuperadminDataOverviewMetricsSchema = z.object({
  platformDrScore: z.number().min(0).max(100),
  activeSchedulesCount: z.number().nonnegative(),
  totalSnapshotsCount: z.number().nonnegative(),
  totalStorageUsedGb: z.number().nonnegative(),
  storageQuotaGb: z.number().positive(),
  lastBackupTimestamp: z.string(),
  lastRestoreDrillTimestamp: z.string(),
  replicationHealth: z.enum(['OPTIMAL', 'DEGRADED', 'FAILED']),
  tenantIsolationIntegrity: z.enum(['VERIFIED_100_PERCENT', 'ATTENTION_REQUIRED']),
});

export const SuperadminDataOverviewRpoRtoSchema = z.object({
  targetRpoMinutes: z.number().positive(),
  currentRpoMinutes: z.number().nonnegative(),
  rpoStatus: z.enum(['COMPLIANT', 'BREACHED']),
  targetRtoMinutes: z.number().positive(),
  testedRtoMinutes: z.number().nonnegative(),
  rtoStatus: z.enum(['COMPLIANT', 'BREACHED']),
  lastDrillPassRate: z.number().min(0).max(100),
  nextScheduledDrill: z.string(),
});

export const SuperadminDataQuickBackupPayloadSchema = z.object({
  snapshotName: z.string().min(3).max(64),
  backupType: z.enum(['FULL_PLATFORM', 'TENANT_DATABASE_ONLY', 'BLOB_STORAGE_ONLY']),
  encryptionMode: z.literal('AES_256_GCM'),
  dualRegionSync: z.boolean(),
  reason: z.string().min(5).max(255),
});

export type SuperadminDataQuickBackupPayload = z.infer<typeof SuperadminDataQuickBackupPayloadSchema>;
