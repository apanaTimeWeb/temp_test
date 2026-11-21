'use client';
// RESPONSIBILITY: Category, priority and multi-channel selection (Email, SMS, WhatsApp) for notification compose.
// FLOW: ComposeModal -> ComposeChannelSelector -> form update.

import { Mail, MessageSquare, PhoneCall } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { DispatchNotificationSchema } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/schemas/SuperadminCommunicationNotificationCenterSchemas';
import type {
  NotificationCategory,
  NotificationChannel,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

interface ComposeChannelSelectorProps {
  selectedChannels: NotificationChannel[];
  onChannelToggle: (ch: NotificationChannel) => void;
  onCategoryChange: (cat: NotificationCategory) => void;
  register: UseFormRegister<DispatchNotificationSchema>;
  channelsError?: string;
}

export function SuperadminCommunicationNotificationCenterComposeChannelSelector({
  selectedChannels,
  onChannelToggle,
  onCategoryChange,
  register,
  channelsError,
}: ComposeChannelSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Category / Template Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Notification Category</label>
          <select
            {...register('category')}
            onChange={(e) => onCategoryChange(e.target.value as NotificationCategory)}
            className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="ADMIN_INVITATION">Admin Invitations</option>
            <option value="WELCOME_MESSAGE">Welcome Message</option>
            <option value="SUBSCRIPTION_EXPIRY_REMINDER">Subscription Expiry Reminder</option>
            <option value="PAYMENT_REMINDER">Payment Reminder</option>
            <option value="FAILED_PAYMENT_NOTIFICATION">Failed Payment Notification</option>
            <option value="BRANCH_CREATION_CONFIRMATION">Branch Creation Confirmation</option>
            <option value="MAINTENANCE_ALERT">Maintenance Alert</option>
            <option value="SYSTEM_OUTAGE_NOTIFICATION">System Outage Notification</option>
            <option value="SECURITY_ALERT">Security Alert</option>
            <option value="PRODUCT_ANNOUNCEMENT">Product Announcements</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Urgency Priority</label>
          <select
            {...register('priority')}
            className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="NORMAL">Normal Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="URGENT">Urgent (Immediate Push)</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Delivery Channels */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center justify-between">
          <span>Active Transmission Channels</span>
          <span className="text-2xs text-muted-foreground">Select at least one</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onChannelToggle('EMAIL')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              selectedChannels.includes('EMAIL')
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-xs'
                : 'border-border/60 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => onChannelToggle('SMS')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              selectedChannels.includes('SMS')
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                : 'border-border/60 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>SMS</span>
          </button>

          <button
            type="button"
            onClick={() => onChannelToggle('WHATSAPP')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              selectedChannels.includes('WHATSAPP')
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-xs'
                : 'border-border/60 text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-teal-400" />
            <span>WhatsApp</span>
          </button>
        </div>
        {channelsError && (
          <p className="text-2xs text-destructive">{channelsError}</p>
        )}
      </div>
    </div>
  );
}
