'use client';
// RESPONSIBILITY: Render the members group admission admission summary section of the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the members group admission admission summary section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';

import { useManagerGroupAdmissionFormatting } from '@/app/frontend_manager/manager_members/members_group_admission/hooks/useManagerMembersGroupAdmissionFormatting';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_group_admission/config/manager_members_group_admission.url_config';
import type { ManagerMembersGroupAdmissionAdmissionSummaryProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';
export type { ManagerMembersGroupAdmissionAdmissionSummaryProps };



export function ManagerMembersGroupAdmissionAdmissionSummary({ smartIdPreview, plan, shift, seat, locker, baseAmountMinor, discountMinor, totalPayableMinor, amountPaidMinor, currency, isSubmitting, canSubmit, pricingAvailable = false }: ManagerMembersGroupAdmissionAdmissionSummaryProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');
  const { formatCurrency } = useManagerGroupAdmissionFormatting();
  const balanceMinor = Math.max(0, totalPayableMinor - amountPaidMinor);
  return (
    <aside className="mgr-admission-summary">
      <div className="mgr-card mgr-admission-summary-card">
        <div className="mgr-card-header"><h2 className="mgr-section-title">{tManagerUi('admission_summary')}</h2></div>
        <div className="mgr-card-body">
          <div className="mgr-summary-rows">
            <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('smart_id')}</span><span className="mgr-smartid-chip">{smartIdPreview}</span></div>
            <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('plan_ae2f98')}</span><span className="mgr-summary-value">{plan || '—'}</span></div>
            <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('shift')}</span><span className="mgr-summary-value">{shift || '—'}</span></div>
            <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('seat_b90b32')}</span><span className="mgr-summary-value">{seat || '—'}</span></div>
            <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('locker')}</span><span className="mgr-summary-value">{locker || '—'}</span></div>
            {pricingAvailable ? <>
              <div className="mgr-summary-divider" />
              <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('base_amount')}</span><span className="mgr-summary-value">{formatCurrency(baseAmountMinor, currency)}</span></div>
              <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('discount')}</span><span className="mgr-text-warning">− {formatCurrency(discountMinor, currency)}</span></div>
              <div className="mgr-summary-total-row"><span className="mgr-summary-total-label">{tManagerUi('total_payable')}</span><span className="mgr-summary-total-value">{formatCurrency(totalPayableMinor, currency)}</span></div>
              <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('paid_now')}</span><span className="mgr-text-success">{formatCurrency(amountPaidMinor, currency)}</span></div>
              {balanceMinor > 0 && <div className="mgr-summary-row"><span className="mgr-summary-label">{tManagerUi('balance_due')}</span><span className="mgr-text-danger">{formatCurrency(balanceMinor, currency)}</span></div>}
            </> : <p className="mgr-input-hint" role="status">{tManagerUi('admission_unavailable_host_contract_not_supplied')}</p>}
          </div>
          <div className="mgr-summary-actions">
            {/* Guard against raw window.confirm; cancel uses structured route navigation */}
            <button type="submit" disabled={!canSubmit || isSubmitting} title={!canSubmit ? tManagerUi('admission_unavailable_host_contract_not_supplied') : undefined} className="mgr-btn-primary mgr-btn-full cursor-not-allowed"><CheckCircle size={18} strokeWidth={2} />{canSubmit ? (isSubmitting ? tManagerUi('confirming') : tManagerUi('confirm_admission')) : tManagerUi('admission_unavailable')}</button>
            <Link href={MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES.LIST} className="mgr-btn-ghost mgr-btn-full" >{tManagerUi('cancel')}</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
