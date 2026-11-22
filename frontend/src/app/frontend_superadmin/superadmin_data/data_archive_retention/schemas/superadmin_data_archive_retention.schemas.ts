// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/schemas/superadmin_data_archive_retention.schemas.ts
/**
 * @file superadmin_data_archive_retention.schemas.ts
 * @description Zod validation schemas for Data Retention Policies and Legal Holds.
 */

import { z } from 'zod';

export const UpdateRetentionRuleSchema = z.object({
  ruleId: z.string().min(1, 'Rule ID is required'),
  retentionPeriodDays: z.number().int().min(30, 'Retention period must be at least 30 days').max(3650, 'Retention cannot exceed 10 years (3650 days)'),
  postRetentionAction: z.enum(['ARCHIVE_TO_COLD_STORAGE', 'HARD_PURGE', 'LEGAL_HOLD']),
  targetStorageTier: z.enum(['HOT_POSTGRES', 'WARM_S3_STANDARD', 'COLD_GLACIER_VAULT']),
  isEnabled: z.boolean(),
});

export const LegalHoldToggleSchema = z.object({
  recordId: z.string().min(1, 'Record ID is required'),
  reason: z.string().min(5, 'Legal justification reason is required (min 5 characters)'),
});

export type UpdateRetentionRuleFormData = z.infer<typeof UpdateRetentionRuleSchema>;
export type LegalHoldToggleFormData = z.infer<typeof LegalHoldToggleSchema>;
