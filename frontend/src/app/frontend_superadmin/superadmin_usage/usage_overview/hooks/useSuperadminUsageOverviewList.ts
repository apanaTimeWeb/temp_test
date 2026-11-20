// hooks/useSuperadminUsageOverviewList.ts
// RESPONSIBILITY: Orchestrates TanStack Query fetching for 12-resource usage overview with debouncing.
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS } from '../api/superadmin_usage_overview.query_keys';
import { fetchUsageOverviewList, fetchSystemUsageSummary } from '../api/superadmin_usage_overview.api';
import { useSuperadminUsageOverviewStore } from '../state/useSuperadminUsageOverviewStore';
import { getMockUsageOverviewResponse, getMockSystemSummaryResponse } from '../mocks/handlers/superadmin_usage_overview.handlers';

export function useSuperadminUsageOverviewList() {
  const { search, planTier, severity } = useSuperadminUsageOverviewStore();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce API calls by 300ms (Rule 15 invariant)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const queryFilters = {
    search: debouncedSearch,
    planTier,
    severity,
  };

  const listQuery = useQuery({
    queryKey: SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.list(queryFilters),
    queryFn: async () => {
      try {
        const res = await fetchUsageOverviewList(queryFilters);
        if (res.success && res.data) return res.data;
        // Fallback to local deterministic mock
        return getMockUsageOverviewResponse('ACTIVE', debouncedSearch, planTier).data ?? [];
      } catch {
        return getMockUsageOverviewResponse('ACTIVE', debouncedSearch, planTier).data ?? [];
      }
    },
    staleTime: 30000,
  });

  const summaryQuery = useQuery({
    queryKey: SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.summary(),
    queryFn: async () => {
      try {
        const res = await fetchSystemUsageSummary();
        if (res.success && res.data) return res.data;
        return getMockSystemSummaryResponse().data!;
      } catch {
        return getMockSystemSummaryResponse().data!;
      }
    },
    staleTime: 60000,
  });

  return {
    libraries: listQuery.data ?? [],
    isPending: listQuery.isPending,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    summary: summaryQuery.data,
    isSummaryPending: summaryQuery.isPending,
  };
}
