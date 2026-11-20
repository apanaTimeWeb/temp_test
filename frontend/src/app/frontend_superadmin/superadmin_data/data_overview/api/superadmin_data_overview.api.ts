// api/superadmin_data_overview.api.ts
// API service client for Superadmin Data Overview

import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_DATA_OVERVIEW_API } from '@/app/frontend_superadmin/superadmin_data/data_overview/config/superadmin_data_overview.url_config';
import type {
  SuperadminDataOverviewMetrics,
  SuperadminDataOverviewRpoRtoStatus,
  SuperadminDataOverviewActivityItem,
  SuperadminDataOverviewStorageCategory,
} from '@/app/frontend_superadmin/superadmin_data/data_overview/types/superadmin_data_overview.types';
import type { SuperadminDataQuickBackupPayload } from '@/app/frontend_superadmin/superadmin_data/data_overview/schemas/superadmin_data_overview.schemas';

export async function fetchSuperadminDataOverviewMetrics(): Promise<ApiResponse<SuperadminDataOverviewMetrics>> {
  return apiFetch<SuperadminDataOverviewMetrics>(SUPERADMIN_DATA_OVERVIEW_API.getOverviewMetrics);
}

export async function fetchSuperadminDataOverviewRpoRto(): Promise<ApiResponse<SuperadminDataOverviewRpoRtoStatus>> {
  return apiFetch<SuperadminDataOverviewRpoRtoStatus>(SUPERADMIN_DATA_OVERVIEW_API.getRpoRtoStatus);
}

export async function fetchSuperadminDataOverviewActivity(): Promise<ApiResponse<SuperadminDataOverviewActivityItem[]>> {
  return apiFetch<SuperadminDataOverviewActivityItem[]>(SUPERADMIN_DATA_OVERVIEW_API.getRecentActivity);
}

export async function fetchSuperadminDataOverviewStorage(): Promise<ApiResponse<SuperadminDataOverviewStorageCategory[]>> {
  return apiFetch<SuperadminDataOverviewStorageCategory[]>(SUPERADMIN_DATA_OVERVIEW_API.getStorageBreakdown);
}

export async function triggerSuperadminQuickBackup(
  payload: SuperadminDataQuickBackupPayload,
  idempotencyKey: string
): Promise<ApiResponse<{ snapshotId: string; status: string }>> {
  return apiFetch<{ snapshotId: string; status: string }>(SUPERADMIN_DATA_OVERVIEW_API.triggerQuickBackup, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
}
