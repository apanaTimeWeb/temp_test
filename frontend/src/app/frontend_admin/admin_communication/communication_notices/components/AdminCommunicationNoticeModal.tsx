'use client';

import { useTranslations } from 'next-intl';
import type { UseFormReturn } from 'react-hook-form';
import { X, Building2 } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type { Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import type { AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import type { AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';

export interface AdminCommunicationNoticeModalProps {
  showAdd: boolean;
  showDiscardDialog: boolean;
  editItem: Notice | null;
  noticeForm: UseFormReturn<AdminCommunicationNoticeFormValues>;
  isDemoMode: boolean;
  branches: readonly AdminBranchItem[];
  onRequestClose: () => void;
  onDiscard: () => void;
  onStay: () => void;
  onSave: (values: AdminCommunicationNoticeFormValues) => void;
}

export function AdminCommunicationNoticeModal({
  showAdd,
  showDiscardDialog,
  editItem,
  noticeForm,
  isDemoMode,
  branches,
  onRequestClose,
  onDiscard,
  onStay,
  onSave,
}: AdminCommunicationNoticeModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  if (!showAdd) return null;

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) { if (showDiscardDialog) onStay(); else onRequestClose(); } }}>
      <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[560px] space-y-4">
        {showDiscardDialog ? (
          <>
            <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
            <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
            <DialogFooter>
              <button
                type="button"
                className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onStay}
              >
                {t('UNSAVED_CHANGES_STAY')}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onDiscard}
              >
                {t('UNSAVED_CHANGES_LEAVE')}
              </button>
            </DialogFooter>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label={t('NOTICE_ROW_CLOSE_FORM_ARIA')}
              data-testid="admin_communication-page-control-005"
              onClick={onRequestClose}
              className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:text-danger-text"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <DialogTitle className="text-lg mb-4 font-bold text-text-primary">
              {editItem ? t('NOTICE_EDIT_DIALOG_TITLE') : t('NOTICE_CREATE_DIALOG_TITLE')}
            </DialogTitle>
            <DialogDescription className="sr-only">{t('NOTICE_FORM_DESCRIPTION')}</DialogDescription>
            <form onSubmit={noticeForm.handleSubmit(onSave)} noValidate className="flex flex-col gap-3.5 space-y-4">
              <div>
                <label htmlFor="admin-communication-notice-title" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_TITLE_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <input
                  id="admin-communication-notice-title"
                  className="min-h-11 border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full"
                  placeholder={t('NOTICE_TITLE_PLACEHOLDER')}
                  aria-invalid={Boolean(noticeForm.formState.errors.title)}
                  aria-describedby={noticeForm.formState.errors.title ? 'admin-communication-notice-title-error' : undefined}
                  {...noticeForm.register('title')}
                />
                {noticeForm.formState.errors.title && (
                  <p id="admin-communication-notice-title-error" className="text-sm text-danger-text" role="alert">
                    {noticeForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Target Branch Dropdown */}
              <div>
                <label htmlFor="admin-communication-notice-branch" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary flex items-center gap-1.5">
                  <Building2 size={14} className="text-primary" />
                  Target Audience / Branch
                </label>
                <select
                  id="admin-communication-notice-branch"
                  className="min-h-11 border-border bg-input text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary py-2 px-3 border rounded w-full"
                  {...noticeForm.register('targetBranch')}
                >
                  <option value="All Branches">All Branches (Network-Wide Notice)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-xs text-text-secondary">
                  Choose specific library branch or broadcast across all network locations.
                </span>
              </div>

              <div>
                <label htmlFor="admin-communication-notice-message" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_MESSAGE_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <textarea
                  id="admin-communication-notice-message"
                  className="min-h-24 resize-y border-border bg-input text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full"
                  rows={5}
                  placeholder={t('NOTICE_MESSAGE_PLACEHOLDER')}
                  aria-invalid={Boolean(noticeForm.formState.errors.message)}
                  aria-describedby={noticeForm.formState.errors.message ? 'admin-communication-notice-message-error' : undefined}
                  {...noticeForm.register('message')}
                />
                {noticeForm.formState.errors.message && (
                  <p id="admin-communication-notice-message-error" className="text-sm text-danger-text" role="alert">
                    {noticeForm.formState.errors.message.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin-communication-notice-valid-till" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_VALID_TILL_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <input
                  id="admin-communication-notice-valid-till"
                  type="date"
                  className="min-h-11 border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full"
                  aria-invalid={Boolean(noticeForm.formState.errors.validTill)}
                  aria-describedby={noticeForm.formState.errors.validTill ? 'admin-communication-notice-valid-till-error' : undefined}
                  {...noticeForm.register('validTill')}
                />
                {noticeForm.formState.errors.validTill && (
                  <p id="admin-communication-notice-valid-till-error" className="text-sm text-danger-text" role="alert">
                    {noticeForm.formState.errors.validTill.message}
                  </p>
                )}
              </div>

              <p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">
                {t('NOTICE_PERSISTENCE_BLOCKED')}
              </p>
              <div className="flex-wrap border-border pt-3 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  data-testid="admin_communication-page-control-006"
                  onClick={onRequestClose}
                  className="min-h-11 px-4 py-2 border border-border text-primary rounded hover:bg-surface-hover motion-safe:transition-colors"
                >
                  {t('NOTICE_CANCEL')}
                </button>
                <button
                  type="submit"
                  data-testid="admin_communication-page-control-007"
                  disabled={!isDemoMode}
                  title={!isDemoMode ? t('NOTICE_PERSISTENCE_BLOCKED') : undefined}
                  className="min-h-11 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-hover motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editItem ? t('NOTICE_EDIT_UNAVAILABLE') : t('NOTICE_CREATE_UNAVAILABLE')}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default AdminCommunicationNoticeModal;

