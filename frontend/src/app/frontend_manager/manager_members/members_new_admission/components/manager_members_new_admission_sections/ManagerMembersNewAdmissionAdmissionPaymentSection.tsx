'use client';
// RESPONSIBILITY: Render the members new admission admission payment section with dynamic shift-based plan pricing.
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { IndianRupee, MessageSquare, Tag, Sparkles } from 'lucide-react';
import { SearchableCombobox } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_ADMISSION_PAYMENT_MODE_OPTIONS } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission_options';
import type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';

export type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps };

export function ManagerMembersNewAdmissionAdmissionPaymentSection({
  register,
  errors,
  setValue,
  watch,
  planOptions,
  effectiveMonthlyRate = 0,
}: ManagerMembersNewAdmissionAdmissionPaymentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  const watchedPlan = watch ? watch('plan') : '';
  const watchedPaymentMode = watch ? watch('paymentMode') : '';

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

          {/* Refundable Security Deposit */}
          <div className="mgr-form-field">
            <div className="flex items-center justify-between mb-1">
              <label className="mgr-label !mb-0" htmlFor="admission-security-deposit">
                Security Deposit <span className="text-secondary font-normal text-xs">(Refundable)</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setValue?.('securityDeposit', '500', { shouldValidate: true, shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  ₹500 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setValue?.('securityDeposit', '1000', { shouldValidate: true, shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  ₹1000 Locker+Seat
                </button>
                <button
                  type="button"
                  onClick={() => setValue?.('securityDeposit', '0', { shouldValidate: true, shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  ₹0 None
                </button>
              </div>
            </div>
            <div className="mgr-input-icon-wrap">
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
            <label className="mgr-label mgr-label-required" htmlFor="admission-amount">
              {tManagerUi('amount_paid_now')}
            </label>
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
