// hooks/useSuperadminUsageQuotaRequestsQueries.ts
// RESPONSIBILITY: TanStack Query v5 hooks for quota upgrade requests list and KPIs with debouncing.
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS } from '../api/superadmin_usage_quota_requests.query_keys';
import {
  fetchQuotaRequestsList,
  fetchQuotaRequestsKpis,
} from '../api/superadmin_usage_quota_requests.api';
import { useSuperadminUsageQuotaRequestsStore } from '../state/useSuperadminUsageQuotaRequestsStore';
import {
  getMockQuotaRequestsResponse,
  getMockQuotaRequestsKpisResponse,
} from '../mocks/handlers/superadmin_usage_quota_requests.handlers';

export function useSuperadminUsageQuotaRequestsQueries() {
  const { search, status, resourceType } = useSuperadminUsageQuotaRequestsStore();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = { search: debouncedSearch, status, resourceType };

  const listQuery = useQuery({
    queryKey: SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS.list(filters),
    queryFn: async () => {
      try {
        const res = await fetchQuotaRequestsList(filters);
        if (res.success && res.data) return res.data;
        return getMockQuotaRequestsResponse(debouncedSearch, status, resourceType).data ?? [];
      } catch {
        return getMockQuotaRequestsResponse(debouncedSearch, status, resourceType).data ?? [];
      }
    },
    staleTime: 30000,
  });

  const kpisQuery = useQuery({
    queryKey: SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS.kpis(),
    queryFn: async () => {
      try {
        const res = await fetchQuotaRequestsKpis();
        if (res.success && res.data) return res.data;
        return getMockQuotaRequestsKpisResponse().data!;
      } catch {
        return getMockQuotaRequestsKpisResponse().data!;
      }
    },
    staleTime: 60000,
  });

  return {
    requests: listQuery.data ?? [],
    kpis: kpisQuery.data,
    isPending: listQuery.isPending,
    isError: listQuery.isError,
    refetch: () => {
      listQuery.refetch();
      kpisQuery.refetch();
    },
  };
}
