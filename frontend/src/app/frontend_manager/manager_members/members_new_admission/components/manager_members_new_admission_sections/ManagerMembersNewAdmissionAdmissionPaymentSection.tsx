'use client';
// RESPONSIBILITY: Render the members new admission admission payment section with dynamic shift-based plan pricing.
import {
  ManagerMembersNewAdmissionPartialPromiseCard,
  ManagerMembersNewAdmissionPaymentStructureSelector,
  ManagerMembersNewAdmissionSecurityDepositCard,
} from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_sections/ManagerMembersNewAdmissionPaymentDetailsCards';
import { MANAGER_ADMISSION_PAYMENT_MODE_OPTIONS } from '@/app/frontend_manager/manager_members/members_new_admission/config/manager_members_new_admission_options';
import type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';
import { formatAdmissionInr } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionStorageAndFormat';
import { SearchableCombobox } from '@/components/ui/combobox/SearchableCombobox';
import { IndianRupee, MessageSquare, Tag } from 'lucide-react';
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
        label: `${opt.label} — ${formatAdmissionInr(opt.totalAmount)}`,
        badge: opt.savingsText || undefined,
      }));
    }
    return [
      { value: '1 Month (Monthly)', label: `1 Month (Monthly) (${formatAdmissionInr(1000)} / month)` },
      { value: '3 Months (Quarterly)', label: `3 Months (Quarterly) (${formatAdmissionInr(2700)} / 3 months)` },
      { value: '6 Months (Half-Yearly)', label: `6 Months (Half-Yearly) (${formatAdmissionInr(5000)} / 6 months)` },
      { value: '1 Year (Annual)', label: `1 Year (Annual) (${formatAdmissionInr(9500)} / year)` },
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
              <IndianRupee size={13} />
              <span>Dynamic Plan Rates calculated from Shift Base: <strong>{`${formatAdmissionInr(effectiveMonthlyRate)} / mo`}</strong></span>
            </p>
          )}
        </div>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
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
            {errors.plan && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.plan.message}</p>}
          </div>

          <div className="mgr-form-field">
            <div className="flex items-center justify-between mb-1">
              <label className="mgr-label !mb-0" htmlFor="admission-reg-fee">
                Registration Fee <span className="text-secondary font-normal text-xs">(One-Time)</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button type="button" onClick={() => setValue?.('registrationFee', '200', { shouldValidate: true, shouldDirty: true })} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">
                  {`${formatAdmissionInr(200)} Standard`}
                </button>
                <button type="button" onClick={() => setValue?.('registrationFee', '0', { shouldValidate: true, shouldDirty: true })} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">
                  {`${formatAdmissionInr(0)} Waived`}
                </button>
              </div>
            </div>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input id="admission-reg-fee" {...register('registrationFee')} type="number" min="0" step="1" onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }} className="mgr-input mgr-input-with-icon" placeholder="200" />
            </div>
          </div>

          <ManagerMembersNewAdmissionSecurityDepositCard
            register={register}
            setValue={setValue}
            watchedSecurityDeposit={watchedSecurityDeposit || ''}
            watchedLocker={watchedLocker}
          />

          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-coupon">Coupon Code <span className="text-secondary font-normal text-xs">(Optional)</span></label>
            <div className="mgr-input-icon-wrap">
              <Tag size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input maxLength={30} id="admission-coupon" {...register('couponCode')} type="text" className="mgr-input mgr-input-with-icon uppercase" placeholder="e.g. WELCOME100 / FESTIVE" />
            </div>
          </div>

          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-discount">{tManagerUi('manual_discount')} <span className="text-secondary font-normal text-xs">(Optional)</span></label>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-discount" {...register('manualDiscount')} type="number" min="0" step="1" onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }} className="mgr-input mgr-input-with-icon" placeholder="0" />
            </div>
            {errors.manualDiscount && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.manualDiscount.message}</p>}
          </div>

          <ManagerMembersNewAdmissionPaymentStructureSelector
            setValue={setValue}
            watchedPaymentType={watchedPaymentType}
            finalPayable={finalPayable}
          />

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
            {errors.paymentMode && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.paymentMode.message}</p>}
          </div>

          <div className="mgr-form-field">
            <div className="flex items-center justify-between mb-1">
              <label className="mgr-label !mb-0 mgr-label-required" htmlFor="admission-amount">
                {watchedPaymentType === 'partial' ? 'Token / Amount Paid Today' : tManagerUi('amount_paid_now')}
              </label>
              {watchedPaymentType === 'partial' && (
                <div className="flex items-center gap-1 text-[11px]">
                  <button type="button" onClick={() => setValue?.('amountPaid', '500', { shouldValidate: true, shouldDirty: true })} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">
                    {formatAdmissionInr(500)}
                  </button>
                  <button type="button" onClick={() => setValue?.('amountPaid', '1000', { shouldValidate: true, shouldDirty: true })} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">
                    {formatAdmissionInr(1000)}
                  </button>
                  <button type="button" onClick={() => setValue?.('amountPaid', String(Math.round((finalPayable || 0) / 2)), { shouldValidate: true, shouldDirty: true })} className="px-1.5 py-0.5 rounded bg-surface border border-border text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer">
                    50%
                  </button>
                </div>
              )}
            </div>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-amount" {...register('amountPaid')} type="number" min="1" step="1" inputMode="numeric" onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }} className={`mgr-input mgr-input-with-icon${errors.amountPaid ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.amountPaid)} placeholder="1000" />
            </div>
            {errors.amountPaid && <p className="mgr-error text-rose-400 text-xs mt-1" role="alert">{errors.amountPaid.message}</p>}
          </div>

          {watchedPaymentType === 'partial' && (
            <ManagerMembersNewAdmissionPartialPromiseCard
              register={register}
              setValue={setValue}
              balanceDue={balanceDue}
              currentPaid={currentPaid}
              totalDue={totalDue}
            />
          )}

          <div className="mgr-form-field mgr-form-field-full">
            <label className="mgr-label" htmlFor="admission-remarks">
              Remarks / Special Notes <span className="text-secondary font-normal text-xs">(Optional)</span>
            </label>
            <div className="mgr-input-icon-wrap">
              <MessageSquare size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input maxLength={250} id="admission-remarks" {...register('remarks')} type="text" className="mgr-input mgr-input-with-icon" placeholder="e.g. Student requested quiet corner near window, fee paid in full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
