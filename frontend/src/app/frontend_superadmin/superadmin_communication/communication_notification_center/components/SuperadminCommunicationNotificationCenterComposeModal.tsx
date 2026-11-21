'use client';
// RESPONSIBILITY: Compose and dispatch a global or account-specific notification with validation.
// FLOW: SuperadminCommunicationNotificationCenterMain -> ComposeModal -> useDispatchNotificationMutation.

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Send, Loader2 } from 'lucide-react';
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
import { SuperadminCommunicationNotificationCenterComposeScopeSelector } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterComposeScopeSelector';
import { SuperadminCommunicationNotificationCenterComposeChannelSelector } from '@/app/frontend_superadmin/superadmin_communication/communication_notification_center/components/SuperadminCommunicationNotificationCenterComposeChannelSelector';
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
          <SuperadminCommunicationNotificationCenterComposeScopeSelector
            selectedTargetScope={selectedTargetScope}
            accounts={accounts}
            register={register}
          />

          <SuperadminCommunicationNotificationCenterComposeChannelSelector
            selectedChannels={selectedChannels}
            onChannelToggle={handleChannelToggle}
            onCategoryChange={handleCategoryChange}
            register={register}
            channelsError={errors.channels?.message}
          />

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
