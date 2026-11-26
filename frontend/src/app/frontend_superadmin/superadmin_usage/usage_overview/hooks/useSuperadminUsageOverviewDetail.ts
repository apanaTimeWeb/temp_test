// hooks/useSuperadminUsageOverviewDetail.ts
// RESPONSIBILITY: Fetches detailed 12-resource breakdown for a single selected library.
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/api/superadmin_usage_overview.query_keys';
import { fetchLibraryUsageDetailById } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/api/superadmin_usage_overview.api';
import { getMockLibraryDetailResponse } from '@/app/frontend_superadmin/superadmin_usage/usage_overview/mocks/handlers/superadmin_usage_overview.handlers';

export function useSuperadminUsageOverviewDetail(libraryId: string | null) {
  return useQuery({
    queryKey: libraryId ? SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.detail(libraryId) : ['superadmin', 'usage', 'null'],
    queryFn: async () => {
      if (!libraryId) return null;
      try {
        const res = await fetchLibraryUsageDetailById(libraryId);
        if (res.success && res.data) return res.data;
        return getMockLibraryDetailResponse(libraryId).data;
      } catch {
        return getMockLibraryDetailResponse(libraryId).data;
      }
    },
    enabled: Boolean(libraryId),
  });
}
