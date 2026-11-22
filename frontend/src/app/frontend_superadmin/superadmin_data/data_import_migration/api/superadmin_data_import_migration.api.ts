// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/api/superadmin_data_import_migration.api.ts
/**
 * @file superadmin_data_import_migration.api.ts
 * @description API client for Data Import, Pre-flight Dry-Run Validation, and Batch Management.
 */

import { apiFetch } from '@/lib/api';
import { IMPORT_MIGRATION_URLS } from '../config/superadmin_data_import_migration.url_config';
import type {
  ImportOverview,
  ImportBatchRecord,
  PreflightValidationResult,
  PreflightValidatePayload,
  CommitImportPayload,
} from '../types/superadmin_data_import_migration.types';
import {
  MOCK_IMPORT_OVERVIEW,
  MOCK_IMPORT_BATCHES,
  MOCK_PREFLIGHT_RESULT,
} from '../mocks/fixtures/superadmin_data_import_migration.fixtures';

const IS_MOCK_ENV = process.env.NODE_ENV !== 'production';

export async function fetchImportOverview(): Promise<ImportOverview> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_IMPORT_OVERVIEW);
  const res = await apiFetch<ImportOverview>(IMPORT_MIGRATION_URLS.OVERVIEW);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function fetchImportBatches(filters?: {
  status?: string;
  tenantId?: string;
}): Promise<ImportBatchRecord[]> {
  if (IS_MOCK_ENV) {
    let result = [...MOCK_IMPORT_BATCHES];
    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters?.tenantId && filters.tenantId !== 'ALL') {
      result = result.filter((b) => b.tenantId === filters.tenantId);
    }
    return Promise.resolve(result);
  }
  const searchParams = new URLSearchParams();
  if (filters?.status) searchParams.set('status', filters.status);
  if (filters?.tenantId) searchParams.set('tenantId', filters.tenantId);
  const qs = searchParams.toString();
  const endpoint = `${IMPORT_MIGRATION_URLS.BATCHES_LIST}${qs ? `?${qs}` : ''}`;

  const res = await apiFetch<ImportBatchRecord[]>(endpoint);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function runPreflightValidation(
  payload: PreflightValidatePayload
): Promise<PreflightValidationResult> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-pfl-' + Date.now();
  if (IS_MOCK_ENV) {
    return Promise.resolve({
      ...MOCK_PREFLIGHT_RESULT,
      preflightId: 'pfl-' + Date.now(),
      fileName: payload.fileName,
      fileSizeBytes: payload.fileSizeBytes,
      entityType: payload.entityType,
    });
  }

  const res = await apiFetch<PreflightValidationResult>(IMPORT_MIGRATION_URLS.VALIDATE_PREFLIGHT, {
    method: 'POST',
    idempotencyKey,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function commitImportBatch(
  payload: CommitImportPayload
): Promise<ImportBatchRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-cmt-' + Date.now();
  if (IS_MOCK_ENV) {
    const newBatch: ImportBatchRecord = {
      id: 'batch-' + Date.now(),
      batchNumber: 'MIG-' + new Date().toISOString().slice(0, 10) + '-' + Math.floor(100 + Math.random() * 900),
      tenantId: payload.tenantId,
      tenantName: 'Target Library Tenant',
      entityType: payload.entityType,
      originalFileName: 'committed_import_dataset.xlsx',
      totalRecords: 1250,
      importedRecords: 1226,
      failedRecords: 16,
      duplicateRecords: 8,
      status: 'COMPLETED',
      rollbackSnapshotId: payload.takeRollbackSnapshot ? 'snp-rb-' + Date.now() : null,
      errorCsvUrl: '/api/v1/superadmin/data/imports/batches/errors.csv',
      createdAt: new Date().toISOString(),
      completedAt: new Date(Date.now() + 60 * 1000).toISOString(),
      operatorId: 'superadmin@institution.edu',
    };
    return Promise.resolve(newBatch);
  }

  const res = await apiFetch<ImportBatchRecord>(IMPORT_MIGRATION_URLS.COMMIT_IMPORT, {
    method: 'POST',
    idempotencyKey,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function rollbackImportBatch(
  batchId: string
): Promise<{ success: boolean; batchId: string }> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-rb-' + Date.now();
  if (IS_MOCK_ENV) {
    return Promise.resolve({ success: true, batchId });
  }

  const res = await apiFetch<{ success: boolean; batchId: string }>(IMPORT_MIGRATION_URLS.ROLLBACK_IMPORT(batchId), {
    method: 'POST',
    idempotencyKey,
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}
