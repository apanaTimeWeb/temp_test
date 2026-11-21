'use client';
// RESPONSIBILITY: Compose and dispatch a global or account-specific notification with validation in Cyber-Luxury styling.
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
import { useModalScrollLock } from '@/lib/useModalScrollLock';

export function SuperadminCommunicationNotificationCenterComposeModal() {
  const { isComposeOpen, setIsComposeOpen } = useSuperadminCommunicationNotificationCenterStore();
  const { data: accounts } = useSuperadminTargetAccountsQuery();
  const { data: templates } = useSuperadminTemplatesQuery();
  const dispatchMutation = useDispatchNotificationMutation();

  useModalScrollLock(isComposeOpen);

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
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsComposeOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-modal-title"
        className="bg-gradient-to-br from-[#0c102b] via-[#090d24] to-[#050714] border border-indigo-500/30 text-slate-100 shadow-2xl rounded-3xl w-full max-w-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ease-out"
        data-testid="notif-compose-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-inner">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 id="compose-modal-title" className="text-base sm:text-lg font-bold text-white">
                Dispatch Notification
              </h2>
              <p className="text-2xs text-slate-400 mt-0.5">
                Send global broadcast or account-specific message across Email, SMS & WhatsApp.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsComposeOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5">
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">Notification Title / Email Subject</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 shadow-inner"
              placeholder="e.g. Scheduled System Maintenance"
            />
            {errors.title && <p className="text-2xs text-rose-400 font-semibold">{errors.title.message}</p>}
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200">Message Body</label>
            <textarea
              rows={4}
              {...register('message')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 leading-relaxed font-mono shadow-inner"
              placeholder="Type message content..."
            />
            {errors.message && <p className="text-2xs text-rose-400 font-semibold">{errors.message.message}</p>}
          </div>

          {/* Test Recipient Override (Optional) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">
              Optional Test Transmission Override
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="email"
                {...register('testRecipient.email')}
                placeholder="Test email (e.g. admin@test.com)"
                className="px-3 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
              />
              <input
                type="text"
                {...register('testRecipient.phone')}
                placeholder="Test phone (+919800000000)"
                className="px-3 py-2 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-indigo-500/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-indigo-500/25 text-xs sm:text-sm font-semibold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer min-w-36 justify-center shadow-lg shadow-indigo-500/25"
              data-testid="dispatch-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching…</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
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
