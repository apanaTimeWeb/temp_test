'use client';
// RESPONSIBILITY: Render the members new admission admission payment section with dynamic shift-based plan pricing.
import { MANAGER_ADMISSION_PAYMENT_MODE_OPTIONS } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission_options';
import type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
import { SearchableCombobox } from '@/components/ui/combobox/SearchableCombobox';
import { AlertCircle,Calendar,IndianRupee,Info,MessageSquare,ShieldCheck,Sparkles,Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps };

export function ManagerMembersNewAdmissionAdmissionPaymentSection({
  register,
  errors,
  setValue,
  watch,
  planOptions,
  effectiveMonthlyRate = 0,
  finalPayable = 0,
  watchedLocker,
}: ManagerMembersNewAdmissionAdmissionPaymentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const watchedPlan = watch ? watch('plan') : '';
  const watchedPaymentMode = watch ? watch('paymentMode') : '';
  const watchedPaymentType = (watch ? watch('paymentType') : 'full') || 'full';
  const watchedAmountPaid = watch ? watch('amountPaid') : '';
  const watchedSecurityDeposit = watch ? watch('securityDeposit') : '';

  const totalDue = finalPayable || 0;
  const currentPaid = Number(watchedAmountPaid) || 0;
  const balanceDue = Math.max(0, totalDue - currentPaid);

  const comboboxPlanOptions = useMemo(() => {
    if (planOptions && planOptions.length > 0) {
      return planOptions.map((opt) => ({
        value: opt.label,
        label: `${opt.label} — ₹${opt.totalAmount.toLocaleString('en-IN')}`,
        badge: opt.savingsText || undefined,
      }));
    }
    return [
      { value: '1 Month (Monthly)', label: '1 Month (Monthly) (₹1,000 / month)' },
      { value: '3 Months (Quarterly)', label: '3 Months (Quarterly) (₹2,700 / 3 months)' },
      { value: '6 Months (Half-Yearly)', label: '6 Months (Half-Yearly) (₹5,000 / 6 months)' },
      { value: '1 Year (Annual)', label: '1 Year (Annual) (₹9,500 / year)' },
    ];
  }, [planOptions]);

  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-payment">
      <div className="mgr-card-header">
        <div className="mgr-section-number">04</div>
        <div>
          <h2 id="manager-students-admission-payment" className="mgr-section-title">{tManagerUi('fee_payment')}</h2>
          {effectiveMonthlyRate > 0 && (
            <p className="text-xs text-primary font-medium flex items-center gap-1 mt-0.5">
              <Sparkles size={13} />
              <span>Dynamic Plan Rates calculated from Shift Base: <strong>₹{effectiveMonthlyRate} / mo</strong></span>
            </p>
          )}
        </div>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          {/* Subscription Plan */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-plan">
              {tManagerUi('subscription_plan')}
            </label>
            <SearchableCombobox
              id="admission-plan"
              options={comboboxPlanOptions}
              value={watchedPlan}
              onChange={(val) => setValue?.('plan', val, { shouldValidate: true, shouldDirty: true })}
              placeholder="Select Subscription Duration..."
              searchPlaceholder="Search plans..."
            />
            {errors.plan && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.plan.message}</p>}
          </div>

          {/* One-Time Registration Fee */}
          <div className="mgr-form-field">
            <div className="flex items-center justify-between mb-1">
              <label className="mgr-label !mb-0" htmlFor="admission-reg-fee">
                Registration Fee <span className="text-secondary font-normal text-xs">(One-Time)</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setValue?.('registrationFee', '200', { shouldValidate: true, shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  ₹200 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setValue?.('registrationFee', '0', { shouldValidate: true, shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  ₹0 Waived
                </button>
              </div>
            </div>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input
                id="admission-reg-fee"
                {...register('registrationFee')}
                type="number"
                min="0"
                step="1"
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                }}
                className="mgr-input mgr-input-with-icon"
                placeholder="200"
              />
            </div>
          </div>

          {/* Dedicated Refundable Security Deposit Box */}
          <div className="mgr-form-field mgr-form-field-full p-4 rounded-xl border border-indigo-500/25 bg-surface/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <label className="mgr-label !mb-0 font-bold text-primary" htmlFor="admission-security-deposit">
                      Refundable Security Deposit
                    </label>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      100% Refundable on Exit
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-0.5">
                    Refundable deposit held securely in student account; returned upon membership exit and no-dues clearance.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setValue?.('securityDeposit', '0', { shouldValidate: true, shouldDirty: true })}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    !watchedSecurityDeposit || watchedSecurityDeposit === '0'
                      ? 'bg-secondary-bg border-primary text-primary font-bold'
                      : 'bg-surface border-border text-secondary hover:text-primary'
                  }`}
                >
                  ₹0 None
                </button>
                <button
                  type="button"
                  onClick={() => setValue?.('securityDeposit', '500', { shouldValidate: true, shouldDirty: true })}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    watchedSecurityDeposit === '500'
                      ? 'bg-secondary-bg border-primary text-primary font-bold'
                      : 'bg-surface border-border text-secondary hover:text-primary'
                  }`}
                >
                  ₹500 Standard Desk
                </button>
                <button
                  type="button"
                  onClick={() => setValue?.('securityDeposit', '1000', { shouldValidate: true, shouldDirty: true })}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    watchedSecurityDeposit === '1000'
                      ? 'bg-secondary-bg border-primary text-primary font-bold'
                      : 'bg-surface border-border text-secondary hover:text-primary'
                  }`}
                >
                  ₹1,000 Desk + Locker
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="mgr-input-icon-wrap flex-1">
                <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
                <input
                  id="admission-security-deposit"
                  {...register('securityDeposit')}
                  type="number"
                  min="0"
                  step="1"
                  onKeyDown={(e) => {
                    if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                  }}
                  className="mgr-input mgr-input-with-icon"
                  placeholder="500"
                />
              </div>
              {watchedLocker && (
                <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0">
                  <Info size={14} />
                  <span>Personal locker allotted — ₹500 or ₹1,000 security deposit recommended.</span>
                </div>
              )}
            </div>
          </div>

          {/* Coupon Code */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-coupon">
              Coupon Code <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <Tag size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input id="admission-coupon" {...register('couponCode')} type="text" className="mgr-input mgr-input-with-icon uppercase" placeholder="e.g. WELCOME100 / FESTIVE" />
            </div>
          </div>

          {/* Manual Discount */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-discount">
              {tManagerUi('manual_discount')} <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" />
              <input
                id="admission-discount"
                {...register('manualDiscount')}
                type="number"
                min="0"
                step="1"
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                }}
                className="mgr-input mgr-input-with-icon"
                placeholder="0"
              />
            </div>
            {errors.manualDiscount && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.manualDiscount.message}</p>}
          </div>

          {/* Payment Structure Selection: Full vs Partial (Token Money) */}
          <div className="mgr-form-field mgr-form-field-full space-y-2">
            <label className="mgr-label font-bold text-primary">Payment Structure</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue?.('paymentType', 'full', { shouldValidate: true, shouldDirty: true });
                  if (finalPayable > 0) {
                    setValue?.('amountPaid', String(finalPayable), { shouldValidate: true, shouldDirty: true });
                  }
                  setValue?.('promiseDueDate', '', { shouldDirty: true });
                  setValue?.('promiseRemarks', '', { shouldDirty: true });
                }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  watchedPaymentType !== 'partial'
                    ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'border-border bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  watchedPaymentType !== 'partial' ? 'border-emerald-500 bg-emerald-500' : 'border-border'
                }`}>
                  {watchedPaymentType !== 'partial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Full Payment (Pay in Full)</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Pay entire total fee of ₹{(finalPayable || 0).toLocaleString('en-IN')} today. No pending dues.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue?.('paymentType', 'partial', { shouldValidate: true, shouldDirty: true });
                  const half = Math.round((finalPayable || 1000) / 2);
                  const defaultPaid = (finalPayable || 1000) > 1000 ? '500' : String(half);
                  setValue?.('amountPaid', defaultPaid, { shouldValidate: true, shouldDirty: true });
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setValue?.('promiseDueDate', nextWeek.toISOString().slice(0, 10), { shouldDirty: true });
                  setValue?.('promiseRemarks', 'Balance token payment commitment recorded at admission.', { shouldDirty: true });
                }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  watchedPaymentType === 'partial'
                    ? 'border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-border bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  watchedPaymentType === 'partial' ? 'border-amber-500 bg-amber-500' : 'border-border'
                }`}>
                  {watchedPaymentType === 'partial' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-foreground">Partial Payment (Token Advance)</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">
                      Auto Promise
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Pay a token / partial amount today and auto-schedule a verified Payment Promise for the balance.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-payment-mode">
              {tManagerUi('payment_mode_23b35c')}
            </label>
            <SearchableCombobox
              id="admission-payment-mode"
              options={MANAGER_ADMISSION_PAYMENT_MODE_OPTIONS}
              value={watchedPaymentMode}
              onChange={(val) => setValue?.('paymentMode', val, { shouldValidate: true, shouldDirty: true })}
              placeholder="Select Payment Mode..."
              searchPlaceholder="Cash or UPI..."
            />
            {errors.paymentMode && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.paymentMode.message}</p>}
          </div>

          {/* Amount Paid Now */}
          <div className="mgr-form-field">
            <div className="flex items-center justify-between mb-1">
              <label className="mgr-label !mb-0 mgr-label-required" htmlFor="admission-amount">
                {watchedPaymentType === 'partial' ? 'Token / Amount Paid Today' : tManagerUi('amount_paid_now')}
              </label>
              {watchedPaymentType === 'partial' && (
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setValue?.('amountPaid', '500', { shouldValidate: true, shouldDirty: true })}
                    className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    ₹500
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue?.('amountPaid', '1000', { shouldValidate: true, shouldDirty: true })}
                    className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const half = Math.round((finalPayable || 0) / 2);
                      setValue?.('amountPaid', String(half), { shouldValidate: true, shouldDirty: true });
                    }}
                    className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    50%
                  </button>
                </div>
              )}
            </div>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" />
              <input
                id="admission-amount"
                {...register('amountPaid')}
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault();
                }}
                className={`mgr-input mgr-input-with-icon${errors.amountPaid ? ' mgr-input-error' : ''}`}
                aria-invalid={Boolean(errors.amountPaid)}
                placeholder="1000"
              />
            </div>
            {errors.amountPaid && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.amountPaid.message}</p>}
          </div>

          {/* Partial Payment Balance & Auto Payment Promise Card */}
          {watchedPaymentType === 'partial' && (
            <div className="mgr-form-field mgr-form-field-full p-4 rounded-xl border border-amber-500/35 bg-amber-500/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-200">
                      Balance Due: ₹{balanceDue.toLocaleString('en-IN')} (Token Advance Received)
                    </h4>
                    <p className="text-[11px] text-amber-300/80">
                      Paid ₹{currentPaid.toLocaleString('en-IN')} out of ₹{totalDue.toLocaleString('en-IN')}. Remaining balance will be registered as an auto-tracked Payment Promise.
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DUE: ₹{balanceDue.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Promise Due Date */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="mgr-label !mb-0 text-amber-200" htmlFor="admission-promise-date">
                      Promise Due Date *
                    </label>
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setValue?.('promiseDueDate', d.toISOString().slice(0, 10), { shouldDirty: true });
                        }}
                        className="px-1.5 py-0.5 rounded bg-surface/80 border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        +7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 14);
                          setValue?.('promiseDueDate', d.toISOString().slice(0, 10), { shouldDirty: true });
                        }}
                        className="px-1.5 py-0.5 rounded bg-surface/80 border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        +14 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                          setValue?.('promiseDueDate', lastDay.toISOString().slice(0, 10), { shouldDirty: true });
                        }}
                        className="px-1.5 py-0.5 rounded bg-surface/80 border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        Month End
                      </button>
                    </div>
                  </div>
                  <div className="mgr-input-icon-wrap">
                    <Calendar size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
                    <input
                      id="admission-promise-date"
                      {...register('promiseDueDate')}
                      type="date"
                      className="mgr-input mgr-input-with-icon"
                    />
                  </div>
                </div>

                {/* Promise Remarks */}
                <div>
                  <label className="mgr-label text-amber-200" htmlFor="admission-promise-remarks">
                    Promise Remarks / Notes
                  </label>
                  <div className="mgr-input-icon-wrap">
                    <MessageSquare size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
                    <input
                      id="admission-promise-remarks"
                      {...register('promiseRemarks')}
                      type="text"
                      className="mgr-input mgr-input-with-icon"
                      placeholder="e.g. Student promised to pay remaining balance next week"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-300/90 pt-1">
                <Sparkles size={14} className="text-amber-400 shrink-0" />
                <span>
                  <strong>Auto-Creates Payment Promise:</strong> Saving admission will automatically record this ₹{balanceDue.toLocaleString('en-IN')} promise into Finance › Payment Promises with automatic due date alerts.
                </span>
              </div>
            </div>
          )}

          {/* Remarks */}
          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label" htmlFor="admission-remarks">
              Remarks / Special Notes <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <MessageSquare size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input id="admission-remarks" {...register('remarks')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Student requested quiet corner near window, fee paid in full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
