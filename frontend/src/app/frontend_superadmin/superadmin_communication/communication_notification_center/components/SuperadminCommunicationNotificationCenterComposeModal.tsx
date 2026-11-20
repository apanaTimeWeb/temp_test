'use client';
// RESPONSIBILITY: Compose and dispatch a global or account-specific notification with validation.
// FLOW: SuperadminCommunicationNotificationCenterMain -> ComposeModal -> useDispatchNotificationMutation.

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Send,
  Globe,
  Building2,
  Mail,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  dispatchNotificationSchema,
  type DispatchNotificationSchema,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/schemas/SuperadminCommunicationNotificationCenterSchemas';
import {
  useDispatchNotificationMutation,
  useSuperadminTargetAccountsQuery,
  useSuperadminTemplatesQuery,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/hooks/useSuperadminCommunicationNotificationCenterQueries';
import { useSuperadminCommunicationNotificationCenterStore } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/state/useSuperadminCommunicationNotificationCenterStore';
import type {
  NotificationCategory,
  NotificationChannel,
} from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/types/SuperadminCommunicationNotificationCenterNotificationTypes';

export function SuperadminCommunicationNotificationCenterComposeModal() {
  const { isComposeOpen, setIsComposeOpen } = useSuperadminCommunicationNotificationCenterStore();
  const { data: accounts } = useSuperadminTargetAccountsQuery();
  const { data: templates } = useSuperadminTemplatesQuery();
  const dispatchMutation = useDispatchNotificationMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DispatchNotificationSchema>({
    resolver: zodResolver(dispatchNotificationSchema),
    defaultValues: {
      category: 'ADMIN_INVITATION',
      title: 'Admin Invitation for Library Portal Access',
      message: 'You have been granted administrator access. Complete your setup: https://library.app/setup',
      targetScope: 'GLOBAL',
      targetAccountId: null,
      targetRole: 'ALL_ROLES',
      channels: ['EMAIL'],
      priority: 'NORMAL',
    },
  });

  const selectedTargetScope = watch('targetScope');
  const selectedChannels = watch('channels') ?? [];

  if (!isComposeOpen) return null;

  const handleChannelToggle = (ch: NotificationChannel) => {
    const current = [...selectedChannels];
    const index = current.indexOf(ch);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
        setValue('channels', current);
      }
    } else {
      current.push(ch);
      setValue('channels', current);
    }
  };

  const handleCategoryChange = (cat: NotificationCategory) => {
    setValue('category', cat);
    const matchedTmpl = templates?.find((t) => t.category === cat);
    if (matchedTmpl) {
      setValue('title', matchedTmpl.name);
      setValue('message', matchedTmpl.channelTemplates.email.body);
      setValue('priority', matchedTmpl.defaultPriority);
    }
  };

  const onSubmit = async (values: DispatchNotificationSchema) => {
    const idempotencyKey = `idemp-dispatch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    try {
      await dispatchMutation.mutateAsync({ dto: values, idempotencyKey });
      reset();
      setIsComposeOpen(false);
    } catch {
      // Error handled by mutation onError toast
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsComposeOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-modal-title"
        className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl p-6 relative my-8"
        data-testid="notif-compose-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 id="compose-modal-title" className="text-base font-bold text-foreground">
                Dispatch Notification
              </h2>
              <p className="text-2xs text-muted-foreground">
                Send global broadcast or account-specific message across Email, SMS & WhatsApp.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsComposeOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Target Scope Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Audience Scope</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedTargetScope === 'GLOBAL' ? 'border-primary bg-primary/10 text-foreground font-semibold' : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <input
                  type="radio"
                  value="GLOBAL"
                  {...register('targetScope')}
                  className="sr-only"
                />
                <Globe className="w-4 h-4 text-sky-400" />
                <span className="text-xs">Global (All Libraries & Admins)</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedTargetScope === 'ACCOUNT_SPECIFIC' ? 'border-primary bg-primary/10 text-foreground font-semibold' : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <input
                  type="radio"
                  value="ACCOUNT_SPECIFIC"
                  {...register('targetScope')}
                  className="sr-only"
                />
                <Building2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs">Account-Specific Library</span>
              </label>
            </div>
          </div>

          {/* Account-Specific Dropdown if applicable */}
          {selectedTargetScope === 'ACCOUNT_SPECIFIC' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Select Target Library Account</label>
              <select
                {...register('targetAccountId')}
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Choose a library account…</option>
                {accounts?.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.code}) — {acc.planName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category / Template Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Notification Category</label>
              <select
                {...register('category')}
                onChange={(e) => handleCategoryChange(e.target.value as NotificationCategory)}
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
            <label className="text-xs font-semibold text-foreground">Transmission Channels (Select at least 1)</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleChannelToggle('EMAIL')}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  selectedChannels.includes('EMAIL') ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-xs' : 'border-border/60 text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => handleChannelToggle('SMS')}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  selectedChannels.includes('SMS') ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs' : 'border-border/60 text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>SMS</span>
              </button>

              <button
                type="button"
                onClick={() => handleChannelToggle('WHATSAPP')}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  selectedChannels.includes('WHATSAPP') ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-xs' : 'border-border/60 text-muted-foreground hover:bg-muted/40'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-teal-400" />
                <span>WhatsApp</span>
              </button>
            </div>
            {errors.channels && (
              <p className="text-2xs text-destructive">{errors.channels.message}</p>
            )}
          </div>

          {/* Subject / Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Notification Title / Email Subject</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Scheduled System Maintenance"
            />
            {errors.title && <p className="text-2xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Message Body */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Message Body</label>
            <textarea
              rows={4}
              {...register('message')}
              className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed font-mono"
              placeholder="Type message content..."
            />
            {errors.message && <p className="text-2xs text-destructive">{errors.message.message}</p>}
          </div>

          {/* Test Recipient Override (Optional) */}
          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2">
            <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Optional Test Transmission
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="email"
                {...register('testRecipient.email')}
                placeholder="Test email address..."
                className="px-2.5 py-1.5 rounded-lg bg-card border border-border/60 text-xs text-foreground focus:outline-none"
              />
              <input
                type="text"
                {...register('testRecipient.phone')}
                placeholder="Test phone (+919800000000)..."
                className="px-2.5 py-1.5 rounded-lg bg-card border border-border/60 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary text-black font-semibold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer min-w-32 justify-center shadow-xs"
              data-testid="dispatch-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching…</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
