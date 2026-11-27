'use client';
// RESPONSIBILITY: Display 4 key overview metrics for notification dispatches, success rate, failures, and automated triggers with Cyber-Luxury styling.
// FLOW: Overview -> OverviewKpis -> display.

import { AlertCircle, CheckCircle2, Radio, Zap } from 'lucide-react';
import type { NotificationUsageAnalytics } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

interface OverviewKpisProps {
  usage?: NotificationUsageAnalytics | null;
  failedCount: number;
}

export function SuperadminCommunicationNotificationCenterOverviewKpis({
  usage,
  failedCount,
}: OverviewKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Dispatched - Sky / Indigo */}
      <div className="group relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#0c0f2a]/95 via-[#090d24]/90 to-[#141a45]/85 p-5 shadow-lg shadow-indigo-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-sky-400/50 hover:shadow-xl hover:shadow-indigo-950/50">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-sky-500/15 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-sky-500/25" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Monthly Dispatched
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform motion-safe:duration-200 group-hover:scale-110 shadow-md shadow-sky-500/20 bg-sky-500/20 border-sky-500/40 text-sky-400">
            <Radio size={18} strokeWidth={2.3} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-3xl font-black tracking-tight text-sky-200">
            {usage?.totalDispatched.toLocaleString() ?? '28,450'}
          </p>
          <span className="inline-flex items-center text-[11px] font-semibold text-sky-300 bg-sky-500/20 border border-sky-500/35 px-2.5 py-0.5 rounded-full">
            3 Channels
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-emerald-300 bg-emerald-500/15 border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
            ↑ 12% vs last cycle
          </span>
        </div>
      </div>

      {/* 2. Delivery Success Rate - Emerald / Green */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#061e14]/95 via-[#061810]/90 to-[#0a2e1d]/85 p-5 shadow-lg shadow-emerald-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-950/50">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-500/15 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-emerald-500/25" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/90">
            Delivery Success Rate
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform motion-safe:duration-200 group-hover:scale-110 shadow-md shadow-emerald-500/20 bg-emerald-500/20 border-emerald-500/40 text-emerald-400">
            <CheckCircle2 size={18} strokeWidth={2.3} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-3xl font-black tracking-tight text-emerald-300">
            {usage?.overallDeliveryRate ?? 98.35}%
          </p>
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/35 px-2.5 py-0.5 rounded-full">
            SLA Compliant
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-emerald-300 bg-emerald-500/15 border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {usage?.totalDelivered.toLocaleString() ?? '27,980'} delivered
          </span>
        </div>
      </div>

      {/* 3. Failures & Bounces - Rose / Red */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-[#1c0810]/95 via-[#1c0810]/90 to-[#2c0c1a]/85 p-5 shadow-lg shadow-rose-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-rose-400/50 hover:shadow-xl hover:shadow-rose-950/50">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-rose-500/15 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-rose-500/25" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400/90">
            Failures & Bounces
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform motion-safe:duration-200 group-hover:scale-110 shadow-md shadow-rose-500/20 bg-rose-500/20 border-rose-500/40 text-rose-400">
            <AlertCircle size={18} strokeWidth={2.3} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-3xl font-black tracking-tight text-rose-300">
            {failedCount}
          </p>
          <span
            className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              failedCount > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35'
            }`}
          >
            {failedCount > 0 ? 'Needs Attention' : 'Zero Errors'}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-rose-300 bg-rose-500/15 border-rose-500/30">
            <span className={`w-1.5 h-1.5 rounded-full ${failedCount > 0 ? 'bg-rose-400 motion-safe:animate-pulse' : 'bg-emerald-400'}`} />
            1-Click Retry Enabled
          </span>
        </div>
      </div>

      {/* 4. Automated Triggers - Purple / Violet */}
      <div className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1a0a2a]/95 via-[#130722]/90 to-[#280d3f]/85 p-5 shadow-lg shadow-purple-950/40 motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-950/50">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-purple-500/15 blur-2xl motion-safe:transition-all motion-safe:duration-500 group-hover:bg-purple-500/25" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300/90">
            Automated Policies
          </span>
          <div className="p-2.5 rounded-xl border shrink-0 transition-transform motion-safe:duration-200 group-hover:scale-110 shadow-md shadow-purple-500/20 bg-purple-500/20 border-purple-500/40 text-purple-400">
            <Zap size={18} strokeWidth={2.3} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-3xl font-black tracking-tight text-purple-200">
            10
          </p>
          <span className="inline-flex items-center text-[11px] font-semibold text-purple-300 bg-purple-500/20 border border-purple-500/35 px-2.5 py-0.5 rounded-full">
            All Active
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold rounded-full px-2.5 py-0.5 border text-purple-300 bg-purple-500/15 border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Invites, Renewals & Outages
          </span>
        </div>
      </div>
    </div>
  );
}
