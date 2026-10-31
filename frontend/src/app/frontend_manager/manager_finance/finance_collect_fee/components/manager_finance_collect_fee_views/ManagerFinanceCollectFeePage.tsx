'use client';
import { useTranslations } from 'next-intl';

import { maskManagerCollectFeePhone } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { useManagerCollectFeeFormatting } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeFormattingHook';

// RESPONSIBILITY: Entry page for the manager_collect_fee module.
// DATA FLOW: Next.js Router -> Page -> Components

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
import { MANAGER_FINANCE_COLLECT_FEE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeMocks';
import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { MANAGER_FINANCE_COLLECT_FEE_MODES, MANAGER_FINANCE_COLLECT_FEE_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import { ManagerFinanceCollectFeeEmptyState } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_empty_states/ManagerFinanceCollectFeeEmptyState';
import type { ManagerFinanceCollectFeeRouteQueryProps, ManagerFinanceCollectFeeContractStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeComponentTypes';



export default function ManagerFinanceCollectFeePage(_routeQuery: ManagerFinanceCollectFeeRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_collect_fee.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerFinanceCollectFeeConfirm();
  const { formatCurrency } = useManagerCollectFeeFormatting();
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
  const amount = watch('amount');
  const mode = watch('mode');
  const txnId = watch('txnId');
  const couponCode = watch('couponCode');
  const lateFee = watch('lateFee');
  const monthsToRenew = watch('monthsToRenew');
  const remark = watch('remark');
  const setAmount = (value: string) => setValue('amount', value, { shouldDirty: true, shouldValidate: true });
  const setMode = (value: ManagerFinanceCollectFeeMode) => setValue('mode', value, { shouldDirty: true, shouldValidate: true });
  const setTxnId = (value: string) => setValue('txnId', value, { shouldDirty: true, shouldValidate: true });
  const setCouponCode = (value: string) => setValue('couponCode', value, { shouldDirty: true, shouldValidate: true });
  const setLateFee = (value: string) => setValue('lateFee', value, { shouldDirty: true, shouldValidate: true });
  const setMonthsToRenew = (value: ManagerFinanceCollectFeeDraft['monthsToRenew']) => setValue('monthsToRenew', value, { shouldDirty: true, shouldValidate: true });
  const setRemark = (value: string) => setValue('remark', value, { shouldDirty: true, shouldValidate: true });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<ManagerFinanceCollectFeeContractStatus>('idle');
  const [lateFeeOverride, setLateFeeOverride] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setLateFee('');
    setAmount('');
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
              {selectedStudent && (
                <div className="fin-student-confirmed">
                  <CheckCircle size={16} />
                  <span className="fin-cell-name">{selectedStudent.name}</span>
                  <span className="fin-cell-subtext">({selectedStudent.smartId})</span>
                  <span className="fin-cell-subtext">· +91-{maskManagerCollectFeePhone(selectedStudent.phone)}</span>
                </div>
              )}
              {selectedStudent != null && selectedStudent.dueAmount > 0 && (
                <div className="fin-badge fin-badge--danger w-full justify-center py-2">
                  {tManagerUi('due_amount')} {formatCurrency(selectedStudent?.dueAmount ?? 0)} {tManagerUi('pending')}
                </div>
              )}
            </div>

            <div className="fin-card p-6 space-y-4">
              <p className="fin-section-label">{tManagerUi('payment_details')}</p>
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-128">{tManagerUi('months_paying_for_cycle')}</label>
                <select id="rbg4-managerfinancecollectfeepage-128" className="fin-select w-full mt-1" value={monthsToRenew} onChange={e => setMonthsToRenew(e.target.value as ManagerFinanceCollectFeeDraft['monthsToRenew'])}>
                  <option value="1">{tManagerUi('label_1_month')}</option>
                  <option value="3">{tManagerUi('label_3_months_quarterly')}</option>
                  <option value="6">{tManagerUi('label_6_months_half_yearly')}</option>
                  <option value="12">{tManagerUi('label_12_months_annual')}</option>
                </select>
              </div>
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-137">{tManagerUi('amount_43dc85')} <span className="fin-text-danger">*</span></label>
                <div className="relative mt-1">
                  <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                  <input id="rbg4-managerfinancecollectfeepage-137" type="number" min="0.01" step="0.01" className="fin-input fin-input--pl8" placeholder="0.00" value={amount} aria-invalid={Boolean(formState.errors.amount)} onChange={e => setAmount(e.target.value)} />
                  {formState.errors.amount && <p className="fin-input-hint fin-text-danger" role="alert">{tManagerUi(formState.errors.amount.message ?? 'enter_valid_amount')}</p>}
                </div>
              </div>
              <div>
                <p className="fin-label" id="manager-collect-fee-payment-mode-label">{tManagerUi('payment_mode_23b35c')}</p>
                <div className="flex gap-2 mt-1 flex-wrap" role="group" aria-labelledby="manager-collect-fee-payment-mode-label">
                  {MANAGER_FINANCE_COLLECT_FEE_MODES.map(m => (
                    <button type="button" key={m} aria-pressed={mode === m} onClick={() => setMode(m)} className={`fin-badge cursor-pointer ${mode === m ? 'fin-badge--info' : 'fin-badge--neutral'}`}>
                      {modeLabels[m]}
                    </button>
                  ))}
                </div>
              </div>
              {mode !== 'cash' && (
                <div>
                  <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-155">{tManagerUi('transaction_id')} <span className="fin-text-danger">*</span></label>
                  <input id="rbg4-managerfinancecollectfeepage-155" className="fin-input w-full mt-1" placeholder={tManagerUi('enter_transaction_reference')} value={txnId} aria-invalid={Boolean(formState.errors.txnId)} onChange={e => setTxnId(e.target.value)} />
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
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-160">{tManagerUi('coupon_code')}</label>
                <div className="flex gap-2 mt-1">
                  <input id="rbg4-managerfinancecollectfeepage-160" className="fin-input flex-1" placeholder={tManagerUi('enter_coupon_code')} value={couponCode}
                    onChange={e => { setCouponCode(e.target.value); setCouponStatus('idle'); setCouponDiscount(0); }} />
                  <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handleApplyCoupon}>{tManagerUi('apply')}</button>
                </div>
                {couponStatus === 'unavailable' && <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-finance-coupon-contract-warning">{tManagerUi('coupon_validation_unavailable_no_discount_has_been_appli_0e35b5')}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="fin-label" htmlFor="manager-collect-fee-late-fee">{tManagerUi('late_fee')}</label>
                  <label className="flex items-center gap-1 fin-text-xs cursor-pointer">
                    <input type="checkbox" checked={lateFeeOverride} onChange={e => setLateFeeOverride(e.target.checked)} /> {tManagerUi('override')}
                  </label>
                </div>
                <input id="manager-collect-fee-late-fee" type="number" className="fin-input w-full mt-1" value={lateFee} onChange={e => setLateFee(e.target.value)} readOnly={!lateFeeOverride} />
              </div>
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-178">{tManagerUi('remark_optional')}</label>
                <textarea id="rbg4-managerfinancecollectfeepage-178" className="fin-textarea mt-1" rows={2} placeholder={tManagerUi('any_notes')} value={remark} onChange={e => setRemark(e.target.value)} />
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
