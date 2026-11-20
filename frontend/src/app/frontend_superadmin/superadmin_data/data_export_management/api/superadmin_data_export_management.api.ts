// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/api/superadmin_data_export_management.api.ts
/**
 * @file superadmin_data_export_management.api.ts
 * @description API client for Tenant & Branch Data Export Operations.
 */

import { EXPORT_MANAGEMENT_URLS } from '../config/superadmin_data_export_management.url_config';
import type {
  ExportJobRecord,
  TenantOption,
  BranchOption,
  CreateExportPayload,
  ExportManagementOverview,
} from '../types/superadmin_data_export_management.types';
import {
  MOCK_EXPORT_OVERVIEW,
  MOCK_EXPORT_TENANTS,
  MOCK_EXPORT_BRANCHES,
  MOCK_EXPORT_JOBS,
} from '../mocks/fixtures/superadmin_data_export_management.fixtures';

const IS_MOCK_ENV = process.env.NODE_ENV !== 'production';

export async function fetchExportOverview(): Promise<ExportManagementOverview> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_EXPORT_OVERVIEW);
  const res = await fetch(EXPORT_MANAGEMENT_URLS.OVERVIEW);
  if (!res.ok) throw new Error(`Failed to fetch export overview: ${res.statusText}`);
  return res.json();
}

export async function fetchExportJobs(filters?: {
  scope?: string;
  status?: string;
  tenantId?: string;
}): Promise<ExportJobRecord[]> {
  if (IS_MOCK_ENV) {
    let result = [...MOCK_EXPORT_JOBS];
    if (filters?.scope && filters.scope !== 'ALL') {
      result = result.filter((j) => j.scope === filters.scope);
    }
    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((j) => j.status === filters.status);
    }
    if (filters?.tenantId && filters.tenantId !== 'ALL') {
      result = result.filter((j) => j.tenantId === filters.tenantId);
    }
    return Promise.resolve(result);
  }
  const url = new URL(EXPORT_MANAGEMENT_URLS.JOBS_LIST, window.location.origin);
  if (filters?.scope) url.searchParams.set('scope', filters.scope);
  if (filters?.status) url.searchParams.set('status', filters.status);
  if (filters?.tenantId) url.searchParams.set('tenantId', filters.tenantId);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch export jobs: ${res.statusText}`);
  return res.json();
}

export async function fetchExportTenants(): Promise<TenantOption[]> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_EXPORT_TENANTS);
  const res = await fetch(EXPORT_MANAGEMENT_URLS.TENANTS_LIST);
  if (!res.ok) throw new Error(`Failed to fetch tenants: ${res.statusText}`);
  return res.json();
}

export async function fetchExportBranches(tenantId?: string): Promise<BranchOption[]> {
  if (IS_MOCK_ENV) {
    if (tenantId) {
      return Promise.resolve(MOCK_EXPORT_BRANCHES.filter((b) => b.tenantId === tenantId));
    }
    return Promise.resolve(MOCK_EXPORT_BRANCHES);
  }
  const url = new URL(EXPORT_MANAGEMENT_URLS.BRANCHES_LIST, window.location.origin);
  if (tenantId) url.searchParams.set('tenantId', tenantId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch branches: ${res.statusText}`);
  return res.json();
}

export async function triggerDataExport(payload: CreateExportPayload): Promise<ExportJobRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-exp-' + Date.now();
  if (IS_MOCK_ENV) {
    const tenant = MOCK_EXPORT_TENANTS.find((t) => t.id === payload.tenantId);
    const branch = payload.branchId ? MOCK_EXPORT_BRANCHES.find((b) => b.id === payload.branchId) : null;

    const newJob: ExportJobRecord = {
      id: 'exp-job-' + Date.now(),
      exportNumber: 'EXP-' + new Date().toISOString().slice(0, 10) + '-' + Math.floor(100 + Math.random() * 900),
      scope: payload.scope,
      tenantId: payload.tenantId,
      tenantName: tenant?.name ?? 'Target Library Tenant',
      branchId: payload.branchId ?? null,
      branchName: branch?.name ?? null,
      format: payload.format,
      entities: payload.entities,
      sizeBytes: null,
      sha256Checksum: null,
      downloadUrl: null,
      status: 'QUEUED',
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      requestedBy: 'superadmin@institution.edu',
    };
    return Promise.resolve(newJob);
  }

  const res = await fetch(EXPORT_MANAGEMENT_URLS.TRIGGER_EXPORT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Export trigger failed: ${res.statusText}`);
  return res.json();
}

export async function cancelExportJob(id: string): Promise<{ success: boolean }> {
  if (IS_MOCK_ENV) return Promise.resolve({ success: true });
  const res = await fetch(EXPORT_MANAGEMENT_URLS.CANCEL_EXPORT(id), { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to cancel export: ${res.statusText}`);
  return res.json();
}
