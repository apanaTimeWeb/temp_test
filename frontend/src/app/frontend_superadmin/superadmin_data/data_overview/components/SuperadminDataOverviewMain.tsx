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
            onClick={handleSimulateSandboxDrill}
            disabled={isSimulatingDrill}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-foreground border border-border transition-colors disabled:opacity-50 cursor-pointer min-w-36 justify-center"
            data-testid="data_overview-top-drill-btn"
          >
            <RotateCcw size={14} className={isSimulatingDrill ? 'animate-spin text-emerald-400' : 'text-emerald-400'} />
            <span>{isSimulatingDrill ? 'Running Drill...' : 'Run Sandbox Drill'}</span>
          </button>

          <button
            type="button"
            onClick={openQuickBackupModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-colors shadow-xs cursor-pointer"
            data-testid="data_overview-top-backup-btn"
          >
            <Play size={14} />
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
