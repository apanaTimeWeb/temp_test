// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/types/superadmin_data_restore_operations.types.ts
/**
 * @file superadmin_data_restore_operations.types.ts
 * @description Types for Backup History, Restore Verification, Sandbox Drills, and Isolated Restores.
 */

import type {
  RESTORE_TARGET_TYPES,
  BACKUP_VERIFICATION_STATUS,
  RESTORE_STATUS,
  DRILL_STATUS,
} from '@/app/frontend_superadmin/superadmin_data/data_restore_operations/constants/superadmin_data_restore_operations.constants';

export type RestoreTargetType = keyof typeof RESTORE_TARGET_TYPES;
export type BackupVerificationStatus = keyof typeof BACKUP_VERIFICATION_STATUS;
export type RestoreStatus = keyof typeof RESTORE_STATUS;
export type DrillStatus = keyof typeof DRILL_STATUS;

export interface BackupSnapshotRecord {
  id: string;
  snapshotNumber: string;
  scope: 'FULL' | 'INCREMENTAL' | 'TENANT_ISOLATED';
  tenantId: string | null;
  tenantName: string | null;
  createdAt: string;
  sizeBytes: number;
  sha256Checksum: string;
  encryptionAlgorithm: 'AES-GCM-256' | 'CHACHA20-POLY1305';
  storageLocation: string;
  verificationStatus: BackupVerificationStatus;
  lastDrillAt: string | null;
  retentionExpiresAt: string;
  metadata: {
    totalRecords: number;
    databaseVersion: string;
    schemaMigrationVersion: string;
  };
}

export interface RestoreDrillRecord {
  id: string;
  snapshotId: string;
  snapshotNumber: string;
  executedAt: string;
  durationSeconds: number;
  status: DrillStatus;
  simulatedRtoMinutes: number;
  checksumMatch: boolean;
  tenantIsolationPass: boolean;
  notes: string;
  operatorId: string;
}

export interface RestoreExecutionRequest {
  snapshotId: string;
  targetType: RestoreTargetType;
  targetTenantId?: string | null;
  confirmationText: string;
  pointInTimeIso?: string | null;
  reason: string;
}

export interface RestoreExecutionResponse {
  restoreJobId: string;
  snapshotId: string;
  status: RestoreStatus;
  startedAt: string;
  estimatedCompletionAt: string;
  sandboxIsolationVerified: boolean;
  auditLogId: string;
}

export interface RestoreOperationsOverview {
  totalSnapshots: number;
  verifiedSnapshots: number;
  lastDrillResult: {
    status: DrillStatus;
    simulatedRtoMinutes: number;
    executedAt: string;
  };
  tenantIsolationGuarantee: boolean;
}
