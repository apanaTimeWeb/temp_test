// schemas/SuperadminUsageOverviewSchemas.ts
import { z } from 'zod';

export const QuotaSeveritySchema = z.enum(['NORMAL', 'WARNING_80', 'CRITICAL_90', 'EXCEEDED_100']);

export const ResourceMetricSchema = z.object({
  current: z.number().min(0),
  limit: z.number().min(0),
  unit: z.string(),
  status: QuotaSeveritySchema,
  details: z.string().optional(),
});

export const FileUploadMetricSchema = ResourceMetricSchema.extend({
  fileCount: z.number().min(0),
  fileCountLimit: z.number().min(0),
});

export const EmailUsageMetricSchema = ResourceMetricSchema.extend({
  sentCount: z.number().min(0),
  monthlyLimit: z.number().min(0),
  deliveryRatePercent: z.number().min(0).max(100),
  bounceRatePercent: z.number().min(0).max(100),
});

export const ApiUsageMetricSchema = ResourceMetricSchema.extend({
  dailyCalls: z.number().min(0),
  monthlyCalls: z.number().min(0),
  monthlyLimit: z.number().min(0),
  rateLimitPerMinute: z.number().min(0),
});

export const ExportUsageMetricSchema = ResourceMetricSchema.extend({
  monthlyExportsCount: z.number().min(0),
  monthlyExportsLimit: z.number().min(0),
  dataExportedMb: z.number().min(0),
  lastExportAt: z.string().optional(),
});

export const BackupUsageMetricSchema = ResourceMetricSchema.extend({
  backupSizeGb: z.number().min(0),
  backupSizeLimitGb: z.number().min(0),
  snapshotCount: z.number().min(0),
  lastBackupAt: z.string(),
  backupStatus: z.enum(['HEALTHY', 'WARNING', 'FAILED']),
});

export const OveragePolicySchema = z.enum(['HARD_STOP', 'UPGRADE_REQUIRED', 'ADDON_ACTIVE']);

export const LibraryUsageRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  planName: z.string().min(1),
  planId: z.string().min(1),
  branchUsage: ResourceMetricSchema,
  adminUsage: ResourceMetricSchema,
  staffUsage: ResourceMetricSchema,
  memberUsage: ResourceMetricSchema,
  storageUsage: ResourceMetricSchema,
  fileUploadUsage: FileUploadMetricSchema,
  smsUsage: ResourceMetricSchema,
  whatsappUsage: ResourceMetricSchema,
  emailUsage: EmailUsageMetricSchema,
  apiUsage: ApiUsageMetricSchema,
  exportUsage: ExportUsageMetricSchema,
  backupUsage: BackupUsageMetricSchema,
  overagePolicy: OveragePolicySchema,
  hasPendingRequest: z.boolean(),
  pendingRequestNote: z.string().optional(),
});

export const UsageOverviewFiltersSchema = z.object({
  search: z.string().default(''),
  planTier: z.string().default('ALL'),
  severity: z.string().default('ALL'),
  categoryTab: z.enum(['all', 'branches', 'storage', 'communication', 'system']).default('all'),
});
