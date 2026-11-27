// api/superadmin_usage_overview.api.ts
import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_USAGE_OVERVIEW_API } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/config/superadmin_usage_overview.url_config';
import type { LibraryUsageRecord, SystemUsageAggregates } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/types/SuperadminUsageOverviewTypes';

export async function fetchUsageOverviewList(
  filters: { search?: string; planTier?: string; severity?: string } = {}
): Promise<ApiResponse<LibraryUsageRecord[]>> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.planTier && filters.planTier !== 'ALL') params.set('planTier', filters.planTier);
  if (filters.severity && filters.severity !== 'ALL') params.set('severity', filters.severity);

  const query = params.toString();
  const url = `${SUPERADMIN_USAGE_OVERVIEW_API.list}${query ? `?${query}` : ''}`;
  return apiFetch<LibraryUsageRecord[]>(url);
}

export async function fetchSystemUsageSummary(): Promise<ApiResponse<SystemUsageAggregates>> {
  return apiFetch<SystemUsageAggregates>(SUPERADMIN_USAGE_OVERVIEW_API.summary);
}

export async function fetchLibraryUsageDetailById(
  libraryId: string
): Promise<ApiResponse<LibraryUsageRecord>> {
  return apiFetch<LibraryUsageRecord>(SUPERADMIN_USAGE_OVERVIEW_API.detail(libraryId));
}
