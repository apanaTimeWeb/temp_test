// hooks/useSuperadminAnalyticsUsageReports.ts
// RESPONSIBILITY: Logic and query orchestration for Superadmin Usage Reports.
// DATA FLOW: API -> useSuperadminAnalyticsUsageReports.ts -> SuperadminAnalyticsUsageReportsMain -> UI View

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_USAGE_REPORTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/api/superadmin_analytics_usage_reports.query_keys';
import { fetchUsageReportsOverview } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/api/superadmin_analytics_usage_reports.api';
import { DEFAULT_USAGE_REPORTS_FILTERS } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/constants/SuperadminAnalyticsUsageReportsConstants';
import type {
  SuperadminAnalyticsUsageReportsFilters,
  UsageReportTableRecord,
} from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/types/SuperadminAnalyticsUsageReportsTypes';

export function useSuperadminAnalyticsUsageReports() {
  const [filters, setFilters] = useState<SuperadminAnalyticsUsageReportsFilters>(
    DEFAULT_USAGE_REPORTS_FILTERS
  );
  const [searchInput, setSearchInput] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<UsageReportTableRecord | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
    queryKey: SUPERADMIN_USAGE_REPORTS_QUERY_KEYS.overview(queryFilters as unknown as Record<string, unknown>),
    queryFn: () => fetchUsageReportsOverview(filters),
  });

  const reportData = response?.data;

  const filteredRecords = useMemo(() => {
    if (!reportData?.items) return [];
    return reportData.items.filter((item) => {
      if (filters.status !== 'ALL' && item.status !== filters.status) return false;
      if (filters.plan !== 'ALL' && item.plan !== filters.plan) return false;
      if (filters.paymentStatus !== 'ALL' && item.paymentStatus !== filters.paymentStatus) return false;
      if (filters.libraryId !== 'ALL' && item.libraryCode !== filters.libraryId) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          item.libraryCode.toLowerCase().includes(q) ||
          item.libraryName.toLowerCase().includes(q) ||
          item.branchName.toLowerCase().includes(q) ||
          item.adminName.toLowerCase().includes(q) ||
          item.adminEmail.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [reportData?.items, filters.status, filters.plan, filters.paymentStatus, filters.libraryId, filters.searchQuery]);

  const updateFilter = useCallback((key: keyof SuperadminAnalyticsUsageReportsFilters, val: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_USAGE_REPORTS_FILTERS);
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
