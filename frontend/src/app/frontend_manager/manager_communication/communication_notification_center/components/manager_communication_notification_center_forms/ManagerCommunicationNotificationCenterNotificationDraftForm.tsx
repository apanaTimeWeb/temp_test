'use client';
// RESPONSIBILITY: Render the communication notification center notification draft form component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Send } from 'lucide-react';
import { managerCommunicationNotificationDraftSchema, type ManagerCommunicationNotificationCenterNotificationDraft } from '@/app/frontend_manager/manager_communication/communication_notification_center/schemas/ManagerCommunicationNotificationCenterNotificationDraftSchema';

/** Local validation/presentation only. Send remains disabled without the verified messaging contract. */
export function ManagerCommunicationNotificationCenterNotificationDraftForm() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);
  const { register, control, handleSubmit, formState: { errors: notificationErrors } } = useForm<ManagerCommunicationNotificationCenterNotificationDraft>({
    resolver: zodResolver(managerCommunicationNotificationDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { recipient: '', type: 'Manual member notification', channel: 'Email', message: '' },
  });
  const selectedNotificationChannel = useWatch({ control, name: 'channel' });
  const onValidateNotificationDraft = handleSubmit(() => {
    setDraftFeedback(tManagerUi('sending_unavailable_verified_messaging_integration_contr_57b208'));
  });
  const notificationFieldError = (field: Extract<keyof ManagerCommunicationNotificationCenterNotificationDraft, string>) => notificationErrors[field] ? (
    <p id={`manager-notification-${field}-error`} className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>
  ) : null;

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base max-w-2xl">
      <h2 className="text-xl font-bold text-primary mb-2">{tManagerUi('send_member_notification')}</h2>
      <p className="text-sm text-secondary mb-6 border-b border-border pb-4">{tManagerUi('manually_trigger_alerts_or_custom_messages_to_specific_l_3244a3')}</p>
      {draftFeedback && <p className="mb-4 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" aria-live="polite" data-testid="manager-communication-notification-draft-feedback">{draftFeedback}</p>}
      <form onSubmit={onValidateNotificationDraft} noValidate className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="manager-notification-recipient" className="text-sm font-semibold text-primary">{tManagerUi('recipient_member_id_or_name')}</label>
          <input id="manager-notification-recipient" required type="text" className="mgr-input" placeholder={tManagerUi('e_g_rahul_sharma_or_lib_001')} {...register('recipient')} aria-invalid={Boolean(notificationErrors.recipient)} aria-describedby={notificationErrors.recipient ? 'manager-notification-recipient-error' : undefined} />
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
          <button type="submit" disabled title={tManagerUi('sending_unavailable_verified_messaging_integration_contr_57b208')} className="mgr-btn-primary cursor-not-allowed px-8">
            <Send size={16} className="mr-2 inline" aria-hidden="true" /> {tManagerUi('sending_unavailable')}
          </button>
        </div>
      </form>
    </div>
  );
}

