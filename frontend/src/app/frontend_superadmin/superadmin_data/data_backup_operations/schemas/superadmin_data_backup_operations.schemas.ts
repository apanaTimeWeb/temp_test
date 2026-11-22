// schemas/superadmin_data_backup_operations.schemas.ts
// Zod runtime validation schemas for Superadmin Data Backup Operations

import { z } from 'zod';

export const SuperadminBackupScheduleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(64),
  frequency: z.enum(['HOURLY_WAL', 'DAILY', 'TWICE_DAILY', 'WEEKLY']),
  cronExpression: z.string().min(5, 'Invalid cron expression'),
  scope: z.enum(['FULL_PLATFORM', 'TENANT_DATABASES', 'BINARY_BLOBS']),
  storageTarget: z.enum(['DUAL_REGION', 'PRIMARY_ONLY', 'GLACIER_ARCHIVE']),
  retentionDays: z.number().min(1, 'Retention must be at least 1 day').max(3650),
  encryptionStandard: z.enum(['AES_256_GCM', 'CHACHA20']),
  isActive: z.boolean(),
});

export type SuperadminBackupScheduleFormValues = z.infer<typeof SuperadminBackupScheduleSchema>;

export const SuperadminFullPlatformBackupRequestSchema = z.object({
  snapshotLabel: z.string().min(3, 'Label must be at least 3 characters').max(64),
  scope: z.enum(['FULL_PLATFORM', 'TENANT_DATABASES', 'BINARY_BLOBS']),
  dualCloudSync: z.boolean(),
  includeAuditLogs: z.boolean(),
  reason: z.string().min(5, 'Audit memo must be at least 5 characters').max(255),
});

export type SuperadminFullPlatformBackupFormValues = z.infer<typeof SuperadminFullPlatformBackupRequestSchema>;
