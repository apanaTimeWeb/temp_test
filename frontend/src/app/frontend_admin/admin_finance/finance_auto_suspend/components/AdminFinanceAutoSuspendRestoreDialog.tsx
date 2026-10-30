// Responsibility: AdminFinanceAutoSuspendRestoreDialog component owned by admin_finance; responsibility folder: admin_finance_auto_suspend_sections.
'use client';

// RESPONSIBILITY: Renders confirmation and override-reason inputs for a selected student restore.

import type { RefObject } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminFinanceAutoSuspendRestoreDialogProps } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';


export default function AdminFinanceAutoSuspendRestoreDialog(props: AdminFinanceAutoSuspendRestoreDialogProps) {
  const t = useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  if (!props.target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"><div ref={props.dialogRef} className="relative flex w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-finance-restore-student-title" tabIndex={-1}>
      <h2 id="admin-finance-restore-student-title" className="text-section-title font-bold text-text-primary">{t('RESTORE_TITLE', { name: props.target.name })}</h2>
      <button type="button" aria-label={t('CLOSE_RESTORE')} data-dialog-initial-focus className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={props.onClose}>✕</button>
      <p className="text-ui leading-normal text-text-secondary">{t('RESTORE_PROMPT', { name: props.target.name })}</p>
      <div className="mt-2"><label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="admin-finance-restore-reason">{t('OVERRIDE_REASON')} <span className="text-danger-text">*</span></label><input id="admin-finance-restore-reason" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mt-1" value={props.reason} onChange={(event) => props.onReasonChange(event.target.value)} placeholder={t('REASON_PLACEHOLDER')} /></div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3"><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={props.onClose}>{t('CANCEL')}</button><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={props.onSubmit} disabled={props.isPending || !props.reason.trim()}>{props.isPending ? t('RESTORING') : t('RESTORE')}</button></div>
    </div></div>
  );
}


export type { AdminFinanceAutoSuspendRestoreDialogProps };
