// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/schemas/superadmin_data_restore_operations.schemas.ts
/**
 * @file superadmin_data_restore_operations.schemas.ts
 * @description Zod validation schemas for Restore Operations, requiring explicit confirmation text.
 */

import { z } from 'zod';
import { RESTORE_TYPE_CONFIRM_KEY } from '../constants/superadmin_data_restore_operations.constants';

export const RestoreExecutionSchema = z.object({
  snapshotId: z.string().min(1, 'Snapshot ID is required'),
  targetType: z.enum(['FULL_PLATFORM', 'SPECIFIC_TENANT', 'SANDBOX_DRILL']),
  targetTenantId: z.string().optional().nullable(),
  reason: z.string().min(10, 'Reason must be at least 10 characters explaining disaster recovery necessity'),
  pointInTimeIso: z.string().optional().nullable(),
  confirmationText: z.literal(RESTORE_TYPE_CONFIRM_KEY, {
    errorMap: () => ({ message: `Must type "${RESTORE_TYPE_CONFIRM_KEY}" to authorize restore operation` }),
  }),
});

export const TriggerDrillSchema = z.object({
  snapshotId: z.string().min(1, 'Snapshot ID is required'),
  notes: z.string().default('Automated Weekly Disaster Recovery Sandbox Drill'),
});

export type RestoreExecutionFormData = z.infer<typeof RestoreExecutionSchema>;
export type TriggerDrillFormData = z.infer<typeof TriggerDrillSchema>;
