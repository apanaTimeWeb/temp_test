'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import type { ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { useManagerBranchInfoForm } from '@/app/frontend_manager/manager_settings/settings_branch_info/hooks/useManagerSettingsBranchInfoForm';
import { Building2, Save, MapPin, Phone, Mail, User, Clock, Building, Hash } from 'lucide-react';



export default function ManagerSettingsBranchInfoPage() {
  const tManagerUi = useTranslations('manager.manager_branch_info.ui');
  const { register, errors, isDirty, isDraftValidated, branchData, onValidateLocalDraft } = useManagerBranchInfoForm();
  const fieldError = (field: Extract<keyof ManagerSettingsBranchInfoDraft, string>) => errors[field] ? (
    <p id={`branch-${field}-error`} className="text-sm text-danger" role="alert">{tManagerUi('validation_field_invalid')}</p>
  ) : null;
  const fieldA11y = (field: Extract<keyof ManagerSettingsBranchInfoDraft, string>) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `branch-${field}-error` : undefined,
  });

  return (
    <div className="mgr-page-animate relative pb-12">
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb"><span>{tManagerUi('settings')}</span><span>/</span><span>{tManagerUi('branch_information')}</span></div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2"><Building2 className="text-primary" size={28} /> {tManagerUi('branch_profile')}</h1>
        <p className="text-sm text-secondary">{tManagerUi('review_and_edit_a_local_draft_of_branch_details_saving_i_75e9ef')}</p>
        <p className="mt-3 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status" data-testid="manager-branch-info-sample-data-warning">{tManagerUi('branch_name_address_contact_details_and_manager_identity_e91222')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="mgr-card p-6 sticky top-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center mb-6 border border-border"><Building size={32} /></div>
            <h2 className="text-xl font-black text-primary mb-1">{branchData.branchName}</h2>
            <p className="text-sm text-success font-bold mb-6">{tManagerUi('code')} {branchData.branchCode}</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3"><MapPin size={18} className="text-secondary mt-0.5 shrink-0" /><span className="text-sm text-primary">{branchData.address || tManagerUi('address_not_set')}</span></div>
              <div className="flex items-center gap-3"><Phone size={18} className="text-secondary shrink-0" /><span className="text-sm text-primary">{branchData.phone || tManagerUi('phone_not_set')}</span></div>
              <div className="flex items-center gap-3"><Mail size={18} className="text-secondary shrink-0" /><span className="text-sm text-primary">{branchData.email || tManagerUi('email_not_set')}</span></div>
              <div className="flex items-center gap-3"><User size={18} className="text-secondary shrink-0" /><span className="text-sm text-primary">{branchData.managerName || tManagerUi('manager_not_set')}</span></div>
              <div className="flex items-center gap-3"><Clock size={18} className="text-secondary shrink-0" /><span className="text-sm text-primary">{branchData.workingHours || tManagerUi('hours_not_set')}</span></div>
            </div>
            <div className="mt-8 p-4 bg-card rounded-xl border border-border"><p className="text-xs text-secondary text-center">{tManagerUi('local_preview_only_changes_are_not_saved_or_propagated_f_a3bb60')}</p></div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="mgr-card p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4"><h2 className="text-xl font-bold text-primary">{tManagerUi('edit_details')}</h2></div>
            <form onSubmit={onValidateLocalDraft} noValidate className="space-y-6">
              <p className="text-sm text-warning" data-testid="manager-branch-info-save-contract-warning" role="status" aria-live="polite">{isDraftValidated ? tManagerUi('local_preview_only_changes_are_not_saved_or_propagated_f_a3bb60') : isDirty ? tManagerUi('draft_changes_not_saved') : tManagerUi('save_unavailable_no_authoritative_branch_update_api_cont_9dbd80')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2"><label htmlFor="branch-name" className="text-sm font-semibold text-primary flex items-center gap-2"><Building size={14} className="text-primary" /> {tManagerUi('branch_name')}</label><input id="branch-name" type="text" className="mgr-input" {...register('branchName')} {...fieldA11y('branchName')} />{fieldError('branchName')}</div>
                <div className="flex flex-col gap-2"><label htmlFor="branch-code" className="text-sm font-semibold text-primary flex items-center gap-2"><Hash size={14} className="text-primary" /> {tManagerUi('branch_code')}</label><input id="branch-code" type="text" className="mgr-input opacity-70" readOnly {...register('branchCode')} {...fieldA11y('branchCode')} title={tManagerUi('branch_code_is_assigned_by_superadmin_and_cannot_be_chan_f5fde2')} />{fieldError('branchCode')}</div>
                <div className="flex flex-col gap-2 md:col-span-2"><label htmlFor="branch-address" className="text-sm font-semibold text-primary flex items-center gap-2"><MapPin size={14} className="text-primary" /> {tManagerUi('address')}</label><textarea id="branch-address" rows={2} className="mgr-input resize-none py-3" {...register('address')} {...fieldA11y('address')} />{fieldError('address')}</div>
                <div className="flex flex-col gap-2"><label htmlFor="branch-phone" className="text-sm font-semibold text-primary flex items-center gap-2"><Phone size={14} className="text-primary" /> {tManagerUi('phone_number')}</label><input id="branch-phone" type="tel" className="mgr-input" {...register('phone')} {...fieldA11y('phone')} />{fieldError('phone')}</div>
                <div className="flex flex-col gap-2"><label htmlFor="branch-email" className="text-sm font-semibold text-primary flex items-center gap-2"><Mail size={14} className="text-primary" /> {tManagerUi('email_address')}</label><input id="branch-email" type="email" className="mgr-input" {...register('email')} {...fieldA11y('email')} />{fieldError('email')}</div>
                <div className="flex flex-col gap-2"><label htmlFor="branch-manager-name" className="text-sm font-semibold text-primary flex items-center gap-2"><User size={14} className="text-primary" /> {tManagerUi('manager_name')}</label><input id="branch-manager-name" type="text" className="mgr-input" {...register('managerName')} {...fieldA11y('managerName')} />{fieldError('managerName')}</div>
                <div className="flex flex-col gap-2"><label htmlFor="branch-working-hours" className="text-sm font-semibold text-primary flex items-center gap-2"><Clock size={14} className="text-primary" /> {tManagerUi('working_hours')}</label><input id="branch-working-hours" type="text" className="mgr-input" placeholder={tManagerUi('e_g_08_00_am_10_00_pm_mon_sat')} {...register('workingHours')} {...fieldA11y('workingHours')} />{fieldError('workingHours')}</div>
              </div>
              <div className="flex justify-end pt-6 border-t border-border mt-8"><button type="submit" disabled title={tManagerUi('save_unavailable_host_branch_update_contract_not_supplie_f87f15')} className="mgr-btn-primary px-8 cursor-not-allowed"><Save size={16} className="mr-2 inline" /> {tManagerUi('save_unavailable')}</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
