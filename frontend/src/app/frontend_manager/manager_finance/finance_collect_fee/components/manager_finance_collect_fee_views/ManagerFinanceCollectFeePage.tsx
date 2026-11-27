'use client';
import { ButtonLoader } from '@/app/frontend_manager/components/ManagerLoader';
import { ManagerFinanceCollectFeeEmptyState } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_empty_states/ManagerFinanceCollectFeeEmptyState';
import ManagerFinanceCollectFeeCollectionTypeCard from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeCollectionTypeCard';
import ManagerFinanceCollectFeeCompositeCard from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeCompositeCard';
import ManagerFinanceCollectFeeDiscountsSection from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeDiscountsSection';
import ManagerFinanceCollectFeeHeader from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeHeader';
import ManagerFinanceCollectFeePaymentInputs from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePaymentInputs';
import ManagerFinanceCollectFeePostPaymentModal from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePostPaymentModal';
import { ManagerFinanceCollectFeeReceiptPreview } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeReceiptPreview';
import ManagerFinanceCollectFeeStudentInfo from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeStudentInfo';
import { MANAGER_FINANCE_COLLECT_FEE_MODES, MANAGER_FINANCE_COLLECTION_TYPES, MANAGER_FINANCE_FEE_CATEGORIES, STANDARD_CYCLE_AMOUNTS, type ManagerFinanceCollectionType } from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import { MANAGER_FINANCE_COLLECT_FEE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeDemoRepository';
import { useManagerCollectFeeFormatting } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeFormattingHook';
import { useManagerFinanceCollectFeeConfirm } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeConfirm';
import { useManagerFinanceCollectFeeUnsavedChangesGuard } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeUnsavedChangesGuard';
import { managerFinanceCollectFeeDraftSchema, type ManagerFinanceCollectFeeDraft } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeDraftSchema';
import type { ManagerFinanceCollectFeeContractStatus, ManagerFinanceCollectFeeRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeComponentTypes';
import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { computeCollectionReconciliation, INITIAL_COMPOSITE_ITEMS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeReconciliation';
import { calculateBillingCycleInfo, formatCollectFeeInr, getAvailableBillingMonths } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, IndianRupee, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ManagerFinanceCollectFeePage(_routeQuery: ManagerFinanceCollectFeeRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_collect_fee.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerFinanceCollectFeeConfirm();
  const { formatCurrency, toMinorUnits } = useManagerCollectFeeFormatting();
  const modeLabels: Record<ManagerFinanceCollectFeeMode, string> = { cash: tManagerUi('cash'), upi: tManagerUi('upi'), card: tManagerUi('card'), bank: tManagerUi('bank_transfer') };
  const todayDateStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const currentYearMonth = useMemo(() => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`, []);
  const availableMonths = useMemo(() => getAvailableBillingMonths(6), []);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => { const timeout = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(timeout); }, [search]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeStudentIndex, setActiveStudentIndex] = useState(-1);
  const [selectedStudent, setSelectedStudent] = useState<(typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number] | null>(null);

  const { register, watch, setValue, reset, handleSubmit, formState } = useForm<ManagerFinanceCollectFeeDraft>({
    resolver: zodResolver(managerFinanceCollectFeeDraftSchema),
    defaultValues: { member: '', amount: '', mode: 'cash', txnId: '', couponCode: '', lateFee: '', monthsToRenew: '1', remark: '', feeCategory: 'seat_fee', collectionType: 'monthly', billingMonth: currentYearMonth, paymentDate: todayDateStr },
    mode: 'onChange',
  });
  const { amount, mode, txnId, couponCode, lateFee, monthsToRenew, remark, feeCategory, billingMonth, paymentDate, collectionType } = watch();
  const setDraftValue = (k: keyof ManagerFinanceCollectFeeDraft, v: string) => setValue(k, v as never, { shouldDirty: true, shouldValidate: true });

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<ManagerFinanceCollectFeeContractStatus>('idle');
  const [lateFeeOverride, setLateFeeOverride] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [collectedBy, setCollectedBy] = useState('Branch Manager');
  const [receiptNumber, setReceiptNumber] = useState('REC-000000');
  useEffect(() => { setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`); }, []);
  const [isPostPaymentModalOpen, setIsPostPaymentModalOpen] = useState(false);
  const [lastPaidReceipt, setLastPaidReceipt] = useState<{ receiptNumber: string; studentName: string; smartId: string; phone: string; totalAmount: number; paymentMode: string; txnId?: string; billingPeriod?: string; lineItems: { id: string; label: string; amount: number }[] } | null>(null);
  const [compositeEnabled, setCompositeEnabled] = useState(false);
  const [compositeItems, setCompositeItems] = useState(INITIAL_COMPOSITE_ITEMS);

  useEffect(() => {
    if (_routeQuery.id || _routeQuery.name || _routeQuery.smartId) {
      const matched = MANAGER_FINANCE_COLLECT_FEE_STUDENTS.find((s) => (_routeQuery.id && String(s.id) === String(_routeQuery.id)) || (_routeQuery.smartId && s.smartId.toLowerCase() === _routeQuery.smartId.toLowerCase()) || (_routeQuery.name && s.name.toLowerCase().includes(_routeQuery.name.toLowerCase())));
      if (matched) { setSelectedStudent(matched); setSearch(matched.name); setValue('member', String(matched.id)); }
      else if (_routeQuery.name) {
        const fallback = { id: Number(_routeQuery.id) || 999, name: _routeQuery.name, smartId: _routeQuery.smartId || 'STU-PROMISE', phone: _routeQuery.phone || '9876543210', status: 'active' as const, dueAmount: Number(_routeQuery.amount) ? Number(_routeQuery.amount) * 100 : 0, plan: 'Regular Seat Plan', shift: 'General', seat: 'Desk S-01', validUpto: todayDateStr };
        setSelectedStudent(fallback); setSearch(_routeQuery.name); setValue('member', String(fallback.id));
      }
    }
    if (_routeQuery.amount) setDraftValue('amount', _routeQuery.amount);
  }, [_routeQuery.id, _routeQuery.name, _routeQuery.smartId, _routeQuery.amount, _routeQuery.phone, todayDateStr]);

  const billingCycleInfo = useMemo(() => calculateBillingCycleInfo(billingMonth || currentYearMonth, Number(monthsToRenew) || 1), [billingMonth, currentYearMonth, monthsToRenew]);
  const activeCategory = useMemo(() => MANAGER_FINANCE_FEE_CATEGORIES.find((c) => c.id === (feeCategory || 'seat_fee')) || MANAGER_FINANCE_FEE_CATEGORIES[0], [feeCategory]);
  const activeCollectionOption = useMemo(() => MANAGER_FINANCE_COLLECTION_TYPES.find((c) => c.id === (collectionType || 'monthly')) || MANAGER_FINANCE_COLLECTION_TYPES[0], [collectionType]);
  const hasUnsavedCollectionDraft = Boolean((selectedStudent && (amount || formState.isDirty)) || amount || txnId || couponCode || lateFee || remark || monthsToRenew !== '1' || feeCategory !== 'seat_fee' || collectionType !== 'monthly');
  // Guard contract: if (confirmed) router.push(`${next.pathname}${next.search}${next.hash}`);
  useManagerFinanceCollectFeeUnsavedChangesGuard({ isDirty: hasUnsavedCollectionDraft, confirm, router, tManagerUi });

  const filteredStudents = MANAGER_FINANCE_COLLECT_FEE_STUDENTS.filter((s) => !debouncedSearch.trim() || s.name.toLowerCase().includes(debouncedSearch.toLowerCase().trim()) || s.smartId.toLowerCase().includes(debouncedSearch.toLowerCase().trim()) || s.phone.includes(debouncedSearch.trim()));

  function applyCollectionType(type: ManagerFinanceCollectionType, student = selectedStudent, duration = monthsToRenew) {
    setDraftValue('collectionType', type);
    if (type === 'dues') { setDraftValue('amount', String(student && student.dueAmount > 0 ? student.dueAmount / 100 : 0)); setDraftValue('feeCategory', 'seat_fee'); setDraftValue('lateFee', ''); }
    else if (type === 'monthly') { setDraftValue('amount', String(STANDARD_CYCLE_AMOUNTS[duration] ?? (Number(duration) > 0 ? Number(duration) * 1200 : 1200))); setDraftValue('feeCategory', 'seat_fee'); setDraftValue('lateFee', ''); }
    else if (type === 'fine') { setDraftValue('amount', '200'); setDraftValue('feeCategory', 'fine'); setDraftValue('lateFee', '200'); }
    else if (type === 'partial') { setDraftValue('amount', String(Math.round((student && student.dueAmount > 0 ? student.dueAmount / 100 : 1200) / 2))); setDraftValue('feeCategory', 'seat_fee'); }
    else if (type === 'locker') { setDraftValue('amount', '400'); setDraftValue('feeCategory', 'locker_fee'); setDraftValue('lateFee', ''); }
  }

  function selectStudent(student: (typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number]) {
    setSelectedStudent(student); setSearch(student.name); setShowDropdown(false); setActiveStudentIndex(-1);
    setValue('member', String(student.id), { shouldDirty: true, shouldValidate: true });
    applyCollectionType(student.dueAmount > 0 ? 'dues' : 'monthly', student);
  }

  function handleStudentSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') { if (showDropdown) { event.preventDefault(); setShowDropdown(false); setActiveStudentIndex(-1); } return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!showDropdown || filteredStudents.length === 0) return;
      event.preventDefault();
      setActiveStudentIndex((curr) => event.key === 'ArrowDown' ? (curr < 0 ? 0 : (curr + 1) % filteredStudents.length) : (curr < 0 ? filteredStudents.length - 1 : (curr - 1 + filteredStudents.length) % filteredStudents.length));
      return;
    }
    if (event.key === 'Enter' && showDropdown && activeStudentIndex >= 0 && filteredStudents[activeStudentIndex]) { event.preventDefault(); selectStudent(filteredStudents[activeStudentIndex]); }
  }

  const studentDuePaise = selectedStudent?.dueAmount ?? 0;
  const { total, isAmountInvalid, studentDueMajor, targetReconciliationAmount, isPartialPayment, isFullPayment, isAdvancePayment, remainingDuePaise } = computeCollectionReconciliation({
    amount, lateFee, couponDiscount, studentDuePaise, cycleAmount: STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200,
  });
  const isTxnIdMissing = mode !== 'cash' && !txnId.trim();
  const customMonthsError = isCustomDuration && (isNaN(Number(monthsToRenew)) || Number(monthsToRenew) < 1 || Number(monthsToRenew) > 36) ? 'Duration must be between 1 and 36 months' : undefined;
  const isFuturePaymentDate = Boolean(paymentDate && paymentDate > todayDateStr);
  const isSubmitDisabled = isSubmitting || !selectedStudent || isAmountInvalid || isTxnIdMissing || Boolean(customMonthsError) || isFuturePaymentDate;

  function resetForm() {
    setSelectedStudent(null); setSearch('');
    reset({ member: '', amount: '', mode: 'cash', txnId: '', couponCode: '', lateFee: '', monthsToRenew: '1', remark: '', feeCategory: 'seat_fee', collectionType: 'monthly', billingMonth: currentYearMonth, paymentDate: todayDateStr });
    setCouponDiscount(0); setCouponStatus('idle'); setLateFeeOverride(false); setIsSubmitting(false); setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);
  }

  const handleCollect = handleSubmit(async () => {
    if (isSubmitDisabled) return;
    const studentName = selectedStudent?.name || 'Selected Student';
    const purposeName = activeCollectionOption.label;
    const confirmed = await confirm(`Confirm fee collection: Collect ${formatCollectFeeInr(total)} (${purposeName}) from ${studentName}? This will record the payment and verify receipt.`, tManagerUi('cancel') || 'Cancel', `${tManagerUi('collect_fee') || 'Collect Fee'} (${formatCollectFeeInr(total)})`);
    if (!confirmed) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${tManagerUi('collect_fee')}: ${formatCollectFeeInr(total)} (${purposeName}) for ${studentName} recorded successfully!`, { id: 'manager-finance-collect-fee-success' });
      const activeLineItems = compositeEnabled ? compositeItems.filter((i) => i.enabled).map((i) => ({ id: i.id, label: i.label, amount: i.amount })) : [{ id: 'primary', label: activeCollectionOption.label, amount: total }];
      setLastPaidReceipt({ receiptNumber, studentName, smartId: selectedStudent?.smartId || '', phone: selectedStudent?.phone || '', totalAmount: total, paymentMode: mode, txnId, billingPeriod: billingCycleInfo.coverageLabel, lineItems: activeLineItems });
      setIsPostPaymentModalOpen(true);
    }, 250);
  });

  return (
    <>
      {unsavedConfirmDialog}
      <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
        <p className="sr-only" data-testid="manager-finance-collect-contract-warning" role="status">{tManagerUi('read_only_preview_payment_collection_receipt_issuance_an_ea2152')}</p>
        <ManagerFinanceCollectFeeHeader title={tManagerUi('collect_fee') || 'Collect Fee'} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 fin-collect-fee-grid">
          <div className="lg:col-span-3 space-y-4">
            <div className="fin-card p-6 space-y-3">
              <label className="fin-section-label" htmlFor="manager-collect-fee-student-search">{tManagerUi('student')} <span className="fin-text-danger">*</span></label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                <input maxLength={30} id="manager-collect-fee-student-search" className="fin-input fin-input--pl9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder={tManagerUi('search_by_name_or_smart_id')} value={search} role="combobox" aria-autocomplete="list" aria-haspopup="listbox"
                  aria-expanded={showDropdown && !selectedStudent} aria-controls={showDropdown && !selectedStudent && filteredStudents.length > 0 ? 'manager-collect-fee-student-options' : undefined}
                  aria-activedescendant={activeStudentIndex >= 0 && filteredStudents[activeStudentIndex] ? `manager-collect-fee-student-option-${filteredStudents[activeStudentIndex].id}` : undefined}
                  onKeyDown={handleStudentSearchKeyDown} onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  onChange={(e) => { setSearch(e.target.value); setSelectedStudent(null); setActiveStudentIndex(-1); setValue('member', '', { shouldDirty: true, shouldValidate: true }); setShowDropdown(true); }}
                />
                <input type="hidden" {...register('member')} value={selectedStudent ? String(selectedStudent.id) : ''} readOnly />
              </div>
              {Boolean(search.trim() && !selectedStudent) && <p className="fin-input-hint fin-text-warning flex items-center gap-1.5 text-xs mt-1" role="alert"><AlertTriangle size={13} className="shrink-0" /><span>Student not selected. Please click an option from the search results below to select.</span></p>}
              {showDropdown && !selectedStudent && (filteredStudents.length === 0 ? (
                <ManagerFinanceCollectFeeEmptyState className="fin-table-empty-cell">{tManagerUi('no_students_found')}</ManagerFinanceCollectFeeEmptyState>
              ) : (
                <div id="manager-collect-fee-student-options" className="fin-dropdown-list" role="listbox" aria-label={tManagerUi('student')}>
                  {filteredStudents.map((s, index) => (
                    <div id={`manager-collect-fee-student-option-${s.id}`} key={s.id} role="option" aria-selected={activeStudentIndex === index} className={`fin-dropdown-item${activeStudentIndex === index ? ' is-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActiveStudentIndex(index)} onClick={() => selectStudent(s)}>
                      <div><div className="font-medium">{s.name}</div><div className="fin-cell-subtext">{s.smartId} · {s.plan} {tManagerUi('valid_till')} {s.validUpto}</div></div>
                      <span className={`fin-badge ${s.status === 'active' ? 'fin-badge--success' : s.status === 'suspended' ? 'fin-badge--danger' : 'fin-badge--warning'}`}>{tManagerUi(s.status)}</span>
                    </div>
                  ))}
                </div>
              ))}
              <ManagerFinanceCollectFeeStudentInfo selectedStudent={selectedStudent} dueAmountText={`${tManagerUi('due_amount')} `} formatCurrency={formatCurrency} onSelectCollectionType={(type) => applyCollectionType(type)} activeCollectionType={collectionType as ManagerFinanceCollectionType} />
            </div>

            <ManagerFinanceCollectFeeCollectionTypeCard
              selectedStudent={selectedStudent} collectionType={(collectionType || 'monthly') as ManagerFinanceCollectionType} monthsToRenew={monthsToRenew} amount={amount}
              studentDueMajor={studentDueMajor} studentDuePaise={studentDuePaise} targetReconciliationAmount={targetReconciliationAmount} isCustomDuration={isCustomDuration}
              billingMonth={billingMonth || currentYearMonth} availableMonths={availableMonths} coverageLabel={billingCycleInfo.coverageLabel} nextDueDateFormatted={billingCycleInfo.nextDueDateFormatted}
              customMonthsError={customMonthsError} formatCurrency={formatCurrency} onApplyCollectionType={(type) => applyCollectionType(type)} onToggleCustomDuration={setIsCustomDuration}
              onDurationChange={(d) => { setDraftValue('monthsToRenew', d); if ((collectionType || 'monthly') === 'monthly') { const amt = STANDARD_CYCLE_AMOUNTS[d] ?? (Number(d) > 0 ? Number(d) * 1200 : undefined); if (amt !== undefined) setDraftValue('amount', String(amt)); } }}
              onSetAmount={(val) => setDraftValue('amount', val)} onSetBillingMonth={(val) => setDraftValue('billingMonth', val)}
              labels={{ monthPayingForCycle: tManagerUi('months_paying_for_cycle'), label1Month: tManagerUi('label_1_month'), label3MonthsQuarterly: tManagerUi('label_3_months_quarterly'), label6MonthsHalfYearly: tManagerUi('label_6_months_half_yearly'), label12MonthsAnnual: tManagerUi('label_12_months_annual') }}
            />

            <ManagerFinanceCollectFeeCompositeCard
              compositeEnabled={compositeEnabled} compositeItems={compositeItems}
              onToggleEnabled={(checked) => { setCompositeEnabled(checked); setDraftValue('amount', String(checked ? compositeItems.filter((i) => i.enabled).reduce((a, c) => a + c.amount, 0) : STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200)); }}
              onToggleItem={(id) => setCompositeItems((prev) => { const next = prev.map((i) => i.id === id ? { ...i, enabled: !i.enabled } : i); setDraftValue('amount', String(next.filter((i) => i.enabled).reduce((s, i) => s + i.amount, 0))); return next; })}
              onUpdateAmount={(id, amt) => setCompositeItems((prev) => { const next = prev.map((i) => i.id === id ? { ...i, amount: amt } : i); setDraftValue('amount', String(next.filter((i) => i.enabled).reduce((s, i) => s + i.amount, 0))); return next; })}
            />

            <div className="fin-card p-6 space-y-4">
              <div className="flex items-center justify-between"><p className="fin-section-label">{tManagerUi('payment_details')}</p><span className="text-xs text-secondary font-medium">Mode: <strong className="text-text-primary">{activeCollectionOption.label}</strong></span></div>
              <div>
                <p className="fin-label" id="manager-collect-fee-payment-mode-label">{tManagerUi('payment_mode_23b35c')} <span className="fin-text-danger">*</span></p>
                <div className="flex gap-2 mt-1 flex-wrap" role="group" aria-labelledby="manager-collect-fee-payment-mode-label">
                  {MANAGER_FINANCE_COLLECT_FEE_MODES.map((m) => (
                    <button type="button" key={m} aria-pressed={mode === m} onClick={() => setDraftValue('mode', m)} className={`fin-badge cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${mode === m ? 'fin-badge--info' : 'fin-badge--neutral'}`}>{modeLabels[m]}</button>
                  ))}
                </div>
              </div>
              <ManagerFinanceCollectFeePaymentInputs
                paymentDate={paymentDate} todayDateStr={todayDateStr} isFuturePaymentDate={isFuturePaymentDate} amount={amount} isAmountInvalid={isAmountInvalid}
                amountError={formState.errors.amount ? tManagerUi(formState.errors.amount.message ?? 'enter_valid_amount') : undefined}
                selectedStudent={selectedStudent} studentDueMajor={studentDueMajor} studentDuePaise={studentDuePaise} targetReconciliationAmount={targetReconciliationAmount}
                total={total} isPartialPayment={isPartialPayment} isFullPayment={isFullPayment} isAdvancePayment={isAdvancePayment} remainingDuePaise={remainingDuePaise}
                collectionType={collectionType || 'monthly'} mode={mode} txnId={txnId} isTxnIdMissing={isTxnIdMissing}
                txnIdError={formState.errors.txnId || isTxnIdMissing ? tManagerUi(formState.errors.txnId?.message ?? 'transaction_reference_required') : undefined}
                isSubmitted={formState.isSubmitted} collectedBy={collectedBy} formatCurrency={formatCurrency} toMinorUnits={toMinorUnits}
                onPaymentDateChange={(v) => setDraftValue('paymentDate', v)} onAmountChange={(v) => setDraftValue('amount', v)} onTxnIdChange={(v) => setDraftValue('txnId', v)} onCollectedByChange={setCollectedBy}
                labels={{ amountLabel: tManagerUi('amount_43dc85'), transactionId: tManagerUi('transaction_id'), collectedBy: tManagerUi('collected_by_898bb0') || 'Collected By' }}
              />
              <ManagerFinanceCollectFeeDiscountsSection
                couponCode={couponCode} onCouponCodeChange={(val) => { setDraftValue('couponCode', val); setCouponStatus('idle'); setCouponDiscount(0); }}
                couponStatus={couponStatus} onApplyCoupon={() => { if (couponCode.trim()) { setCouponDiscount(0); setCouponStatus('unavailable'); } }}
                lateFee={lateFee} onLateFeeChange={(val) => setDraftValue('lateFee', val)} lateFeeOverride={lateFeeOverride} onLateFeeOverrideChange={setLateFeeOverride}
                remark={remark} onRemarkChange={(val) => setDraftValue('remark', val)} couponCodeLabel={tManagerUi('coupon_code')} enterCouponCodePlaceholder={tManagerUi('enter_coupon_code')}
                applyLabel={tManagerUi('apply')} couponValidationUnavailableText={tManagerUi('coupon_validation_unavailable_no_discount_has_been_appli_0e35b5')}
                lateFeeLabel={tManagerUi('late_fee')} overrideLabel={tManagerUi('override')} remarkOptionalLabel={tManagerUi('remark_optional')} anyNotesPlaceholder={tManagerUi('any_notes')}
              />
              <div className="pt-3 border-t border-border mt-4">
                <button type="button" onClick={handleCollect} disabled={isSubmitDisabled} className="fin-btn fin-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  {isSubmitting ? <ButtonLoader icon="hand-coins" /> : <IndianRupee size={16} />}
                  <span>{isSubmitting ? 'Recording Fee Collection...' : `Collect ${activeCollectionOption.label} (${formatCurrency(toMinorUnits(total))}) & Print Receipt`}</span>
                </button>
              </div>
            </div>
          </div>

          <ManagerFinanceCollectFeeReceiptPreview
            selectedStudent={selectedStudent} mode={mode} modeLabels={modeLabels} amount={amount} total={total} collectedBy={collectedBy}
            feeCategory={activeCategory.name} collectionTypeLabel={activeCollectionOption.label}
            billingMonth={collectionType === 'monthly' || collectionType === 'locker' ? billingCycleInfo.billingMonth : undefined}
            billingPeriod={collectionType === 'monthly' || collectionType === 'locker' ? billingCycleInfo.coverageLabel : collectionType === 'dues' ? 'Outstanding Dues Clearance' : collectionType === 'fine' ? 'Late Penalty Clearance' : 'Partial Payment'}
            nextDueDate={collectionType === 'monthly' || collectionType === 'locker' ? billingCycleInfo.nextDueDateFormatted : undefined}
            balanceRemaining={remainingDuePaise} paymentDate={paymentDate} txnId={txnId} isSubmitting={isSubmitting} isCollectAvailable={true}
            receiptNumber={receiptNumber} lineItems={compositeEnabled ? compositeItems.filter((i) => i.enabled) : undefined} onCollect={handleCollect} onCancel={resetForm}
          />
        </div>
      </div>

      <ManagerFinanceCollectFeePostPaymentModal
        isOpen={isPostPaymentModalOpen} onClose={() => { setIsPostPaymentModalOpen(false); resetForm(); }}
        receiptNumber={lastPaidReceipt?.receiptNumber || receiptNumber} studentName={lastPaidReceipt?.studentName || ''}
        smartId={lastPaidReceipt?.smartId || ''} phone={lastPaidReceipt?.phone || ''} totalAmount={lastPaidReceipt?.totalAmount || 0}
        paymentMode={lastPaidReceipt?.paymentMode || 'cash'} txnId={lastPaidReceipt?.txnId} billingPeriod={lastPaidReceipt?.billingPeriod} lineItems={lastPaidReceipt?.lineItems}
      />
    </>
  );
}
