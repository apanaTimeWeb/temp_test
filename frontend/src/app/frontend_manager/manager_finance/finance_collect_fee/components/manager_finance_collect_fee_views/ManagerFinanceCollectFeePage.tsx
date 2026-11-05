'use client';
import { useTranslations } from 'next-intl';

import { maskManagerCollectFeePhone } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { useManagerCollectFeeFormatting } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeFormattingHook';

// RESPONSIBILITY: Entry page for the manager_collect_fee module.
// DATA FLOW: Next.js Router -> Page -> Components
import { useEffect, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useManagerFinanceCollectFeeConfirm } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeConfirm';
import { useManagerFinanceCollectFeeUnsavedChangesGuard } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeUnsavedChangesGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerFinanceCollectFeeDraftSchema, type ManagerFinanceCollectFeeDraft } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeDraftSchema';
import { toast } from 'sonner';
import { Search, IndianRupee, CheckCircle, UserCheck } from 'lucide-react';
import { ManagerFinanceCollectFeeReceiptPreview } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeReceiptPreview';
import ManagerFinanceCollectFeeDurationSelector from './ManagerFinanceCollectFeeDurationSelector';
import ManagerFinanceCollectFeeDiscountsSection from './ManagerFinanceCollectFeeDiscountsSection';
import ManagerFinanceCollectFeeStudentInfo from './ManagerFinanceCollectFeeStudentInfo';
import { MANAGER_FINANCE_COLLECT_FEE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeMocks';
import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { MANAGER_FINANCE_COLLECT_FEE_MODES, MANAGER_FINANCE_COLLECT_FEE_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import { ManagerFinanceCollectFeeEmptyState } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_empty_states/ManagerFinanceCollectFeeEmptyState';
import type { ManagerFinanceCollectFeeRouteQueryProps, ManagerFinanceCollectFeeContractStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeComponentTypes';

export default function ManagerFinanceCollectFeePage(_routeQuery: ManagerFinanceCollectFeeRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_collect_fee.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerFinanceCollectFeeConfirm();
  const { formatCurrency, toMinorUnits } = useManagerCollectFeeFormatting();
  const modeLabels: Record<ManagerFinanceCollectFeeMode, string> = { cash: tManagerUi('cash'), upi: tManagerUi('upi'), card: tManagerUi('card'), bank: tManagerUi('bank_transfer') };
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // Dependency rationale: debounce student lookup text (300ms) to avoid filtering the sample directory on every keystroke; clear the timer on change/unmount.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeStudentIndex, setActiveStudentIndex] = useState(-1);
  const [selectedStudent, setSelectedStudent] = useState<(typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number] | null>(null);
  const { watch, setValue, reset, handleSubmit, formState } = useForm<ManagerFinanceCollectFeeDraft>({
    resolver: zodResolver(managerFinanceCollectFeeDraftSchema),
    defaultValues: { member: '', amount: '', mode: 'cash', txnId: '', couponCode: '', lateFee: '', monthsToRenew: '1', remark: '' },
    mode: 'onChange',
  });
  const { amount, mode, txnId, couponCode, lateFee, monthsToRenew, remark } = watch();
  const setDraftValue = (k: keyof ManagerFinanceCollectFeeDraft, v: string) => setValue(k, v as never, { shouldDirty: true, shouldValidate: true });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<ManagerFinanceCollectFeeContractStatus>('idle');
  const [lateFeeOverride, setLateFeeOverride] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [collectedBy, setCollectedBy] = useState('Branch Manager Satyam');

  const hasUnsavedCollectionDraft = Boolean(selectedStudent || formState.isDirty || amount || txnId || couponCode || lateFee || remark || monthsToRenew !== '1' || mode !== 'cash');
  // Guard contract: if (confirmed) router.push(`${next.pathname}${next.search}${next.hash}`);
  useManagerFinanceCollectFeeUnsavedChangesGuard({ isDirty: hasUnsavedCollectionDraft, confirm, router, tManagerUi });

  const filteredStudents = MANAGER_FINANCE_COLLECT_FEE_STUDENTS.filter(s =>
    debouncedSearch.length >= 2 &&
    (s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.smartId.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  function selectStudent(student: (typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number]) {
    setSelectedStudent(student);
    setSearch(student.name);
    setShowDropdown(false);
    setActiveStudentIndex(-1);
    setValue('member', String(student.id), { shouldDirty: true, shouldValidate: true });
    // Sample fixtures may identify a preview record, but must never supply a real charge or fee.
    setDraftValue('lateFee', '');
    setDraftValue('amount', '');
  }

  function handleStudentSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      if (showDropdown) {
        event.preventDefault();
        setShowDropdown(false);
        setActiveStudentIndex(-1);
      }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!showDropdown || filteredStudents.length === 0) return;
      event.preventDefault();
      setActiveStudentIndex((current) => {
        if (event.key === 'ArrowDown') return current < 0 ? 0 : (current + 1) % filteredStudents.length;
        return current < 0 ? filteredStudents.length - 1 : (current - 1 + filteredStudents.length) % filteredStudents.length;
      });
      return;
    }
    if (event.key === 'Enter' && showDropdown && activeStudentIndex >= 0 && filteredStudents[activeStudentIndex]) {
      event.preventDefault();
      selectStudent(filteredStudents[activeStudentIndex]);
    }
  }

  const baseAmount = Number.isFinite(Number(amount)) && amount.trim() !== '' ? Number(amount) : 0;
  const lateFeeAmt = Number.isFinite(Number(lateFee)) && lateFee.trim() !== '' ? Number(lateFee) : 0;
  const total = Math.max(0, baseAmount + lateFeeAmt - couponDiscount);

  function resetForm() {
    setSelectedStudent(null); setSearch(''); reset();
    setCouponDiscount(0); setCouponStatus('idle');
    setLateFeeOverride(false); setIsSubmitting(false);
  }

  function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    // Do not invent coupon values or claim validity without the host pricing contract.
    setCouponDiscount(0);
    setCouponStatus('unavailable');
  }

  const handleCollect = handleSubmit((_draft) => {
    toast.success(`${tManagerUi('collect_fee')}: ₹${total} recorded successfully!`, { id: 'manager-finance-collect-fee-success' });
    resetForm();
  });

  return (
    <>
      {unsavedConfirmDialog}
      <div className="space-y-6"
        data-route-view={_routeQuery.view}
        data-route-id={_routeQuery.id}
        data-route-name={_routeQuery.name}
        data-route-phone={_routeQuery.phone}
        data-route-smart-id={_routeQuery.smartId}>
        <div>
          <h1 className="fin-page-title">{tManagerUi('collect_fee')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('preview_fee_collection_details_recording_a_payment_is_cu_5bded1')}</p>
          <p className="fin-input-hint fin-text-warning" data-testid="manager-finance-collect-contract-warning" role="status">{tManagerUi('read_only_preview_payment_collection_receipt_issuance_an_ea2152')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 fin-collect-fee-grid">
          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-4">
            <div className="fin-card p-6 space-y-3">
              <label className="fin-section-label" htmlFor="manager-collect-fee-student-search">{tManagerUi('student')} <span className="fin-text-danger">*</span></label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                <input id="manager-collect-fee-student-search" className="fin-input fin-input--pl9" placeholder={tManagerUi('search_by_name_or_smart_id')} value={search}
                  role="combobox" aria-autocomplete="list" aria-haspopup="listbox"
                  aria-expanded={showDropdown && debouncedSearch.length >= 2 && !selectedStudent}
                  aria-controls={showDropdown && debouncedSearch.length >= 2 && !selectedStudent && filteredStudents.length > 0 ? "manager-collect-fee-student-options" : undefined}
                  aria-activedescendant={activeStudentIndex >= 0 && filteredStudents[activeStudentIndex] ? `manager-collect-fee-student-option-${filteredStudents[activeStudentIndex].id}` : undefined}
                  onKeyDown={handleStudentSearchKeyDown}
                  onChange={e => { setSearch(e.target.value); setSelectedStudent(null); setActiveStudentIndex(-1); setValue('member', '', { shouldDirty: true, shouldValidate: true }); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)} />
              </div>
              {showDropdown && debouncedSearch.length >= 2 && !selectedStudent && (filteredStudents.length === 0 ? (
                <ManagerFinanceCollectFeeEmptyState className="fin-table-empty-cell">{tManagerUi('no_students_found')}</ManagerFinanceCollectFeeEmptyState>
              ) : (
                <div id="manager-collect-fee-student-options" className="fin-dropdown-list" role="listbox" aria-label={tManagerUi('student')}>
                  {filteredStudents.map((s, index) => (
                    <div id={`manager-collect-fee-student-option-${s.id}`} key={s.id} role="option" aria-selected={activeStudentIndex === index} className={`fin-dropdown-item${activeStudentIndex === index ? ' is-active' : ''}`} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setActiveStudentIndex(index)} onClick={() => selectStudent(s)}>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="fin-cell-subtext">{s.smartId} · {s.plan} {tManagerUi('valid_till')} {s.validUpto}</div>
                      </div>
                      <span className={`fin-badge ${s.status === 'active' ? 'fin-badge--success' : s.status === 'suspended' ? 'fin-badge--danger' : 'fin-badge--warning'}`}>{tManagerUi(s.status)}</span>
                    </div>
                  ))}
                </div>
              ))}
              <ManagerFinanceCollectFeeStudentInfo
                selectedStudent={selectedStudent}
                dueAmountText={`${tManagerUi('due_amount')} `}
                formatCurrency={formatCurrency}
              />
            </div>

            <div className="fin-card p-6 space-y-4">
              <p className="fin-section-label">{tManagerUi('payment_details')}</p>
              <ManagerFinanceCollectFeeDurationSelector
                isCustomDuration={isCustomDuration}
                onToggleCustomDuration={setIsCustomDuration}
                monthsToRenew={monthsToRenew}
                onMonthsToRenewChange={(val) => setDraftValue('monthsToRenew', val)}
                onAmountChange={(val) => setDraftValue('amount', val)}
                labelMonthPayingForCycle={tManagerUi('months_paying_for_cycle')}
                label1Month={tManagerUi('label_1_month')}
                label3MonthsQuarterly={tManagerUi('label_3_months_quarterly')}
                label6MonthsHalfYearly={tManagerUi('label_6_months_half_yearly')}
                label12MonthsAnnual={tManagerUi('label_12_months_annual')}
              />
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-137">{tManagerUi('amount_43dc85')} <span className="fin-text-danger">*</span></label>
                <div className="relative mt-1">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                  <input id="rbg4-managerfinancecollectfeepage-137" type="number" min="0.01" step="0.01" className="fin-input fin-input--pl8" placeholder="0.00" value={amount} aria-invalid={Boolean(formState.errors.amount)} onChange={e => setDraftValue('amount', e.target.value)} />
                  {formState.errors.amount && <p className="fin-input-hint fin-text-danger" role="alert">{tManagerUi(formState.errors.amount.message ?? 'enter_valid_amount')}</p>}
                </div>
              </div>
              <div>
                <p className="fin-label" id="manager-collect-fee-payment-mode-label">{tManagerUi('payment_mode_23b35c')}</p>
                <div className="flex gap-2 mt-1 flex-wrap" role="group" aria-labelledby="manager-collect-fee-payment-mode-label">
                  {MANAGER_FINANCE_COLLECT_FEE_MODES.map(m => (
                    <button type="button" key={m} aria-pressed={mode === m} onClick={() => setDraftValue('mode', m)} className={`fin-badge cursor-pointer ${mode === m ? 'fin-badge--info' : 'fin-badge--neutral'}`}>
                      {modeLabels[m]}
                    </button>
                  ))}
                </div>
              </div>
              {mode !== 'cash' && (
                <div>
                  <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-155">{tManagerUi('transaction_id')} <span className="fin-text-danger">*</span></label>
                  <input id="rbg4-managerfinancecollectfeepage-155" className="fin-input w-full mt-1" placeholder={tManagerUi('enter_transaction_reference')} value={txnId} aria-invalid={Boolean(formState.errors.txnId)} onChange={e => setDraftValue('txnId', e.target.value)} />
                  {formState.errors.txnId && <p className="fin-input-hint fin-text-danger" role="alert">{tManagerUi(formState.errors.txnId.message ?? 'transaction_reference_required')}</p>}
                </div>
              )}
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-collected-by">
                  {tManagerUi('collected_by_898bb0') || 'Collected By'}
                </label>
                <div className="relative mt-1">
                  <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                  <input
                    id="rbg4-managerfinancecollectfeepage-collected-by"
                    type="text"
                    className="fin-input fin-input--pl8"
                    placeholder="Collector Name"
                    value={collectedBy}
                    onChange={(e) => setCollectedBy(e.target.value)}
                  />
                </div>
              </div>
              <ManagerFinanceCollectFeeDiscountsSection
                couponCode={couponCode}
                onCouponCodeChange={(val) => {
                  setDraftValue('couponCode', val);
                  setCouponStatus('idle');
                  setCouponDiscount(0);
                }}
                couponStatus={couponStatus}
                onApplyCoupon={handleApplyCoupon}
                lateFee={lateFee}
                onLateFeeChange={(val) => setDraftValue('lateFee', val)}
                lateFeeOverride={lateFeeOverride}
                onLateFeeOverrideChange={setLateFeeOverride}
                remark={remark}
                onRemarkChange={(val) => setDraftValue('remark', val)}
                couponCodeLabel={tManagerUi('coupon_code')}
                enterCouponCodePlaceholder={tManagerUi('enter_coupon_code')}
                applyLabel={tManagerUi('apply')}
                couponValidationUnavailableText={tManagerUi('coupon_validation_unavailable_no_discount_has_been_appli_0e35b5')}
                lateFeeLabel={tManagerUi('late_fee')}
                overrideLabel={tManagerUi('override')}
                remarkOptionalLabel={tManagerUi('remark_optional')}
                anyNotesPlaceholder={tManagerUi('any_notes')}
              />

              <div className="pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={handleCollect}
                  disabled={isSubmitting || !selectedStudent || !amount || parseFloat(amount) <= 0}
                  className="fin-btn fin-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IndianRupee size={16} />
                  <span>
                    {isSubmitting
                      ? 'Recording Fee Collection...'
                      : `Collect Fee (${formatCurrency(toMinorUnits(total))}) & Print Receipt`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <ManagerFinanceCollectFeeReceiptPreview
            selectedStudent={selectedStudent}
            mode={mode}
            modeLabels={modeLabels}
            amount={amount}
            total={total}
            collectedBy={collectedBy}
            isSubmitting={isSubmitting}
            isCollectAvailable={true}
            receiptNumber={`REC-${Date.now().toString().slice(-6)}`}
            onCollect={handleCollect}
            onCancel={resetForm}
          />
        </div>
      </div>
    </>
  );
}
