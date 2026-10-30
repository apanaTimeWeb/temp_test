'use client';
// RESPONSIBILITY: AdminSupportCreateTicketForm component owned by admin_support; responsibility folder: admin_support_components_forms.

import { format } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';
import type { AdminSupportCreateTicketFormProps } from '@/app/frontend_admin/admin_settings/settings_support/types/AdminSettingsSupportTypes';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { AdminSupportTicketSchema, type AdminSupportTicketFormValues } from '@/app/frontend_admin/admin_settings/settings_support/schemas/AdminSettingsSupportTicketSchema';
import { ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS, ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_support/config/admin_settings_support.url_config';
import { getAdminSupportValidationMessageKey } from '@/app/frontend_admin/admin_settings/settings_support/utils/AdminSettingsSupportValidationUtils';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import useAdminSettingsSupportUnsavedChangesGuard from '@/app/frontend_admin/admin_settings/settings_support/hooks/useAdminSettingsSupportUnsavedChangesGuard';

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
    toast.success(t('DEMO_TICKET_CREATED', { id: ticket.id }));
  });

  if (createdTicket) {
    return (
      <section className="admin-card space-y-4 p-5" aria-labelledby="admin-support-ticket-created-title">
        <h2 id="admin-support-ticket-created-title" className="text-base font-semibold text-text-primary">{t('DEMO_TICKET_CREATED_TITLE')}</h2>
        <p role="status" className="rounded-md border border-info-bg bg-info-bg p-3 text-info-text">{t('DEMO_TICKET_CREATED', { id: createdTicket.id })}</p>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div><dt className="admin-label">{t('FIELD_SUBJECT')}</dt><dd className="text-text-primary">{createdTicket.subject}</dd></div>
          <div><dt className="admin-label">{t('FIELD_PRIORITY')}</dt><dd className="text-text-primary">{t(ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS.find((option) => option.value === createdTicket.priority)?.labelKey ?? 'PRIORITY_MEDIUM')}</dd></div>
          <div><dt className="admin-label">{t('FIELD_CATEGORY')}</dt><dd className="text-text-primary">{t(ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS.find((option) => option.value === createdTicket.category)?.labelKey ?? 'CATEGORY_OTHER')}</dd></div>
          <div><dt className="admin-label">{t('FIELD_CREATED_AT')}</dt><dd className="text-text-primary">{format(new Date(createdTicket.createdAt), 'PPpp', { locale: locale === 'hi' ? hi : enIN })}</dd></div>
          <div className="sm:col-span-2"><dt className="admin-label">{t('FIELD_DESCRIPTION')}</dt><dd className="whitespace-pre-wrap text-text-primary">{createdTicket.description}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-2"><button type="button" className="admin-btn-primary min-h-11" onClick={() => setCreatedTicket(null)}>{t('CREATE_ANOTHER_TICKET')}</button><button type="button" className="admin-btn-ghost min-h-11" onClick={requestCancel}>{t('CANCEL')}</button></div>
      </section>
    );
  }

  return (
    <section className="admin-card" aria-labelledby="admin-support-create-ticket-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="admin-support-create-ticket-title" className="text-base font-semibold text-text-primary">{t('CREATE_TICKET_TITLE')}</h2>
        <button type="button" data-testid="admin_support-AdminSettingsSupportMain-control-005" className="admin-btn-ghost min-h-11" onClick={requestCancel}>{t('CANCEL')}</button>
      </div>
      <p role="status" className={`mt-3 rounded-md border p-3 ${isDemoMode ? 'border-info-bg bg-info-bg text-info-text' : 'border-warning-bg bg-warning-bg text-warning-text'}`}>{isDemoMode ? t('DEMO_TICKET_NOTICE') : t('SUBMIT_BLOCKED')}</p>
      <form data-testid="admin_support-AdminSettingsSupportMain-control-006" onSubmit={handleCreateTicket} noValidate className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-support-ticket-category" className="admin-label">{t('FIELD_CATEGORY')}</label>
            <select id="admin-support-ticket-category" data-testid="admin_support-AdminSettingsSupportMain-control-007" className="admin-input" aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'admin-support-ticket-category-error' : undefined} {...register('category')} required>
              {ADMIN_SUPPORT_TICKET_CATEGORY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
            </select>
            {errors.category && <p id="admin-support-ticket-category-error" className="admin-error" role="alert">{t(getAdminSupportValidationMessageKey('category', errors.category.type))}</p>}
          </div>
          <div>
            <label htmlFor="admin-support-ticket-priority" className="admin-label">{t('FIELD_PRIORITY')}</label>
            <select id="admin-support-ticket-priority" data-testid="admin_support-AdminSettingsSupportMain-control-008" className="admin-input" aria-invalid={Boolean(errors.priority)} aria-describedby={errors.priority ? 'admin-support-ticket-priority-error' : undefined} {...register('priority')} required>
              {ADMIN_SUPPORT_TICKET_PRIORITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{t(option.labelKey)}</option>)}
            </select>
            {errors.priority && <p id="admin-support-ticket-priority-error" className="admin-error" role="alert">{t(getAdminSupportValidationMessageKey('priority', errors.priority.type))}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="admin-support-ticket-subject" className="admin-label">{t('FIELD_SUBJECT')}</label>
          <input id="admin-support-ticket-subject" type="text" className="admin-input" placeholder={t('SUBJECT_PLACEHOLDER')} maxLength={160} {...register('subject')} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'admin-support-ticket-subject-error' : undefined} required />
          {errors.subject && <p id="admin-support-ticket-subject-error" className="admin-error" role="alert">{t(getAdminSupportValidationMessageKey('subject', errors.subject.type))}</p>}
        </div>
        <div>
          <label htmlFor="admin-support-ticket-description" className="admin-label">{t('FIELD_DESCRIPTION')}</label>
          <textarea id="admin-support-ticket-description" className="admin-input min-h-28" placeholder={t('DESCRIPTION_PLACEHOLDER')} maxLength={5000} {...register('description')} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'admin-support-ticket-description-error' : undefined} required />
          {errors.description && <p id="admin-support-ticket-description-error" className="admin-error" role="alert">{t(getAdminSupportValidationMessageKey('description', errors.description.type))}</p>}
        </div>
        <div>
          <p className="admin-label">{t('ATTACHMENT_LABEL')}</p>
          <div className="flex items-start gap-3 rounded-md border border-border bg-floating p-3" role="status" aria-live="polite">
            <Paperclip size={18} className="mt-0.5 shrink-0 text-text-secondary" strokeWidth={2} aria-hidden="true" />
            <div className="text-sm">
              <p className="text-text-primary">{t('ATTACHMENT_UNAVAILABLE')}</p>
              <p className="mt-1 text-text-secondary">{t('ATTACHMENT_NO_UPLOAD')}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button data-testid="admin_support-AdminSettingsSupportMain-control-009" type="submit" className="admin-btn-primary min-h-11 disabled:cursor-not-allowed disabled:opacity-50" disabled={isSubmitting || !isDemoMode} title={!isDemoMode ? t('SUBMIT_BLOCKED') : undefined}>
            <Send size={18} strokeWidth={2} aria-hidden="true" /> {isDemoMode ? t('CREATE_TICKET_DEMO') : t('VALIDATE_SUBMISSION_UNAVAILABLE')}
          </button>
        </div>
      </form>
      <Dialog open={showDiscardDialog} onOpenChange={(open) => { if (!open) { setShowDiscardDialog(false); setPendingHref(null); } }}>
        <DialogContent className="space-y-4">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
