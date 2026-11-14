'use client';
/** Responsibility: Superadmin Finance Collect Fee Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingOverviewMemberPaymentsCollectionPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminBillingOverviewMemberPaymentsCollectionValidationMessage } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/hooks/useSuperadminBillingOverviewMemberPaymentsCollectionValidationMessage';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { formatDate, formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/utils/SuperadminBillingOverviewMemberPaymentsCollectionFormatters';
import { Search, CheckCircle, IndianRupee } from 'lucide-react';
import { SUPERADMIN_FINANCE_MOCK_STUDENTS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/mocks/fixtures/SuperadminBillingOverviewMemberPaymentsCollectionMockStudents';
import { SUPERADMIN_FINANCE_PAYMENT_MODES, SUPERADMIN_FINANCE_MODE_LABELS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';
import type { SuperadminFinanceCollectFeeReceiptData, SuperadminFinanceMockStudent } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionTypes';
import SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModal from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/components/SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModal';
import SuperadminFinanceCollectFeeReceiptPreviewPanel from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/components/SuperadminBillingOverviewMemberPaymentsCollectionReceiptPreviewPanel';
import { printThermal } from '@/lib/thermalPrint';
import { SUPERADMIN_FINANCE_COLLECT_FEE_SCHEMA, type SuperadminFinanceCollectFeeFormValues } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/schemas/SuperadminBillingOverviewMemberPaymentsCollectionSchema';
import { buildSuperadminFinanceSampleWhatsAppReceipt } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/utils/SuperadminBillingOverviewMemberPaymentsCollectionReceiptUtilities';
import { useSuperadminBillingOverviewMemberPaymentsCollectionUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/hooks/useSuperadminBillingOverviewMemberPaymentsCollectionUnsavedChangesGuard';
import { SUPERADMIN_FINANCE_COLLECT_FEE_PAGE_CLIENT_RECEIPT_COUNTER } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionStaticConstants';



function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '').slice(-10);
  return `${d.slice(0, 2)}****${d.slice(6)}`;
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingOverviewMemberPaymentsCollectionPageClient`.
 * Owns local UI state for `search`, `showDropdown`, `selectedStudent`, `couponDiscount`, `couponStatus`, `lateFeeOverride` and related form/selection state.
 * Effect lifecycle boundaries are `[setValue]`.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminBillingOverviewMemberPaymentsCollectionPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminBillingOverviewMemberPaymentsCollectionValidationMessage();
  const [search, setSearch]             = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SuperadminFinanceMockStudent | null>(null);
  const { register, watch, setValue, getValues, reset, handleSubmit, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminFinanceCollectFeeFormValues>({
    resolver: zodResolver(SUPERADMIN_FINANCE_COLLECT_FEE_SCHEMA),
    defaultValues: { amount: '', mode: 'cash', transactionId: '', couponCode: '', lateFee: '0', remark: '' },
  });
  useSuperadminBillingOverviewMemberPaymentsCollectionUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const amount = watch('amount');
  const mode = watch('mode');
  const txnId = watch('transactionId');
  const couponCode = watch('couponCode');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const lateFee = watch('lateFee');
  const remark = watch('remark');
  const [lateFeeOverride, setLateFeeOverride] = useState(false);
  const [receiptData, setReceiptData]   = useState<SuperadminFinanceCollectFeeReceiptData | null>(null);
  const [receiptCounter, setReceiptCounter] = useState(SUPERADMIN_FINANCE_COLLECT_FEE_PAGE_CLIENT_RECEIPT_COUNTER);
  const [selectionWarning, setSelectionWarning] = useState('');

  // Effect contract: hydrate URL-backed filter or route state from the current query string on mount; dependency set [setValue] is the deliberate re-run boundary.
  useEffect(() => {
    const studentId = new URLSearchParams(window.location.search).get('studentId');
    if (!studentId) return;
    const matched = SUPERADMIN_FINANCE_MOCK_STUDENTS.find((student) => String(student.id) === studentId || student.smartId === studentId);
    if (!matched) {
      setSelectionWarning(tCopy('COPY.REQUESTED_STUDENT_ID_DOES_NOT_MATCH_SAMPLE_RECORDS', { studentId }));
      return;
    }
    setSelectedStudent(matched);
    setSearch(`${matched.name} (${matched.smartId})`);
    setSelectionWarning(tCopy('COPY.REQUESTED_STUDENT_MATCHED_SAMPLE_RECORD_ONLY'));
  }, [setValue]);

  const filteredStudents = SUPERADMIN_FINANCE_MOCK_STUDENTS.filter(s =>
    search.length >= 2 &&
    (s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.smartId.toLowerCase().includes(search.toLowerCase()))
  );

  const baseAmount  = parseFloat(amount) || 0;
  const lateFeeAmt  = parseFloat(lateFee) || 0;
  const total       = Math.max(0, baseAmount + lateFeeAmt - couponDiscount);

  function resetForm() {
    setSelectedStudent(null); setSearch('');
    reset({ amount: '', mode: 'cash', transactionId: '', couponCode: '', lateFee: '0', remark: '' });
    setCouponDiscount(0); setCouponStatus('idle');
    setLateFeeOverride(false);
  }

  function handleApplyCoupon() {
    const code = getValues('couponCode').trim().toUpperCase();
    if (!code) {
      setCouponDiscount(0);
      setCouponStatus('idle');
      return;
    }
    const discount = code === 'SAVE50' ? 50 : code === 'FRIEND100' ? 100 : 0;
    const subtotal = Number(getValues('amount')) + Number(getValues('lateFee'));
    if (discount === 0) {
      setCouponDiscount(0);
      setCouponStatus('invalid');
      toast.error(tCopy("COPY.SAMPLE_CODE_NOT_RECOGNIZED"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberPaymentsCollectionPageClient:error:1" });
      return;
    }
    if (!Number.isFinite(subtotal) || subtotal <= discount) {
      setCouponDiscount(0);
      setCouponStatus('invalid');
      toast.error(tCopy("COPY.AMOUNT_MUST_EXCEED_SAMPLE_DISCOUNT"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberPaymentsCollectionPageClient:error:2" });
      return;
    }
    setCouponDiscount(discount);
    setCouponStatus('valid');
    toast.message(tCopy("COPY.SAMPLE_DISCOUNT_APPLIED_LOCALLY", { amount: formatMajorUnitPreviewCurrency(discount, 'INR', locale) }), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberPaymentsCollectionPageClient:message:1" });
  }

  function handleCollectValidated(values: SuperadminFinanceCollectFeeFormValues) {
    if (!selectedStudent) {
      toast.error(tCopy("COPY.SELECT_SAMPLE_STUDENT_FOR_RECEIPT"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberPaymentsCollectionPageClient:error:3" });
      return;
    }
    const resolvedAmount = Number(values.amount);
    const resolvedLateFee = Number(values.lateFee);
    const resolvedTotal = resolvedAmount + resolvedLateFee - couponDiscount;
    if (!Number.isFinite(resolvedTotal) || resolvedTotal <= 0) {
      toast.error(tCopy("COPY.PREVIEW_TOTAL_MUST_REMAIN_POSITIVE"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberPaymentsCollectionPageClient:error:4" });
      return;
    }
    const rn = `SAMPLE-REC-${receiptCounter}`;
    setReceiptCounter((current) => current + 1);
    const date = formatDate(new Date().toISOString(), locale);
    const waMsg = buildSuperadminFinanceSampleWhatsAppReceipt({ receiptNo: rn, student: selectedStudent, amount: resolvedAmount, mode: values.mode, txnId: values.transactionId, lateFee: resolvedLateFee, couponDiscount, total: resolvedTotal, remark: values.remark, date, locale });
    setReceiptData({ receiptNo: rn, studentName: selectedStudent.name, studentId: selectedStudent.smartId, phone: selectedStudent.phone, total: resolvedTotal, mode: values.mode, date, waMessage: waMsg, student: selectedStudent, amount: resolvedAmount, lateFee: resolvedLateFee, couponDiscount, txnId: values.transactionId, remark: values.remark });
  }

  function handlePrintReceipt() {
    if (!receiptData) return;
    printThermal({
      type: 'receipt', shopName: 'SAMPLE PREVIEW - NOT A PAYMENT', branch: 'Main Branch',
      studentName: receiptData.studentName, smartId: receiptData.studentId,
      phone: receiptData.phone, shift: receiptData.student.shift,
      seat: receiptData.student.seat, plan: receiptData.student.plan,
      billNumber: receiptData.receiptNo, date: receiptData.date,
      totalPayable: receiptData.amount + receiptData.lateFee,
      amountPaid: receiptData.total, discount: receiptData.couponDiscount,
      balance: 0, paymentMode: SUPERADMIN_FINANCE_MODE_LABELS[receiptData.mode],
      transactionId: receiptData.txnId || undefined,
    });
  }

  return (
    <>

      <p className="fin-info-box mb-4" role="status">{tCopy("COPY.DEMO_ONLY_FEE_COLLECTION_THIS_PAGE_USES_BUNDLED_SAMPLE_STUDENTS_AN_E8240D16")}</p>
      {selectionWarning && <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{selectionWarning}</p>}

      {receiptData && (
        <SuperadminBillingOverviewMemberPaymentsCollectionSampleReceiptModal
          receiptData={receiptData}
          onClose={() => setReceiptData(null)}
          onPrint={handlePrintReceipt}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1 className="fin-page-title">{tCopy("COPY.COLLECT_FEE")}</h1>
          <p className="fin-page-subtitle">{tCopy("COPY.CREATE_A_SAMPLE_RECEIPT_PREVIEW_FROM_BUNDLED_DEMONSTRATION_RECORDS_8995E09D")}</p>
        </div>

        <form noValidate onSubmit={handleSubmit(handleCollectValidated)} className="grid grid-cols-1 lg:grid-cols-5 gap-6 fin-collect-fee-grid" data-testid="superadmin-superadmin-finance-collect-fee-page-client-form-line-172">
          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-4">
            <div className="fin-card p-6 space-y-3">
              <p className="fin-section-label">{tCopy("COPY.STUDENT")}<span className="fin-text-danger">*</span></p>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                <label htmlFor="superadmin-collect-fee-student-search" className="sr-only">{tCopy("COPY.SEARCH_SAMPLE_STUDENTS_BY_NAME_OR_SMART_ID")}</label>
                <input id="superadmin-collect-fee-student-search" className="fin-input fin-input--pl9" placeholder={tCopy("COPY.SEARCH_BY_NAME_OR_SMART_ID")} value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedStudent(null); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}  data-testid="superadmin-finance-finance-collect-fee-superadmin-collect-fee-student-search-1"/>
              </div>
              {showDropdown && search.length >= 2 && !selectedStudent && (
                <div className="fin-dropdown-list">
                  {filteredStudents.length === 0 ? (
                    <div className="fin-table-empty-cell">{tCopy("COPY.NO_STUDENTS_FOUND")}</div>
                  ) : filteredStudents.map((s) => (
                    <button type="button" key={s.id} className="fin-dropdown-item" onClick={() => {
                      setSelectedStudent(s); setSearch(s.name); setShowDropdown(false);
                      if (s.dueAmount > 0) { setValue('lateFee', '50', { shouldValidate: true }); setValue('amount', s.dueAmount.toString(), { shouldValidate: true }); }
                      else { setValue('lateFee', '0', { shouldValidate: true }); setValue('amount', '', { shouldValidate: true }); }
                    }} data-testid={`superadmin-finance-finance-collect-fee-set-selected-student-2-${String(s.id)}`}>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="fin-cell-subtext">{s.smartId} · {s.plan} · +91-{maskPhone(s.phone)}</div>
                      </div>
                      <span className={`fin-badge ${s.status === 'active' ? 'fin-badge--success' : s.status === 'suspended' ? 'fin-badge--danger' : 'fin-badge--warning'}`}>{s.status}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedStudent && (
                <div className="fin-student-confirmed">
                  <CheckCircle size={16} />
                  <span className="fin-cell-name">{selectedStudent.name}</span>
                  <span className="fin-cell-subtext">({selectedStudent.smartId})</span>
                  <span className="fin-cell-subtext">· +91-{maskPhone(selectedStudent.phone)}</span>
                </div>
              )}
              {selectedStudent != null && selectedStudent.dueAmount > 0 && (
                <div className="fin-badge fin-badge--danger w-full justify-center py-2">
                  {tCopy("COPY.DUE_AMOUNT")}{formatMajorUnitPreviewCurrency(selectedStudent?.dueAmount ?? 0, 'INR', locale)} {tCopy("COPY.PENDING")}</div>
              )}
            </div>

            <div className="fin-card p-6 space-y-4">
              <p className="fin-section-label">{tCopy("COPY.PAYMENT_DETAILS")}</p>
              <div>
                <label htmlFor="superadmin-collect-fee-amount" className="fin-label">{tCopy("COPY.AMOUNT")}<span className="fin-text-danger">*</span></label>
                <div className="relative mt-1">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                  <input aria-label={tCopy("COPY.AMOUNT")} id="superadmin-collect-fee-amount" type="number" min="0.01" step="0.01" inputMode="decimal" aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? 'superadmin-collect-fee-amount-error' : undefined} className="fin-input fin-input--pl8" placeholder="0.00" {...register('amount')}  data-testid="superadmin-finance-finance-collect-fee-superadmin-collect-fee-amount-3"/>
                  {errors.amount && <p id="superadmin-collect-fee-amount-error" role="alert" className="fin-input-hint fin-text-danger">{translateValidationMessage(errors.amount.message)}</p>}
                </div>
              </div>
              <div>
                <span className="fin-label" id="superadmin-collect-fee-payment-mode-label">{tCopy("COPY.PAYMENT_MODE")}</span>
                <div role="group" aria-labelledby="superadmin-collect-fee-payment-mode-label" className="flex gap-2 mt-1 flex-wrap">
                  {SUPERADMIN_FINANCE_PAYMENT_MODES.map((m) => (
                    <button type="button" key={m} aria-pressed={mode === m} onClick={() => setValue('mode', m, { shouldDirty: true, shouldValidate: true })} className={`fin-badge cursor-pointer hover:opacity-80 motion-safe:transition-opacity motion-reduce:transition-none ${mode === m ? 'fin-badge--info ring-2 ring-primary' : 'fin-badge--neutral'}`} data-testid={`superadmin-finance-finance-collect-fee-set-value-4-${String(m)}`}>
                      {SUPERADMIN_FINANCE_MODE_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
              {mode !== 'cash' && (
                <div>
                  <label htmlFor="superadmin-collect-fee-transaction-id" className="fin-label">{tCopy("COPY.TRANSACTION_ID")}<span className="fin-text-danger">*</span></label>
                  <input id="superadmin-collect-fee-transaction-id" className="fin-input w-full mt-1" placeholder={tCopy("COPY.ENTER_TRANSACTION_REFERENCE")} aria-invalid={Boolean(errors.transactionId)} aria-describedby={errors.transactionId ? 'superadmin-collect-fee-transaction-id-error' : undefined} {...register('transactionId')}  data-testid="superadmin-finance-finance-collect-fee-superadmin-collect-fee-transaction-id-5"/>
                  {errors.transactionId && <p id="superadmin-collect-fee-transaction-id-error" role="alert" className="fin-input-hint fin-text-danger">{translateValidationMessage(errors.transactionId.message)}</p>}
                </div>
              )}
              <div>
                <label htmlFor="superadmin-collect-fee-coupon" className="fin-label">{tCopy("COPY.COUPON_CODE")}</label>
                <div className="flex gap-2 mt-1">
                  <input id="superadmin-collect-fee-coupon" className="fin-input flex-1" placeholder={tCopy("COPY.E_G_SAVE50")} aria-invalid={couponStatus === 'invalid' || Boolean(errors.couponCode)} aria-describedby={errors.couponCode ? 'superadmin-collect-fee-coupon-error' : couponStatus === 'invalid' ? 'superadmin-collect-fee-coupon-status' : undefined} {...register('couponCode', { onChange: () => { setCouponStatus('idle'); setCouponDiscount(0); } })}  data-testid="superadmin-finance-finance-collect-fee-superadmin-collect-fee-coupon-6"/>
                  <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handleApplyCoupon} data-testid="superadmin-finance-finance-collect-fee-apply-7">{tCopy("COPY.APPLY")}</button>
                </div>
                {couponStatus === 'valid'   && <p className="fin-input-hint fin-text-success" role="status">{tCopy("COPY.PREVIEW_ONLY")}{formatMajorUnitPreviewCurrency(couponDiscount, 'INR', locale)} {tCopy("COPY.SAMPLE_DISCOUNT_APPLIED_LOCALLY_COUPON_VALIDITY_WAS_NOT_CHECKED_WITH_A_SERVICE")}</p>}
                {couponStatus === 'invalid' && <p id="superadmin-collect-fee-coupon-status" className="fin-input-hint fin-text-danger" role="alert">{tCopy("COPY.COUPON_COULD_NOT_BE_APPLIED_IN_THE_LOCAL_PREVIEW")}</p>}
                {errors.couponCode && <p id="superadmin-collect-fee-coupon-error" role="alert" className="fin-input-hint fin-text-danger">{translateValidationMessage(errors.couponCode.message)}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="superadmin-collect-fee-late-fee" className="fin-label">{tCopy("COPY.LATE_FEE")}</label>
                  <label className="flex items-center gap-1 fin-text-xs cursor-pointer">
                    <input aria-label={tCopy("COPY.LATE_FEE")} type="checkbox" checked={lateFeeOverride} onChange={e => setLateFeeOverride(e.target.checked)}  data-testid="superadmin-finance-finance-collect-fee-late-fee-8"/> {tCopy("COPY.OVERRIDE")}</label>
                </div>
                <input aria-label={tCopy("COPY.LATE_FEE")} id="superadmin-collect-fee-late-fee" type="number" min="0" step="0.01" className="fin-input w-full mt-1" aria-invalid={Boolean(errors.lateFee)} aria-describedby={errors.lateFee ? 'superadmin-collect-fee-late-fee-error' : undefined} {...register('lateFee')} readOnly={!lateFeeOverride}  data-testid="superadmin-finance-finance-collect-fee-superadmin-collect-fee-late-fee-9"/>
                {errors.lateFee && <p id="superadmin-collect-fee-late-fee-error" role="alert" className="fin-input-hint fin-text-danger">{translateValidationMessage(errors.lateFee.message)}</p>}
              </div>
              <div>
                <label htmlFor="superadmin-collect-fee-remark" className="fin-label">{tCopy("COPY.REMARK_OPTIONAL")}</label>
                <textarea id="superadmin-collect-fee-remark" className="fin-textarea mt-1" rows={2} maxLength={500} placeholder={tCopy("COPY.ANY_NOTES")} aria-invalid={Boolean(errors.remark)} aria-describedby={errors.remark ? 'superadmin-collect-fee-remark-error' : undefined} {...register('remark')}  data-testid="superadmin-finance-finance-collect-fee-superadmin-collect-fee-remark-10"/>
                {errors.remark && <p id="superadmin-collect-fee-remark-error" role="alert" className="fin-input-hint fin-text-danger">{translateValidationMessage(errors.remark.message)}</p>}
              </div>
            </div>
          </div>

          <SuperadminFinanceCollectFeeReceiptPreviewPanel
            selectedStudent={selectedStudent}
            mode={mode}
            total={total}
            nextReceiptNumber={receiptCounter}
            canGenerate={Boolean(selectedStudent && amount && Number.isFinite(parseFloat(amount)) && parseFloat(amount) > 0 && !isSubmitting)}
            onCancel={resetForm}
          />
        </form>
      </div>
    </>
  );
}
