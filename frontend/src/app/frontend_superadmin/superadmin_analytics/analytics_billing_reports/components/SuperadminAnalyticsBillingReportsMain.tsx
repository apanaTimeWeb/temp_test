'use client';
// RESPONSIBILITY: Primary layout and composition orchestrator for Superadmin Billing Reports.
// FLOW: useSuperadminAnalyticsBillingReports -> SuperadminAnalyticsBillingReportsMain -> Child presentation components.

import React from 'react';
import { Receipt, RefreshCw, X, Download } from 'lucide-react';
import { useSuperadminAnalyticsBillingReports } from '../hooks/useSuperadminAnalyticsBillingReports';
import { SuperadminAnalyticsBillingReportsKpiGrid } from './SuperadminAnalyticsBillingReportsKpiGrid';
import { SuperadminAnalyticsBillingReportsCharts } from './SuperadminAnalyticsBillingReportsCharts';
import { SuperadminAnalyticsBillingReportsFilterBar } from './SuperadminAnalyticsBillingReportsFilterBar';
import { SuperadminAnalyticsBillingReportsTable } from './SuperadminAnalyticsBillingReportsTable';
import { SuperadminAnalyticsBillingReportsExportModal } from './SuperadminAnalyticsBillingReportsExportModal';
import { formatBillingCurrency } from '../utils/SuperadminAnalyticsBillingReportsFormatters';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Receipt size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Billing & Financial Reports
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Revenue & Invoices
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              MRR, ARR, plan-wise income, pending invoices, failed collections, and audit logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer disabled:opacity-50"
            title="Refresh billing data"
          >
            <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            data-testid="billing-reports-open-export-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={14} />
            <span>Export & Print</span>
          </button>
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
        onOpenExport={() => setIsExportModalOpen(true)}
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
        onPageChange={(page) => updateFilter('page', page)}
      />

      {/* ── Record Detail Slide-Over / Modal ── */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Invoice {selectedRecord.invoiceNumber}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedRecord.libraryName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-semibold text-foreground">{selectedRecord.branchName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold text-foreground">{selectedRecord.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Cycle</span>
                <span className="font-semibold text-foreground">{selectedRecord.billingCycle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-emerald-400">
                  {formatBillingCurrency(selectedRecord.amountMinor)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-foreground">{selectedRecord.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground">{selectedRecord.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-muted-foreground">{selectedRecord.transactionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Invoice Date</span>
                <span className="text-foreground">{selectedRecord.invoiceDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Due Date</span>
                <span className="text-foreground">{selectedRecord.dueDate}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* ── Export & Print Modal (Excel, PDF, CSV, Print, Download) ── */}
      <SuperadminAnalyticsBillingReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        records={filteredRecords}
        overviewData={reportData}
      />
    </div>
  );
}
