// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/types/superadmin_data_import_migration.types.ts
/**
 * @file superadmin_data_import_migration.types.ts
 * @description Types for Import Management, Validation Results, and Batch History.
 */

import type {
  IMPORT_ENTITY_TYPES,
  DUPLICATE_STRATEGIES,
  BATCH_STATUS,
  VALIDATION_SEVERITY,
} from '../constants/superadmin_data_import_migration.constants';

export type ImportEntityType = keyof typeof IMPORT_ENTITY_TYPES;
export type DuplicateStrategy = keyof typeof DUPLICATE_STRATEGIES;
export type BatchStatus = keyof typeof BATCH_STATUS;
export type ValidationSeverity = keyof typeof VALIDATION_SEVERITY;

export interface ValidationIssue {
  rowNumber: number;
  field: string;
  message: string;
  severity: ValidationSeverity;
  duplicateIdentifier?: string | null;
}

export interface PreflightValidationResult {
  preflightId: string;
  fileName: string;
  fileSizeBytes: number;
  entityType: ImportEntityType;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  issues: ValidationIssue[];
  canProceed: boolean;
}

export interface ImportBatchRecord {
  id: string;
  batchNumber: string;
  tenantId: string;
  tenantName: string;
  entityType: ImportEntityType;
  originalFileName: string;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  duplicateRecords: number;
  status: BatchStatus;
  rollbackSnapshotId: string | null;
  errorCsvUrl: string | null;
  createdAt: string;
  completedAt: string | null;
  operatorId: string;
}

export interface PreflightValidatePayload {
  tenantId: string;
  entityType: ImportEntityType;
  duplicateStrategy: DuplicateStrategy;
  fileName: string;
  fileSizeBytes: number;
}

export interface CommitImportPayload {
  preflightId: string;
  tenantId: string;
  entityType: ImportEntityType;
  duplicateStrategy: DuplicateStrategy;
  takeRollbackSnapshot: boolean;
}

export interface ImportOverview {
  totalBatchesRun: number;
  totalRecordsIngested: number;
  lastMigrationAt: string | null;
  activeRollbackSnapshotsCount: number;
}
