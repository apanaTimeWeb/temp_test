'use client';
import SuperadminBillingOverviewMemberSecurityDepositsEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/components/SuperadminBillingOverviewMemberSecurityDepositsEmptyState';
/** Responsibility: Superadmin Finance Security Deposits Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingOverviewMemberSecurityDepositsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminBillingOverviewMemberSecurityDepositsUrlFilter } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/hooks/useSuperadminBillingOverviewMemberSecurityDepositsUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminBillingOverviewMemberSecurityDepositsValidationMessage } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/hooks/useSuperadminBillingOverviewMemberSecurityDepositsValidationMessage';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminFinanceSecurityDepositDeductionSchema, SuperadminFinanceSecurityDepositRefundSchema, type SuperadminFinanceSecurityDepositDeductionValues, type SuperadminFinanceSecurityDepositRefundValues } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/schemas/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositSchemas';

import { toast } from 'sonner';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/utils/SuperadminBillingOverviewMemberSecurityDepositsFormatters';
import { Undo2, Minus } from 'lucide-react';
import { SUPERADMIN_FINANCE_SECURITY_DEPOSIT_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/constants/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositConstants';
import { SUPERADMIN_FINANCE_SAMPLE_SECURITY_DEPOSITS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/mocks/fixtures/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositMockFixtures';
import type { SuperadminFinanceSecurityDepositSample } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/types/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositTypes';
import { useSuperadminBillingOverviewMemberSecurityDepositsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/hooks/useSuperadminBillingOverviewMemberSecurityDepositsUnsavedChangesGuard';
import { SUPERADMIN_FINANCE_SECURITY_DEPOSITS_PAGE_CLIENT_SELECTOR } from '@/app/frontend_superadmin/superadmin_billing/billing_member_security_deposits/constants/SuperadminBillingOverviewMemberSecurityDepositsStaticConstants';

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingOverviewMemberSecurityDepositsPageClient`.
 * Owns local preview deposit state and the refund/deduction dialog lifecycle.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminBillingOverviewMemberSecurityDepositsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminBillingOverviewMemberSecurityDepositsValidationMessage();
  const [statusFilter, setStatusFilter] = useSuperadminBillingOverviewMemberSecurityDepositsUrlFilter('depositStatus', 'all');
  const [deposits] = useState<SuperadminFinanceSecurityDepositSample[]>(() => SUPERADMIN_FINANCE_SAMPLE_SECURITY_DEPOSITS.map((deposit) => ({ ...deposit })));
  const [refundDialog, setRefundDialog] = useState<{ id: number; name: string; amount: number } | null>(null);
  const [deductDialog, setDeductDialog] = useState<{ id: number; name: string; maxAmount: number } | null>(null);
  const refundDialogRef = useRef<HTMLDivElement>(null);
  const deductDialogRef = useRef<HTMLDivElement>(null);
  const refundForm = useForm<SuperadminFinanceSecurityDepositRefundValues>({ resolver: zodResolver(SuperadminFinanceSecurityDepositRefundSchema), defaultValues: { refundAmount: '', deductionAmount: '', deductionReason: '' } });
  const deductionForm = useForm<SuperadminFinanceSecurityDepositDeductionValues>({ resolver: zodResolver(SuperadminFinanceSecurityDepositDeductionSchema), defaultValues: { amount: '', reason: '' } });
  const { confirmLeave } = useSuperadminBillingOverviewMemberSecurityDepositsUnsavedChangesGuard(refundForm.formState.isDirty || deductionForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const closeRefundDialog = useCallback(async () => { if (!(await confirmLeave())) return; setRefundDialog(null); refundForm.reset({ refundAmount: '', deductionAmount: '', deductionReason: '' }); }, [confirmLeave, refundForm.reset]);
  const closeDeductDialog = useCallback(async () => { if (!(await confirmLeave())) return; setDeductDialog(null); deductionForm.reset({ amount: '', reason: '' }); }, [confirmLeave, deductionForm.reset]);


  const filtered = deposits.filter((d) => statusFilter === 'all' || d.status === statusFilter);
  const totalDeposit = filtered.reduce((sum, item) => sum + item.depositAmount, 0);
  const totalDeduction = filtered.reduce((sum, item) => sum + item.deductionAmount, 0);

  // Effect contract: attach keyboard handling for the active interactive surface and remove it during cleanup; dependency set [refundDialog, deductDialog] is the deliberate re-run boundary.
  useEffect(() => {
    const dialog = refundDialog ? refundDialogRef.current : deductDialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    const controls = () => Array.from<HTMLElement>(dialog.querySelectorAll<HTMLElement>(SUPERADMIN_FINANCE_SECURITY_DEPOSITS_PAGE_CLIENT_SELECTOR));
    controls()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); if (refundDialog) closeRefundDialog(); else if (deductDialog) closeDeductDialog(); return; }
      if (event.key !== 'Tab') return;
      const items = controls(); const first = items[0]; const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [refundDialog, deductDialog, closeRefundDialog, closeDeductDialog]);

  const handleRefund = (values: SuperadminFinanceSecurityDepositRefundValues) => {
    if (!refundDialog) return;
    const amount = Number(values.refundAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > refundDialog.amount) {
      refundForm.setError('refundAmount', { type: 'validate', message: 'SUPERADMIN_FINANCE.VALIDATION.REFUND_AMOUNT_EXCEEDS_HELD_DEPOSIT' });
      return;
    }
    toast.error(tCopy("COPY.REFUND_API_UNAVAILABLE_NO_CHANGE"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberSecurityDepositsPageClient:error:1" });
  };

  const handleDeduction = (values: SuperadminFinanceSecurityDepositDeductionValues) => {
    if (!deductDialog) return;
    const amount = Number(values.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > deductDialog.maxAmount) {
      deductionForm.setError('amount', { type: 'validate', message: 'SUPERADMIN_FINANCE.VALIDATION.DEDUCTION_EXCEEDS_REMAINING_DEPOSIT' });
      return;
    }
    toast.error(tCopy("COPY.DEDUCTION_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberSecurityDepositsPageClient:unavailable:1" });
  };

  return (
    <div className="space-y-6">
      {(filtered?.length === 0) && <SuperadminBillingOverviewMemberSecurityDepositsEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.SECURITY_DEPOSITS")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.REVIEW_ILLUSTRATIVE_SECURITY_DEPOSIT_RECORDS")}</p>
        <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_DATA_ONLY_REFUNDS_CANNOT_BE_PROCESSED_AND_DEDUCTIONS_UPDATE_C28407F0")}</p>
      </div>

      <div className="fin-filter-bar">
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} data-testid="superadmin-finance-finance-security-deposits-status-filter-1">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="held">{tCopy("COPY.HELD")}</option>
          <option value="refunded">{tCopy("COPY.REFUNDED")}</option>
          <option value="forfeited">{tCopy("COPY.FORFEITED")}</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tCopy('COPY.DEPOSIT')}</p><p className="fin-kpi-value">{formatMajorUnitPreviewCurrency(totalDeposit, 'INR', locale)}</p></div>
        <div className="fin-kpi-card"><p className="fin-kpi-label">{tCopy('COPY.DEDUCTION')}</p><p className="fin-kpi-value">{formatMajorUnitPreviewCurrency(totalDeduction, 'INR', locale)}</p></div>
      </div>
      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.DEPOSIT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.COLLECTED_BY")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.COLLECTED_DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.DEDUCTION")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.DEDUCTION_REASON")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.REFUNDED_DATE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">💼</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.NO_SECURITY_DEPOSITS_RECORDED")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{d.studentName}</div>
                    <div className="fin-cell-subtext">{d.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className="py-3 px-4">
                    <span className={SUPERADMIN_FINANCE_SECURITY_DEPOSIT_STATUS_BADGE[d.status]}>{d.status}</span>
                  </td>
                  <td className="py-3 px-4 fin-text-body">{d.collectedBy}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.collectedDate}</td>
                  <td className={`py-3 px-4 text-right ${d.deductionAmount > 0 ? 'fin-text-danger' : 'fin-text-muted'}`}>
                    {d.deductionAmount > 0 ? tCopy('COPY.FINANCIAL_DETAIL_ONLY') : '—'}
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.deductionReason || '—'}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{d.refundedDate || '—'}</td>
                  <td className="py-3 px-4">
                    {d.status === 'held' && (
                      <div className="flex items-center justify-end gap-2">
                        <button type="button"
                          className="fin-badge fin-badge--success cursor-pointer"
                          onClick={() => { setRefundDialog({ id: d.id, name: d.studentName, amount: d.depositAmount - d.deductionAmount }); refundForm.reset({ refundAmount: String(Math.max(0, d.depositAmount - d.deductionAmount)), deductionAmount: '0', deductionReason: '' }); }}
                         data-testid={`superadmin-finance-finance-security-deposits-preview-refund-2-${String(d.id)}`}>
                          <Undo2 size={11} /> {tCopy("COPY.PREVIEW_REFUND")}</button>
                        <button type="button"
                          className="fin-badge fin-badge--warning cursor-pointer"
                          onClick={() => { setDeductDialog({ id: d.id, name: d.studentName, maxAmount: Math.max(0, d.depositAmount - d.deductionAmount) }); deductionForm.reset({ amount: '', reason: '' }); }}
                         data-testid={`superadmin-finance-finance-security-deposits-add-deduction-3-${String(d.id)}`}>
                          <Minus size={11} /> {tCopy("COPY.ADD_DEDUCTION")}</button>
                      </div>
                    )}
                    {d.status === 'refunded' && d.refundedDate && (
                      <span className="fin-cell-subtext">{tCopy("COPY.REFUNDED")}{d.refundedDate}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {refundDialog && (
        <div className="fin-dialog-overlay" onClick={closeRefundDialog} data-testid="superadmin-superadmin-finance-security-deposits-page-client-div-line-181">
          <div ref={refundDialogRef} className="fin-dialog" role="dialog" aria-modal="true" aria-labelledby="deposit-refund-title" onClick={(event) => event.stopPropagation()} data-testid="superadmin-superadmin-finance-security-deposits-page-client-div-line-182">
            <h2 id="deposit-refund-title" className="fin-dialog__title">{tCopy("COPY.REFUND_PREVIEW")}{refundDialog.name}</h2>
            <button type="button" className="fin-dialog__close" aria-label={tCopy("COPY.CLOSE_REFUND_PREVIEW_DIALOG")} onClick={closeRefundDialog} data-testid="superadmin-finance-finance-security-deposits-close-refund-preview-dialog-4">✕</button>
            <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.ACTUAL_REFUNDS_ARE_DISABLED_THE_APPROVED_REFUND_API_AND_AUTHORIZAT_9FC07E41")}</p>
            <form onSubmit={refundForm.handleSubmit(handleRefund)} noValidate className="space-y-4" data-testid="superadmin-superadmin-finance-security-deposits-page-client-form-line-186">
              <div>
                <label className="fin-label" htmlFor="deposit-refund-amount">{tCopy("COPY.REFUND_AMOUNT")}</label>
                <input id="deposit-refund-amount" type="number" min="0.01" max={refundDialog.amount} step="0.01" className="fin-input" aria-invalid={Boolean(refundForm.formState.errors.refundAmount)} aria-describedby={refundForm.formState.errors.refundAmount ? 'deposit-refund-amount-error' : undefined} {...refundForm.register('refundAmount')}  data-testid="superadmin-finance-finance-security-deposits-deposit-refund-amount-5"/>
                {refundForm.formState.errors.refundAmount && <p id="deposit-refund-amount-error" role="alert" className="mt-1 text-xs text-danger">{translateValidationMessage(refundForm.formState.errors.refundAmount.message)}</p>}
              </div>
              <div>
                <label className="fin-label" htmlFor="deposit-refund-deduction">{tCopy("COPY.DEDUCTION_AMOUNT")}</label>
                <input id="deposit-refund-deduction" type="number" min="0" step="0.01" className="fin-input" placeholder="0" aria-invalid={Boolean(refundForm.formState.errors.deductionAmount)} aria-describedby={refundForm.formState.errors.deductionAmount ? 'deposit-refund-deduction-error' : undefined} {...refundForm.register('deductionAmount')}  data-testid="superadmin-finance-finance-security-deposits-deposit-refund-deduction-6"/>
                {refundForm.formState.errors.deductionAmount && <p id="deposit-refund-deduction-error" role="alert" className="mt-1 text-xs text-danger">{translateValidationMessage(refundForm.formState.errors.deductionAmount.message)}</p>}
              </div>
              <div>
                <label className="fin-label" htmlFor="deposit-refund-deduction-reason">{tCopy("COPY.DEDUCTION_REASON")}</label>
                <input id="deposit-refund-deduction-reason" className="fin-input" placeholder={tCopy("COPY.REASON_2")} aria-invalid={Boolean(refundForm.formState.errors.deductionReason)} aria-describedby={refundForm.formState.errors.deductionReason ? 'deposit-refund-deduction-reason-error' : undefined} {...refundForm.register('deductionReason')}  data-testid="superadmin-finance-finance-security-deposits-deposit-refund-deduction-reason-7"/>
                {refundForm.formState.errors.deductionReason && <p id="deposit-refund-deduction-reason-error" role="alert" className="mt-1 text-xs text-danger">{translateValidationMessage(refundForm.formState.errors.deductionReason.message)}</p>}
              </div>
              <div className="fin-dialog__footer">
                <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={closeRefundDialog} data-testid="superadmin-finance-finance-security-deposits-close-8">{tCopy("COPY.CLOSE")}</button>
                <button type="submit" className="fin-badge fin-badge--success cursor-pointer" data-testid="superadmin-finance-finance-security-deposits-validate-preview-no-refund-9">{tCopy("COPY.VALIDATE_PREVIEW_NO_REFUND")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deductDialog && (
        <div className="fin-dialog-overlay" onClick={closeDeductDialog} data-testid="superadmin-superadmin-finance-security-deposits-page-client-div-line-212">
          <div ref={deductDialogRef} className="fin-dialog" role="dialog" aria-modal="true" aria-labelledby="deposit-deduction-title" onClick={(event) => event.stopPropagation()} data-testid="superadmin-superadmin-finance-security-deposits-page-client-div-line-213">
            <h2 id="deposit-deduction-title" className="fin-dialog__title">{tCopy("COPY.ADD_DEDUCTION_PREVIEW")}{deductDialog.name}</h2>
            <button type="button" className="fin-dialog__close" aria-label={tCopy("COPY.CLOSE_DEDUCTION_DIALOG")} onClick={closeDeductDialog} data-testid="superadmin-finance-finance-security-deposits-close-deduction-dialog-10">✕</button>
            <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.THIS_UPDATES_ONLY_THE_LOCAL_SAMPLE_PREVIEW_REMAINING_ELIGIBLE_AMOUNT")}{formatMajorUnitPreviewCurrency(deductDialog.maxAmount, 'INR', locale)}{tCopy("COPY.NO_SERVER_FINANCIAL_RECORD_WILL_CHANGE")}</p>
            <form onSubmit={deductionForm.handleSubmit(handleDeduction)} noValidate className="space-y-4" data-testid="superadmin-superadmin-finance-security-deposits-page-client-form-line-217">
              <div>
                <label className="fin-label" htmlFor="deposit-deduction-amount">{tCopy("COPY.AMOUNT")}<span className="fin-text-danger">*</span></label>
                <input id="deposit-deduction-amount" type="number" min="0.01" max={deductDialog.maxAmount} step="0.01" className="fin-input" aria-invalid={Boolean(deductionForm.formState.errors.amount)} aria-describedby={deductionForm.formState.errors.amount ? 'deposit-deduction-amount-error' : undefined} {...deductionForm.register('amount')}  data-testid="superadmin-finance-finance-security-deposits-deposit-deduction-amount-11"/>
                {deductionForm.formState.errors.amount && <p id="deposit-deduction-amount-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(deductionForm.formState.errors.amount.message)}</p>}
              </div>
              <div>
                <label className="fin-label" htmlFor="deposit-deduction-reason">{tCopy("COPY.REASON")}<span className="fin-text-danger">*</span></label>
                <input id="deposit-deduction-reason" className="fin-input" placeholder={tCopy("COPY.REASON_FOR_DEDUCTION")} aria-invalid={Boolean(deductionForm.formState.errors.reason)} aria-describedby={deductionForm.formState.errors.reason ? 'deposit-deduction-reason-error' : undefined} {...deductionForm.register('reason')}  data-testid="superadmin-finance-finance-security-deposits-deposit-deduction-reason-12"/>
                {deductionForm.formState.errors.reason && <p id="deposit-deduction-reason-error" className="mt-1 text-xs text-danger" role="alert">{translateValidationMessage(deductionForm.formState.errors.reason.message)}</p>}
              </div>
              <div className="fin-dialog__footer">
                <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={closeDeductDialog} data-testid="superadmin-finance-finance-security-deposits-cancel-13">{tCopy("COPY.CANCEL")}</button>
                <button type="submit" className="fin-badge fin-badge--warning cursor-pointer" disabled={deductionForm.formState.isSubmitting} data-testid="superadmin-finance-finance-security-deposits-apply-deduction-preview-14">{tCopy("COPY.APPLY_DEDUCTION_PREVIEW")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
