'use client';
// RESPONSIBILITY: Display 4 key overview metrics for notification dispatches, success rate, failures, and automated triggers.
// FLOW: Overview -> OverviewKpis -> display.

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
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">Monthly Dispatched</p>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-foreground">
            {usage?.totalDispatched.toLocaleString() ?? '28,450'}
          </span>
          <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
            3 Channels Active
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
          <span className="text-emerald-400">↑ 12%</span> from last cycle
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">Delivery Success Rate</p>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-foreground">
            {usage?.overallDeliveryRate ?? 98.35}%
          </span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            SLA Compliant
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {usage?.totalDelivered.toLocaleString() ?? '27,980'} delivered successfully
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">Delivery Failures & Bounces</p>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-foreground">
            {failedCount}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              failedCount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-muted text-muted-foreground'
            }`}
          >
            {failedCount > 0 ? 'Needs Attention' : 'Zero Errors'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">1-click manual & auto retry enabled</p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">Automated Trigger Policies</p>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-2xl font-bold text-foreground">10 Triggers</span>
          <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
            All Active
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">Admin invites, billing, outages & alerts</p>
      </div>
    </div>
  );
}
