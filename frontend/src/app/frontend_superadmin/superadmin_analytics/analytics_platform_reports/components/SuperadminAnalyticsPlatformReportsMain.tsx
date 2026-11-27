'use client';
// RESPONSIBILITY: Primary layout and composition orchestrator for Superadmin Platform Reports.
// FLOW: useSuperadminAnalyticsPlatformReports -> SuperadminAnalyticsPlatformReportsMain -> Child presentation components.

import React from 'react';
import { Building2, RefreshCw, X } from 'lucide-react';
import { useSuperadminAnalyticsPlatformReports } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/hooks/useSuperadminAnalyticsPlatformReports';
import { SuperadminAnalyticsPlatformReportsKpiGrid } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/components/SuperadminAnalyticsPlatformReportsKpiGrid';
import { SuperadminAnalyticsPlatformReportsCharts } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/components/SuperadminAnalyticsPlatformReportsCharts';
import { SuperadminAnalyticsPlatformReportsFilterBar } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/components/SuperadminAnalyticsPlatformReportsFilterBar';
import { SuperadminAnalyticsPlatformReportsTable } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/components/SuperadminAnalyticsPlatformReportsTable';
import { SuperadminAnalyticsPlatformReportsExportModal } from '@/app/frontend_superadmin/superadmin_analytics/analytics_platform_reports/components/SuperadminAnalyticsPlatformReportsExportModal';

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
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-info-bg border border-border text-info text-xs font-semibold mb-2">
              <Building2 size={13} aria-hidden="true" />
              <span>Multi-Tenant Platform Directory</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-primary tracking-tight">
              Platform Reports & Growth Metrics
            </h1>
            <p className="text-xs sm:text-sm text-secondary max-w-2xl leading-relaxed">
              Aggregate intelligence on SaaS libraries, branch networks, active tenant accounts, and expansion velocity.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-input border border-border hover:bg-surface-hover text-secondary hover:text-primary text-xs font-semibold motion-safe:transition-all shadow-card cursor-pointer disabled:opacity-50 motion-safe:active:scale-95"
              aria-label="Refresh platform reports"
            >
              <RefreshCw size={13} className={isPending ? 'motion-safe:animate-spin text-primary' : 'text-primary'} />
              <span>Refresh</span>
            </button>
          </div>
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
        overviewData={reportData ?? undefined}
      />

      {/* ── 6. Detail Inspection Modal ── */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="record-detail-title"
        >
          <div className="w-full max-w-lg p-6 rounded-2xl border border-indigo-500/30 bg-[#0a0d24] text-white shadow-2xl shadow-indigo-950/60 space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono text-sky-400 uppercase tracking-wider">
                  {selectedRecord.libraryCode}
                </span>
                <h2 id="record-detail-title" className="text-base font-bold text-white">
                  {selectedRecord.libraryName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                <dt className="text-slate-400 text-[11px]">Branches</dt>
                <dd className="font-bold text-white mt-0.5">{selectedRecord.branchCount} Active Branches</dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                <dt className="text-slate-400 text-[11px]">Location</dt>
                <dd className="font-bold text-white mt-0.5">{selectedRecord.city}, {selectedRecord.state}</dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                <dt className="text-slate-400 text-[11px]">Primary Admin</dt>
                <dd className="font-bold text-white mt-0.5">{selectedRecord.adminName}</dd>
                <dd className="text-[10px] text-slate-400 truncate">{selectedRecord.adminEmail}</dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                <dt className="text-slate-400 text-[11px]">Subscription Plan</dt>
                <dd className="font-bold text-sky-400 mt-0.5">{selectedRecord.plan}</dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                <dt className="text-slate-400 text-[11px]">Account Status</dt>
                <dd className="font-bold text-emerald-400 mt-0.5">{selectedRecord.status}</dd>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20">
                <dt className="text-slate-400 text-[11px]">Payment Status</dt>
                <dd className="font-bold text-white mt-0.5">{selectedRecord.paymentStatus}</dd>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 flex justify-between">
                <div>
                  <dt className="text-slate-400 text-[11px]">Onboarded On</dt>
                  <dd className="font-semibold text-white mt-0.5">{selectedRecord.createdDate}</dd>
                </div>
                <div className="text-right">
                  <dt className="text-slate-400 text-[11px]">Last Activity</dt>
                  <dd className="font-semibold text-white mt-0.5">{selectedRecord.lastActiveDate}</dd>
                </div>
              </div>
            </dl>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
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
