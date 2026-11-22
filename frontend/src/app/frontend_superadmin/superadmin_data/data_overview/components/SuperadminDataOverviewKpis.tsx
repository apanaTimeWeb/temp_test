// components/SuperadminDataOverviewKpis.tsx
// RESPONSIBILITY: Renders colorful, premium jewel-styled KPI cards for Superadmin Data Overview (Platform DR Score, Snapshots, Storage, Replication). No API calls.
'use client';

import React from 'react';
import { Database, HardDrive, ShieldCheck, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" data-testid="data_overview-kpis-grid">
      {/* 1. DR Readiness Score - Emerald Jewel Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-[#07251a] to-[#04150e] p-5 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/60 transition-all duration-300 flex flex-col justify-between group">
        {/* Decorative background glow */}
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              DR Readiness Score
            </span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-xs">
              <ShieldCheck size={20} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {displayValue(metrics.platformDrScore)}%
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 font-bold">
              Tier-4 HA
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-200/80">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Cross-Region Synchronized
          </span>
          <span className="text-emerald-300 font-bold">0% Bleed</span>
        </div>
      </div>

      {/* 2. Active Snapshots - Sky Blue Jewel Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/70 via-[#07213d] to-[#041424] p-5 shadow-lg shadow-sky-950/40 hover:border-sky-400/60 transition-all duration-300 flex flex-col justify-between group">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-sky-500/10 blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all" />
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Active Snapshots
            </span>
            <span className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-300 shadow-xs">
              <Database size={20} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {displayValue(metrics.totalSnapshotsCount)}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/25 border border-sky-500/40 text-sky-200 font-bold">
              {metrics.activeSchedulesCount} Policies
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-sky-500/20 flex items-center justify-between text-[11px] text-sky-200/80">
          <span className="truncate max-w-[190px]">
            Last: {metrics.lastBackupTimestamp}
          </span>
          <span className="text-sky-300 font-semibold shrink-0">Atomic</span>
        </div>
      </div>

      {/* 3. Storage Consumption - Amber/Gold Jewel Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/70 via-[#2a1b06] to-[#150d03] p-5 shadow-lg shadow-amber-950/40 hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between group">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-500/10 blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Cloud Storage Used
            </span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 shadow-xs">
              <HardDrive size={20} />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatGigabytes(metrics.totalStorageUsedGb)}
            </span>
            <span className="text-xs text-amber-300/80 font-medium">
              / {formatGigabytes(metrics.storageQuotaGb)}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="w-full bg-amber-950/80 border border-amber-500/30 rounded-full h-2 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                storagePercentage > 85
                  ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300'
              }`}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-200/80">
            <span>{storagePercentage}% Quota Consumed</span>
            <span className="text-amber-300 font-bold">AES-256</span>
          </div>
        </div>
      </div>

      {/* 4. Multi-Tenant Isolation Integrity - Pink/Purple Jewel Theme */}
      <div className="relative overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-950/70 via-[#2d0a20] to-[#170410] p-5 shadow-lg shadow-pink-950/40 hover:border-pink-400/60 transition-all duration-300 flex flex-col justify-between group">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-pink-500/10 blur-2xl pointer-events-none group-hover:bg-pink-500/20 transition-all" />
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              Tenant Isolation Status
            </span>
            <span className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 shadow-xs">
              <Layers size={20} />
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 shadow-xs">
              <CheckCircle2 size={13} className="text-emerald-400" />
              {tenantBadge.label}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between text-[11px] text-pink-200/80">
          <span className="flex items-center gap-1.5 font-medium">
            <RefreshCw size={11} className="text-pink-400 animate-spin" />
            Replication: {replicationBadge.label}
          </span>
          <span className="text-pink-300 font-semibold">Zero-Bleed</span>
        </div>
      </div>
    </div>
  );
}
