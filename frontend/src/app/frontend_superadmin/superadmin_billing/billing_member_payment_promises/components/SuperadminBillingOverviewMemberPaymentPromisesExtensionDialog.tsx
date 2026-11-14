// RESPONSIBILITY: Render the accessible RHF/Zod expected-date preview dialog; no write API is invoked.
'use client';
import type { RefObject } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { SuperadminBillingOverviewMemberPaymentPromisesExtensionValues } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/schemas/superadmin_billing_member_payment_promises.schemas';
type Props = {
  dialog: { id: number; name: string } | null;
  form: UseFormReturn<SuperadminBillingOverviewMemberPaymentPromisesExtensionValues>;
  dialogRef: RefObject<HTMLDivElement | null>;
  dateInputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onSubmit: (values: SuperadminBillingOverviewMemberPaymentPromisesExtensionValues) => void;
};
export default function SuperadminBillingOverviewMemberPaymentPromisesExtensionDialog({ dialog, form, dialogRef, dateInputRef, onClose, onSubmit }: Props) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const tValidation = useTranslations('SUPERADMIN_FINANCE.VALIDATION');
  if (!dialog) return null;
  const dateRegistration = form.register('newDate');
  const reasonRegistration = form.register('reason');
  return <div className="fin-dialog-overlay"><div className="fin-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="payment-promise-dialog-title" tabIndex={-1}>
    <h2 id="payment-promise-dialog-title" className="fin-dialog__title">{tCopy('COPY.PREVIEW_PROMISE_DATE_CHANGE')}{dialog.name}</h2>
    <button type="button" className="fin-dialog__close" aria-label={tCopy('COPY.CLOSE_PROMISE_DATE_PREVIEW')} onClick={onClose} data-testid="superadmin-finance-finance-payment-promises-close-promise-date-preview-5">✕</button>
    <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)} data-testid="superadmin-finance-payment-promise-extension-form">
      <div><label className="fin-label" htmlFor="payment-promise-new-date">{tCopy('COPY.NEW_EXPECTED_DATE')}<span className="fin-text-danger">*</span></label>
        <input {...dateRegistration} ref={(element) => { dateInputRef.current = element; dateRegistration.ref(element); }} id="payment-promise-new-date" type="date" className="fin-input" aria-invalid={Boolean(form.formState.errors.newDate)} aria-describedby={form.formState.errors.newDate ? 'payment-promise-new-date-error' : undefined} data-testid="superadmin-finance-payment-promise-new-date" />
        {form.formState.errors.newDate?.message && <p id="payment-promise-new-date-error" className="fin-text-danger text-sm" role="alert">{tValidation(form.formState.errors.newDate.message)}</p>}
      </div>
      <div><label className="fin-label" htmlFor="payment-promise-extension-reason">{tCopy('COPY.REASON')}<span className="fin-text-danger">*</span></label>
        <textarea {...reasonRegistration} id="payment-promise-extension-reason" className="fin-textarea" placeholder={tCopy('COPY.REASON_FOR_EXTENSION')} rows={2} aria-invalid={Boolean(form.formState.errors.reason)} aria-describedby={form.formState.errors.reason ? 'payment-promise-extension-reason-error' : undefined} data-testid="superadmin-finance-payment-promise-extension-reason" />
        {form.formState.errors.reason?.message && <p id="payment-promise-extension-reason-error" className="fin-text-danger text-sm" role="alert">{tValidation(form.formState.errors.reason.message)}</p>}
      </div>
      <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy('COPY.PREVIEW_ONLY_CHANGING_THIS_DATE_UPDATES_THIS_PAGE_S_ILLUSTRATIVE_S_64E04918')}</p>
      <div className="fin-dialog__footer"><button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={onClose} data-testid="superadmin-finance-finance-payment-promises-cancel-8">{tCopy('COPY.CANCEL')}</button>
        <button type="submit" className="fin-badge fin-badge--warning cursor-pointer disabled:opacity-50" disabled={!form.formState.isValid || form.formState.isSubmitting} data-testid="superadmin-finance-finance-payment-promises-preview-date-change-9">{tCopy('COPY.PREVIEW_DATE_CHANGE')}</button></div>
    </form>
  </div></div>;
}
