'use client';
import { useTranslations } from 'next-intl';
import { useManagerCollectFeeFormatting } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/ManagerFinanceCollectFeeFormattingHook';
import { useEffect, useState, useMemo, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useManagerFinanceCollectFeeConfirm } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeConfirm';
import { useManagerFinanceCollectFeeUnsavedChangesGuard } from '@/app/frontend_manager/manager_finance/finance_collect_fee/hooks/useManagerFinanceCollectFeeUnsavedChangesGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerFinanceCollectFeeDraftSchema, type ManagerFinanceCollectFeeDraft } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeDraftSchema';
import { toast } from 'sonner';
import { Search, IndianRupee, UserCheck, Calendar, Tag, AlertTriangle, AlertCircle, CheckCircle, Scale, PieChart, Archive, Plus, Layers } from 'lucide-react';
import { ManagerFinanceCollectFeeReceiptPreview } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeeReceiptPreview';
import ManagerFinanceCollectFeeDurationSelector from './ManagerFinanceCollectFeeDurationSelector';
import ManagerFinanceCollectFeeDiscountsSection from './ManagerFinanceCollectFeeDiscountsSection';
import ManagerFinanceCollectFeeStudentInfo from './ManagerFinanceCollectFeeStudentInfo';
import ManagerFinanceCollectFeePostPaymentModal from './ManagerFinanceCollectFeePostPaymentModal';
import { MANAGER_FINANCE_COLLECT_FEE_STUDENTS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/mocks/manager_finance_collect_fee_fixtures/ManagerFinanceCollectFeeMocks';
import type { ManagerFinanceCollectFeeMode } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import {
  MANAGER_FINANCE_COLLECT_FEE_MODES,
  MANAGER_FINANCE_FEE_CATEGORIES,
  MANAGER_FINANCE_COLLECTION_TYPES,
  STANDARD_CYCLE_AMOUNTS,
  type ManagerFinanceCollectionType,
} from '@/app/frontend_manager/manager_finance/finance_collect_fee/constants/ManagerFinanceCollectFeeConstants';
import { calculateBillingCycleInfo, getAvailableBillingMonths } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeUtilities';
import { ManagerFinanceCollectFeeEmptyState } from '@/app/frontend_manager/manager_finance/finance_collect_fee/components/manager_finance_collect_fee_empty_states/ManagerFinanceCollectFeeEmptyState';
import type { ManagerFinanceCollectFeeRouteQueryProps, ManagerFinanceCollectFeeContractStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeComponentTypes';

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
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeStudentIndex, setActiveStudentIndex] = useState(-1);
  const [selectedStudent, setSelectedStudent] = useState<(typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number] | null>(null);

  const { register, watch, setValue, reset, handleSubmit, formState } = useForm<ManagerFinanceCollectFeeDraft>({
    resolver: zodResolver(managerFinanceCollectFeeDraftSchema),
    defaultValues: {
      member: '',
      amount: '',
      mode: 'cash',
      txnId: '',
      couponCode: '',
      lateFee: '',
      monthsToRenew: '1',
      remark: '',
      feeCategory: 'seat_fee',
      collectionType: 'monthly',
      billingMonth: currentYearMonth,
      paymentDate: todayDateStr,
    },
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
  useEffect(() => {
    setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);
  }, []);

  // Post-Payment Confirmation Popup State
  const [isPostPaymentModalOpen, setIsPostPaymentModalOpen] = useState(false);
  const [lastPaidReceipt, setLastPaidReceipt] = useState<{
    receiptNumber: string;
    studentName: string;
    smartId: string;
    phone: string;
    totalAmount: number;
    paymentMode: string;
    txnId?: string;
    billingPeriod?: string;
    lineItems: { id: string; label: string; amount: number }[];
  } | null>(null);

  // Composite Billing (Multi-Item Invoice) State
  const [compositeEnabled, setCompositeEnabled] = useState(false);
  const [compositeItems, setCompositeItems] = useState([
    { id: 'seat_fee', label: 'Seat Monthly Fee', amount: 1200, enabled: true },
    { id: 'locker_fee', label: 'Locker Rental Fee', amount: 400, enabled: false },
    { id: 'late_fine', label: 'Late Fine / Penalty', amount: 200, enabled: false },
    { id: 'reg_fee', label: 'Registration / Admission Fee', amount: 500, enabled: false },
  ]);

  const toggleCompositeItem = (id: string) => {
    setCompositeItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item));
      const newTotal = next.filter((i) => i.enabled).reduce((sum, i) => sum + i.amount, 0);
      setDraftValue('amount', String(newTotal));
      return next;
    });
  };

  const updateCompositeItemAmount = (id: string, newAmt: number) => {
    setCompositeItems((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, amount: newAmt } : item));
      const newTotal = next.filter((i) => i.enabled).reduce((sum, i) => sum + i.amount, 0);
      setDraftValue('amount', String(newTotal));
      return next;
    });
  };

  // Pre-fill student & amount from query parameters (e.g. from Payment Promises or Fines)
  useEffect(() => {
    if (_routeQuery.id || _routeQuery.name || _routeQuery.smartId) {
      const matched = MANAGER_FINANCE_COLLECT_FEE_STUDENTS.find(
        (s) =>
          (_routeQuery.id && String(s.id) === String(_routeQuery.id)) ||
          (_routeQuery.smartId && s.smartId.toLowerCase() === _routeQuery.smartId.toLowerCase()) ||
          (_routeQuery.name && s.name.toLowerCase().includes(_routeQuery.name.toLowerCase()))
      );
      if (matched) {
        setSelectedStudent(matched);
        setSearch(matched.name);
        setValue('member', String(matched.id));
      } else if (_routeQuery.name) {
        const fallbackStudent = {
          id: Number(_routeQuery.id) || 999,
          name: _routeQuery.name,
          smartId: _routeQuery.smartId || 'STU-PROMISE',
          phone: _routeQuery.phone || '9876543210',
          status: 'active' as const,
          dueAmount: Number(_routeQuery.amount) ? Number(_routeQuery.amount) * 100 : 0,
          plan: 'Regular Seat Plan',
          shift: 'General',
          seat: 'Desk S-01',
          validUpto: todayDateStr,
        };
        setSelectedStudent(fallbackStudent);
        setSearch(_routeQuery.name);
        setValue('member', String(fallbackStudent.id));
      }
    }
    if (_routeQuery.amount) {
      setDraftValue('amount', _routeQuery.amount);
    }
  }, [_routeQuery.id, _routeQuery.name, _routeQuery.smartId, _routeQuery.amount, _routeQuery.phone, todayDateStr]);

  const billingCycleInfo = useMemo(() => {
    return calculateBillingCycleInfo(billingMonth || currentYearMonth, Number(monthsToRenew) || 1);
  }, [billingMonth, currentYearMonth, monthsToRenew]);

  const activeCategory = useMemo(() => {
    return MANAGER_FINANCE_FEE_CATEGORIES.find((c) => c.id === (feeCategory || 'seat_fee')) || MANAGER_FINANCE_FEE_CATEGORIES[0];
  }, [feeCategory]);

  const activeCollectionOption = useMemo(() => {
    return MANAGER_FINANCE_COLLECTION_TYPES.find((c) => c.id === (collectionType || 'monthly')) || MANAGER_FINANCE_COLLECTION_TYPES[0];
  }, [collectionType]);

  const hasUnsavedCollectionDraft = Boolean(
    (selectedStudent && (amount || formState.isDirty)) ||
    amount ||
    txnId ||
    couponCode ||
    lateFee ||
    remark ||
    monthsToRenew !== '1' ||
    feeCategory !== 'seat_fee' ||
    collectionType !== 'monthly'
  );
  // Guard contract: if (confirmed) router.push(`${next.pathname}${next.search}${next.hash}`);
  useManagerFinanceCollectFeeUnsavedChangesGuard({ isDirty: hasUnsavedCollectionDraft, confirm, router, tManagerUi });

  const filteredStudents = MANAGER_FINANCE_COLLECT_FEE_STUDENTS.filter(s => {
    if (!debouncedSearch.trim()) return true;
    const q = debouncedSearch.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.smartId.toLowerCase().includes(q) || s.phone.includes(q);
  });

  /**
   * Intelligently applies collection type and auto-populates amounts and cycles
   */
  function applyCollectionType(type: ManagerFinanceCollectionType, student = selectedStudent, duration = monthsToRenew) {
    setDraftValue('collectionType', type);

    if (type === 'dues') {
      // DUES COLLECTION: Auto-fetch student's exact pending due
      const dueMajor = student && student.dueAmount > 0 ? student.dueAmount / 100 : 0;
      setDraftValue('amount', dueMajor > 0 ? String(dueMajor) : '0');
      setDraftValue('feeCategory', 'seat_fee');
      setDraftValue('lateFee', '');
    } else if (type === 'monthly') {
      // MONTHLY FEE / RENEWAL: Auto-fetch plan cycle rate
      const cycleAmt = STANDARD_CYCLE_AMOUNTS[duration] ?? (Number(duration) > 0 ? Number(duration) * 1200 : 1200);
      setDraftValue('amount', String(cycleAmt));
      setDraftValue('feeCategory', 'seat_fee');
      setDraftValue('lateFee', '');
    } else if (type === 'fine') {
      // FINE / PENALTY ONLY: Auto-fetch standard fine
      setDraftValue('amount', '200');
      setDraftValue('feeCategory', 'fine');
      setDraftValue('lateFee', '200');
    } else if (type === 'partial') {
      // PARTIAL PAYMENT: Auto-suggest 50% of outstanding due or monthly fee
      const targetMajor = student && student.dueAmount > 0 ? student.dueAmount / 100 : 1200;
      const half = Math.round(targetMajor / 2);
      setDraftValue('amount', String(half));
      setDraftValue('feeCategory', 'seat_fee');
    } else if (type === 'locker') {
      // LOCKER ALLOCATION: Auto-fetch locker fee
      setDraftValue('amount', '400');
      setDraftValue('feeCategory', 'locker_fee');
      setDraftValue('lateFee', '');
    }
  }

  function selectStudent(student: (typeof MANAGER_FINANCE_COLLECT_FEE_STUDENTS)[number]) {
    setSelectedStudent(student);
    setSearch(student.name);
    setShowDropdown(false);
    setActiveStudentIndex(-1);
    setValue('member', String(student.id), { shouldDirty: true, shouldValidate: true });

    // Condition: If student has pending dues, auto-select 'dues' and auto-fetch pending due amount!
    // If student has 0 dues, auto-select 'monthly' fee and auto-fetch standard cycle amount!
    if (student.dueAmount > 0) {
      applyCollectionType('dues', student);
    } else {
      applyCollectionType('monthly', student);
    }
  }

  function handleStudentSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      if (showDropdown) { event.preventDefault(); setShowDropdown(false); setActiveStudentIndex(-1); }
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!showDropdown || filteredStudents.length === 0) return;
      event.preventDefault();
      setActiveStudentIndex((curr) => {
        if (event.key === 'ArrowDown') return curr < 0 ? 0 : (curr + 1) % filteredStudents.length;
        return curr < 0 ? filteredStudents.length - 1 : (curr - 1 + filteredStudents.length) % filteredStudents.length;
      });
      return;
    }
    if (event.key === 'Enter' && showDropdown && activeStudentIndex >= 0 && filteredStudents[activeStudentIndex]) {
      event.preventDefault(); selectStudent(filteredStudents[activeStudentIndex]);
    }
  }

  function handleDurationChange(newDuration: string) {
    setDraftValue('monthsToRenew', newDuration);
    if ((collectionType || 'monthly') === 'monthly') {
      const cycleAmt = STANDARD_CYCLE_AMOUNTS[newDuration] ?? (Number(newDuration) > 0 ? Number(newDuration) * 1200 : undefined);
      if (cycleAmt !== undefined) {
        setDraftValue('amount', String(cycleAmt));
      }
    }
  }

  const baseAmount = Number.isFinite(Number(amount)) && amount.trim() !== '' ? Number(amount) : 0;
  const lateFeeAmt = Number.isFinite(Number(lateFee)) && lateFee.trim() !== '' ? Number(lateFee) : 0;
  const total = Math.max(0, baseAmount + lateFeeAmt - couponDiscount);

  // Negative scenario validation flags
  const numAmount = parseFloat(amount || '');
  const isAmountInvalid = !amount || isNaN(numAmount) || numAmount <= 0;
  const isTxnIdMissing = mode !== 'cash' && !txnId.trim();
  const customMonthsNum = Number(monthsToRenew);
  const customMonthsError = isCustomDuration && (isNaN(customMonthsNum) || customMonthsNum < 1 || customMonthsNum > 36)
    ? 'Duration must be between 1 and 36 months'
    : undefined;
  const isFuturePaymentDate = Boolean(paymentDate && paymentDate > todayDateStr);
  const hasUnselectedSearchText = Boolean(search.trim() && !selectedStudent);

  // Financial reconciliation: dues vs payment
  const studentDuePaise = selectedStudent?.dueAmount ?? 0;
  const studentDueMajor = studentDuePaise / 100;
  const targetReconciliationAmount = studentDueMajor > 0 ? studentDueMajor : (STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200);
  const isPartialPayment = studentDuePaise > 0 && total > 0 && total < studentDueMajor;
  const isFullPayment = studentDuePaise > 0 && total === studentDueMajor;
  const isAdvancePayment = studentDuePaise > 0 && total > studentDueMajor;
  const remainingDuePaise = studentDuePaise > 0 ? Math.max(0, studentDuePaise - Math.round(total * 100)) : 0;

  function resetForm() {
    setSelectedStudent(null);
    setSearch('');
    reset({
      member: '',
      amount: '',
      mode: 'cash',
      txnId: '',
      couponCode: '',
      lateFee: '',
      monthsToRenew: '1',
      remark: '',
      feeCategory: 'seat_fee',
      collectionType: 'monthly',
      billingMonth: currentYearMonth,
      paymentDate: todayDateStr,
    });
    setCouponDiscount(0);
    setCouponStatus('idle');
    setLateFeeOverride(false);
    setIsSubmitting(false);
    setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);
  }

  function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponDiscount(0);
    setCouponStatus('unavailable');
  }

  const isSubmitDisabled =
    isSubmitting ||
    !selectedStudent ||
    isAmountInvalid ||
    isTxnIdMissing ||
    Boolean(customMonthsError) ||
    isFuturePaymentDate;

  const handleCollect = handleSubmit(async (_draft) => {
    if (isSubmitDisabled) return;
    const studentName = selectedStudent?.name || 'Selected Student';
    const purposeName = activeCollectionOption.label;
    const confirmed = await confirm(
      `Confirm fee collection: Collect ₹${total} (${purposeName}) from ${studentName}? This will record the payment and verify receipt.`,
      tManagerUi('cancel') || 'Cancel',
      `${tManagerUi('collect_fee') || 'Collect Fee'} (₹${total})`
    );
    if (!confirmed) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${tManagerUi('collect_fee')}: ₹${total} (${purposeName}) for ${studentName} recorded successfully!`, { id: 'manager-finance-collect-fee-success' });
      const activeLineItems = compositeEnabled
        ? compositeItems.filter((i) => i.enabled).map((i) => ({ id: i.id, label: i.label, amount: i.amount }))
        : [{ id: 'primary', label: activeCollectionOption.label, amount: total }];
      setLastPaidReceipt({
        receiptNumber,
        studentName,
        smartId: selectedStudent?.smartId || '',
        phone: selectedStudent?.phone || '',
        totalAmount: total,
        paymentMode: mode,
        txnId,
        billingPeriod: billingCycleInfo.coverageLabel,
        lineItems: activeLineItems,
      });
      setIsPostPaymentModalOpen(true);
    }, 250);
  });

  const handleClosePostPaymentModal = () => {
    setIsPostPaymentModalOpen(false);
    resetForm();
  };

  return (
    <>
      {unsavedConfirmDialog}
      <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="fin-page-title text-2xl font-bold tracking-tight">{tManagerUi('collect_fee') || 'Collect Fee'}</h1>
            <p className="fin-page-subtitle text-sm text-secondary mt-1">
              Record student dues, monthly plan renewal, and generate verified receipts.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 self-start sm:self-auto shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Collection Desk</span>
          </div>
          <p className="sr-only" data-testid="manager-finance-collect-contract-warning" role="status">
            {tManagerUi('read_only_preview_payment_collection_receipt_issuance_an_ea2152')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 fin-collect-fee-grid">
          <div className="lg:col-span-3 space-y-4">
            {/* 1. Student Search & Details Card */}
            <div className="fin-card p-6 space-y-3">
              <label className="fin-section-label" htmlFor="manager-collect-fee-student-search">{tManagerUi('student')} <span className="fin-text-danger">*</span></label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                <input
                  id="manager-collect-fee-student-search" className="fin-input fin-input--pl9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder={tManagerUi('search_by_name_or_smart_id')} value={search}
                  role="combobox" aria-autocomplete="list" aria-haspopup="listbox"
                  aria-expanded={showDropdown && !selectedStudent}
                  aria-controls={showDropdown && !selectedStudent && filteredStudents.length > 0 ? "manager-collect-fee-student-options" : undefined}
                  aria-activedescendant={activeStudentIndex >= 0 && filteredStudents[activeStudentIndex] ? `manager-collect-fee-student-option-${filteredStudents[activeStudentIndex].id}` : undefined}
                  onKeyDown={handleStudentSearchKeyDown}
                  onChange={e => { setSearch(e.target.value); setSelectedStudent(null); setActiveStudentIndex(-1); setValue('member', '', { shouldDirty: true, shouldValidate: true }); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <input type="hidden" {...register('member')} value={selectedStudent ? String(selectedStudent.id) : ''} readOnly />
              </div>
              {hasUnselectedSearchText && (
                <p className="fin-input-hint fin-text-warning flex items-center gap-1.5 text-xs mt-1" role="alert">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>Student not selected. Please click an option from the search results below to select.</span>
                </p>
              )}
              {showDropdown && !selectedStudent && (filteredStudents.length === 0 ? (
                <ManagerFinanceCollectFeeEmptyState className="fin-table-empty-cell">{tManagerUi('no_students_found')}</ManagerFinanceCollectFeeEmptyState>
              ) : (
                <div id="manager-collect-fee-student-options" className="fin-dropdown-list" role="listbox" aria-label={tManagerUi('student')}>
                  {filteredStudents.map((s, index) => (
                    <div id={`manager-collect-fee-student-option-${s.id}`} key={s.id} role="option" aria-selected={activeStudentIndex === index} className={`fin-dropdown-item${activeStudentIndex === index ? ' is-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActiveStudentIndex(index)} onClick={() => selectStudent(s)}>
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
                onSelectCollectionType={(type) => applyCollectionType(type)}
                activeCollectionType={collectionType as ManagerFinanceCollectionType}
              />
            </div>

            {/* 2. Collection Type Selector Card (What are you collecting?) */}
            <div className="fin-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="fin-section-label">What are you collecting today?</p>
                {selectedStudent && (
                  <span className="text-xs text-primary font-medium">
                    Auto-fetch active for {selectedStudent.name}
                  </span>
                )}
              </div>

              {/* 5 Clear Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Collection Option">
                {MANAGER_FINANCE_COLLECTION_TYPES.map((opt) => {
                  const isSelected = (collectionType || 'monthly') === opt.id;
                  const isDuesOption = opt.id === 'dues';
                  const studentHasDues = selectedStudent && selectedStudent.dueAmount > 0;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => applyCollectionType(opt.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                          : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                          {opt.label}
                        </span>
                        {isDuesOption && studentHasDues && (
                          <span className="fin-badge fin-badge--danger text-[9px] px-1 py-0">
                            ₹{studentDueMajor}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-secondary mt-1 leading-snug">
                        {opt.description}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Auto-Fetch Feedback Alert Banner */}
              <div className="text-xs p-3 rounded-lg border bg-muted/30 border-border space-y-1">
                {collectionType === 'dues' && (
                  studentDueMajor > 0 ? (
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle size={14} className="shrink-0" />
                      <span>Auto-fetched Full Due: <strong>{formatCurrency(studentDuePaise)}</strong> has been populated in the amount field to settle all past dues.</span>
                    </div>
                  ) : (
                    <div className="text-secondary flex items-center gap-1.5">
                      <AlertCircle size={14} className="shrink-0 text-amber-500" />
                      <span>Student has <strong>₹0.00 outstanding dues</strong>. Selecting <strong>Monthly Fee (Renewal)</strong> or <strong>Late Fine</strong> is recommended.</span>
                    </div>
                  )
                )}

                {collectionType === 'monthly' && (
                  <div className="space-y-1">
                    <div className="text-text-primary font-medium flex items-center gap-1.5">
                      <Calendar size={14} className="shrink-0 text-primary" />
                      <span>Auto-fetched Plan Cycle Rate: <strong>₹{STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200}</strong> for {monthsToRenew} Month(s).</span>
                    </div>
                    {studentDueMajor > 0 && (
                      <div className="flex items-center justify-between text-danger font-medium pt-1 border-t border-border/60">
                        <span>Student also has {formatCurrency(studentDuePaise)} previous dues.</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cycleAmt = STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200;
                            setDraftValue('amount', String(cycleAmt + studentDueMajor));
                          }}
                          className="underline hover:opacity-80 text-xs font-semibold cursor-pointer"
                        >
                          + Add Past Dues (+₹{studentDueMajor})
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {collectionType === 'fine' && (
                  <div className="text-text-primary font-medium flex items-center gap-1.5">
                    <Scale size={14} className="shrink-0 text-amber-500" />
                    <span>Auto-fetched Overdue Fine: <strong>₹200.00</strong>. This records late fee clearance only and will not extend desk validity.</span>
                  </div>
                )}

                {collectionType === 'partial' && (
                  <div className="space-y-2">
                    <div className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
                      <PieChart size={14} className="shrink-0" />
                      <span>Partial Payment Mode Active: Settle part of the target amount (Target: ₹{targetReconciliationAmount}).</span>
                    </div>
                    {/* Quick Partial Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[11px] text-secondary">Quick amounts:</span>
                      {[500, 1000, 1500, Math.round(targetReconciliationAmount / 2)].filter((v, idx, arr) => v > 0 && arr.indexOf(v) === idx).map((chipVal) => (
                        <button
                          type="button"
                          key={`chip-${chipVal}`}
                          onClick={() => setDraftValue('amount', String(chipVal))}
                          className={`text-xs px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            amount === String(chipVal)
                              ? 'bg-primary text-on-primary font-semibold border-primary'
                              : 'bg-card border-border hover:bg-muted text-text-primary'
                          }`}
                        >
                          ₹{chipVal}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {collectionType === 'locker' && (
                  <div className="text-text-primary font-medium flex items-center gap-1.5">
                    <Archive size={14} className="shrink-0 text-purple-500" />
                    <span>Auto-fetched Locker Fee: <strong>₹400.00</strong> for monthly locker allocation.</span>
                  </div>
                )}
              </div>

              {/* Show Duration & Billing Month selector ONLY when relevant (Monthly or Locker) */}
              {(collectionType === 'monthly' || collectionType === 'locker') && (
                <div className="pt-2 border-t border-border/70">
                  <ManagerFinanceCollectFeeDurationSelector
                    isCustomDuration={isCustomDuration}
                    onToggleCustomDuration={setIsCustomDuration}
                    monthsToRenew={monthsToRenew}
                    onMonthsToRenewChange={handleDurationChange}
                    onAmountChange={(val) => setDraftValue('amount', val)}
                    labelMonthPayingForCycle={tManagerUi('months_paying_for_cycle')}
                    label1Month={tManagerUi('label_1_month')}
                    label3MonthsQuarterly={tManagerUi('label_3_months_quarterly')}
                    label6MonthsHalfYearly={tManagerUi('label_6_months_half_yearly')}
                    label12MonthsAnnual={tManagerUi('label_12_months_annual')}
                    billingMonth={billingMonth}
                    onBillingMonthChange={(val) => setDraftValue('billingMonth', val)}
                    availableMonths={availableMonths}
                    coverageLabel={billingCycleInfo.coverageLabel}
                    nextDueDateFormatted={billingCycleInfo.nextDueDateFormatted}
                    customMonthsError={customMonthsError}
                  />
                </div>
              )}
            </div>

            {/* 2.5 Composite Billing (Multi-Item Invoice) Card */}
            <div className="fin-card p-6 space-y-4 border border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Composite Billing (Multi-Item Receipt)</h3>
                    <p className="text-xs text-secondary">Bundle seat fees, lockers, and late penalties into one combined receipt.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    data-testid="manager-finance-composite-toggle"
                    checked={compositeEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setCompositeEnabled(checked);
                      if (checked) {
                        const sum = compositeItems.filter((i) => i.enabled).reduce((acc, curr) => acc + curr.amount, 0);
                        setDraftValue('amount', String(sum));
                      } else {
                        const cycleAmt = STANDARD_CYCLE_AMOUNTS[monthsToRenew] || 1200;
                        setDraftValue('amount', String(cycleAmt));
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {compositeEnabled && (
                <div className="space-y-3 pt-3 border-t border-border/70 animate-in fade-in">
                  <p className="text-xs font-semibold text-text-primary">Select items to include in this invoice:</p>
                  <div className="space-y-2">
                    {compositeItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                          item.enabled ? 'border-primary/40 bg-primary/5 shadow-xs' : 'border-border bg-card opacity-60'
                        }`}
                      >
                        <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={() => toggleCompositeItem(item.id)}
                            className="rounded text-primary focus:ring-primary w-4 h-4"
                          />
                          <span className={`text-xs font-semibold ${item.enabled ? 'text-primary' : 'text-secondary'}`}>
                            {item.label}
                          </span>
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-secondary font-semibold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={item.amount}
                            disabled={!item.enabled}
                            onChange={(e) => updateCompositeItemAmount(item.id, Number(e.target.value) || 0)}
                            className="w-24 text-xs font-bold rounded-lg border border-border bg-surface px-2.5 py-1 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border text-xs font-bold text-primary">
                    <span>Combined Total ({compositeItems.filter((i) => i.enabled).length} items):</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ₹{compositeItems.filter((i) => i.enabled).reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Details Card */}
            <div className="fin-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="fin-section-label">{tManagerUi('payment_details')}</p>
                <span className="text-xs text-secondary font-medium">
                  Mode: <strong className="text-text-primary">{activeCollectionOption.label}</strong>
                </span>
              </div>
              
              {/* Payment Date & Amount Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="fin-label flex items-center gap-1.5" htmlFor="manager-collect-fee-payment-date">
                    <Calendar size={13} className="fin-icon-muted" />
                    <span>Payment Date</span>
                    <span className="fin-text-danger">*</span>
                  </label>
                  <input
                    id="manager-collect-fee-payment-date"
                    type="date"
                    max={todayDateStr}
                    className={`fin-input w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isFuturePaymentDate ? 'border-danger' : ''
                    }`}
                    value={paymentDate || todayDateStr}
                    onChange={(e) => setDraftValue('paymentDate', e.target.value)}
                  />
                  {isFuturePaymentDate && (
                    <p className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
                      Payment date cannot be in the future.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-137">
                      {tManagerUi('amount_43dc85')} <span className="fin-text-danger">*</span>
                    </label>
                    <span className="text-[10px] text-primary font-medium">
                      {collectionType === 'dues' ? 'Auto-filled Due' : collectionType === 'monthly' ? 'Auto-filled Cycle' : collectionType === 'fine' ? 'Auto-filled Fine' : 'Amount'}
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                    <input
                      id="rbg4-managerfinancecollectfeepage-137"
                      type="number"
                      min="0.01"
                      step="0.01"
                      className={`fin-input fin-input--pl8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        formState.errors.amount || (amount !== '' && isAmountInvalid) ? 'border-danger' : ''
                      }`}
                      placeholder="0.00"
                      value={amount}
                      aria-invalid={Boolean(formState.errors.amount || (amount !== '' && isAmountInvalid))}
                      aria-describedby={formState.errors.amount ? "manager-collect-fee-amount-error" : undefined}
                      onChange={(e) => setDraftValue('amount', e.target.value)}
                    />
                  </div>
                  {formState.errors.amount && (
                    <p id="manager-collect-fee-amount-error" className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
                      {tManagerUi(formState.errors.amount.message ?? 'enter_valid_amount')}
                    </p>
                  )}
                  {!formState.errors.amount && amount !== '' && isAmountInvalid && (
                    <p className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
                      Amount must be greater than ₹0.00.
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Payment Reconciliation Feedback */}
              {selectedStudent && (studentDueMajor > 0 || total > 0) && (
                <div className="p-3 rounded-lg border text-xs space-y-1.5 transition-colors bg-card border-border">
                  <div className="flex justify-between items-center text-secondary">
                    <span>Target Due / Fee: <span className="font-semibold text-danger">{formatCurrency(studentDuePaise > 0 ? studentDuePaise : toMinorUnits(targetReconciliationAmount))}</span></span>
                    <span>Amount Paying: <span className="font-semibold text-text-primary">₹{total}</span></span>
                  </div>
                  {isPartialPayment && (
                    <div className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5">
                      <AlertTriangle size={13} className="shrink-0" />
                      <span>Partial Payment: Remaining balance due will be {formatCurrency(remainingDuePaise)}.</span>
                    </div>
                  )}
                  {isFullPayment && (
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle size={13} className="shrink-0" />
                      <span>✓ Full Settlement: Total pending dues of {formatCurrency(studentDuePaise)} will be completely cleared.</span>
                    </div>
                  )}
                  {isAdvancePayment && (
                    <div className="text-blue-700 dark:text-blue-400 font-medium">
                      ✓ Advance Payment: Outstanding dues cleared + ₹{total - studentDueMajor} credited to subsequent cycle.
                    </div>
                  )}
                </div>
              )}

              {/* Payment Mode Selection */}
              <div>
                <p className="fin-label" id="manager-collect-fee-payment-mode-label">{tManagerUi('payment_mode_23b35c')} <span className="fin-text-danger">*</span></p>
                <div className="flex gap-2 mt-1 flex-wrap" role="group" aria-labelledby="manager-collect-fee-payment-mode-label">
                  {MANAGER_FINANCE_COLLECT_FEE_MODES.map(m => (
                    <button
                      type="button" key={m} aria-pressed={mode === m} onClick={() => setDraftValue('mode', m)}
                      className={`fin-badge cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${mode === m ? 'fin-badge--info' : 'fin-badge--neutral'}`}
                    >
                      {modeLabels[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Transaction Reference for Non-Cash */}
              {mode !== 'cash' && (
                <div>
                  <label className="fin-label flex items-center justify-between" htmlFor="rbg4-managerfinancecollectfeepage-155">
                    <span>{tManagerUi('transaction_id')} <span className="fin-text-danger">*</span></span>
                    <span className="text-[10px] text-secondary">Mandatory for {mode.toUpperCase()}</span>
                  </label>
                  <input
                    id="rbg4-managerfinancecollectfeepage-155"
                    className={`fin-input w-full mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isTxnIdMissing && (formState.isSubmitted || txnId !== '') ? 'border-danger bg-red-500/5' : ''
                    }`}
                    placeholder={
                      mode === 'upi'
                        ? 'Enter UPI UTR / Txn Reference (e.g. 425123456789)'
                        : mode === 'card'
                        ? 'Enter POS Authorization Code / Slip No.'
                        : 'Enter IMPS / NEFT / RTGS Reference Number'
                    }
                    value={txnId}
                    aria-invalid={isTxnIdMissing}
                    aria-describedby={formState.errors.txnId || isTxnIdMissing ? "manager-collect-fee-txnid-error" : undefined}
                    onChange={e => setDraftValue('txnId', e.target.value)}
                  />
                  {(formState.errors.txnId || isTxnIdMissing) && (
                    <p id="manager-collect-fee-txnid-error" className="fin-input-hint fin-text-danger mt-1 text-xs" role="alert">
                      {tManagerUi(formState.errors.txnId?.message ?? 'transaction_reference_required')}
                    </p>
                  )}
                </div>
              )}

              {/* Collected By Field */}
              <div>
                <label className="fin-label" htmlFor="rbg4-managerfinancecollectfeepage-collected-by">
                  {tManagerUi('collected_by_898bb0') || 'Collected By'} <span className="fin-text-danger">*</span>
                </label>
                <div className="relative mt-1">
                  <UserCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-icon-muted" />
                  <input
                    id="rbg4-managerfinancecollectfeepage-collected-by" type="text" className="fin-input fin-input--pl8"
                    placeholder="Collector Name" value={collectedBy} onChange={(e) => setCollectedBy(e.target.value)}
                  />
                </div>
              </div>

              {/* Discounts & Late Fee Section */}
              <ManagerFinanceCollectFeeDiscountsSection
                couponCode={couponCode} onCouponCodeChange={(val) => { setDraftValue('couponCode', val); setCouponStatus('idle'); setCouponDiscount(0); }}
                couponStatus={couponStatus} onApplyCoupon={handleApplyCoupon} lateFee={lateFee} onLateFeeChange={(val) => setDraftValue('lateFee', val)}
                lateFeeOverride={lateFeeOverride} onLateFeeOverrideChange={setLateFeeOverride} remark={remark} onRemarkChange={(val) => setDraftValue('remark', val)}
                couponCodeLabel={tManagerUi('coupon_code')} enterCouponCodePlaceholder={tManagerUi('enter_coupon_code')} applyLabel={tManagerUi('apply')}
                couponValidationUnavailableText={tManagerUi('coupon_validation_unavailable_no_discount_has_been_appli_0e35b5')} lateFeeLabel={tManagerUi('late_fee')}
                overrideLabel={tManagerUi('override')} remarkOptionalLabel={tManagerUi('remark_optional')} anyNotesPlaceholder={tManagerUi('any_notes')}
              />

              {/* Action Button */}
              <div className="pt-3 border-t border-border mt-4">
                <button
                  type="button" onClick={handleCollect}
                  disabled={isSubmitDisabled}
                  className="fin-btn fin-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <IndianRupee size={16} />
                  <span>
                    {isSubmitting
                      ? 'Recording Fee Collection...'
                      : `Collect ${activeCollectionOption.label} (${formatCurrency(toMinorUnits(total))}) & Print Receipt`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Receipt Preview Side Column */}
          <ManagerFinanceCollectFeeReceiptPreview
            selectedStudent={selectedStudent}
            mode={mode}
            modeLabels={modeLabels}
            amount={amount}
            total={total}
            collectedBy={collectedBy}
            feeCategory={activeCategory.name}
            collectionTypeLabel={activeCollectionOption.label}
            billingMonth={collectionType === 'monthly' || collectionType === 'locker' ? billingCycleInfo.billingMonth : undefined}
            billingPeriod={collectionType === 'monthly' || collectionType === 'locker' ? billingCycleInfo.coverageLabel : collectionType === 'dues' ? 'Outstanding Dues Clearance' : collectionType === 'fine' ? 'Late Penalty Clearance' : 'Partial Payment'}
            nextDueDate={collectionType === 'monthly' || collectionType === 'locker' ? billingCycleInfo.nextDueDateFormatted : undefined}
            balanceRemaining={remainingDuePaise}
            paymentDate={paymentDate}
            txnId={txnId}
            isSubmitting={isSubmitting}
            isCollectAvailable={true}
            receiptNumber={receiptNumber}
            lineItems={compositeEnabled ? compositeItems.filter((i) => i.enabled) : undefined}
            onCollect={handleCollect}
            onCancel={resetForm}
          />
        </div>
      </div>

      <ManagerFinanceCollectFeePostPaymentModal
        isOpen={isPostPaymentModalOpen}
        onClose={handleClosePostPaymentModal}
        receiptNumber={lastPaidReceipt?.receiptNumber || receiptNumber}
        studentName={lastPaidReceipt?.studentName || ''}
        smartId={lastPaidReceipt?.smartId || ''}
        phone={lastPaidReceipt?.phone || ''}
        totalAmount={lastPaidReceipt?.totalAmount || 0}
        paymentMode={lastPaidReceipt?.paymentMode || 'cash'}
        txnId={lastPaidReceipt?.txnId}
        billingPeriod={lastPaidReceipt?.billingPeriod}
        lineItems={lastPaidReceipt?.lineItems}
      />
    </>
  );
}
