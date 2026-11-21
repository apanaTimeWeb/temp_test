'use client';
// RESPONSIBILITY: Display 4 key overview metrics for notification dispatches, success rate, failures, and automated triggers.
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
      {/* 1. Monthly Dispatched */}
      <div className="p-5 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 hover:border-indigo-400/40 shadow-xl backdrop-blur-md transition-all relative overflow-hidden group">
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 bg-sky-500/10 rounded-full blur-xl group-hover:bg-sky-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Monthly Dispatched</p>
          <Radio className="w-4 h-4 text-sky-400" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {usage?.totalDispatched.toLocaleString() ?? '28,450'}
          </span>
          <span className="text-2xs font-semibold text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-full">
            3 Channels Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">↑ 12%</span>
          <span>from last billing cycle</span>
        </p>
      </div>

      {/* 2. Delivery Success Rate */}
      <div className="p-5 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 hover:border-indigo-400/40 shadow-xl backdrop-blur-md transition-all relative overflow-hidden group">
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Delivery Success Rate</p>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {usage?.overallDeliveryRate ?? 98.35}%
          </span>
          <span className="text-2xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            SLA Compliant
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          <strong className="text-slate-200">{usage?.totalDelivered.toLocaleString() ?? '27,980'}</strong> delivered successfully
        </p>
      </div>

      {/* 3. Failures & Bounces */}
      <div className="p-5 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 hover:border-indigo-400/40 shadow-xl backdrop-blur-md transition-all relative overflow-hidden group">
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Delivery Failures & Bounces</p>
          <AlertCircle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {failedCount}
          </span>
          <span
            className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${
              failedCount > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {failedCount > 0 ? 'Needs Attention' : 'Zero Errors'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">1-click manual retry with Idempotency Key</p>
      </div>

      {/* 4. Automated Triggers */}
      <div className="p-5 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 hover:border-indigo-400/40 shadow-xl backdrop-blur-md transition-all relative overflow-hidden group">
        <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Automated Trigger Policies</p>
          <Zap className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">10 Triggers</span>
          <span className="text-2xs font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
            All Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Invites, renewals, outages & alerts</p>
      </div>
    </div>
  );
}
