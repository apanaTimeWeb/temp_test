'use client';

import { ManagerCommunicationNotificationCenterChannelPicker } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_forms/ManagerCommunicationNotificationCenterChannelPicker';
import { ManagerCommunicationNotificationCenterFlyerModal } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_modals/ManagerCommunicationNotificationCenterFlyerModal';
import { MANAGER_COMMUNICATION_NOTIFICATION_DEMO_MEMBERS } from '@/app/frontend_manager/manager_communication/communication_notification_center/config/manager_communication_notification_center.demo_data';
import {
  managerCommunicationNotificationDraftSchema,
  type ManagerCommunicationNotificationCenterNotificationDraft,
} from '@/app/frontend_manager/manager_communication/communication_notification_center/schemas/ManagerCommunicationNotificationCenterNotificationDraftSchema';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarClock, CheckCircle2, CreditCard, Layers, Megaphone, MessageSquare, Printer, RotateCcw, Send, Smartphone, Tag, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const QUICK_TEMPLATES = [
  {
    name: 'Fee Due Reminder',
    icon: CreditCard,
    type: 'Due reminder' as const,
    channel: 'SMS' as const,
    text: 'Dear Student, your monthly library subscription fee is due. Please settle your dues at the reception or via the student app to avoid seat lock.',
    badgeStyle: 'hover:border-amber-500/40 hover:bg-amber-500/10 text-amber-300',
  },
  {
    name: 'Seat Renewal Notice',
    icon: CalendarClock,
    type: 'Membership expiry reminder' as const,
    channel: 'WhatsApp' as const,
    text: 'Hello! Your assigned reading seat reservation expires in 3 days. Renew your membership now to retain your favorite dedicated desk.',
    badgeStyle: 'hover:border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300',
  },
  {
    name: 'Library Announcement',
    icon: Megaphone,
    type: 'Manual member notification' as const,
    channel: 'Email' as const,
    text: 'Notice to all students: The study hall air conditioning maintenance is scheduled tonight from 11 PM to 2 AM. Study halls will remain open with secondary ventilation.',
    badgeStyle: 'hover:border-sky-500/40 hover:bg-sky-500/10 text-sky-300',
  },
];

export function ManagerCommunicationNotificationCenterNotificationDraftForm() {
  const tManagerUi = useTranslations('manager.manager_notification_center.ui');
  const [draftFeedback, setDraftFeedback] = useState<string | null>(null);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);

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
    defaultValues: { recipient: '', type: 'Manual member notification', channel: 'Email', message: '' },
  });

  const selectedNotificationChannel = useWatch({ control, name: 'channel' });
  const recipientValue = watch('recipient');
  const messageValue = watch('message') || '';

  const handleApplyTemplate = (tmpl: (typeof QUICK_TEMPLATES)[0]) => {
    setValue('type', tmpl.type, { shouldValidate: true, shouldDirty: true });
    setValue('channel', tmpl.channel, { shouldValidate: true, shouldDirty: true });
    setValue('message', tmpl.text, { shouldValidate: true, shouldDirty: true });
    toast.success(`Applied template: "${tmpl.name}"`, { id: 'manager-notif-draft-template' });
  };

  const handleClearForm = () => {
    reset({ recipient: '', type: 'Manual member notification', channel: 'Email', message: '' });
    toast.info('Form cleared', { id: 'manager-notif-draft-clear' });
  };

  const recipientOptions: ComboboxOption[] = useMemo(() => {
    const broadcast: ComboboxOption = {
      value: 'ALL_STUDENTS',
      label: '📢 All Active Students (Broadcast Announcement)',
      subLabel: 'Sends notification to all enrolled active library members',
      badge: 'Broadcast',
    };
    const students: ComboboxOption[] = MANAGER_COMMUNICATION_NOTIFICATION_DEMO_MEMBERS.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.id})`,
      subLabel: s.seat ? `Seat ${s.seat} · ${s.phone}` : s.phone,
      badge: s.status,
    }));
    return [broadcast, ...students];
  }, []);

  const draftTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (draftTimerRef.current !== null) window.clearTimeout(draftTimerRef.current);
  }, []);

  const onValidateNotificationDraft = handleSubmit((data) => {
    toast.success(`Notification dispatched successfully to ${data.recipient} via ${data.channel}!`, {
      id: 'manager-notif-draft-submit',
    });
    setDraftFeedback(`Notification successfully queued for ${data.recipient} via ${data.channel}.`);
    reset({ recipient: '', type: 'Manual member notification', channel: 'Email', message: '' });
    if (draftTimerRef.current !== null) window.clearTimeout(draftTimerRef.current);
    draftTimerRef.current = window.setTimeout(() => { setDraftFeedback(null); draftTimerRef.current = null; }, 5000);
  });

  const notificationFieldError = (field: Extract<keyof ManagerCommunicationNotificationCenterNotificationDraft, string>) =>
    notificationErrors[field] ? (
      <p id={`manager-notification-${field}-error`} className="text-xs text-rose-400 mt-1" role="alert">
        {tManagerUi('validation_field_invalid')}
      </p>
    ) : null;

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base max-w-3xl">
      <div className="pb-4 border-b border-border mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary">{tManagerUi('send_member_notification')}</h2>
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="manager-notification-recipient" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary">
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
              setValue('recipient', matched ? matched.label : val, { shouldDirty: true, shouldValidate: true });
            }}
            placeholder="Search student by name or Smart ID, or choose Broadcast..."
            searchPlaceholder="Type student name or ID..."
            aria-label="Select notification recipient"
          />
          {notificationFieldError('recipient')}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="manager-notification-type" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary">
            <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
              <Layers size={12} />
            </span>
            <span>{tManagerUi('message_type')}</span>
            <span className="text-rose-400 font-bold">*</span>
          </label>
          <select
            id="manager-notification-type"
            className="mgr-select h-11 text-xs sm:text-sm font-medium rounded-xl bg-surface border border-border focus:border-primary px-3.5"
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

        <ManagerCommunicationNotificationCenterChannelPicker
          selectedChannel={selectedNotificationChannel}
          onSelectChannel={(ch) => setValue('channel', ch, { shouldValidate: true, shouldDirty: true })}
        />

        <select id="manager-notification-channel" className="sr-only" tabIndex={-1} aria-hidden="true" {...register('channel')}>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
        {notificationFieldError('channel')}

        {selectedNotificationChannel === 'WhatsApp' && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex gap-3 text-emerald-300 text-xs sm:text-sm">
            <Smartphone size={16} className="shrink-0 mt-0.5 text-emerald-400" aria-hidden="true" />
            <p className="leading-relaxed">
              WhatsApp dispatch will use the verified student mobile number with instant two-way delivery report.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="manager-notification-message" className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary">
              <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                <MessageSquare size={12} />
              </span>
              <span>{tManagerUi('message_content')}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <span className="text-xs text-secondary font-mono">{messageValue.length} / 1000 characters</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
              <Tag size={11} className="text-amber-400" />
              <span>Quick templates:</span>
            </span>
            {QUICK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-border bg-card motion-safe:transition-all cursor-pointer ${tmpl.badgeStyle}`}
                title="Click to fill template"
              >
                <tmpl.icon size={12} />
                <span>{tmpl.name}</span>
              </button>
            ))}
          </div>

          <textarea
            id="manager-notification-message"
            required
            rows={5}
            className="mgr-input resize-none py-3 px-3.5 text-xs sm:text-sm leading-relaxed rounded-xl bg-surface border border-border focus:border-primary"
            placeholder={tManagerUi('type_your_message_here')}
            maxLength={1000}
            {...register('message')}
            aria-invalid={Boolean(notificationErrors.message)}
            aria-describedby={notificationErrors.message ? 'manager-notification-message-error' : undefined}
          />
          {notificationFieldError('message')}
        </div>

        <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClearForm}
              className="mgr-btn-outline inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold h-11 px-4 rounded-xl border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFlyerOpen(true)}
              className="mgr-btn-outline inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold h-11 px-4 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 motion-safe:transition-all cursor-pointer flex-1 sm:flex-initial"
              title="Convert this draft into an official printable A4 noticeboard flyer"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print as A4 Flyer</span>
            </button>
          </div>

          <button
            type="submit"
            className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold h-11 px-8 rounded-xl shadow-md cursor-pointer motion-safe:transition-all w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-95"
          >
            <Send size={15} aria-hidden="true" />
            <span>Send Notification</span>
          </button>
        </div>
      </form>

      <ManagerCommunicationNotificationCenterFlyerModal
        isOpen={isFlyerOpen}
        onClose={() => setIsFlyerOpen(false)}
        customDraftBody={messageValue}
      />
    </div>
  );
}
