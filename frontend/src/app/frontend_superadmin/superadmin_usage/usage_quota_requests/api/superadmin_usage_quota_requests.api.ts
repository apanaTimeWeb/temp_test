// api/superadmin_usage_quota_requests.api.ts
import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_USAGE_QUOTA_REQUESTS_API } from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/config/superadmin_usage_quota_requests.url_config';
import type {
  QuotaUpgradeRequestRecord,
  QuotaRequestsKpis,
} from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/types/SuperadminUsageQuotaRequestsTypes';
import type {
  ApproveQuotaRequestFormValues,
  RejectQuotaRequestFormValues,
} from '@/app/frontend_superadmin/superadmin_usage/usage_quota_requests/schemas/SuperadminUsageQuotaRequestsSchemas';

export async function fetchQuotaRequestsList(
  filters: { search?: string; status?: string; resourceType?: string } = {}
): Promise<ApiResponse<QuotaUpgradeRequestRecord[]>> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters.resourceType && filters.resourceType !== 'ALL') params.set('resourceType', filters.resourceType);

  const query = params.toString();
  return apiFetch<QuotaUpgradeRequestRecord[]>(
    `${SUPERADMIN_USAGE_QUOTA_REQUESTS_API.list}${query ? `?${query}` : ''}`
  );
}

export async function fetchQuotaRequestsKpis(): Promise<ApiResponse<QuotaRequestsKpis>> {
  return apiFetch<QuotaRequestsKpis>(SUPERADMIN_USAGE_QUOTA_REQUESTS_API.kpis);
}

export async function approveQuotaRequestApi(
  payload: ApproveQuotaRequestFormValues
): Promise<ApiResponse<QuotaUpgradeRequestRecord>> {
  return apiFetch<QuotaUpgradeRequestRecord>(
    SUPERADMIN_USAGE_QUOTA_REQUESTS_API.approve(payload.requestId),
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}

export async function rejectQuotaRequestApi(
  payload: RejectQuotaRequestFormValues
): Promise<ApiResponse<QuotaUpgradeRequestRecord>> {
  return apiFetch<QuotaUpgradeRequestRecord>(
    SUPERADMIN_USAGE_QUOTA_REQUESTS_API.reject(payload.requestId),
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}
