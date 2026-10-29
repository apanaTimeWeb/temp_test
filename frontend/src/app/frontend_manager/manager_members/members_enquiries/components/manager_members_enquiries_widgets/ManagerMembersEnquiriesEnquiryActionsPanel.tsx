'use client';
// RESPONSIBILITY: Render the members enquiries enquiry actions panel component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the members enquiries enquiry actions panel component within the components feature. It does not own backend persistence or cross-feature business logic.
import { CheckCircle, XCircle } from 'lucide-react';
import type { ManagerMembersEnquiriesEnquiryActionsPanelProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';




export function ManagerMembersEnquiriesEnquiryActionsPanel({
  status,
  statusOptions,
  statusLabels,
  unavailableMessage,
  currentStatusLabel,
  updateUnavailableLabel,
  actionsLabel,
  onConvert,
  alreadyConvertedLabel,
  convertLabel,
  alreadyLostLabel,
  markLostUnavailableLabel,
}: ManagerMembersEnquiriesEnquiryActionsPanelProps) {
  return (
    <>
      <section className="crm-card" aria-labelledby="crm-detail-current-status-title">
        <h2 id="crm-detail-current-status-title" className="crm-section-label">{currentStatusLabel}</h2>
        <div className="crm-status-row">
          <div className="crm-select-wrap">
            <select className="crm-select" value={status} disabled aria-label={currentStatusLabel}>
              {statusOptions.map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}
            </select>
          </div>
          <button type="button" className="crm-btn-primary cursor-not-allowed" disabled title={unavailableMessage}>
            <CheckCircle size={14} aria-hidden="true" />{updateUnavailableLabel}
          </button>
        </div>
      </section>
      <section className="crm-card crm-form-stack" aria-labelledby="crm-detail-actions-title">
        <h2 id="crm-detail-actions-title" className="crm-section-label">{actionsLabel}</h2>
        <button type="button" className="crm-btn-success crm-btn-full" onClick={onConvert} disabled={status === 'Converted'}>
          <CheckCircle size={16} aria-hidden="true" />{status === 'Converted' ? alreadyConvertedLabel : convertLabel}
        </button>
        <button type="button" className="crm-btn-danger crm-btn-full cursor-not-allowed" disabled title={unavailableMessage}>
          <XCircle size={15} aria-hidden="true" />{status === 'Lost' ? alreadyLostLabel : markLostUnavailableLabel}
        </button>
      </section>
    </>
  );
}
