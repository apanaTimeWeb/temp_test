'use client';
// RESPONSIBILITY: Superadmin Notification Center Header with platform quick stats and dispatch CTA in Cyber-Luxury theme.
// FLOW: SuperadminCommunicationNotificationCenterMain -> Header -> Compose modal trigger.

import { Bell, Mail, MessageSquare, PhoneCall, PlusCircle } from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useSuperadminUsageAnalyticsQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';

export function SuperadminCommunicationNotificationCenterHeader() {
  const { setIsComposeOpen } = useSuperadminCommunicationNotificationCenterStore();
  const { data: usage } = useSuperadminUsageAnalyticsQuery();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0d1338]/90 to-slate-900/90 border border-indigo-500/25 shadow-xl backdrop-blur-md">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner shadow-indigo-500/20 mt-0.5 shrink-0">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Notification Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              Gateways Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage global platform broadcasts and account-specific notifications across Email, SMS, and WhatsApp with delivery tracking.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
        {/* Quick channel statistics pills */}
        <div className="hidden xl:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-300 shadow-inner">
          <span className="flex items-center gap-1.5 text-sky-400 font-semibold" title="Email Dispatches">
            <Mail className="w-3.5 h-3.5" />
            <span>{usage?.channels.email.sentCount.toLocaleString() ?? '15,200'}</span>
          </span>
          <span className="text-indigo-500/40">|</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold" title="SMS Dispatches">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{usage?.channels.sms.sentCount.toLocaleString() ?? '8,150'}</span>
          </span>
          <span className="text-indigo-500/40">|</span>
          <span className="flex items-center gap-1.5 text-teal-400 font-semibold" title="WhatsApp Dispatches">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{usage?.channels.whatsapp.sentCount.toLocaleString() ?? '5,100'}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm active:scale-95 motion-safe:transition-all shadow-lg shadow-indigo-500/25 cursor-pointer min-w-36"
          data-testid="superadmin-notif-compose-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Notification</span>
        </button>
      </div>
    </div>
  );
}
