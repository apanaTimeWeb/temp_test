'use client';
// RESPONSIBILITY: Superadmin Notification Center Header with platform quick stats and dispatch CTA.
// FLOW: SuperadminCommunicationNotificationCenterMain -> Header -> Compose modal trigger.

import { Bell, Mail, MessageSquare, PhoneCall, PlusCircle, Radio } from 'lucide-react';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import { useSuperadminUsageAnalyticsQuery } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';

export function SuperadminCommunicationNotificationCenterHeader() {
  const { setIsComposeOpen } = useSuperadminCommunicationNotificationCenterStore();
  const { data: usage } = useSuperadminUsageAnalyticsQuery();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/80">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary mt-1">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Notification & Communication Center
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gateways Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage global and account-specific notifications across Email, SMS, and WhatsApp with delivery tracking.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Quick channel pills */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/60 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 text-sky-400 font-medium">
            <Mail className="w-3.5 h-3.5" /> {usage?.channels.email.sentCount.toLocaleString() ?? '15.2k'}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <MessageSquare className="w-3.5 h-3.5" /> {usage?.channels.sms.sentCount.toLocaleString() ?? '8.1k'}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1 text-teal-400 font-medium">
            <PhoneCall className="w-3.5 h-3.5" /> {usage?.channels.whatsapp.sentCount.toLocaleString() ?? '5.1k'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-black font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer min-w-36"
          data-testid="superadmin-notif-compose-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Notification</span>
        </button>
      </div>
    </div>
  );
}
