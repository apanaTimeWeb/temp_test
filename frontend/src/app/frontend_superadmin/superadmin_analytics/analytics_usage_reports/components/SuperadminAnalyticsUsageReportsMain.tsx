'use client';
// RESPONSIBILITY: Primary layout and composition orchestrator for Superadmin Usage Reports.
// FLOW: useSuperadminAnalyticsUsageReports -> SuperadminAnalyticsUsageReportsMain -> Child presentation components.

import React from 'react';
import { Gauge, RefreshCw, X, Download } from 'lucide-react';
import { useSuperadminAnalyticsUsageReports } from '../hooks/useSuperadminAnalyticsUsageReports';
import { SuperadminAnalyticsUsageReportsKpiGrid } from './SuperadminAnalyticsUsageReportsKpiGrid';
import { SuperadminAnalyticsUsageReportsCharts } from './SuperadminAnalyticsUsageReportsCharts';
import { SuperadminAnalyticsUsageReportsFilterBar } from './SuperadminAnalyticsUsageReportsFilterBar';
import { SuperadminAnalyticsUsageReportsTable } from './SuperadminAnalyticsUsageReportsTable';
import { SuperadminAnalyticsUsageReportsExportModal } from './SuperadminAnalyticsUsageReportsExportModal';
import { formatUsageNumber, formatStorageSize } from '../utils/SuperadminAnalyticsUsageReportsFormatters';

export function SuperadminAnalyticsUsageReportsMain() {
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
  } = useSuperadminAnalyticsUsageReports();

  return (
    <div
      className="space-y-6 w-full max-w-full min-w-0"
      data-testid="superadmin-analytics-usage-reports-main"
    >
      {/* ── Top Header Toolbar ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1338]/90 to-slate-900/90 border border-emerald-500/25 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2 shadow-xs">
              <Gauge size={13} aria-hidden="true" />
              <span>Resource Telemetry & Metering</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Platform Usage & Consumption Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Members, staff, branches, cloud storage, API ingress, and SMS/WhatsApp consumption
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/25 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-200 text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
              title="Refresh usage telemetry"
            >
              <RefreshCw size={13} className={isPending ? 'animate-spin text-emerald-400' : 'text-emerald-400'} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              data-testid="usage-reports-open-export-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
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
          <span>Failed to load usage telemetry: {error?.message || 'Server error'}</span>
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
      <SuperadminAnalyticsUsageReportsKpiGrid kpis={reportData?.kpis} />

      {/* ── 2. Usage Trends & Quota Consumption Charts ── */}
      <SuperadminAnalyticsUsageReportsCharts
        usageTrends={reportData?.usageTrends}
        consumptionBreakdown={reportData?.kpis?.consumptionBreakdown}
      />

      {/* ── 3. Filter Bar (7 Controls + Search) ── */}
      <SuperadminAnalyticsUsageReportsFilterBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        onOpenExport={() => setIsExportModalOpen(true)}
        filterOptions={reportData?.filterOptions}
      />

      {/* ── 4. Detailed Usage Ingress Table ── */}
      <SuperadminAnalyticsUsageReportsTable
        records={filteredRecords}
        isLoading={isPending}
        selectedRecord={selectedRecord}
        onSelectRecord={setSelectedRecord}
        totalCount={reportData?.totalCount ?? filteredRecords.length}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={(page) => updateFilter('page', page)}
      />

      {/* ── Record Detail Slide-Over ── */}
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
                  {selectedRecord.libraryName}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedRecord.branchName} • {selectedRecord.libraryCode}</p>
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
                <span className="text-muted-foreground">Admin Account</span>
                <span className="font-semibold text-foreground">{selectedRecord.adminName} ({selectedRecord.adminEmail})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Tier Plan</span>
                <span className="font-semibold text-foreground">{selectedRecord.plan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Operating Status</span>
                <span className="font-semibold text-foreground">{selectedRecord.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="font-semibold text-emerald-400">{selectedRecord.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Registered Members</span>
                <span className="font-bold text-foreground">{formatUsageNumber(selectedRecord.membersCount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Staff & Operators</span>
                <span className="font-bold text-foreground">{selectedRecord.staffCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Database Storage</span>
                <span className="font-mono text-purple-400">{formatStorageSize(selectedRecord.storageMb)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">API Volume</span>
                <span className="font-mono text-foreground">{formatUsageNumber(selectedRecord.apiCalls)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">SMS / WhatsApp</span>
                <span className="font-medium text-foreground">{formatUsageNumber(selectedRecord.smsCount)} SMS / {formatUsageNumber(selectedRecord.whatsappCount)} WA</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Last Telemetry Active</span>
                <span className="text-foreground">{selectedRecord.lastActiveDate}</span>
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
      <SuperadminAnalyticsUsageReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        records={filteredRecords}
        overviewData={reportData ?? undefined}
      />
    </div>
  );
}
