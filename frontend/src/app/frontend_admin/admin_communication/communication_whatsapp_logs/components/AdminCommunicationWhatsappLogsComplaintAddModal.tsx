'use client';
// Responsibility: AdminCommunicationComplaintAddModal component owned by admin_communication; responsibility folder: admin_communication_complaint_add_modal.

// RESPONSIBILITY: Renders the validated complaint-entry form inside the shared focus-managed dialog.

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import useAdminCommunicationWhatsappLogsUnsavedChangesGuard from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/hooks/useAdminCommunicationWhatsappLogsUnsavedChangesGuard';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { AdminCommunicationComplaintFormValues } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/schemas/AdminCommunicationWhatsappLogsSchema';
import type { AdminCommunicationComplaintAddModalProps } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';


/** Isolated, accessible complaint-entry modal; demo submissions mutate local session state only. */
export default function AdminCommunicationComplaintAddModal({ form, onClose, onSubmit, isDemoMode }: AdminCommunicationComplaintAddModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminCommunicationWhatsappLogsUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const requestClose = () => { if (form.formState.isDirty) { setPendingHref(null); setShowDiscardDialog(true); } else onClose(); };
  const discardDraft = () => { const destination = pendingHref; form.reset(); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); else onClose(); };
  const titleError = form.formState.errors.title;
  const descriptionError = form.formState.errors.description;

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) { if (showDiscardDialog) { setShowDiscardDialog(false); setPendingHref(null); } else requestClose(); } }}>
      <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[480px] space-y-4">
        {showDiscardDialog ? (<>
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </>) : <>
        <button type="button" aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')} data-testid="admin_communication-page-control-004" onClick={requestClose} className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><X size={18} strokeWidth={2} /></button>
        <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{t('COMPLAINT_ADD_DIALOG_TITLE')}</DialogTitle>
        <DialogDescription className="mb-5 text-ui text-text-secondary">{t('COMPLAINT_ADD_DIALOG_DESCRIPTION')}</DialogDescription>
        <form className="flex flex-col gap-3.5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-secondary" htmlFor="admin-communication-complaint-student">{t('COMPLAINT_STUDENT_OPTIONAL')}</label>
            <input id="admin-communication-complaint-student" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" placeholder={t('COMPLAINT_STUDENT_SEARCH_PLACEHOLDER')} {...form.register('student')} />
          </div>
          <label className="flex min-h-11 items-center gap-2.5 text-body text-text-primary" htmlFor="admin-communication-complaint-anonymous">
            <input id="admin-communication-complaint-anonymous" type="checkbox" {...form.register('anonymous')} />
            {t('COMPLAINT_HIDE_IDENTITY')}
          </label>
          <div>
            <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-danger-text" htmlFor="admin-communication-complaint-title">{t('FORM_LABEL_TITLE')} <span className="text-danger-text">{t('FORM_REQUIRED')}</span></label>
            <input id="admin-communication-complaint-title" className="min-h-11 w-full rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" placeholder={t('COMPLAINT_TITLE_PLACEHOLDER')} aria-invalid={Boolean(titleError)} aria-describedby={titleError ? 'admin-communication-complaint-title-error' : undefined} {...form.register('title')} />
            {titleError && <p id="admin-communication-complaint-title-error" className="text-sm text-danger-text" role="alert">{titleError.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-danger-text" htmlFor="admin-communication-complaint-description">{t('FORM_LABEL_DESCRIPTION')} <span className="text-danger-text">{t('FORM_REQUIRED')}</span></label>
            <textarea id="admin-communication-complaint-description" className="min-h-24 w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" rows={4} placeholder={t('COMPLAINT_DESCRIPTION_PLACEHOLDER')} aria-invalid={Boolean(descriptionError)} aria-describedby={descriptionError ? 'admin-communication-complaint-description-error' : undefined} {...form.register('description')} />
            {descriptionError && <p id="admin-communication-complaint-description-error" className="text-sm text-danger-text" role="alert">{descriptionError.message}</p>}
          </div>
          <p className="mb-3 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{isDemoMode ? t('COMPLAINT_DEMO_FORM_NOTICE') : t('COMPLAINT_ADD_API_UNAVAILABLE')}</p>
          <div className="mt-6 flex flex-wrap justify-end gap-2.5 border-border pt-3">
            <button type="button" data-testid="admin_communication-page-control-005" onClick={requestClose} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base">{t('BUTTON_CANCEL')}</button>
            <button type="submit" data-testid="admin_communication-page-control-006" disabled={!isDemoMode} title={!isDemoMode ? t('COMPLAINT_ADD_API_UNAVAILABLE') : undefined} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-body font-semibold text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50">{isDemoMode ? t('COMPLAINT_SUBMIT_DEMO') : t('COMPLAINT_SUBMIT_UNAVAILABLE')}</button>
          </div>
        </form>
        </>}
      </DialogContent>
    </Dialog>
  );
}


export type { AdminCommunicationComplaintAddModalProps };
