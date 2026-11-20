// components/SuperadminDataOverviewKpis.tsx
// RESPONSIBILITY: Renders the top KPI cards for Superadmin Data Overview (Platform DR Score, Snapshots, Storage, Replication). No API calls.
'use client';

import React from 'react';
import { Database, HardDrive, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import type { SuperadminDataOverviewMetrics } from '@/app/frontend_superadmin/superadmin_data/data_overview/types/superadmin_data_overview.types';
import { formatGigabytes, getStatusBadgeVariant } from '@/app/frontend_superadmin/superadmin_data/data_overview/utils/superadmin_data_overview_formatters';
import { displayValue } from '@/lib/display_value';

interface SuperadminDataOverviewKpisProps {
  metrics: SuperadminDataOverviewMetrics | undefined;
}

export function SuperadminDataOverviewKpis({ metrics }: SuperadminDataOverviewKpisProps) {
  if (!metrics) return null;

  const storagePercentage = Math.min(
    100,
    Math.round((metrics.totalStorageUsedGb / metrics.storageQuotaGb) * 100)
  );

  const replicationBadge = getStatusBadgeVariant(metrics.replicationHealth);
  const tenantBadge = getStatusBadgeVariant(metrics.tenantIsolationIntegrity);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="data_overview-kpis-grid">
      {/* 1. DR Readiness Score */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            DR Readiness Score
          </span>
          <span className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <ShieldCheck size={18} />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {displayValue(metrics.platformDrScore)}%
          </span>
          <span className="text-xs text-emerald-400 font-semibold">Tier-4 High Availability</span>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Cross-region synchronized & zero tenant bleed
        </div>
      </div>

      {/* 2. Active Snapshots */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Snapshots
          </span>
          <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Database size={18} />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {displayValue(metrics.totalSnapshotsCount)}
          </span>
          <span className="text-xs text-sky-400 font-medium">
            {metrics.activeSchedulesCount} Active Schedules
          </span>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Last: {metrics.lastBackupTimestamp}
        </div>
      </div>

      {/* 3. Storage Consumption */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Cloud Storage Used
          </span>
          <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <HardDrive size={18} />
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {formatGigabytes(metrics.totalStorageUsedGb)}
          </span>
          <span className="text-xs text-muted-foreground">
            / {formatGigabytes(metrics.storageQuotaGb)}
          </span>
        </div>
        <div className="mt-2 w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              storagePercentage > 85 ? 'bg-rose-500' : 'bg-pink-500'
            }`}
            style={{ width: `${storagePercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Multi-Tenant Isolation Integrity */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tenant Isolation Status
          </span>
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers size={18} />
          </span>
        </div>
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${tenantBadge.bg} ${tenantBadge.text}`}>
            {tenantBadge.label}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
          <RefreshCw size={11} className="text-emerald-400" />
          Replication: {replicationBadge.label}
        </div>
      </div>
    </div>
  );
}
