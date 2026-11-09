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
            <label className="mgr-label mgr-label-required" htmlFor="admission-plan">{tManagerUi('subscription_plan')}</label>
            <SearchableCombobox
              id="admission-plan"
              options={comboboxPlanOptions}
              value={watchedPlan}
              onChange={(val) => setValue?.('plan', val, { shouldValidate: true, shouldDirty: true })}
              placeholder="Select Subscription Duration..."
              searchPlaceholder="Search plans..."
            />
            {errors.plan && <p className="mgr-error" role="alert">{errors.plan.message}</p>}
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
              <input id="admission-discount" {...register('manualDiscount')} type="number" min="0" step="1" className="mgr-input mgr-input-with-icon" placeholder="0" />
            </div>
            {errors.manualDiscount && <p className="mgr-error" role="alert">{errors.manualDiscount.message}</p>}
          </div>

          {/* Payment Mode */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-payment-mode">{tManagerUi('payment_mode_23b35c')}</label>
            <SearchableCombobox
              id="admission-payment-mode"
              options={MANAGER_ADMISSION_PAYMENT_MODE_OPTIONS}
              value={watchedPaymentMode}
              onChange={(val) => setValue?.('paymentMode', val, { shouldValidate: true, shouldDirty: true })}
              placeholder="Select Payment Mode..."
              searchPlaceholder="Cash or UPI..."
            />
            {errors.paymentMode && <p className="mgr-error" role="alert">{errors.paymentMode.message}</p>}
          </div>

          {/* Amount Paid Now */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-amount">{tManagerUi('amount_paid_now')}</label>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-amount" {...register('amountPaid')} type="number" min="1" step="1" className={`mgr-input mgr-input-with-icon${errors.amountPaid ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.amountPaid)} placeholder="1000" />
            </div>
            {errors.amountPaid && <p className="mgr-error" role="alert">{errors.amountPaid.message}</p>}
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
