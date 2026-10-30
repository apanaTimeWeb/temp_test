// DATA FLOW: finance_collect_fee route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ADMIN_COLLECT_FEE_MOCK_STUDENTS, ADMIN_COLLECT_FEE_PAYMENT_COUPONS } from '@/app/frontend_admin/admin_finance/finance_collect_fee/mocks/scenarios/admin_finance_collect_fee.scenarios';
import { ADMIN_COLLECT_FEE_PAYMENT_MODES, type AdminCollectFeeMockStudent, type AdminCollectFeePaymentMode } from '@/app/frontend_admin/admin_finance/finance_collect_fee/types/AdminFinanceCollectFeeTypes';
import { createAdminCollectFeeSchema, type AdminCollectFeeFormInput, type AdminCollectFeeFormValues } from '@/app/frontend_admin/admin_finance/finance_collect_fee/schemas/AdminFinanceCollectFeeSchema';
import { adminCollectFeeMajorToMinor, adminCollectFeeMinorToMajor, adminCollectFeeMaskPhone } from '@/app/frontend_admin/admin_finance/finance_collect_fee/utils/AdminFinanceCollectFeeFormat';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { AdminFinanceCollectFeeCouponStatus } from '@/app/frontend_admin/admin_finance/finance_collect_fee/types/AdminFinanceCollectFeeTypes';


/**
 * Prevents accidental data loss for the collect-fee form on browser exit and in-app links.
 * The supplied callback opens the feature-owned confirmation dialog; navigation continues
 * only after the user confirms through that dialog.
 */
export function useUnsavedChangesGuard(
  isDirty: boolean,
  isDialogOpen: boolean,
  onNavigationAttempt: (destination: string) => void,
): void {
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const handleInternalNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || isDialogOpen) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const next = `${destination.pathname}${destination.search}${destination.hash}`;
      if (current === next) return;
      event.preventDefault();
      event.stopPropagation();
      onNavigationAttempt(next);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleInternalNavigation, true);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleInternalNavigation, true);
    };
  }, [isDirty, isDialogOpen, onNavigationAttempt]);
}

/** Owns collect-fee form state and preview-only calculations; payment mutation remains fail-closed. */
export default function useAdminCollectFeePage() {
  const t = useTranslations('ADMIN_COLLECT_FEE');
  const router = useRouter();
  const isDemoMode = isFrontendDemoModeEnabled();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search), 300); return () => window.clearTimeout(timer); }, [search]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdminCollectFeeMockStudent | null>(null);
  const [couponStatus, setCouponStatus] = useState<AdminFinanceCollectFeeCouponStatus>('idle');
  const [couponDiscountMinor, setCouponDiscountMinor] = useState(0);
  const [lateFeeOverride, setLateFeeOverride] = useState(false);
  const schema = useMemo(() => createAdminCollectFeeSchema({
    amountPositive: t('VALIDATION_AMOUNT_POSITIVE'),
    amountPrecision: t('VALIDATION_AMOUNT_PRECISION'),
    studentRequired: t('VALIDATION_STUDENT_REQUIRED'),
    transactionTooLong: t('VALIDATION_TRANSACTION_TOO_LONG'),
    transactionRequired: t('VALIDATION_TRANSACTION_REQUIRED'),
    couponTooLong: t('VALIDATION_COUPON_TOO_LONG'),
    lateFeeNegative: t('VALIDATION_LATE_FEE_NEGATIVE'),
    remarkTooLong: t('VALIDATION_REMARK_TOO_LONG'),
  }), [t]);
  const form = useForm<AdminCollectFeeFormInput, unknown, AdminCollectFeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { selectedStudentId: '', amountMajor: 0, mode: 'cash', txnId: '', couponCode: '', lateFeeMajor: 0, monthsToRenew: '1', remark: '' },
    mode: 'onBlur',
  });
  const amountMajor = form.watch('amountMajor');
  const lateFeeMajor = form.watch('lateFeeMajor');
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [pendingNavigationHref, setPendingNavigationHref] = useState<string | null>(null);

  const handleNavigationAttempt = useCallback((destination: string) => {
    setPendingNavigationHref(destination);
    setIsDiscardDialogOpen(true);
  }, []);
  useUnsavedChangesGuard(form.formState.isDirty, isDiscardDialogOpen, handleNavigationAttempt);
  const baseAmountMinor = adminCollectFeeMajorToMinor(amountMajor);
  const lateFeeMinor = adminCollectFeeMajorToMinor(lateFeeMajor);
  const eligibleMinor = baseAmountMinor + lateFeeMinor;
  const appliedDiscountMinor = Math.min(couponDiscountMinor, Math.max(0, eligibleMinor));
  const totalMinor = Number.isSafeInteger(eligibleMinor) && eligibleMinor >= 0 ? eligibleMinor - appliedDiscountMinor : Number.NaN;
  const filteredStudents = useMemo(() => isDemoMode ? ADMIN_COLLECT_FEE_MOCK_STUDENTS.filter((student) => debouncedSearch.trim().length >= 2 && (student.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase()) || student.smartId.toLowerCase().includes(debouncedSearch.trim().toLowerCase()))) : [], [isDemoMode, debouncedSearch]);
  const modeLabels: Record<AdminCollectFeePaymentMode, string> = {
    cash: t('MODE_CASH'), upi: t('MODE_UPI'), card: t('MODE_CARD'), bank: t('MODE_BANK'),
  };

  const handleApplyCoupon = () => {
    if (!isDemoMode) {
      setCouponDiscountMinor(0);
      setCouponStatus('blocked');
      toast.error(t('COUPON_VALIDATION_BLOCKED_TOAST'), { id: 'admin_finance-finance_collect_fee-hooks-useAdminFinanceCollectFeePage-toast-54-1' });
      return;
    }
    const normalized = form.getValues('couponCode').trim().toUpperCase();
    const discount = Object.hasOwn(ADMIN_COLLECT_FEE_PAYMENT_COUPONS, normalized) ? ADMIN_COLLECT_FEE_PAYMENT_COUPONS[normalized as keyof typeof ADMIN_COLLECT_FEE_PAYMENT_COUPONS] : 0;
    if (discount > 0 && Number.isSafeInteger(eligibleMinor) && eligibleMinor > 0 && discount <= eligibleMinor) {
      setCouponDiscountMinor(discount);
      setCouponStatus('valid');
      toast.success(t('COUPON_APPLIED_TOAST'), { id: 'admin_finance-finance_collect_fee-hooks-useAdminFinanceCollectFeePage-toast-62-2' });
    } else {
      setCouponDiscountMinor(0);
      setCouponStatus('invalid');
      toast.error(t('COUPON_INVALID_TOAST'), { id: 'admin_finance-finance_collect_fee-hooks-useAdminFinanceCollectFeePage-toast-66-3' });
    }
  };

  const handleCollect = form.handleSubmit(() => {
    toast.error(t('FEE_COLLECTION_BLOCKED_TOAST'), { id: 'admin_finance-finance_collect_fee-hooks-useAdminFinanceCollectFeePage-toast-71-4' });
  });

  const resetCouponPreview = () => { setCouponDiscountMinor(0); setCouponStatus('idle'); };
  const resetForm = () => { setSelectedStudent(null); setSearch(''); setShowDropdown(false); form.reset({ selectedStudentId: '', amountMajor: 0, mode: 'cash', txnId: '', couponCode: '', lateFeeMajor: 0, monthsToRenew: '1', remark: '' }); resetCouponPreview(); setLateFeeOverride(false); setPendingNavigationHref(null); setIsDiscardDialogOpen(false); };
  const requestResetForm = () => { setPendingNavigationHref(null); if (form.formState.isDirty) setIsDiscardDialogOpen(true); else resetForm(); };
  const confirmResetForm = () => { const destination = pendingNavigationHref; resetForm(); if (destination) router.push(destination); };
  const cancelDiscard = () => { setPendingNavigationHref(null); setIsDiscardDialogOpen(false); };
  const updateSearch = (value: string) => { setSearch(value); setShowDropdown(true); if (selectedStudent && value !== selectedStudent.name) { setSelectedStudent(null); form.setValue('selectedStudentId', '', { shouldDirty: true, shouldValidate: true }); form.setValue('amountMajor', 0, { shouldValidate: true }); form.setValue('lateFeeMajor', 0, { shouldValidate: true }); resetCouponPreview(); } };
  const selectStudent = (student: AdminCollectFeeMockStudent) => { setSelectedStudent(student); setSearch(student.name); setShowDropdown(false); resetCouponPreview(); form.setValue('selectedStudentId', student.id, { shouldValidate: true, shouldDirty: true }); form.setValue('amountMajor', student.dueAmountMinor > 0 ? adminCollectFeeMinorToMajor(student.dueAmountMinor) : 0, { shouldValidate: true, shouldDirty: true }); form.setValue('lateFeeMajor', student.dueAmountMinor > 0 ? 50 : 0, { shouldValidate: true, shouldDirty: true }); };
  const updateCouponCode = (value: string) => { form.setValue('couponCode', value, { shouldDirty: true, shouldValidate: true }); resetCouponPreview(); };
  const updateAmountMajor = (value: number) => { form.setValue('amountMajor', value, { shouldDirty: true, shouldValidate: true }); resetCouponPreview(); };
  const updateLateFeeMajor = (value: number) => { form.setValue('lateFeeMajor', value, { shouldDirty: true, shouldValidate: true }); resetCouponPreview(); };


  return { isDemoMode, pendingNavigationHref, MOCK_STUDENTS: isDemoMode ? ADMIN_COLLECT_FEE_MOCK_STUDENTS : [], MODES: ADMIN_COLLECT_FEE_PAYMENT_MODES, MODE_LABELS: modeLabels, maskPhone: adminCollectFeeMaskPhone, search, setSearch: updateSearch, showDropdown, setShowDropdown, selectedStudent, setSelectedStudent, selectStudent, couponDiscount: couponDiscountMinor, couponStatus, filteredStudents, lateFeeMinor, totalMinor, updateCouponCode, updateAmountMajor, updateLateFeeMajor, lateFeeOverride, setLateFeeOverride, form, resetForm, requestResetForm, confirmResetForm, cancelDiscard, isDiscardDialogOpen, handleApplyCoupon, handleCollect } as const;
}
