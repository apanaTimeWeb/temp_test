// hooks/useSuperadminAnalyticsPlatformReports.ts
// RESPONSIBILITY: Logic and query orchestration for Superadmin Platform Reports.
// DATA FLOW: API -> useSuperadminAnalyticsPlatformReports.ts -> SuperadminAnalyticsPlatformReportsMain -> UI View

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_PLATFORM_REPORTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/api/superadmin_analytics_platform_reports.query_keys';
import { fetchPlatformReportsOverview } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/api/superadmin_analytics_platform_reports.api';
import { DEFAULT_PLATFORM_REPORTS_FILTERS } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/constants/SuperadminAnalyticsPlatformReportsConstants';
import type {
  SuperadminAnalyticsPlatformReportsFilters,
  PlatformReportTableRecord,
} from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/types/SuperadminAnalyticsPlatformReportsTypes';

export function useSuperadminAnalyticsPlatformReports() {
  const [filters, setFilters] = useState<SuperadminAnalyticsPlatformReportsFilters>(
    DEFAULT_PLATFORM_REPORTS_FILTERS
  );
  const [searchInput, setSearchInput] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PlatformReportTableRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Debounced search sync to filters
  const handleSearchChange = useCallback((text: string) => {
    setSearchInput(text);
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchQuery: text, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const queryFilters = useMemo(
    () => ({
      ...filters,
      searchQuery: filters.searchQuery,
    }),
    [filters]
  );

  const { data: response, isPending, isError, error, refetch } = useQuery({
    queryKey: SUPERADMIN_PLATFORM_REPORTS_QUERY_KEYS.overview(queryFilters as unknown as Record<string, unknown>),
    queryFn: () => fetchPlatformReportsOverview(filters),
  });

  const reportData = response?.data;

  // Client-side filtering when backend returns fixture array
  const filteredRecords = useMemo(() => {
    if (!reportData?.items) return [];
    return reportData.items.filter((item) => {
      if (filters.status !== 'ALL' && item.status !== filters.status) return false;
      if (filters.plan !== 'ALL' && item.plan !== filters.plan) return false;
      if (filters.paymentStatus !== 'ALL' && item.paymentStatus !== filters.paymentStatus) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          item.libraryName.toLowerCase().includes(q) ||
          item.libraryCode.toLowerCase().includes(q) ||
          item.adminName.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [reportData?.items, filters.status, filters.plan, filters.paymentStatus, filters.searchQuery]);

  const updateFilter = useCallback((key: keyof SuperadminAnalyticsPlatformReportsFilters, val: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_PLATFORM_REPORTS_FILTERS);
    setSearchInput('');
  }, []);

  return {
    filters,
    searchInput,
    setSearchInput,
    handleSearchChange,
    updateFilter,
    resetFilters,
    reportData,
    filteredRecords,
    isPending,
    isError,
    error,
    refetch,
    selectedRecord,
    setSelectedRecord,
    isExportModalOpen,
    setIsExportModalOpen,
  };
}
