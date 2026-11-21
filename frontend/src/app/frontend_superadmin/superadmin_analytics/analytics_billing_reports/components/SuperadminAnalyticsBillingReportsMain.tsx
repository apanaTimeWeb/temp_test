'use client';
// RESPONSIBILITY: Primary layout and composition orchestrator for Superadmin Billing Reports.
// FLOW: useSuperadminAnalyticsBillingReports -> SuperadminAnalyticsBillingReportsMain -> Child presentation components.

import React from 'react';
import { Receipt, RefreshCw, Download } from 'lucide-react';
import { useSuperadminAnalyticsBillingReports } from '../hooks/useSuperadminAnalyticsBillingReports';
import { SuperadminAnalyticsBillingReportsKpiGrid } from './SuperadminAnalyticsBillingReportsKpiGrid';
import { SuperadminAnalyticsBillingReportsCharts } from './SuperadminAnalyticsBillingReportsCharts';
import { SuperadminAnalyticsBillingReportsFilterBar } from './SuperadminAnalyticsBillingReportsFilterBar';
import { SuperadminAnalyticsBillingReportsTable } from './SuperadminAnalyticsBillingReportsTable';
import { SuperadminAnalyticsBillingReportsExportModal } from './SuperadminAnalyticsBillingReportsExportModal';
import { SuperadminAnalyticsBillingReportsDetailModal } from './SuperadminAnalyticsBillingReportsDetailModal';

export function SuperadminAnalyticsBillingReportsMain() {
  const {
    filters,
    searchInput,
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
  } = useSuperadminAnalyticsBillingReports();

  return (
    <div
      className="space-y-6 w-full max-w-full min-w-0"
      data-testid="superadmin-analytics-billing-reports-main"
    >
      {/* ── Top Header Toolbar ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1338]/90 to-slate-900/90 border border-amber-500/25 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold mb-2 shadow-xs">
              <Receipt size={13} aria-hidden="true" />
              <span>Revenue & Invoicing Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Billing & Financial Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              MRR, ARR, plan-wise income, pending invoices, failed collections, and audit logs
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/25 hover:border-amber-500/50 hover:bg-amber-500/10 text-slate-200 text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              title="Refresh billing data"
            >
              <RefreshCw size={13} className={isPending ? 'animate-spin text-amber-400' : 'text-amber-400'} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              data-testid="billing-reports-open-export-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Download size={14} />
              <span>Export & Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {isError && (
        <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center justify-between">
          <span>Failed to load billing metrics: {error?.message || 'Server error'}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-bold underline hover:no-underline cursor-pointer"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* ── 1. KPI Metric Summary Grid ── */}
      <SuperadminAnalyticsBillingReportsKpiGrid kpis={reportData?.kpis} />

      {/* ── 2. Revenue Trend & Plan-Wise Breakdown Charts ── */}
      <SuperadminAnalyticsBillingReportsCharts
        revenueTrend={reportData?.revenueTrend}
        planWiseIncome={reportData?.kpis?.planWiseIncome}
      />

      {/* ── 3. Filter Bar (Date Range, Library, Branch, Plan, Status, Admin, Payment Status) ── */}
      <SuperadminAnalyticsBillingReportsFilterBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        filterOptions={reportData?.filterOptions}
      />

      {/* ── 4. Detailed Financial Invoices Table ── */}
      <SuperadminAnalyticsBillingReportsTable
        records={filteredRecords}
        isLoading={isPending}
        selectedRecord={selectedRecord}
        onSelectRecord={setSelectedRecord}
        totalCount={reportData?.totalCount ?? filteredRecords.length}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={(page: number) => updateFilter('page', page)}
      />

      {/* ── 5. Record Detail Modal (Full Transaction & Accounting Details) ── */}
      <SuperadminAnalyticsBillingReportsDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* ── 6. Export & Print Modal (Excel, PDF, CSV, Print, Download) ── */}
      <SuperadminAnalyticsBillingReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        records={filteredRecords}
        overviewData={reportData ?? undefined}
      />
    </div>
  );
}
