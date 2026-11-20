'use client';
// RESPONSIBILITY: Display usage tracking, quota monitoring, and delivery rate analytics across Email, SMS, and WhatsApp.
// FLOW: SuperadminCommunicationNotificationCenterMain -> UsageView -> charts & quota meters.

import {
  BarChart3,
  Mail,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useSuperadminUsageAnalyticsQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';

export function SuperadminCommunicationNotificationCenterUsageView() {
  const { data: usage, isLoading } = useSuperadminUsageAnalyticsQuery();

  if (isLoading || !usage) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border/80 flex items-center justify-center text-muted-foreground text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>Loading usage and quota analytics…</span>
      </div>
    );
  }

  const channels = [
    {
      channel: 'Email',
      icon: Mail,
      data: usage.channels.email,
      accent: 'sky',
      quotaColor: 'bg-sky-500',
    },
    {
      channel: 'SMS',
      icon: MessageSquare,
      data: usage.channels.sms,
      accent: 'emerald',
      quotaColor: 'bg-emerald-500',
    },
    {
      channel: 'WhatsApp',
      icon: PhoneCall,
      data: usage.channels.whatsapp,
      accent: 'teal',
      quotaColor: 'bg-teal-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Communication Quota & Consumption Cockpit ({usage.period})</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time delivery status, provider balance consumption, and monthly transmission quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Overall Delivery Success:</span>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {usage.overallDeliveryRate}%
          </span>
        </div>
      </div>

      {/* 3 Channel Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channels.map(({ channel, icon: Icon, data, quotaColor }) => (
          <div
            key={channel}
            className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4"
            data-testid={`quota-card-${channel.toLowerCase()}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-muted/60 border border-border/50">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{channel}</h3>
                  <p className="text-2xs text-muted-foreground">Monthly Transmission Quota</p>
                </div>
              </div>

              <span className="text-xs font-bold text-foreground">
                {data.quotaUsedPercent}% used
              </span>
            </div>

            {/* Quota Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={`h-full rounded-full ${quotaColor}`}
                  style={{ width: `${Math.min(data.quotaUsedPercent, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-2xs text-muted-foreground">
                <span>{data.sentCount.toLocaleString()} sent</span>
                <span>{data.monthlyQuota.toLocaleString()} quota</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
              <div>
                <span className="text-2xs text-muted-foreground block">Delivery Rate</span>
                <span className="font-semibold text-emerald-400">{data.deliverySuccessRate}%</span>
              </div>
              <div>
                <span className="text-2xs text-muted-foreground block">Failed / Bounced</span>
                <span className="font-semibold text-rose-400">{data.failedCount}</span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-2xs text-muted-foreground block">Estimated Spend</span>
                <span className="font-semibold text-foreground">
                  ₹{(data.costInMinorUnits / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Volume Summary Table */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>7-Day Transmission Activity by Channel</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/20 text-2xs text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">SMS</th>
                <th className="px-3 py-2">WhatsApp</th>
                <th className="px-3 py-2">Daily Total</th>
                <th className="px-3 py-2 text-right">Failures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {usage.dailyVolume.map((day) => {
                const total = day.email + day.sms + day.whatsapp;
                return (
                  <tr key={day.date} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 font-medium text-foreground">{day.date}</td>
                    <td className="px-3 py-2 text-sky-400">{day.email.toLocaleString()}</td>
                    <td className="px-3 py-2 text-emerald-400">{day.sms.toLocaleString()}</td>
                    <td className="px-3 py-2 text-teal-400">{day.whatsapp.toLocaleString()}</td>
                    <td className="px-3 py-2 font-semibold text-foreground">{total.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-rose-400 font-semibold">{day.failures}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
