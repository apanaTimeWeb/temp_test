'use client';
// RESPONSIBILITY: Render the members enquiries follow up form panel component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the members enquiries follow up form panel component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useManagerMembersEnquiriesConfirm } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesConfirm';
import { useManagerMembersEnquiriesUnsavedChangesGuard } from '@/app/frontend_manager/manager_members/members_enquiries/hooks/useManagerMembersEnquiriesUnsavedChangesGuard';
import { CalendarDays, Edit2, Plus } from 'lucide-react';
import type { ManagerMembersEnquiriesFollowUpFormPanelProps } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';
export type { ManagerMembersEnquiriesFollowUpFormPanelProps };





export function ManagerMembersEnquiriesFollowUpFormPanel({
  form,
  minimumDate,
  title,
  dateLabel,
  remarkLabel,
  unavailableTitle,
  submitLabel,
  nextFollowUpLabel,
  nextFollowUpStatus,
  nextFollowUpStatusClassName,
  editFollowUpLabel,
  onDirtyChange,
}: ManagerMembersEnquiriesFollowUpFormPanelProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerMembersEnquiriesConfirm();
  const isDirty = form.formState.isDirty;
  // Dependency rationale: parent route actions must know whether this child form has an uncommitted draft.
  useEffect(() => { onDirtyChange?.(isDirty); return () => onDirtyChange?.(false); }, [isDirty, onDirtyChange]);
  useManagerMembersEnquiriesUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi });
  const dateError = form.formState.errors.date;
  const remarkError = form.formState.errors.remark;

  return (
    <>
    {unsavedConfirmDialog}
    <div className="crm-card">
      <h3 className="crm-section-label">{title}</h3>
      <p className="crm-contract-warning" role="status" data-testid="manager-crm-followup-contract-warning">{unavailableTitle}</p>
      <form onSubmit={(event) => event.preventDefault()} noValidate className="crm-form-stack">
        <div className="crm-field">
          <label htmlFor="crm-followup-date" className="crm-label crm-label--required">{dateLabel}</label>
          <input
            id="crm-followup-date"
            type="date"
            min={minimumDate}
            className={`crm-input crm-input-date${dateError ? ' crm-input--error' : ''}`}
            aria-invalid={Boolean(dateError)}
            aria-describedby={dateError ? 'crm-followup-date-error' : undefined}
            {...form.register('date')}
          />
          {dateError && <p id="crm-followup-date-error" className="crm-error" role="alert">{dateError.message}</p>}
        </div>
        <div className="crm-field">
          <label htmlFor="crm-followup-remark" className="crm-label crm-label--required">{remarkLabel}</label>
          <textarea
            id="crm-followup-remark"
            rows={3}
            className={`crm-textarea${remarkError ? ' crm-textarea--error' : ''}`}
            aria-invalid={Boolean(remarkError)}
            aria-describedby={remarkError ? 'crm-followup-remark-error' : undefined}
            {...form.register('remark')}
          />
          {remarkError && <p id="crm-followup-remark-error" className="crm-error" role="alert">{remarkError.message}</p>}
        </div>
        <button type="submit" className="crm-btn-primary crm-btn-full cursor-not-allowed" disabled title={unavailableTitle}>
          <Plus size={15} />{submitLabel}
        </button>
      </form>
      <div className="crm-divider" />
      <div className="crm-followup-next">
        <div className="crm-followup-next-left">
          <CalendarDays size={13} aria-hidden="true" />
          <span>{nextFollowUpLabel} <strong className={nextFollowUpStatusClassName}>{nextFollowUpStatus}</strong></span>
        </div>
        <button type="button" className="crm-btn-icon" title={editFollowUpLabel} aria-label={editFollowUpLabel} disabled>
          <Edit2 size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
    </>
  );
}
