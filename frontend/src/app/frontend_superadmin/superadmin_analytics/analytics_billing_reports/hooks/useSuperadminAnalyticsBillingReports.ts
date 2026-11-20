// hooks/useSuperadminAnalyticsBillingReports.ts
// RESPONSIBILITY: Logic and query orchestration for Superadmin Billing Reports.
// DATA FLOW: API -> useSuperadminAnalyticsBillingReports.ts -> SuperadminAnalyticsBillingReportsMain -> UI View

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SUPERADMIN_BILLING_REPORTS_QUERY_KEYS } from '../api/superadmin_analytics_billing_reports.query_keys';
import { fetchBillingReportsOverview } from '../api/superadmin_analytics_billing_reports.api';
import { DEFAULT_BILLING_REPORTS_FILTERS } from '../constants/SuperadminAnalyticsBillingReportsConstants';
import type {
  SuperadminAnalyticsBillingReportsFilters,
  BillingReportTableRecord,
} from '../types/SuperadminAnalyticsBillingReportsTypes';

export function useSuperadminAnalyticsBillingReports() {
  const [filters, setFilters] = useState<SuperadminAnalyticsBillingReportsFilters>(
    DEFAULT_BILLING_REPORTS_FILTERS
  );
  const [searchInput, setSearchInput] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<BillingReportTableRecord | null>(null);
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
    queryKey: SUPERADMIN_BILLING_REPORTS_QUERY_KEYS.overview(queryFilters as unknown as Record<string, unknown>),
    queryFn: () => fetchBillingReportsOverview(filters),
  });

  const reportData = response?.data;

  const filteredRecords = useMemo(() => {
    if (!reportData?.items) return [];
    return reportData.items.filter((item) => {
      if (filters.paymentStatus !== 'ALL' && item.paymentStatus !== filters.paymentStatus) return false;
      if (filters.plan !== 'ALL' && item.planName !== filters.plan) return false;
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          item.invoiceNumber.toLowerCase().includes(q) ||
          item.libraryName.toLowerCase().includes(q) ||
          item.transactionId.toLowerCase().includes(q) ||
          item.paymentMethod.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [reportData?.items, filters.paymentStatus, filters.plan, filters.searchQuery]);

  const updateFilter = useCallback((key: keyof SuperadminAnalyticsBillingReportsFilters, val: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: val, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_BILLING_REPORTS_FILTERS);
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
