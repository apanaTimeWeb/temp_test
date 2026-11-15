'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  User,
  Layers,
  Smartphone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  managerCommunicationNotificationDraftSchema,
  type ManagerCommunicationNotificationCenterNotificationDraft,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/schemas/ManagerCommunicationNotificationCenterNotificationDraftSchema';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';

export function ManagerCommunicationNotificationCenterNotificationDraftForm() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: notificationErrors },
  } = useForm<ManagerCommunicationNotificationCenterNotificationDraft>({
    resolver: zodResolver(managerCommunicationNotificationDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      recipient: '',
      type: 'Manual member notification',
      channel: 'Email',
      message: '',
    },
  });

  const selectedNotificationChannel = useWatch({ control, name: 'channel' });
  const recipientValue = watch('recipient');
  const messageValue = watch('message') || '';

  const recipientOptions: ComboboxOption[] = useMemo(() => {
    const broadcast: ComboboxOption = {
      value: 'ALL_STUDENTS',
      label: '📢 All Active Students (Broadcast Announcement)',
      subLabel: 'Sends notification to all enrolled active library members',
      badge: 'Broadcast',
    };
    const students: ComboboxOption[] = MANAGER_MEMBERS_DEMO_RECORDS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: s.seat ? `Seat ${s.seat} · ${s.phone}` : s.phone,
      badge: s.status,
    }));
    return [broadcast, ...students];
  }, []);

  const onValidateNotificationDraft = handleSubmit((data) => {
    toast.success(`Notification dispatched successfully to ${data.recipient} via ${data.channel}!`);
    setDraftFeedback(`Notification successfully queued for ${data.recipient} via ${data.channel}.`);
    reset({
      recipient: '',
      type: 'Manual member notification',
      channel: 'Email',
      message: '',
    });
    setTimeout(() => setDraftFeedback(null), 5000);
  });

  const notificationFieldError = (
    field: Extract<keyof ManagerCommunicationNotificationCenterNotificationDraft, string>
  ) =>
    notificationErrors[field] ? (
      <p id={`manager-notification-${field}-error`} className="text-xs text-rose-400 mt-1" role="alert">
        {tManagerUi('validation_field_invalid')}
      </p>
    ) : null;

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base max-w-3xl">
      <div className="pb-4 border-b border-border mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary">
          {tManagerUi('send_member_notification')}
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          {tManagerUi('manually_trigger_alerts_or_custom_messages_to_specific_l_3244a3')}
        </p>
      </div>

      {draftFeedback && (
        <div
          className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-xs sm:text-sm text-emerald-400 flex items-center gap-2.5 font-semibold motion-safe:animate-fade-in"
          role="status"
          aria-live="polite"
          data-testid="manager-communication-notification-draft-feedback"
        >
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{draftFeedback}</span>
        </div>
      )}

      <form onSubmit={onValidateNotificationDraft} noValidate className="space-y-5">
        {/* Recipient Selection */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="manager-notification-recipient"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary"
          >
            <span className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shrink-0">
              <User size={12} />
            </span>
            <span>{tManagerUi('recipient_member_id_or_name')}</span>
            <span className="text-rose-400 font-bold">*</span>
          </label>
          <SearchableCombobox
            options={recipientOptions}
            value={recipientOptions.find((o) => o.label === recipientValue || o.value === recipientValue)?.value}
            onChange={(val) => {
              const matched = recipientOptions.find((o) => o.value === val);
              setValue('recipient', matched ? matched.label : val, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            placeholder="Search student by name or Smart ID, or choose Broadcast..."
            searchPlaceholder="Type student name or ID..."
            aria-label="Select notification recipient"
          />
          {notificationFieldError('recipient')}
        </div>

        {/* Row 2: Type and Channel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Message Type */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="manager-notification-type"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary"
            >
              <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                <Layers size={12} />
              </span>
              <span>{tManagerUi('message_type')}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <select
              id="manager-notification-type"
              className="mgr-select h-11 text-xs sm:text-sm font-medium rounded-xl bg-surface/60 border border-border focus:border-primary px-3.5"
              {...register('type')}
              aria-invalid={Boolean(notificationErrors.type)}
              aria-describedby={notificationErrors.type ? 'manager-notification-type-error' : undefined}
            >
              <option value="Due reminder">🪙 {tManagerUi('due_reminder')}</option>
              <option value="Overdue reminder">⚠️ {tManagerUi('overdue_reminder')}</option>
              <option value="Reservation ready">🪑 {tManagerUi('reservation_ready')}</option>
              <option value="Membership expiry reminder">🔄 {tManagerUi('membership_expiry_reminder')}</option>
              <option value="Manual member notification">💬 {tManagerUi('manual_member_notification')}</option>
            </select>
            {notificationFieldError('type')}
          </div>

          {/* Message Channel */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="manager-notification-channel"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary"
            >
              <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                <Smartphone size={12} />
              </span>
              <span>{tManagerUi('message_channel')}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <select
              id="manager-notification-channel"
              className="mgr-select h-11 text-xs sm:text-sm font-medium rounded-xl bg-surface/60 border border-border focus:border-primary px-3.5"
              {...register('channel')}
              aria-invalid={Boolean(notificationErrors.channel)}
              aria-describedby={notificationErrors.channel ? 'manager-notification-channel-error' : undefined}
            >
              <option value="Email">✉️ {tManagerUi('email')}</option>
              <option value="SMS">💬 {tManagerUi('sms')}</option>
              <option value="WhatsApp">📱 {tManagerUi('whatsapp_requires_integration')}</option>
            </select>
            {notificationFieldError('channel')}
          </div>
        </div>

        {selectedNotificationChannel === 'WhatsApp' && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex gap-3 text-amber-300 text-xs sm:text-sm">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
            <p className="leading-relaxed">
              {tManagerUi('whatsapp_integration_must_be_configured_and_active_in_th_48cc4c')}
            </p>
          </div>
        )}

        {/* Message Content */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="manager-notification-message"
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary"
            >
              <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                <MessageSquare size={12} />
              </span>
              <span>{tManagerUi('message_content')}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <span className="text-xs text-secondary font-mono">
              {messageValue.length} / 1000 characters
            </span>
          </div>
          <textarea
            id="manager-notification-message"
            required
            rows={5}
            className="mgr-input resize-none py-3 px-3.5 text-xs sm:text-sm leading-relaxed rounded-xl bg-surface/60 border border-border focus:border-primary"
            placeholder={tManagerUi('type_your_message_here')}
            maxLength={1000}
            {...register('message')}
            aria-invalid={Boolean(notificationErrors.message)}
            aria-describedby={notificationErrors.message ? 'manager-notification-message-error' : undefined}
          />
          {notificationFieldError('message')}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-border flex justify-end">
          <button
            type="submit"
            className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold h-11 px-8 rounded-xl shadow-md cursor-pointer transition-all w-full sm:w-auto"
          >
            <Send size={15} aria-hidden="true" />
            <span>Send Notification</span>
          </button>
        </div>
      </form>
    </div>
  );
}
