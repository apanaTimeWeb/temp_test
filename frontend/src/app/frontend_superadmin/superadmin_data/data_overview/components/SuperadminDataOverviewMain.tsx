// components/SuperadminDataOverviewMain.tsx
// RESPONSIBILITY: Root client orchestrator for Superadmin Data Overview. Owns layout, toolbars and modals; no direct fetch calls.
'use client';

import React from 'react';
import { Database, Play, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';
import { useSuperadminDataOverview } from '@/app/frontend_superadmin/superadmin_data/data_overview/hooks/useSuperadminDataOverview';
import { SuperadminDataOverviewKpis } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewKpis';
import { SuperadminDataOverviewRpoRtoGauges } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewRpoRtoGauges';
import { SuperadminDataOverviewStorageBreakdown } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewStorageBreakdown';
import { SuperadminDataOverviewActivityFeed } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewActivityFeed';
import { SuperadminDataOverviewQuickBackupModal } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewQuickBackupModal';
import { SuperadminDataOverviewSkeleton } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewSkeleton';
import { SuperadminDataOverviewEmptyState } from '@/app/frontend_superadmin/superadmin_data/data_overview/components/SuperadminDataOverviewEmptyState';

export function SuperadminDataOverviewMain() {
  const {
    metrics,
    rpoRto,
    activities,
    storage,
    isLoading,
    isError,
    errorMessage,
    refetch,
    isQuickBackupModalOpen,
    isSimulatingDrill,
    activityFilter,
    openQuickBackupModal,
    closeQuickBackupModal,
    setActivityFilter,
    triggerQuickBackup,
    isSubmittingQuickBackup,
    handleSimulateSandboxDrill,
  } = useSuperadminDataOverview();

  if (isLoading) {
    return <SuperadminDataOverviewSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 space-y-3" data-testid="data_overview-error">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertCircle size={18} />
          Failed to load Disaster Recovery metrics
        </div>
        <p className="text-xs text-rose-300/80">{errorMessage || 'An unexpected error occurred while communicating with DR orchestrator.'}</p>
        <button
          type="button"
          onClick={refetch}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
        >
          <RefreshCw size={12} />
          Retry Connection
        </button>
      </div>
    );
  }

  if (!metrics && (!activities || activities.length === 0)) {
    return <SuperadminDataOverviewEmptyState onTriggerBackup={openQuickBackupModal} />;
  }

  return (
    <div className="space-y-6" data-testid="superadmin_data_overview-main">
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
            <Database size={24} />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Disaster Recovery & Data Health Cockpit
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-bold">
                Tier-4 Platform Resiliency
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuous WAL replication, point-in-time RPO/RTO verification, and tenant-isolated restoration
            </p>
          </div>
        </div>

        {/* ── Quick Action Buttons ── */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => refetch()}
            className="group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 motion-safe:transition-all motion-safe:duration-300 shadow-sm hover:border-slate-600 active:scale-[0.97] cursor-pointer"
            data-testid="data_overview-top-refresh-btn"
            title="Refresh DR status"
          >
            <span className="p-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 group-hover:rotate-180 transition-transform motion-safe:duration-500">
              <RefreshCw size={13} />
            </span>
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openQuickBackupModal}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:from-pink-500 hover:to-rose-400 text-white motion-safe:transition-all motion-safe:duration-300 shadow-lg shadow-pink-600/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
            data-testid="data_overview-top-backup-btn"
          >
            <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
              <Play size={13} className="fill-white" />
            </span>
            <span>Trigger Instant Snapshot</span>
          </button>
        </div>
      </div>

      {/* ── 1. KPI Metric Cards ── */}
      <SuperadminDataOverviewKpis metrics={metrics} />

      {/* ── 2. RPO / RTO Deep Verification Gauges ── */}
      <SuperadminDataOverviewRpoRtoGauges
        rpoRto={rpoRto}
        onSimulateDrill={handleSimulateSandboxDrill}
        isSimulatingDrill={isSimulatingDrill}
      />

      {/* ── 3. Multi-Cloud Storage Allocation ── */}
      <SuperadminDataOverviewStorageBreakdown storage={storage} />

      {/* ── 4. Recent Operations Activity Feed ── */}
      <SuperadminDataOverviewActivityFeed
        activities={activities}
        currentFilter={activityFilter}
        onFilterChange={setActivityFilter}
      />

      {/* ── Quick Backup Modal ── */}
      <SuperadminDataOverviewQuickBackupModal
        isOpen={isQuickBackupModalOpen}
        onClose={closeQuickBackupModal}
        onSubmit={triggerQuickBackup}
        isSubmitting={isSubmittingQuickBackup}
      />
    </div>
  );
}
