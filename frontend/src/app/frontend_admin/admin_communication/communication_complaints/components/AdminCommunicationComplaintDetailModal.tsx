'use client';

import { useTranslations } from 'next-intl';
import { X, Building2, AlertTriangle, MessageSquare } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import type { ReactNode } from 'react';

export interface AdminCommunicationComplaintDetailModalProps {
  viewItem: Complaint | null;
  resolveItem: Complaint | null;
  resolveNote: string;
  isDemoMode: boolean;
  onCloseView: () => void;
  onCloseResolve: () => void;
  onChangeResolveNote: (note: string) => void;
  onConfirmResolve: () => void;
  statusBadge: (status: Complaint['status']) => ReactNode;
  formatComplaintDate: (date: string) => string;
}

export function AdminCommunicationComplaintDetailModal({
  viewItem,
  resolveItem,
  resolveNote,
  isDemoMode,
  onCloseView,
  onCloseResolve,
  onChangeResolveNote,
  onConfirmResolve,
  statusBadge,
  formatComplaintDate,
}: AdminCommunicationComplaintDetailModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  return (
    <>
      {/* View Modal */}
      {viewItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseView(); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[500px] space-y-4">
            <button
              type="button"
              aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')}
              data-testid="admin_communication-page-control-007"
              onClick={onCloseView}
              className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{viewItem.title}</DialogTitle>
            <DialogDescription className="sr-only">{t('COMPLAINT_DIALOG_DESCRIPTION')}</DialogDescription>
            <div data-testid="admin_communication-page-state-008" className="mb-3 flex flex-wrap items-center gap-2">
              {statusBadge(viewItem.status)}
              <span data-testid="admin_communication-page-state-009" className="inline-flex min-h-6 items-center gap-1 rounded-full border px-2 py-1 text-badge font-semibold whitespace-nowrap bg-transparent text-text-secondary border-border">
                {formatComplaintDate(viewItem.date)}
              </span>
              {viewItem.isEscalatedToHq && (
                <span className="inline-flex items-center gap-1 rounded-full bg-danger-bg text-danger-text px-2 py-0.5 text-xs font-semibold border border-border">
                  <AlertTriangle size={12} className="shrink-0" />
                  Escalated to HQ
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1 rounded bg-surface-highlight px-2 py-0.5 font-medium text-text-primary">
                <Building2 size={12} className="text-primary" />
                {viewItem.branchName ?? 'Downtown Central'}
              </span>
              <span>· {t('LABEL_BY')} <strong className="text-text-primary">{viewItem.student}</strong></span>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-body text-text-primary">
              {viewItem.description}
            </div>
            {viewItem.resolvedNote && (
              <div className="rounded-lg border border-info-bg bg-info-bg p-3 text-ui text-info-text mt-3">
                {t('COMPLAINT_RESOLUTION_DETAILS', {
                  note: viewItem.resolvedNote,
                  by: viewItem.resolvedBy,
                  date: formatComplaintDate(viewItem.resolvedDate),
                })}
              </div>
            )}
            <div className="mt-4 flex flex-wrap justify-between items-center gap-2.5 border-border pt-3">
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(`Hello ${viewItem.student}, regarding your complaint "${viewItem.title}" at Smart Library:\n${viewItem.resolvedNote ? `Resolution: ${viewItem.resolvedNote}` : 'We are actively investigating and will resolve it shortly.'}\nThank you!`);
                  const popup = window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
                  if (popup) {
                    popup.opener = null;
                  }
                }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-success-bg bg-success-bg px-3.5 py-2 text-ui font-semibold text-success-text hover:bg-success hover:text-on-success transition-all"
              >
                <MessageSquare size={16} />
                WhatsApp Student
              </button>
              <button
                type="button"
                data-testid="admin_communication-page-control-010"
                onClick={onCloseView}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base"
              >
                {t('BUTTON_CLOSE')}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Resolve Modal */}
      {resolveItem && (
        <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) onCloseResolve(); }}>
          <DialogContent className="relative w-full overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog max-w-[480px] space-y-4">
            <button
              type="button"
              aria-label={t('COMPLAINT_DIALOG_CLOSE_LABEL')}
              data-testid="admin_communication-page-control-011"
              onClick={onCloseResolve}
              className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <DialogTitle className="mb-1.5 text-lg font-bold text-text-primary">{t('COMPLAINT_RESOLVE_TITLE')}</DialogTitle>
            <DialogDescription className="mb-4 text-ui text-text-secondary">&quot;{resolveItem.title}&quot;</DialogDescription>
            <div>
              <label className="mb-1.5 block text-badge font-semibold uppercase tracking-[0.07em] text-text-primary" htmlFor="admin-communication-resolution-note">
                {t('COMPLAINT_RESOLUTION_NOTE')} <span className="text-danger-text">*</span>
              </label>
              <textarea
                id="admin-communication-resolution-note"
                className="min-h-24 w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
                placeholder={t('COMPLAINT_RESOLUTION_NOTE_PLACEHOLDER')}
                required
                value={resolveNote}
                onChange={e => onChangeResolveNote(e.target.value)}
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-between items-center gap-2.5 border-border pt-3">
              <button
                type="button"
                disabled={!resolveNote.trim()}
                onClick={() => {
                  const msg = encodeURIComponent(`Hello ${resolveItem.student}, good news! Your complaint regarding "${resolveItem.title}" has been resolved by Smart Library Admin:\n"${resolveNote}"\nThank you for your patience!`);
                  const popup = window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer');
                  if (popup) {
                    popup.opener = null;
                  }
                }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-success-bg bg-success-bg px-3 py-2 text-xs font-semibold text-success-text hover:bg-success hover:text-on-success transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send resolution message on WhatsApp"
              >
                <MessageSquare size={15} />
                WhatsApp Update
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="admin_communication-page-control-012"
                  onClick={onCloseResolve}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-ui font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors motion-safe:duration-base"
                >
                  {t('BUTTON_CANCEL')}
                </button>
                <button
                  type="button"
                  data-testid="admin_communication-page-control-013"
                  disabled={!isDemoMode || !resolveNote.trim()}
                  title={!isDemoMode ? t('COMPLAINT_RESOLUTION_BLOCKED') : undefined}
                  onClick={onConfirmResolve}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-success bg-success px-4 py-2 text-body font-semibold text-on-success hover:bg-success focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('BUTTON_MARK_RESOLVED')}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
export default AdminCommunicationComplaintDetailModal;

