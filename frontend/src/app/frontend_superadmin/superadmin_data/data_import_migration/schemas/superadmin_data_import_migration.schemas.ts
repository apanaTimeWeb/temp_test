// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/schemas/superadmin_data_import_migration.schemas.ts
/**
 * @file superadmin_data_import_migration.schemas.ts
 * @description Zod validation schemas for Migration Pre-flight Validation & Commit.
 */

import { z } from 'zod';

export const PreflightValidateSchema = z.object({
  tenantId: z.string().min(1, 'Target library tenant must be selected'),
  entityType: z.enum(['BOOKS_CATALOG', 'PATRONS', 'CIRCULATION_HISTORY', 'FINES_FEES']),
  duplicateStrategy: z.enum(['SKIP', 'OVERWRITE', 'ERROR']),
  fileName: z.string().min(1, 'A migration file must be uploaded'),
  fileSizeBytes: z.number().positive('File size must be greater than zero'),
});

export const CommitImportSchema = z.object({
  preflightId: z.string().min(1, 'Preflight ID is required'),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  entityType: z.enum(['BOOKS_CATALOG', 'PATRONS', 'CIRCULATION_HISTORY', 'FINES_FEES']),
  duplicateStrategy: z.enum(['SKIP', 'OVERWRITE', 'ERROR']),
  takeRollbackSnapshot: z.boolean().default(true),
});

export type PreflightValidateFormData = z.infer<typeof PreflightValidateSchema>;
export type CommitImportFormData = z.infer<typeof CommitImportSchema>;
