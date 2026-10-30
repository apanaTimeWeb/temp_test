'use client';
// Responsibility: AdminFinancePaymentPromisesExtendDialog component owned by admin_finance; responsibility folder: admin_finance_payment_promises_sections.

// RESPONSIBILITY: Presents an extension form for one selected payment promise.

import type { RefObject } from 'react';
import { useTranslations } from 'next-intl';
import type { AdminFinancePaymentPromisesExtendDialogProps } from '@/app/frontend_admin/admin_finance/finance_payment_promises/types/AdminFinancePaymentPromisesTypes';


export default function AdminFinancePaymentPromisesExtendDialog(props: AdminFinancePaymentPromisesExtendDialogProps) {
  const t = useTranslations('ADMIN_FINANCE_PAYMENT_PROMISES');
  if (!props.target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4"><div ref={props.dialogRef} className="relative flex w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-overlay p-6 shadow-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-finance-extend-promise-title" tabIndex={-1}>
      <h2 id="admin-finance-extend-promise-title" className="text-section-title font-bold text-text-primary">{t('EXTEND_TITLE', { name: props.target.name })}</h2>
      <button type="button" aria-label={t('CLOSE_EXTEND')} data-dialog-initial-focus className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={props.onClose}>✕</button>
      <div className="space-y-4">
        <div><label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="admin-finance-promise-new-date">{t('NEW_EXPECTED_DATE')} <span className="text-danger-text">*</span></label><input id="admin-finance-promise-new-date" type="date" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={props.newDate} onChange={(event) => props.onDateChange(event.target.value)} /></div>
        <div><label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="admin-finance-promise-extend-reason">{t('REASON')} <span className="text-danger-text">*</span></label><textarea id="admin-finance-promise-extend-reason" className="min-h-24 w-full min-w-0 resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={props.reason} onChange={(event) => props.onReasonChange(event.target.value)} placeholder={t('REASON_PLACEHOLDER')} rows={2} /></div>
        <div className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg w-full justify-center py-2">{t('TRUST_WARNING')}</div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3"><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={props.onClose}>{t('CANCEL')}</button><button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-warning-bg text-warning-text border-warning-bg cursor-pointer" onClick={props.onSubmit} disabled={!props.newDate || !props.reason.trim()}>{t('EXTEND')}</button></div>
    </div></div>
  );
}


export type { AdminFinancePaymentPromisesExtendDialogProps };
