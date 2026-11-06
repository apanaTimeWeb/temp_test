'use client';
// RESPONSIBILITY: Render the communication notification center notification draft form component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { managerCommunicationNotificationDraftSchema, type ManagerCommunicationNotificationCenterNotificationDraft } from '@/app/frontend_manager/manager_communication/communication_notification_center/schemas/ManagerCommunicationNotificationCenterNotificationDraftSchema';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';

/** Local notification draft form with instant dispatch feedback. */
export function ManagerCommunicationNotificationCenterNotificationDraftForm() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);
  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors: notificationErrors } } = useForm<ManagerCommunicationNotificationCenterNotificationDraft>({
    resolver: zodResolver(managerCommunicationNotificationDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { recipient: '', type: 'Manual member notification', channel: 'Email', message: '' },
  });
  const selectedNotificationChannel = useWatch({ control, name: 'channel' });
  const recipientValue = watch('recipient');

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
    reset({ recipient: '', type: 'Manual member notification', channel: 'Email', message: '' });
    setTimeout(() => setDraftFeedback(null), 5000);
  });

  const notificationFieldError = (field: Extract<keyof ManagerCommunicationNotificationCenterNotificationDraft, string>) => notificationErrors[field] ? (
    <p id={`manager-notification-${field}-error`} className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>
  ) : null;

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base max-w-2xl">
      <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi('send_member_notification')}</h2>
      <p className="text-sm text-secondary mb-6 border-b border-border pb-4">{tManagerUi('manually_trigger_alerts_or_custom_messages_to_specific_l_3244a3')}</p>
      {draftFeedback && (
        <div className="mb-4 rounded-lg border border-border bg-success-bg p-3 text-sm text-success flex items-center gap-2" role="status" aria-live="polite" data-testid="manager-communication-notification-draft-feedback">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{draftFeedback}</span>
        </div>
      )}
      <form onSubmit={onValidateNotificationDraft} noValidate className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="manager-notification-recipient" className="text-sm font-semibold text-primary">
            {tManagerUi('recipient_member_id_or_name')} <span className="text-danger">*</span>
          </label>
          <SearchableCombobox
            options={recipientOptions}
            value={recipientOptions.find(o => o.label === recipientValue || o.value === recipientValue)?.value}
            onChange={(val) => {
              const matched = recipientOptions.find(o => o.value === val);
              setValue('recipient', matched ? matched.label : val, { shouldDirty: true, shouldValidate: true });
            }}
            placeholder="Search student by name or Smart ID, or choose Broadcast..."
            searchPlaceholder="Type student name or ID..."
            aria-label="Select notification recipient"
          />
          {notificationFieldError('recipient')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="manager-notification-type" className="text-sm font-semibold text-primary">{tManagerUi('message_type')}</label>
            <select id="manager-notification-type" className="mgr-input" {...register('type')} aria-invalid={Boolean(notificationErrors.type)} aria-describedby={notificationErrors.type ? 'manager-notification-type-error' : undefined}>
              <option value="Due reminder">{tManagerUi('due_reminder')}</option>
              <option value="Overdue reminder">{tManagerUi('overdue_reminder')}</option>
              <option value="Reservation ready">{tManagerUi('reservation_ready')}</option>
              <option value="Membership expiry reminder">{tManagerUi('membership_expiry_reminder')}</option>
              <option value="Manual member notification">{tManagerUi('manual_member_notification')}</option>
            </select>
            {notificationFieldError('type')}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="manager-notification-channel" className="text-sm font-semibold text-primary">{tManagerUi('message_channel')}</label>
            <select id="manager-notification-channel" className="mgr-input" {...register('channel')} aria-invalid={Boolean(notificationErrors.channel)} aria-describedby={notificationErrors.channel ? 'manager-notification-channel-error' : undefined}>
              <option value="Email">{tManagerUi('email')}</option>
              <option value="SMS">{tManagerUi('sms')}</option>
              <option value="WhatsApp">{tManagerUi('whatsapp_requires_integration')}</option>
            </select>
            {notificationFieldError('channel')}
          </div>
        </div>
        {selectedNotificationChannel === 'WhatsApp' && (
          <div className="p-3 bg-warning-bg border border-warning rounded-lg flex gap-3 text-warning text-sm">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
            <p>{tManagerUi('whatsapp_integration_must_be_configured_and_active_in_th_48cc4c')}</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="manager-notification-message" className="text-sm font-semibold text-primary">{tManagerUi('message_content')}</label>
          <textarea id="manager-notification-message" required rows={5} className="mgr-input resize-none py-3" placeholder={tManagerUi('type_your_message_here')} {...register('message')} aria-invalid={Boolean(notificationErrors.message)} aria-describedby={notificationErrors.message ? 'manager-notification-message-error' : undefined} />
          {notificationFieldError('message')}
        </div>
        <div className="pt-4 flex justify-end">
          <button type="submit" className="mgr-btn-primary px-8 flex items-center gap-2">
            <Send size={16} aria-hidden="true" /> Send Notification
          </button>
        </div>
      </form>
    </div>
  );
}
