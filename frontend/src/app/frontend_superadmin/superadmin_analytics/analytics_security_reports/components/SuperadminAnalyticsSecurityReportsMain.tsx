'use client';
// RESPONSIBILITY: Primary layout and composition orchestrator for Superadmin Security Reports.
// FLOW: useSuperadminAnalyticsSecurityReports -> SuperadminAnalyticsSecurityReportsMain -> Child presentation components.

import React from 'react';
import { ShieldAlert, RefreshCw, X, Download } from 'lucide-react';
import { useSuperadminAnalyticsSecurityReports } from '../hooks/useSuperadminAnalyticsSecurityReports';
import { SuperadminAnalyticsSecurityReportsKpiGrid } from './SuperadminAnalyticsSecurityReportsKpiGrid';
import { SuperadminAnalyticsSecurityReportsCharts } from './SuperadminAnalyticsSecurityReportsCharts';
import { SuperadminAnalyticsSecurityReportsFilterBar } from './SuperadminAnalyticsSecurityReportsFilterBar';
import { SuperadminAnalyticsSecurityReportsTable } from './SuperadminAnalyticsSecurityReportsTable';
import { SuperadminAnalyticsSecurityReportsExportModal } from './SuperadminAnalyticsSecurityReportsExportModal';
import { formatSecurityEventLabel } from '../utils/SuperadminAnalyticsSecurityReportsFormatters';

export function SuperadminAnalyticsSecurityReportsMain() {
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
  } = useSuperadminAnalyticsSecurityReports();

  return (
    <div
      className="space-y-6 w-full max-w-full min-w-0"
      data-testid="superadmin-analytics-security-reports-main"
    >
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Platform Security & Threat Audit Reports
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Security Telemetry
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Login history, failed logins, locked accounts, permission changes, exports, and suspicious activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer disabled:opacity-50"
            title="Refresh security audit log"
          >
            <RefreshCw size={13} className={isPending ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            data-testid="security-reports-open-export-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={14} />
            <span>Export & Print</span>
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {isError && (
        <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center justify-between">
          <span>Failed to load security audit telemetry: {error?.message || 'Server error'}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-bold underline hover:no-underline cursor-pointer"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* ── 1. KPI Metric Summary Grid (Total Logins, Failed Logins, Locked Accounts, Permission Changes, Exports, Suspicious) ── */}
      <SuperadminAnalyticsSecurityReportsKpiGrid kpis={reportData?.kpis} />

      {/* ── 2. Security Trends & Threat Vector Distribution ── */}
      <SuperadminAnalyticsSecurityReportsCharts
        auditTrends={reportData?.auditTrends}
        threatDistribution={reportData?.kpis?.threatDistribution}
      />

      {/* ── 3. Filter Bar (7 Controls + Search) ── */}
      <SuperadminAnalyticsSecurityReportsFilterBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        onOpenExport={() => setIsExportModalOpen(true)}
        filterOptions={reportData?.filterOptions}
      />

      {/* ── 4. Detailed Security Events Table ── */}
      <SuperadminAnalyticsSecurityReportsTable
        records={filteredRecords}
        isLoading={isPending}
        selectedRecord={selectedRecord}
        onSelectRecord={setSelectedRecord}
        totalCount={reportData?.totalCount ?? filteredRecords.length}
        currentPage={filters.page}
        pageSize={filters.limit}
        onPageChange={(page) => updateFilter('page', page)}
      />

      {/* ── Security Event Detail Slide-Over ── */}
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
                  {formatSecurityEventLabel(selectedRecord.eventType)}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedRecord.timestamp} • {selectedRecord.severity} Severity</p>
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
                <span className="text-muted-foreground">Target Library</span>
                <span className="font-semibold text-foreground">{selectedRecord.libraryName} ({selectedRecord.libraryCode})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Branch Unit</span>
                <span className="font-semibold text-foreground">{selectedRecord.branchName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">User / Actor</span>
                <span className="font-semibold text-foreground">{selectedRecord.adminName} ({selectedRecord.adminEmail})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Subscription Plan</span>
                <span className="font-medium text-foreground">{selectedRecord.plan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Operating Status</span>
                <span className="font-semibold text-foreground">{selectedRecord.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Origin IP Address</span>
                <span className="font-mono text-rose-400 font-bold">{selectedRecord.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-muted-foreground">Geo Location</span>
                <span className="font-medium text-foreground">{selectedRecord.location}</span>
              </div>
              <div className="py-2">
                <span className="text-muted-foreground block mb-1">Audit Details / Payload</span>
                <p className="p-2.5 rounded-xl bg-muted/40 font-mono text-[11px] text-foreground leading-relaxed">
                  {selectedRecord.details}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer"
            >
              Close Event Details
            </button>
          </div>
        </div>
      )}

      {/* ── Export & Print Modal (Excel, PDF, CSV, Print, Download) ── */}
      <SuperadminAnalyticsSecurityReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        records={filteredRecords}
        overviewData={reportData ?? undefined}
      />
    </div>
  );
}
