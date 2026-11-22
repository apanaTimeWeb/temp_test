'use client';
// RESPONSIBILITY: Category, priority and multi-channel selection (Email, SMS, WhatsApp) for notification compose in Cyber-Luxury styling.
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
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200">Notification Category</label>
          <select
            {...register('category')}
            onChange={(e) => onCategoryChange(e.target.value as NotificationCategory)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
          >
            <option value="ADMIN_INVITATION" className="bg-slate-900 text-slate-100">Admin Invitations</option>
            <option value="WELCOME_MESSAGE" className="bg-slate-900 text-slate-100">Welcome Message</option>
            <option value="SUBSCRIPTION_EXPIRY_REMINDER" className="bg-slate-900 text-slate-100">Subscription Expiry Reminder</option>
            <option value="PAYMENT_REMINDER" className="bg-slate-900 text-slate-100">Payment Reminder</option>
            <option value="FAILED_PAYMENT_NOTIFICATION" className="bg-slate-900 text-slate-100">Failed Payment Notification</option>
            <option value="BRANCH_CREATION_CONFIRMATION" className="bg-slate-900 text-slate-100">Branch Creation Confirmation</option>
            <option value="MAINTENANCE_ALERT" className="bg-slate-900 text-slate-100">Maintenance Alert</option>
            <option value="SYSTEM_OUTAGE_NOTIFICATION" className="bg-slate-900 text-slate-100">System Outage Notification</option>
            <option value="SECURITY_ALERT" className="bg-slate-900 text-slate-100">Security Alert</option>
            <option value="PRODUCT_ANNOUNCEMENT" className="bg-slate-900 text-slate-100">Product Announcements</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200">Urgency Priority</label>
          <select
            {...register('priority')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 cursor-pointer shadow-inner"
          >
            <option value="NORMAL" className="bg-slate-900 text-slate-100">Normal Priority</option>
            <option value="HIGH" className="bg-slate-900 text-slate-100">High Priority</option>
            <option value="URGENT" className="bg-slate-900 text-slate-100">Urgent (Immediate Push)</option>
            <option value="LOW" className="bg-slate-900 text-slate-100">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Delivery Channels */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
          <span>Active Transmission Channels</span>
          <span className="text-2xs text-slate-400">Select at least one</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => onChannelToggle('EMAIL')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              selectedChannels.includes('EMAIL')
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-xs'
                : 'border-indigo-500/20 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => onChannelToggle('SMS')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              selectedChannels.includes('SMS')
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                : 'border-indigo-500/20 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>SMS</span>
          </button>

          <button
            type="button"
            onClick={() => onChannelToggle('WHATSAPP')}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              selectedChannels.includes('WHATSAPP')
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-xs'
                : 'border-indigo-500/20 text-slate-400 hover:bg-slate-900/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-teal-400" />
            <span>WhatsApp</span>
          </button>
        </div>
        {channelsError && (
          <p className="text-2xs text-rose-400 font-semibold">{channelsError}</p>
        )}
      </div>
    </div>
  );
}
