'use client';

import React from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import type { IntegrationSummaryStats } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';

interface SuperadminIntegrationsOverviewKpisProps {
  summary: IntegrationSummaryStats | null | undefined;
}

export function SuperadminIntegrationsOverviewKpis({ summary }: SuperadminIntegrationsOverviewKpisProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-indigo-500/10 blur-xl" />
        <span className="text-[11px] font-medium text-slate-400 block">Total Providers</span>
        <div className="text-xl font-bold text-slate-100">{summary?.totalGateways ?? 11}</div>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl" />
        <span className="text-[11px] font-medium text-slate-400 block">Active Live</span>
        <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 size={16} /> {summary?.activeGateways ?? 9}
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-amber-500/10 blur-xl" />
        <span className="text-[11px] font-medium text-slate-400 block">Failed Retries Queue</span>
        <div className="text-xl font-bold text-amber-400 flex items-center gap-1.5">
          <RefreshCw size={16} /> {summary?.failedWebhooksCount ?? 2}
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-purple-500/10 blur-xl" />
        <span className="text-[11px] font-medium text-slate-400 block">Active API Keys</span>
        <div className="text-xl font-bold text-purple-300">{summary?.activeApiKeysCount ?? 2}</div>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/90 via-[#090d24]/90 to-[#050714]/90 p-4 space-y-1 shadow-lg backdrop-blur-md relative overflow-hidden col-span-2 sm:col-span-1">
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-cyan-500/10 blur-xl" />
        <span className="text-[11px] font-medium text-slate-400 block">API Calls Today</span>
        <div className="text-xl font-bold text-cyan-400">
          {(summary?.todayApiRequestsCount ?? 148290).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
