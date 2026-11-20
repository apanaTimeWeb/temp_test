'use client';
// RESPONSIBILITY: Primary layout and composition orchestrator for Superadmin Platform Reports.
// FLOW: useSuperadminAnalyticsPlatformReports -> SuperadminAnalyticsPlatformReportsMain -> Child presentation components.

import React from 'react';
import { Building2, RefreshCw, X } from 'lucide-react';
import { useSuperadminAnalyticsPlatformReports } from '../hooks/useSuperadminAnalyticsPlatformReports';
import { SuperadminAnalyticsPlatformReportsKpiGrid } from './SuperadminAnalyticsPlatformReportsKpiGrid';
import { SuperadminAnalyticsPlatformReportsCharts } from './SuperadminAnalyticsPlatformReportsCharts';
import { SuperadminAnalyticsPlatformReportsFilterBar } from './SuperadminAnalyticsPlatformReportsFilterBar';
import { SuperadminAnalyticsPlatformReportsTable } from './SuperadminAnalyticsPlatformReportsTable';
import { SuperadminAnalyticsPlatformReportsExportModal } from './SuperadminAnalyticsPlatformReportsExportModal';

export function SuperadminAnalyticsPlatformReportsMain() {
  const {
    filters,
    searchInput,
    handleSearchChange,
    updateFilter,
    resetFilters,
    reportData,
    filteredRecords,
    isPending,
    refetch,
    selectedRecord,
    setSelectedRecord,
    isExportModalOpen,
    setIsExportModalOpen,
  } = useSuperadminAnalyticsPlatformReports();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0" data-testid="superadmin-platform-reports-main">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-card to-card shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-400">
            <Building2 size={22} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider">Level 1 Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Platform Reports & Growth Metrics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Aggregate intelligence on SaaS libraries, branch networks, active tenant accounts, and expansion velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer disabled:opacity-50 active:scale-95 shadow-2xs"
            aria-label="Refresh platform reports"
          >
            <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── 1. KPI Cards (6 Key Metrics) ── */}
      <SuperadminAnalyticsPlatformReportsKpiGrid kpis={reportData?.kpis} />

      {/* ── 2. Visual Growth & Status Distribution Charts ── */}
      <SuperadminAnalyticsPlatformReportsCharts
        growthTimeline={reportData?.growthTimeline}
        statusDistribution={reportData?.statusDistribution}
      />

      {/* ── 3. Filters & Search Bar ── */}
      <SuperadminAnalyticsPlatformReportsFilterBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        onOpenExport={() => setIsExportModalOpen(true)}
        filterOptions={reportData?.filterOptions}
      />

      {/* ── 4. Detailed Data Table ── */}
      <SuperadminAnalyticsPlatformReportsTable
        records={filteredRecords}
        onSelectRecord={setSelectedRecord}
        onResetFilters={resetFilters}
      />

      {/* ── 5. Export Modal (Excel, PDF, CSV, Print, Download) ── */}
      <SuperadminAnalyticsPlatformReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        records={filteredRecords}
        overviewData={reportData}
      />

      {/* ── 6. Detail Inspection Modal ── */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="record-detail-title"
        >
          <div className="w-full max-w-lg p-6 rounded-2xl border border-border bg-card shadow-xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono text-sky-400 uppercase tracking-wider">
                  {selectedRecord.libraryCode}
                </span>
                <h2 id="record-detail-title" className="text-base font-bold text-foreground">
                  {selectedRecord.libraryName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/30">
                <dt className="text-muted-foreground text-[11px]">Branches</dt>
                <dd className="font-bold text-foreground mt-0.5">{selectedRecord.branchCount} Active Branches</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <dt className="text-muted-foreground text-[11px]">Location</dt>
                <dd className="font-bold text-foreground mt-0.5">{selectedRecord.city}, {selectedRecord.state}</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <dt className="text-muted-foreground text-[11px]">Primary Admin</dt>
                <dd className="font-bold text-foreground mt-0.5">{selectedRecord.adminName}</dd>
                <dd className="text-[10px] text-muted-foreground truncate">{selectedRecord.adminEmail}</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <dt className="text-muted-foreground text-[11px]">Subscription Plan</dt>
                <dd className="font-bold text-foreground mt-0.5">{selectedRecord.plan}</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <dt className="text-muted-foreground text-[11px]">Account Status</dt>
                <dd className="font-bold text-foreground mt-0.5">{selectedRecord.status}</dd>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <dt className="text-muted-foreground text-[11px]">Payment Status</dt>
                <dd className="font-bold text-foreground mt-0.5">{selectedRecord.paymentStatus}</dd>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-muted/30 flex justify-between">
                <div>
                  <dt className="text-muted-foreground text-[11px]">Onboarded On</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{selectedRecord.createdDate}</dd>
                </div>
                <div className="text-right">
                  <dt className="text-muted-foreground text-[11px]">Last Activity</dt>
                  <dd className="font-semibold text-foreground mt-0.5">{selectedRecord.lastActiveDate}</dd>
                </div>
              </div>
            </dl>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
