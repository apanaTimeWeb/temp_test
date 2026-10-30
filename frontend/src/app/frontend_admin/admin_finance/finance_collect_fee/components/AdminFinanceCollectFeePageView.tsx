// RESPONSIBILITY: AdminCollectFeePageView component owned by admin_collect_fee; responsibility folder: components.
'use client';
import { useEffect, useRef } from 'react';
import { adminCollectFeeMajorToMinor, formatAdminCollectFeeCurrency, formatDate, getAdminCollectFeeLocalDateString } from '@/app/frontend_admin/admin_finance/finance_collect_fee/utils/AdminFinanceCollectFeeFormat';
import { Search, CheckCircle, IndianRupee, BookOpen, X } from 'lucide-react';
import type useCollectFee from '@/app/frontend_admin/admin_finance/finance_collect_fee/hooks/useAdminFinanceCollectFeePage';
import { useTranslations } from 'next-intl';
import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import { displayValue } from '@/lib/display_value';
import type { AdminCollectFeePageViewProps } from '@/app/frontend_admin/admin_finance/finance_collect_fee/types/AdminFinanceCollectFeeTypes';


export default function AdminCollectFeePageView({ model }: AdminCollectFeePageViewProps) {
  const t = useTranslations('ADMIN_COLLECT_FEE');
  const { isDemoMode, pendingNavigationHref, MODES, MODE_LABELS, maskPhone, search, setSearch, showDropdown, setShowDropdown, selectedStudent, selectStudent, updateCouponCode, updateAmountMajor, updateLateFeeMajor, couponDiscount, couponStatus, filteredStudents, totalMinor, lateFeeMinor, lateFeeOverride, setLateFeeOverride, form, requestResetForm, confirmResetForm, cancelDiscard, isDiscardDialogOpen, handleApplyCoupon, handleCollect } = model;
  const { register, setValue, watch, formState: { errors } } = form;
  const dialogRef = useRef<HTMLElement | null>(null);
  const keepEditingRef = useRef<HTMLButtonElement | null>(null);
  const discardChangesRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isDiscardDialogOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    keepEditingRef.current?.focus();
    return () => { previousFocusRef.current?.focus(); previousFocusRef.current = null; };
  }, [isDiscardDialogOpen]);
  const selectedMode = watch('mode');
  const amountMajor = watch('amountMajor');
  const lateFeeLocked = !lateFeeOverride;
  const phoneLabel = displayValue(selectedStudent ? `+91-${maskPhone(selectedStudent.phone)}` : null);
  const formattedAmountMajor = Number.isFinite(Number(amountMajor)) && Number(amountMajor) >= 0 ? formatAdminCollectFeeCurrency(adminCollectFeeMajorToMinor(Number(amountMajor))) : '—';
  return (
    <>
      <div className="space-y-6">
        <p id="admin-finance-collect-fee-unavailable" data-testid="admin_collect_fee-AdminCollectFeePageView-state-collection-unavailable" role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">
          {isDemoMode
            ? t('BANNER_DEMO')
            : t('BANNER_LIVE')}
        </p>
        <div>
<h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
<p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
</div>
        <form onSubmit={handleCollect} className="grid grid-cols-1 lg:grid-cols-5 gap-6" noValidate>
          <div className="lg:col-span-3 space-y-4">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6 space-y-3">
<p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary text-danger-text">{t('STUDENT')} <span aria-hidden="true">*</span>
</p>
<div className="relative">
<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2}/>
<input type="hidden" {...register('selectedStudentId')} />
<input className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pl-9" aria-label={t('SEARCH_STUDENT_ARIA')} placeholder={t('SEARCH_STUDENT_PLACEHOLDER')} value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setShowDropdown(true)} aria-invalid={Boolean(errors.selectedStudentId)} aria-describedby={errors.selectedStudentId ? 'finance-student-error' : undefined} />
</div>
              {showDropdown&&search.length>=2&&!selectedStudent&&<div className="absolute left-0 right-0 top-full z-20 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-card shadow-popover">{filteredStudents.length===0?<div className="p-6 text-center text-body text-text-secondary">{t('NO_STUDENTS_FOUND')}</div>:filteredStudents.map(student=>
<button type="button" key={student.id} className="flex min-h-11 w-full items-center justify-between gap-3 border-b border-border px-3 py-2 text-left text-body text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={()=>selectStudent(student)}>
<div>
<div className="font-medium">{student.name}</div>
<div className="text-caption text-text-secondary">{student.smartId} · {student.plan} · {t('VALID_TILL', { date: student.validUpto })}</div>
</div>
<span className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${student.status==='active'?'bg-success-bg text-success-text border-success-bg':student.status==='suspended'?'bg-danger-bg text-danger-text border-danger-bg':'bg-warning-bg text-warning-text border-warning-bg'}`}>{student.status === 'active' ? t('STATUS_ACTIVE') : student.status === 'expired' ? t('STATUS_EXPIRED') : t('STATUS_SUSPENDED')}</span>
</button>)}</div>}
              {errors.selectedStudentId&&<p id="finance-student-error" className="mt-1 text-caption text-text-secondary text-danger-text" role="alert">{errors.selectedStudentId.message}</p>}
              {selectedStudent&&<div className="flex items-center gap-2 rounded-md border border-success-bg bg-success-bg p-3 text-body text-success-text">
<CheckCircle size={18} strokeWidth={2}/>
 <span className="text-body font-semibold text-text-primary">{displayValue(selectedStudent.name)}</span>
 <span className="text-caption text-text-secondary">({displayValue(selectedStudent.smartId)})</span>
<span className="text-caption text-text-secondary">· {phoneLabel}</span>
</div>}
              {selectedStudent&&selectedStudent.dueAmountMinor>0&&<div className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg w-full justify-center py-2">{t('DUE_AMOUNT', { amount: formatAdminCollectFeeCurrency(selectedStudent.dueAmountMinor) })}</div>}
            </div>
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6 space-y-4">
<p className="text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary">{t('PAYMENT_DETAILS')}</p>
              <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="finance-cycle">{t('MONTHS_PAYING_FOR')}</label>
<select id="finance-cycle" className="mt-1 min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...register('monthsToRenew')}>
<option value="1">{t('MONTH_ONE')}</option>
<option value="3">{t('MONTH_QUARTERLY')}</option>
<option value="6">{t('MONTH_HALF_YEARLY')}</option>
<option value="12">{t('MONTH_ANNUAL')}</option>
</select>
</div>
              <div>
<label className="mb-1.5 block text-body font-medium text-text-primary text-danger-text" htmlFor="finance-amount">{t('AMOUNT')} <span aria-hidden="true">*</span>
</label>
<div className="relative mt-1">
<IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" strokeWidth={2}/>
<input id="finance-amount" type="number" min="0" step="0.01" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary pl-8" placeholder="0.00" {...register('amountMajor')} onChange={e => updateAmountMajor(e.target.value === '' ? Number.NaN : Number(e.target.value))} aria-invalid={Boolean(errors.amountMajor)} aria-describedby={errors.amountMajor ? 'finance-amount-error' : undefined}/>
</div>{errors.amountMajor&&<p id="finance-amount-error" className="mt-1 text-caption text-text-secondary text-danger-text" role="alert">{errors.amountMajor.message}</p>}</div>
              <div>
<span className="mb-1.5 block text-body font-medium text-text-primary">{t('PAYMENT_MODE')}</span>
<div className="flex gap-2 mt-1 flex-wrap">{MODES.map(paymentMode=>
<button type="button" key={paymentMode} onClick={()=>setValue('mode',paymentMode,{shouldDirty:true,shouldValidate:true})} aria-pressed={selectedMode===paymentMode} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-3 py-2 text-body font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer ${selectedMode===paymentMode?'border-primary bg-primary-subtle text-primary':'border-border bg-card text-text-secondary hover:bg-surface-hover'}`}>{MODE_LABELS[paymentMode]}</button>)}</div>
</div>
              {selectedMode!=='cash'&&<div>
<label className="mb-1.5 block text-body font-medium text-text-primary text-danger-text" htmlFor="finance-txn">{t('TRANSACTION_ID')} <span aria-hidden="true">*</span>
</label>
<input id="finance-txn" className="mt-1 min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder={t('TRANSACTION_PLACEHOLDER')} {...register('txnId')} aria-invalid={Boolean(errors.txnId)} aria-describedby={errors.txnId ? 'finance-txn-error' : undefined}/>{errors.txnId&&<p id="finance-txn-error" className="mt-1 text-caption text-text-secondary text-danger-text" role="alert">{errors.txnId.message}</p>}</div>}
              <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="finance-coupon">{t('COUPON_CODE')}</label>
<div className="flex gap-2 mt-1">
<input id="finance-coupon" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-1" placeholder={t('COUPON_PLACEHOLDER')} {...register('couponCode')} onChange={e=>updateCouponCode(e.target.value)} aria-invalid={Boolean(errors.couponCode)} aria-describedby={errors.couponCode ? 'finance-coupon-error' : undefined}/>
<button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!isDemoMode} title={!isDemoMode ? t('COUPON_VALIDATION_BLOCKED_TOAST') : undefined} onClick={handleApplyCoupon}>{t('APPLY')}</button>
</div>{errors.couponCode&&<p id="finance-coupon-error" className="mt-1 text-caption text-text-secondary text-danger-text" role="alert">{errors.couponCode.message}</p>}{couponStatus==='valid'&&<p className="mt-1 text-caption text-text-secondary text-success-text">{t('DISCOUNT_APPLIED', { amount: formatAdminCollectFeeCurrency(couponDiscount) })}</p>}{couponStatus==='invalid'&&<p className="mt-1 text-caption text-text-secondary text-danger-text">{t('INVALID_EXPIRED_CODE')}</p>}{couponStatus==='blocked'&&<p role="status" className="mt-1 text-caption text-text-secondary text-warning-text">{t('COUPON_BLOCKED')}</p>}</div>
              <div>
<div className="flex items-center justify-between">
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="finance-late-fee">{t('LATE_FEE')}</label>
<label className="flex items-center gap-2 text-badge text-text-secondary">
<input type="checkbox" checked={!lateFeeLocked} onChange={e=>setLateFeeOverride(e.target.checked)}/> {t('OVERRIDE')}</label>
</div>
<input id="finance-late-fee" type="number" min="0" step="0.01" className="mt-1 min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" {...register('lateFeeMajor')} onChange={e => updateLateFeeMajor(e.target.value === '' ? Number.NaN : Number(e.target.value))} readOnly={lateFeeLocked} aria-invalid={Boolean(errors.lateFeeMajor)} aria-describedby={errors.lateFeeMajor ? 'finance-late-fee-error' : undefined} />
{errors.lateFeeMajor&&<p id="finance-late-fee-error" className="mt-1 text-caption text-text-secondary text-danger-text" role="alert">{errors.lateFeeMajor.message}</p>}
</div>
              <div>
<label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="finance-remark">{t('REMARK_OPTIONAL')}</label>
<textarea id="finance-remark" className="min-h-24 w-full min-w-0 resize-y rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mt-1" rows={2} placeholder={t('REMARK_PLACEHOLDER')} {...register('remark')} aria-invalid={Boolean(errors.remark)} aria-describedby={errors.remark ? 'finance-remark-error' : undefined} />
{errors.remark&&<p id="finance-remark-error" className="mt-1 text-caption text-text-secondary text-danger-text" role="alert">{errors.remark.message}</p>}
</div>
              <button type="submit" aria-describedby="admin-finance-collect-fee-unavailable" title={t('COLLECT_FEE_DISABLED_TITLE')} className="min-h-11 w-full rounded-md bg-success text-on-success motion-safe:transition-colors motion-safe:duration-base disabled:bg-input disabled:text-text-secondary" disabled>{t('COLLECT_FEE_UNAVAILABLE')}</button>
            </div>
          </div>
          <div className="lg:col-span-2">
<div className="lg:sticky lg:top-[88px]">
<div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-border bg-card shadow-dialog">
<div className="flex h-4 justify-center gap-1 overflow-hidden bg-card" aria-hidden="true">{Array.from({length:20},(_,i)=>
<div key={`skeleton-${i + 1}`} className="-mt-1 h-3 w-3 rounded-full bg-surface-zebra" />)}</div>
<div className="p-8 text-center">
<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-floating text-primary">
<BookOpen size={18} strokeWidth={2}/>
</div>
<p className="mt-3 text-badge font-semibold uppercase tracking-wide text-text-primary">{ADMIN_BRAND_CONFIG.displayName}</p>
<p className="mt-1 text-xl font-bold text-text-primary">{t('RECEIPT_PREVIEW')}</p>
<div className="mb-8 rounded-xl bg-surface-zebra px-4 py-3 mt-6">
<p className="text-micro uppercase tracking-widest text-text-secondary">{t('RECEIPT_NUMBER')}</p>
<p className="mt-0.5 font-mono text-ui tracking-wider text-text-primary">{t('PREVIEW_ONLY')}</p>
</div>
<div className="space-y-3 text-left mb-6">
<div className="flex justify-between">
<span className="text-badge uppercase text-text-secondary">{t('DATE')}</span>
<span className="text-body font-bold text-text-primary">{formatDate(getAdminCollectFeeLocalDateString())}</span>
</div>
<div className="flex justify-between">
<span className="text-badge uppercase text-text-secondary">{t('STUDENT')}</span>
 <span className="text-body font-bold text-text-primary">{displayValue(selectedStudent?.name)}</span>
</div>
<div className="flex justify-between">
<span className="text-badge uppercase text-text-secondary">{t('SMART_ID')}</span>
 <span className="text-body font-bold text-text-primary">{displayValue(selectedStudent?.smartId)}</span>
</div>
<div className="flex justify-between">
<span className="text-badge uppercase text-text-secondary">{t('PHONE')}</span>
<span className="text-body font-bold text-text-primary">{phoneLabel}</span>
</div>
<div className="flex justify-between">
<span className="text-badge uppercase text-text-secondary">{t('MODE')}</span>
<span className="text-body font-bold text-text-primary">{MODE_LABELS[selectedMode]}</span>
</div>
</div>
<div className="mb-8 border-t-2 border-dashed border-border pt-6">
<p className="text-badge font-bold uppercase tracking-[0.08em] text-text-secondary">{t('TOTAL_AMOUNT')}</p>
<p className="text-[40px] font-black tracking-tight text-text-primary">{formatAdminCollectFeeCurrency(totalMinor)}</p>
</div>
<p className="mt-1 text-caption text-text-secondary">{t('LATE_FEE_VALUE', { amount: formatAdminCollectFeeCurrency(lateFeeMinor), entered: formattedAmountMajor })}</p>
</div>
<div className="flex h-4 justify-center gap-1 overflow-hidden bg-card" aria-hidden="true">{Array.from({length:20},(_,i)=>
<div key={`skeleton-${i + 1}`} className="mt-1 h-3 w-3 rounded-full bg-surface-zebra" />)}</div>
</div>
<div className="space-y-3 mt-4">
<button type="button" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-floating px-4 py-3 text-body font-semibold text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={requestResetForm}>
<X size={18} strokeWidth={2}/> {t('CANCEL')}</button>
</div>
</div>
</div>
        </form>
      </div>
      {isDiscardDialogOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-backdrop p-4">
        <section ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="collect-fee-reset-title" aria-describedby="collect-fee-reset-description" className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-dialog" onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); cancelDiscard(); return; }
          if (event.key !== 'Tab') return;
          if (event.shiftKey && document.activeElement === keepEditingRef.current) { event.preventDefault(); discardChangesRef.current?.focus(); }
          else if (!event.shiftKey && document.activeElement === discardChangesRef.current) { event.preventDefault(); keepEditingRef.current?.focus(); }
        }}>
          <h2 id="collect-fee-reset-title" className="text-section-title font-semibold text-text-primary">{pendingNavigationHref ? t('NAVIGATION_CONFIRM_TITLE') : t('RESET_CONFIRM_TITLE')}</h2>
          <p id="collect-fee-reset-description" className="mt-2 text-text-secondary">{pendingNavigationHref ? t('NAVIGATION_CONFIRM_DESCRIPTION') : t('RESET_CONFIRM_DESCRIPTION')}</p>
          <div className="mt-5 flex justify-end gap-3">
            <button ref={keepEditingRef} type="button" className="min-h-11 rounded-md border border-border px-4 text-primary" onClick={cancelDiscard}>{t('KEEP_EDITING')}</button>
            <button ref={discardChangesRef} type="button" className="min-h-11 rounded-md bg-danger px-4 text-on-danger" onClick={confirmResetForm}>{t('DISCARD_CHANGES')}</button>
          </div>
        </section>
      </div>}
    </>
  );
}


export type { AdminCollectFeePageViewProps };
