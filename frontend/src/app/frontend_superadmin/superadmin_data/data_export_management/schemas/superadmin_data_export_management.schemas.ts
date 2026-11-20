// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/schemas/superadmin_data_export_management.schemas.ts
/**
 * @file superadmin_data_export_management.schemas.ts
 * @description Zod validation schemas for Tenant & Branch Data Export Requests.
 */

import { z } from 'zod';

export const CreateExportSchema = z.object({
  scope: z.enum(['TENANT', 'BRANCH']),
  tenantId: z.string().min(1, 'Target tenant library must be selected'),
  branchId: z.string().optional().nullable(),
  format: z.enum(['ENCRYPTED_ZIP', 'JSON', 'CSV_ARCHIVE', 'SQL_DUMP']),
  entities: z.array(z.string()).min(1, 'At least one data entity must be selected for export'),
  encryptionPassword: z.string().optional().nullable(),
  reason: z.string().min(5, 'Audit reason is required for data export (min 5 characters)'),
}).refine(
  (data) => {
    if (data.scope === 'BRANCH') {
      return Boolean(data.branchId && data.branchId.length > 0);
    }
    return true;
  },
  {
    message: 'Branch must be selected when scope is set to Branch Export',
    path: ['branchId'],
  }
);

export type CreateExportFormData = z.infer<typeof CreateExportSchema>;
