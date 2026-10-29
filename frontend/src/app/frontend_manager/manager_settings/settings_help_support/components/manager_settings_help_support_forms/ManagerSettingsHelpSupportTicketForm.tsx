'use client';
// RESPONSIBILITY: Render the settings help support ticket form component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the settings help support ticket form component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useManagerSettingsHelpSupportConfirm } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportConfirm';
import { useManagerSettingsHelpSupportUnsavedChangesGuard } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportUnsavedChangesGuard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerHelpSupportTicketDraftSchema, type ManagerSettingsHelpSupportTicketDraft } from '@/app/frontend_manager/manager_settings/settings_help_support/schemas/ManagerSettingsHelpSupportTicketDraftSchema';
import type { ManagerSettingsHelpSupportTicketFormProps } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportComponentTypes';



export function ManagerSettingsHelpSupportTicketForm({ onCancel }: ManagerSettingsHelpSupportTicketFormProps) {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerSettingsHelpSupportConfirm();
  const { register, formState: { errors, isDirty } } = useForm<ManagerSettingsHelpSupportTicketDraft>({
    resolver: zodResolver(managerHelpSupportTicketDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { category: 'billing', subject: '', description: '', priority: 'Medium' },
  });

  useManagerSettingsHelpSupportUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi });
  const handleCancel = () => {
    if (!isDirty) { onCancel(); return; }
    void confirm(tManagerUi('confirm_leave_with_unsaved_changes'), tManagerUi('cancel'), tManagerUi('continue')).then((confirmed) => { if (confirmed) onCancel(); });
  };

  return (
    <>
    {unsavedConfirmDialog}
    <form onSubmit={(event) => event.preventDefault()} noValidate className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="manager-ticket-category" className="text-sm font-semibold text-primary">{tManagerUi('category')}</label>
          <select id="manager-ticket-category" className="mgr-input" {...register('category')} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'manager-ticket-category-error' : undefined}>
            <option value="billing">{tManagerUi('billing_payments')}</option><option value="technical">{tManagerUi('technical_issue')}</option><option value="feature">{tManagerUi('feature_request')}</option><option value="account">{tManagerUi('account_settings')}</option><option value="general">{tManagerUi('general_inquiry')}</option>
          </select>
          {errors.category && <p id="manager-ticket-category-error" className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="manager-ticket-priority" className="text-sm font-semibold text-primary">{tManagerUi('priority')}</label>
          <select id="manager-ticket-priority" className="mgr-input" {...register('priority')} aria-invalid={Boolean(errors.priority)} aria-describedby={errors.priority ? 'manager-ticket-priority-error' : undefined}>
            <option value="Low">{tManagerUi('low')}</option><option value="Medium">{tManagerUi('medium')}</option><option value="High">{tManagerUi('high')}</option>
          </select>
          {errors.priority && <p id="manager-ticket-priority-error" className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="manager-ticket-subject" className="text-sm font-semibold text-primary">{tManagerUi('subject')}</label>
        <input id="manager-ticket-subject" type="text" required placeholder={tManagerUi('briefly_describe_the_issue')} className="mgr-input" {...register('subject')} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'manager-ticket-subject-error' : undefined} />
        {errors.subject && <p id="manager-ticket-subject-error" className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="manager-ticket-description" className="text-sm font-semibold text-primary">{tManagerUi('description')}</label>
        <textarea id="manager-ticket-description" rows={5} required placeholder={tManagerUi('provide_as_much_detail_as_possible')} className="mgr-input resize-none py-3" {...register('description')} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'manager-ticket-description-error' : undefined} />
        {errors.description && <p id="manager-ticket-description-error" className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>}
      </div>
      <div className="flex flex-col gap-2"><p className="text-sm font-semibold text-primary">{tManagerUi('attachment_optional')}</p><p className="text-sm text-secondary" role="status">{tManagerUi('attachment_unavailable_without_upload_contract')}</p></div>
      <div className="pt-4 border-t border-border flex justify-end gap-3">
        <button type="button" onClick={handleCancel} className="mgr-btn-secondary">{tManagerUi('cancel')}</button>
        <button type="submit" disabled title={tManagerUi('submit_unavailable_host_ticket_creation_contract_not_sup_343905')} className="mgr-btn-primary cursor-not-allowed">{tManagerUi('submit_unavailable')}</button>
      </div>
    </form>
    </>
  );
}
