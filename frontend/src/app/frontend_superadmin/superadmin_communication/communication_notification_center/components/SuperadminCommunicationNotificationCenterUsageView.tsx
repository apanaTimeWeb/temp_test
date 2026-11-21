'use client';
// RESPONSIBILITY: Display usage tracking, quota monitoring, and delivery rate analytics across Email, SMS, and WhatsApp with Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNotificationCenterMain -> UsageView -> charts & quota meters.

import {
  BarChart3,
  Mail,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useSuperadminUsageAnalyticsQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';

export function SuperadminCommunicationNotificationCenterUsageView() {
  const { data: usage, isLoading } = useSuperadminUsageAnalyticsQuery();

  if (isLoading || !usage) {
    return (
      <div className="p-8 rounded-2xl bg-[#0c102b]/85 border border-indigo-500/20 flex items-center justify-center text-slate-400 text-sm shadow-xl">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-indigo-400" />
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
      quotaColor: 'bg-gradient-to-r from-sky-500 to-indigo-500',
    },
    {
      channel: 'SMS',
      icon: MessageSquare,
      data: usage.channels.sms,
      accent: 'emerald',
      quotaColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    },
    {
      channel: 'WhatsApp',
      icon: PhoneCall,
      data: usage.channels.whatsapp,
      accent: 'teal',
      quotaColor: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl sm:rounded-3xl bg-[#0c102b]/85 border border-indigo-500/20 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span>Communication Quota & Consumption Cockpit ({usage.period})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time delivery status, provider balance consumption, and monthly transmission quotas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400">Overall Delivery Success:</span>
          <span className="text-sm font-bold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-xs">
            {usage.overallDeliveryRate}%
          </span>
        </div>
      </div>

      {/* 3 Channel Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channels.map(({ channel, icon: Icon, data, quotaColor }) => (
          <div
            key={channel}
            className="p-5 rounded-2xl bg-[#0b0f28]/90 border border-indigo-500/20 hover:border-indigo-400/40 shadow-xl backdrop-blur-md space-y-4 transition-all"
            data-testid={`quota-card-${channel.toLowerCase()}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-indigo-400 shadow-inner">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{channel}</h3>
                  <p className="text-2xs text-slate-400">Monthly Transmission Quota</p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {data.quotaUsedPercent}% used
              </span>
            </div>

            {/* Quota Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-slate-900/90 border border-indigo-500/20 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full ${quotaColor} shadow-sm`}
                  style={{ width: `${Math.min(data.quotaUsedPercent, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-2xs text-slate-400">
                <span><strong className="text-slate-200">{data.sentCount.toLocaleString()}</strong> sent</span>
                <span>{data.monthlyQuota.toLocaleString()} quota</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-indigo-500/20 text-xs">
              <div>
                <span className="text-2xs text-slate-400 block">Delivery Rate</span>
                <span className="font-bold text-emerald-400">{data.deliverySuccessRate}%</span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block">Failed / Bounced</span>
                <span className="font-bold text-rose-400">{data.failedCount}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-indigo-500/10">
                <span className="text-2xs text-slate-400 block">Estimated Spend</span>
                <span className="font-bold text-white">
                  ₹{(data.costInMinorUnits / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Volume Summary Table */}
      <div className="p-5 rounded-2xl bg-[#0b0f28]/90 border border-indigo-500/20 shadow-xl backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span>7-Day Transmission Activity by Channel</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-indigo-500/20 bg-[#0a0d24]/90">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-indigo-500/25 bg-slate-950/90 text-2xs text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-3.5 py-2.5">Date</th>
                <th className="px-3.5 py-2.5">Email</th>
                <th className="px-3.5 py-2.5">SMS</th>
                <th className="px-3.5 py-2.5">WhatsApp</th>
                <th className="px-3.5 py-2.5">Daily Total</th>
                <th className="px-3.5 py-2.5 text-right">Failures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/15">
              {usage.dailyVolume.map((day) => {
                const total = day.email + day.sms + day.whatsapp;
                return (
                  <tr key={day.date} className="hover:bg-indigo-950/20 transition-colors text-slate-200">
                    <td className="px-3.5 py-2.5 font-bold text-white">{day.date}</td>
                    <td className="px-3.5 py-2.5 text-sky-400 font-semibold">{day.email.toLocaleString()}</td>
                    <td className="px-3.5 py-2.5 text-emerald-400 font-semibold">{day.sms.toLocaleString()}</td>
                    <td className="px-3.5 py-2.5 text-teal-400 font-semibold">{day.whatsapp.toLocaleString()}</td>
                    <td className="px-3.5 py-2.5 font-bold text-white">{total.toLocaleString()}</td>
                    <td className="px-3.5 py-2.5 text-right">
                      <span className="text-rose-400 font-bold">{day.failures}</span>
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
