// types/superadmin_data_backup_operations.types.ts
// Canonical TypeScript interfaces for Superadmin Data Backup Operations

export interface SuperadminBackupSchedule {
  id: string;
  name: string;
  frequency: 'HOURLY_WAL' | 'DAILY' | 'TWICE_DAILY' | 'WEEKLY';
  cronExpression: string;
  scope: 'FULL_PLATFORM' | 'TENANT_DATABASES' | 'BINARY_BLOBS';
  storageTarget: 'DUAL_REGION' | 'PRIMARY_ONLY' | 'GLACIER_ARCHIVE';
  retentionDays: number;
  encryptionStandard: 'AES_256_GCM' | 'CHACHA20';
  isActive: boolean;
  lastRunTimestamp?: string;
  lastRunStatus?: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  nextRunTimestamp: string;
}

export interface SuperadminFullPlatformBackupRequest {
  snapshotLabel: string;
  scope: 'FULL_PLATFORM' | 'TENANT_DATABASES' | 'BINARY_BLOBS';
  dualCloudSync: boolean;
  includeAuditLogs: boolean;
  reason: string;
}
