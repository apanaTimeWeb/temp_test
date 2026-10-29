'use client';
// RESPONSIBILITY: Render the canonical group-admission feature view with incoming route context.
// DATA FLOW: Next.js route page -> Main -> GroupPage.
import { useTranslations } from 'next-intl';
import { Users2, Plus, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES } from '@/app/frontend_manager/manager_members/members_group_admission/config/manager_members_group_admission.url_config';
import type { ManagerMembersGroupAdmissionGroupPageRouteProps } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';



export default function ManagerMembersGroupAdmissionGroupPage(_routeQuery: ManagerMembersGroupAdmissionGroupPageRouteProps) {
  const tManagerUi = useTranslations('manager.manager_group_admission.ui');

  const downloadTemplate = () => {
    const csv = 'name,phone,email,plan\nExample Student,9876543210,student@example.com,Pro\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'student-group-template.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mgr-page"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div className="mgr-page-header">
        <div>
          <Link href={MANAGER_MEMBERS_GROUP_ADMISSION_ROUTES.LIST} className="mgr-back-link">{tManagerUi('back_to_students')}</Link>
          <h1 className="mgr-page-title">{tManagerUi('group_admission')}</h1>
        </div>
        <div className="mgr-page-actions">
          <button type="button" className="mgr-btn-ghost" onClick={downloadTemplate}>
            <Download size={16} /><span>{tManagerUi('download_csv_template')}</span>
          </button>
          <button type="button" disabled title={tManagerUi('group_admission_unavailable_host_contract')} className="mgr-btn-primary cursor-not-allowed">
            <Plus size={16} /><span>{tManagerUi('group_admission_unavailable')}</span>
          </button>
        </div>
      </div>

      <p className="mt-3 mb-6 rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning" role="status" data-testid="manager-students-group-admission-contract-warning">
        {tManagerUi('group_admission_unavailable_host_contract')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-border bg-transparent">
          <div className="w-16 h-16 rounded-full bg-primary-subtle flex items-center justify-center text-primary mb-2"><Upload size={28} /></div>
          <div>
            <h3 className="text-primary font-semibold mb-1">{tManagerUi('bulk_upload_excel_csv')}</h3>
            <p className="text-secondary text-sm max-w-xs">{tManagerUi('bulk_import_unavailable_until_authoritative_import_contract_is_supplied')}</p>
          </div>
          <button type="button" disabled title={tManagerUi('group_admission_unavailable_host_contract')} className="mgr-btn-primary mt-2 cursor-not-allowed">{tManagerUi('upload_unavailable')}</button>
        </div>

        <div className="mgr-card p-6 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-border bg-transparent">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center text-success mb-2"><Users2 size={28} /></div>
          <div>
            <h3 className="text-primary font-semibold mb-1">{tManagerUi('manual_group_entry')}</h3>
            <p className="text-secondary text-sm max-w-xs">{tManagerUi('manual_group_admission_unavailable_until_host_contract_is_supplied')}</p>
          </div>
          <button type="button" disabled title={tManagerUi('group_admission_unavailable_host_contract')} className="mgr-btn-primary mt-2 cursor-not-allowed">{tManagerUi('manual_entry_unavailable')}</button>
        </div>
      </div>

      <div className="mgr-card p-6 mt-6">
        <h3 className="font-semibold text-primary mb-4">{tManagerUi('recent_group_admissions')}</h3>
        <div className="text-center text-secondary py-12" role="status">{tManagerUi('group_admission_records_unavailable')}</div>
      </div>
    </div>
  );
}
