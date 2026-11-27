'use client';
// RESPONSIBILITY: AdminSupportCreateTicketForm component owned by admin_support; responsibility folder: admin_support_components_forms.

import type { AdminSupportCreateTicketFormProps } from '@/app/frontend_admin/admin_settings/settings_support/types/AdminSettingsSupportTypes';
import { format } from 'date-fns';
import { enIN,hi } from 'date-fns/locale';

import { ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS,ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';
import useAdminSettingsSupportUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_support/hooks/useAdminSettingsSupportUnsavedChangesGuard';
import { AdminSupportTicketSchema,type AdminSupportTicketFormValues } from '@/app/frontend_admin/admin_settings/settings_support/schemas/AdminSettingsSupportTicketSchema';
import { getAdminSupportValidationMessageKey } from '@/app/frontend_admin/admin_settings/settings_support/utils/AdminSettingsSupportValidationUtils';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft,CheckCircle2,Paperclip,Send,Ticket } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback,useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

/** Creates an in-memory ticket confirmation only in explicit demo mode; no server ticket is implied. */
export default function AdminSupportCreateTicketForm({ onCancel }: AdminSupportCreateTicketFormProps) {
  const t = useTranslations('ADMIN_SUPPORT');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const [createdTicket, setCreatedTicket] = useState<{ id: string; category: string; priority: string; subject: string; description: string; createdAt: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<AdminSupportTicketFormValues>({
    resolver: zodResolver(AdminSupportTicketSchema),
    defaultValues: { category: 'other', priority: 'medium', subject: '', description: '' },
    mode: 'onBlur',
  });
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminSettingsSupportUnsavedChangesGuard(isDirty, handleBlockedNavigation, isSubmitting);
  const requestCancel = () => { if (isDirty) { setPendingHref(null); setShowDiscardDialog(true); return; } onCancel(); };
  const discardDraft = () => { const destination = pendingHref; reset({ category: 'other', priority: 'medium', subject: '', description: '' }); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); else onCancel(); };

  const handleCreateTicket = handleSubmit((values) => {
    if (!isDemoMode) { toast.error(t('SUBMIT_BLOCKED'), { id: 'admin_settings-settings_support-components-AdminSettingsSupportCreateTicketForm-toast-31-1' }); return; }
    const ticket = { id: `SUP-DEMO-${Date.now()}`, category: values.category, priority: values.priority, subject: values.subject.trim(), description: values.description.trim(), createdAt: new Date().toISOString() };
    setCreatedTicket(ticket);
    reset({ category: 'other', priority: 'medium', subject: '', description: '' });
    toast.success(t('DEMO_TICKET_CREATED', { id: ticket.id }), { id: 'admin-settings-support-ticket-created' });
  });

  if (createdTicket) {
    return (
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-5" aria-labelledby="admin-support-ticket-created-title">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="h-10 w-10 rounded-xl bg-success-bg border border-success flex items-center justify-center text-success-text shrink-0">
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="admin-support-ticket-created-title" className="text-base font-bold text-text-primary">{t('DEMO_TICKET_CREATED_TITLE')}</h2>
            <p className="text-xs text-text-secondary mt-0.5">Your ticket has been logged in this session preview.</p>
          </div>
        </div>

        <p role="status" className="rounded-xl border border-success bg-success-bg p-3.5 text-xs text-success-text font-medium">
          {t('DEMO_TICKET_CREATED', { id: createdTicket.id })}
        </p>

        <dl className="grid gap-3.5 sm:grid-cols-2 rounded-2xl border border-border bg-surface-highlight p-4 sm:p-5">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('FIELD_SUBJECT')}</dt>
            <dd className="text-sm font-bold text-text-primary mt-1">{createdTicket.subject}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('FIELD_PRIORITY')}</dt>
            <dd className="text-sm font-bold text-text-primary mt-1">{t(ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS.find((option) => option.value === createdTicket.priority)?.labelKey ?? 'PRIORITY_MEDIUM')}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('FIELD_CATEGORY')}</dt>
            <dd className="text-sm font-bold text-text-primary mt-1">{t(ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS.find((option) => option.value === createdTicket.category)?.labelKey ?? 'CATEGORY_OTHER')}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('FIELD_CREATED_AT')}</dt>
            <dd className="text-sm font-mono text-text-secondary mt-1">{format(new Date(createdTicket.createdAt), 'PPpp', { locale: locale === 'hi' ? hi : enIN })}</dd>
          </div>
          <div className="sm:col-span-2 pt-2 border-t border-border">
            <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('FIELD_DESCRIPTION')}</dt>
            <dd className="whitespace-pre-wrap text-xs text-text-primary mt-1 leading-relaxed bg-card p-3 rounded-xl border border-border">{createdTicket.description}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button type="button" className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors cursor-pointer" onClick={() => setCreatedTicket(null)}>
            <Ticket size={14} aria-hidden="true" />
            <span>{t('CREATE_ANOTHER_TICKET')}</span>
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors cursor-pointer" onClick={requestCancel}>
            <ArrowLeft size={14} aria-hidden="true" />
            <span>{t('CANCEL')}</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-5" aria-labelledby="admin-support-create-ticket-title">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 id="admin-support-create-ticket-title" className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Ticket size={18} className="text-primary" aria-hidden="true" />
            <span>{t('CREATE_TICKET_TITLE')}</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">Fill in issue particulars to open a new support ticket</p>
        </div>
        <button
          type="button"
          data-testid="admin_support-AdminSettingsSupportMain-control-005"
          className="rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors cursor-pointer"
          onClick={requestCancel}
        >
          {t('CANCEL')}
        </button>
      </div>

      <p role="status" className={`rounded-xl border p-3 text-xs ${isDemoMode ? 'border-border-focus bg-primary-subtle text-primary' : 'border-warning bg-warning-bg text-warning-text'}`}>
        {isDemoMode ? t('DEMO_TICKET_NOTICE') : t('SUBMIT_BLOCKED')}
      </p>

      <form data-testid="admin_support-AdminSettingsSupportMain-control-006" onSubmit={handleCreateTicket} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-support-ticket-category" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              {t('FIELD_CATEGORY')}
            </label>
            <select
              id="admin-support-ticket-category"
              data-testid="admin_support-AdminSettingsSupportMain-control-007"
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-focus-ring"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'admin-support-ticket-category-error' : undefined}
              {...register('category')}
              required
            >
              {ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="admin-support-ticket-category-error" className="mt-1 text-xs text-danger-text font-medium" role="alert">
                {t(getAdminSupportValidationMessageKey('category', errors.category.type))}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="admin-support-ticket-priority" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              {t('FIELD_PRIORITY')}
            </label>
            <select
              id="admin-support-ticket-priority"
              data-testid="admin_support-AdminSettingsSupportMain-control-008"
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-focus-ring"
              aria-invalid={Boolean(errors.priority)}
              aria-describedby={errors.priority ? 'admin-support-ticket-priority-error' : undefined}
              {...register('priority')}
              required
            >
              {ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
            {errors.priority && (
              <p id="admin-support-ticket-priority-error" className="mt-1 text-xs text-danger-text font-medium" role="alert">
                {t(getAdminSupportValidationMessageKey('priority', errors.priority.type))}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="admin-support-ticket-subject" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            {t('FIELD_SUBJECT')}
          </label>
          <input
            id="admin-support-ticket-subject"
            type="text"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-focus-ring"
            placeholder={t('SUBJECT_PLACEHOLDER')}
            maxLength={160}
            {...register('subject')}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'admin-support-ticket-subject-error' : undefined}
            required
          />
          {errors.subject && (
            <p id="admin-support-ticket-subject-error" className="mt-1 text-xs text-danger-text font-medium" role="alert">
              {t(getAdminSupportValidationMessageKey('subject', errors.subject.type))}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="admin-support-ticket-description" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            {t('FIELD_DESCRIPTION')}
          </label>
          <textarea
            id="admin-support-ticket-description"
            className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-focus-ring min-h-28 resize-y"
            placeholder={t('DESCRIPTION_PLACEHOLDER')}
            maxLength={5000}
            {...register('description')}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'admin-support-ticket-description-error' : undefined}
            required
          />
          {errors.description && (
            <p id="admin-support-ticket-description-error" className="mt-1 text-xs text-danger-text font-medium" role="alert">
              {t(getAdminSupportValidationMessageKey('description', errors.description.type))}
            </p>
          )}
        </div>

        <div>
          <p className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">{t('ATTACHMENT_LABEL')}</p>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-highlight p-3" role="status" aria-live="polite">
            <Paperclip size={16} className="mt-0.5 shrink-0 text-text-secondary" strokeWidth={2} aria-hidden="true" />
            <div className="text-xs">
              <p className="text-text-primary font-medium">{t('ATTACHMENT_UNAVAILABLE')}</p>
              <p className="mt-0.5 text-text-secondary">{t('ATTACHMENT_NO_UPLOAD')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors cursor-pointer"
            onClick={requestCancel}
          >
            {t('CANCEL')}
          </button>
          <button
            data-testid="admin_support-AdminSettingsSupportMain-control-009"
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-colors cursor-pointer"
            disabled={isSubmitting || !isDemoMode}
            title={!isDemoMode ? t('SUBMIT_BLOCKED') : undefined}
          >
            <Send size={14} strokeWidth={2} aria-hidden="true" />
            <span>{isDemoMode ? t('CREATE_TICKET_DEMO') : t('VALIDATE_SUBMISSION_UNAVAILABLE')}</span>
          </button>
        </div>
      </form>

      <Dialog open={showDiscardDialog} onOpenChange={(open) => { if (!open) { setShowDiscardDialog(false); setPendingHref(null); } }}>
        <DialogContent className="space-y-4 rounded-2xl border border-border bg-overlay text-text-primary p-6 shadow-dialog max-w-md">
          <DialogTitle className="text-base font-bold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors cursor-pointer"
              onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}
            >
              {t('UNSAVED_CHANGES_STAY')}
            </button>
            <button
              type="button"
              className="rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-on-danger shadow-card hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
              onClick={discardDraft}
            >
              {t('UNSAVED_CHANGES_LEAVE')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
