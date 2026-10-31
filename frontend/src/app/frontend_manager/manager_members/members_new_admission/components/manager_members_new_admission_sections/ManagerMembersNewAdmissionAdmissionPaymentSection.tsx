'use client';
// RESPONSIBILITY: Render the members new admission admission payment section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { CreditCard, FileText, IndianRupee, MessageSquare, Tag } from 'lucide-react';
import type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';

export type { ManagerMembersNewAdmissionAdmissionPaymentSectionProps };

export function ManagerMembersNewAdmissionAdmissionPaymentSection({ register, errors }: ManagerMembersNewAdmissionAdmissionPaymentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_new_admission.ui');
  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-payment">
      <div className="mgr-card-header">
        <div className="mgr-section-number">04</div>
        <h2 id="manager-students-admission-payment" className="mgr-section-title">{tManagerUi('fee_payment')}</h2>
      </div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          {/* Subscription Plan */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-plan">{tManagerUi('subscription_plan')}</label>
            <div className="mgr-input-icon-wrap">
              <FileText size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-plan" {...register('plan')} className={`mgr-select mgr-input-with-icon${errors.plan ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.plan)}>
                <option value="">-- Select Subscription Plan --</option>
                <option value="Basic Monthly">Basic Monthly (₹1,000 / month)</option>
                <option value="Pro Monthly">Pro Monthly (₹1,500 / month)</option>
                <option value="Quarterly Standard">Quarterly Standard (₹2,700 / 3 months)</option>
                <option value="Half-Yearly Saver">Half-Yearly Saver (₹5,000 / 6 months)</option>
                <option value="Annual Elite">Annual Elite (₹9,500 / year)</option>
              </select>
            </div>
            {errors.plan && <p className="mgr-error" role="alert">{errors.plan.message}</p>}
          </div>

          {/* Coupon Code */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-coupon">Coupon Code</label>
            <div className="mgr-input-icon-wrap">
              <Tag size={18} strokeWidth={2} className="mgr-input-icon text-secondary" />
              <input id="admission-coupon" {...register('couponCode')} type="text" className="mgr-input mgr-input-with-icon uppercase" placeholder="e.g. WELCOME100 / FESTIVE" />
            </div>
          </div>

          {/* Manual Discount */}
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-discount">{tManagerUi('manual_discount')}</label>
            <div className="mgr-input-icon-wrap">
              <IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" />
              <input id="admission-discount" {...register('manualDiscount')} type="number" min="0" step="1" className="mgr-input mgr-input-with-icon" placeholder="0" />
            </div>
            {errors.manualDiscount && <p className="mgr-error" role="alert">{errors.manualDiscount.message}</p>}
          </div>

          {/* Payment Mode */}
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-payment-mode">{tManagerUi('payment_mode_23b35c')}</label>
            <div className="mgr-input-icon-wrap">
              <CreditCard size={18} strokeWidth={2} className="mgr-input-icon" />
              <select id="admission-payment-mode" {...register('paymentMode')} className={`mgr-select mgr-input-with-icon${errors.paymentMode ? ' mgr-input-error' : ''}`}>
                <option value="UPI">UPI (Google Pay / PhonePe / Paytm / QR)</option>
                <option value="Cash">Cash at Reception</option>
                <option value="Card">Debit / Credit Card (POS Machine)</option>
                <option value="Net Banking">Net Banking / Direct Bank Transfer</option>
              </select>
            </div>
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
            <label className="mgr-label" htmlFor="admission-remarks">Remarks / Special Notes</label>
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
