'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { useManagerBranchInfoForm } from '@/app/frontend_manager/manager_settings/settings_branch_info/hooks/useManagerSettingsBranchInfoForm';
import { Building2, MapPin, Phone, Mail, User, Clock, Building, Hash, ShieldCheck, Info } from 'lucide-react';

export default function ManagerSettingsBranchInfoPage() {
  const tManagerUi = useTranslations('manager.manager_branch_info.ui');
  const { branchData } = useManagerBranchInfoForm();

  return (
    <div className="mgr-page-animate relative pb-12">
      <div className="flex flex-col gap-1 mb-8">
        <div className="mgr-breadcrumb">
          <span>{tManagerUi('settings')}</span>
          <span>/</span>
          <span>{tManagerUi('branch_information')}</span>
        </div>
        <h1 className="mgr-page-title flex items-center gap-3 mt-2">
          <Building2 className="text-primary" size={28} /> {tManagerUi('branch_profile')}
        </h1>
        <p className="text-sm text-secondary">Verified profile details for this branch facility</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary" role="status">
          <ShieldCheck size={16} className="shrink-0 text-primary" />
          <span>Central Branch Master Record · Branch profile, code, and address are verified and governed by SuperAdmin.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="mgr-card p-6 sticky top-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center mb-6 border border-border">
              <Building size={32} />
            </div>
            <h2 className="text-xl font-black text-primary mb-1">{branchData.branchName}</h2>
            <p className="text-sm text-success font-bold mb-6">{tManagerUi('code')} {branchData.branchCode}</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary mt-0.5 shrink-0" />
                <span className="text-sm text-primary">{branchData.address || tManagerUi('address_not_set')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <span className="text-sm text-primary">{branchData.phone || tManagerUi('phone_not_set')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <span className="text-sm text-primary">{branchData.email || tManagerUi('email_not_set')}</span>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-secondary shrink-0" />
                <span className="text-sm text-primary">{branchData.managerName || tManagerUi('manager_not_set')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-secondary shrink-0" />
                <span className="text-sm text-primary">{branchData.workingHours || tManagerUi('hours_not_set')}</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-card rounded-xl border border-border">
              <p className="text-xs text-secondary text-center">Managed under central multi-branch chain governance.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="mgr-card p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Branch Master Details</h2>
                <p className="text-xs text-secondary mt-0.5">Authoritative branch registry parameters</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                <ShieldCheck size={12} /> Active Branch
              </span>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Building size={14} className="text-primary" /> {tManagerUi('branch_name')}
                  </label>
                  <input
                    type="text"
                    className="mgr-input bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.branchName}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Hash size={14} className="text-primary" /> {tManagerUi('branch_code')}
                  </label>
                  <input
                    type="text"
                    className="mgr-input font-mono bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.branchCode}
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> {tManagerUi('address')}
                  </label>
                  <textarea
                    rows={2}
                    className="mgr-input resize-none py-3 bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.address}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Phone size={14} className="text-primary" /> {tManagerUi('phone_number')}
                  </label>
                  <input
                    type="tel"
                    className="mgr-input bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.phone}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Mail size={14} className="text-primary" /> {tManagerUi('email_address')}
                  </label>
                  <input
                    type="email"
                    className="mgr-input bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.email}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <User size={14} className="text-primary" /> {tManagerUi('manager_name')}
                  </label>
                  <input
                    type="text"
                    className="mgr-input bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.managerName}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Clock size={14} className="text-primary" /> {tManagerUi('working_hours')}
                  </label>
                  <input
                    type="text"
                    className="mgr-input bg-surface-highlight/50 cursor-default"
                    readOnly
                    value={branchData.workingHours}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-border mt-8 p-3.5 rounded-xl bg-card border text-xs text-secondary">
                <Info size={16} className="text-primary shrink-0" />
                <span>To request modifications to branch address, manager in-charge, or operational hours, please contact the Central Head Office.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
