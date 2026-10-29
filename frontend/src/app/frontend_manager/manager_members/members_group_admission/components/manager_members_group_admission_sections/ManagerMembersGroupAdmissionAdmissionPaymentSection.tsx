'use client';
// RESPONSIBILITY: Render the members group admission admission payment section section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members group admission admission payment section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';


import { FileText, IndianRupee } from 'lucide-react';
import type { ManagerMembersGroupAdmissionAdmissionPaymentSectionProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';
export type { ManagerMembersGroupAdmissionAdmissionPaymentSectionProps };





export function ManagerMembersGroupAdmissionAdmissionPaymentSection({ register, errors }: ManagerMembersGroupAdmissionAdmissionPaymentSectionProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');
  return (
    <section className="mgr-card" aria-labelledby="manager-students-admission-payment">
      <div className="mgr-card-header"><div className="mgr-section-number">03</div><h2 id="manager-students-admission-payment" className="mgr-section-title">{tManagerUi('fee_payment')}</h2></div>
      <div className="mgr-card-body">
        <div className="mgr-form-grid">
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-plan">{tManagerUi('subscription_plan')}</label>
            <div className="mgr-input-icon-wrap"><FileText size={18} strokeWidth={2} className="mgr-input-icon" /><select id="admission-plan" {...register('plan')} disabled className="mgr-select mgr-input-with-icon"><option value="">{tManagerUi('admission_unavailable')}</option></select></div>
          </div>
          <div className="mgr-form-field">
            <label className="mgr-label" htmlFor="admission-discount">{tManagerUi('manual_discount')}</label>
            <div className="mgr-input-icon-wrap"><IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" /><input id="admission-discount" {...register('manualDiscount')} disabled type="number" min="0" step="1" className="mgr-input mgr-input-with-icon" /></div>
            {errors.manualDiscount && <p className="mgr-error" role="alert">{errors.manualDiscount.message}</p>}
          </div>
          <div className="mgr-form-field mgr-form-field-full">
            <p id="admission-payment-mode-label" className="mgr-label">{tManagerUi('payment_mode_23b35c')}</p>
            <p className="mgr-input-hint" role="status">{tManagerUi('admission_unavailable_host_contract_not_supplied')}</p>
          </div>
          <div className="mgr-form-field">
            <label className="mgr-label mgr-label-required" htmlFor="admission-amount">{tManagerUi('amount_paid_now')}</label>
            <div className="mgr-input-icon-wrap"><IndianRupee size={18} strokeWidth={2} className="mgr-input-icon" /><input id="admission-amount" {...register('amountPaid')} disabled type="number" min="1" step="1" className={`mgr-input mgr-input-with-icon${errors.amountPaid ? ' mgr-input-error' : ''}`} aria-invalid={Boolean(errors.amountPaid)} /></div>
            {errors.amountPaid && <p className="mgr-error" role="alert">{errors.amountPaid.message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
