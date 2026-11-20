// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/mocks/fixtures/superadmin_data_import_migration.fixtures.ts
/**
 * @file superadmin_data_import_migration.fixtures.ts
 * @description Standard fixtures for Data Import, Pre-flight Validation, and Migration History.
 */

import type {
  ImportBatchRecord,
  PreflightValidationResult,
  ImportOverview,
} from '../../types/superadmin_data_import_migration.types';

export const MOCK_IMPORT_OVERVIEW: ImportOverview = {
  totalBatchesRun: 38,
  totalRecordsIngested: 894210,
  lastMigrationAt: '2026-11-20T16:30:00.000Z',
  activeRollbackSnapshotsCount: 12,
};

export const MOCK_PREFLIGHT_RESULT: PreflightValidationResult = {
  preflightId: 'pfl-2026-991',
  fileName: 'delhi_central_legacy_patrons.xlsx',
  fileSizeBytes: 2451920, // ~2.3 MB
  entityType: 'PATRONS',
  totalRows: 1250,
  validRows: 1226,
  invalidRows: 16,
  duplicateRows: 8,
  issues: [
    {
      rowNumber: 14,
      field: 'phone_number',
      message: 'Invalid Indian phone format (+91 format expected)',
      severity: 'ERROR',
    },
    {
      rowNumber: 29,
      field: 'membership_code',
      message: 'Duplicate barcode: already exists for active patron PAT-1049',
      severity: 'DUPLICATE',
      duplicateIdentifier: 'PAT-1049',
    },
    {
      rowNumber: 88,
      field: 'email',
      message: 'Missing top-level domain in email address',
      severity: 'ERROR',
    },
    {
      rowNumber: 112,
      field: 'dob',
      message: 'Birthdate indicates age under 5 without guardian link',
      severity: 'WARNING',
    },
  ],
  canProceed: true,
};

export const MOCK_IMPORT_BATCHES: ImportBatchRecord[] = [
  {
    id: 'batch-001',
    batchNumber: 'MIG-2026-11-20-001',
    tenantId: 'tnt-delhi-central',
    tenantName: 'Delhi Central Library',
    entityType: 'BOOKS_CATALOG',
    originalFileName: 'koha_catalog_export_final.mrc',
    totalRecords: 14500,
    importedRecords: 14482,
    failedRecords: 18,
    duplicateRecords: 12,
    status: 'COMPLETED',
    rollbackSnapshotId: 'snp-rollback-001',
    errorCsvUrl: '/api/v1/superadmin/data/imports/batches/batch-001/errors.csv',
    createdAt: '2026-11-20T14:00:00.000Z',
    completedAt: '2026-11-20T14:12:00.000Z',
    operatorId: 'superadmin@institution.edu',
  },
  {
    id: 'batch-002',
    batchNumber: 'MIG-2026-11-19-002',
    tenantId: 'tnt-mumbai-suburb',
    tenantName: 'Mumbai Metro Library Network',
    entityType: 'PATRONS',
    originalFileName: 'mumbai_active_students_nov.xlsx',
    totalRecords: 4800,
    importedRecords: 4800,
    failedRecords: 0,
    duplicateRecords: 0,
    status: 'COMPLETED',
    rollbackSnapshotId: 'snp-rollback-002',
    errorCsvUrl: null,
    createdAt: '2026-11-19T09:30:00.000Z',
    completedAt: '2026-11-19T09:34:00.000Z',
    operatorId: 'migration.lead@institution.edu',
  },
  {
    id: 'batch-003',
    batchNumber: 'MIG-2026-11-18-003',
    tenantId: 'tnt-bangalore-tech',
    tenantName: 'Bengaluru Digital Learning Vault',
    entityType: 'CIRCULATION_HISTORY',
    originalFileName: 'legacy_loan_transactions_2025.csv',
    totalRecords: 22000,
    importedRecords: 19800,
    failedRecords: 2200,
    duplicateRecords: 140,
    status: 'ROLLED_BACK',
    rollbackSnapshotId: 'snp-rollback-003',
    errorCsvUrl: '/api/v1/superadmin/data/imports/batches/batch-003/errors.csv',
    createdAt: '2026-11-18T16:00:00.000Z',
    completedAt: '2026-11-18T16:25:00.000Z',
    operatorId: 'superadmin@institution.edu',
  },
];
