// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/api/superadmin_data_restore_operations.api.ts
/**
 * @file superadmin_data_restore_operations.api.ts
 * @description API client for fetching backup history snapshots, executing authorized restores,
 * and triggering sandbox disaster recovery drills.
 */

import { apiFetch } from '@/lib/api';
import { RESTORE_OPERATIONS_URLS } from '../config/superadmin_data_restore_operations.url_config';
import type {
  BackupSnapshotRecord,
  RestoreDrillRecord,
  RestoreExecutionRequest,
  RestoreExecutionResponse,
  RestoreOperationsOverview,
} from '../types/superadmin_data_restore_operations.types';
import {
  MOCK_SNAPSHOTS,
  MOCK_DRILL_HISTORY,
  MOCK_RESTORE_OVERVIEW,
} from '../mocks/fixtures/superadmin_data_restore_operations.fixtures';

const IS_MOCK_ENV = process.env.NODE_ENV !== 'production';

export async function fetchRestoreOverview(): Promise<RestoreOperationsOverview> {
  if (IS_MOCK_ENV) {
    return Promise.resolve(MOCK_RESTORE_OVERVIEW);
  }
  const res = await apiFetch<RestoreOperationsOverview>(RESTORE_OPERATIONS_URLS.OVERVIEW);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function fetchBackupSnapshots(filters?: {
  scope?: string;
  tenantId?: string;
  search?: string;
}): Promise<BackupSnapshotRecord[]> {
  if (IS_MOCK_ENV) {
    let result = [...MOCK_SNAPSHOTS];
    if (filters?.scope && filters.scope !== 'ALL') {
      result = result.filter((s) => s.scope === filters.scope);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.snapshotNumber.toLowerCase().includes(q) ||
          (s.tenantName && s.tenantName.toLowerCase().includes(q))
      );
    }
    return Promise.resolve(result);
  }
  const searchParams = new URLSearchParams();
  if (filters?.scope) searchParams.set('scope', filters.scope);
  if (filters?.tenantId) searchParams.set('tenantId', filters.tenantId);
  if (filters?.search) searchParams.set('search', filters.search);
  const qs = searchParams.toString();
  const endpoint = `${RESTORE_OPERATIONS_URLS.SNAPSHOTS_LIST}${qs ? `?${qs}` : ''}`;

  const res = await apiFetch<BackupSnapshotRecord[]>(endpoint);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function fetchDrillHistory(): Promise<RestoreDrillRecord[]> {
  if (IS_MOCK_ENV) {
    return Promise.resolve(MOCK_DRILL_HISTORY);
  }
  const res = await apiFetch<RestoreDrillRecord[]>(RESTORE_OPERATIONS_URLS.DRILLS_LIST);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function executeRestore(
  payload: RestoreExecutionRequest
): Promise<RestoreExecutionResponse> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-' + Date.now();
  if (IS_MOCK_ENV) {
    return Promise.resolve({
      restoreJobId: 'rst-job-' + Date.now(),
      snapshotId: payload.snapshotId,
      status: 'QUEUED',
      startedAt: new Date().toISOString(),
      estimatedCompletionAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      sandboxIsolationVerified: true,
      auditLogId: 'audit-rst-' + Date.now(),
    });
  }

  const res = await apiFetch<RestoreExecutionResponse>(RESTORE_OPERATIONS_URLS.EXECUTE_RESTORE, {
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

export async function triggerSandboxDrill(snapshotId: string, notes: string): Promise<RestoreDrillRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-drill-' + Date.now();
  if (IS_MOCK_ENV) {
    const newDrill: RestoreDrillRecord = {
      id: 'drill-' + Date.now(),
      snapshotId,
      snapshotNumber: 'SNP-2026-LIVE-DRILL',
      executedAt: new Date().toISOString(),
      durationSeconds: 142,
      status: 'PASSED',
      simulatedRtoMinutes: 2.36,
      checksumMatch: true,
      tenantIsolationPass: true,
      notes,
      operatorId: 'superadmin@institution.edu',
    };
    return Promise.resolve(newDrill);
  }

  const res = await apiFetch<RestoreDrillRecord>(RESTORE_OPERATIONS_URLS.TRIGGER_DRILL, {
    method: 'POST',
    idempotencyKey,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ snapshotId, notes }),
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}
