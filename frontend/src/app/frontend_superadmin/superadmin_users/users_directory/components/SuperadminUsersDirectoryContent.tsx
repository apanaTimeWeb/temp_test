/** Responsibility: Superadmin Users Content; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning users-directory page -> active tab, typed user/session rows, columns and permission data -> feature-local semantic tables and localized role labels; this content component does not persist user or session changes. */
import SuperadminUsersDirectorySemanticTable from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectorySemanticTable';
import { CheckCircle, LogOut, X } from 'lucide-react';
import type { SuperadminUsersContentProps, SuperadminSessionData, SuperadminUserData } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import { useTranslations } from 'next-intl';
/**
 * Renders the `superadmin_users` view owned by `SuperadminUsersDirectoryContent`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminUsersDirectoryContent({ activeTab, users, userCols, sessions, sessionCols, rolePermissions }: SuperadminUsersContentProps) {
  const t = useTranslations('SUPERADMIN_USERS');
  const getRolePermissionModuleLabel = (module: string) => {
    switch (module) {
      case 'Dashboard & Analytics': return t('COPY.MODULE_DASHBOARD_ANALYTICS');
      case 'Library Management': return t('COPY.MODULE_LIBRARY_MANAGEMENT');
      case 'Seat & Shift Allocations': return t('COPY.MODULE_SEAT_SHIFT_ALLOCATIONS');
      case 'Billing & Subscriptions': return t('COPY.MODULE_BILLING_SUBSCRIPTIONS');
      case 'User Access Control': return t('COPY.MODULE_USER_ACCESS_CONTROL');
      case 'Student CRM': return t('COPY.MODULE_STUDENT_CRM');
      default: return module;
    }
  };
  return (
      <div className="sa-card p-0 overflow-hidden h-150 flex flex-col">
        {activeTab === 'All Users' && (
          <div className="flex-1 w-full">
            <SuperadminUsersDirectorySemanticTable<SuperadminUserData>
             
              rowData={users}
              columnDefs={userCols}
              headerHeight={48}
              rowHeight={56}
              suppressCellFocus={false}
              getRowId={(params) => params.data.id}
            />
          </div>
        )}

        {activeTab === 'User Sessions' && (
          <div className="flex-1 w-full flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary">{t("COPY.ACTIVE_SESSIONS_AUDIT")}</h3>
                <p className="text-xs text-secondary">{t("COPY.MONITOR_ACTIVE_USER_SESSIONS_AND_FORCEFULLY_REVOKE_ACCESS_IF_NECESSARY")}</p>
              </div>
              <button className="sa-btn-secondary sa-btn-secondary--sm" type="button" disabled title={t("COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED")} data-testid="superadmin-users-users-content-unavailable-the-session-management-api-contract-is-not-supplied-1">
                <LogOut size={14} className="mr-1 inline" /> {t("COPY.REVOKE_ALL_IDLE_UNAVAILABLE")}
              </button>
            </div>
            <div className="flex-1">
              <SuperadminUsersDirectorySemanticTable<SuperadminSessionData>
               
                rowData={sessions}
                columnDefs={sessionCols}
                headerHeight={48}
                rowHeight={56}
                suppressCellFocus={false}
                getRowId={(params) => params.data.id}
              />
            </div>
          </div>
        )}

        {activeTab === 'Roles & Permissions' && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-primary">{t("COPY.ROLE_BASED_ACCESS_CONTROL_RBAC_MATRIX")}</h3>
              <p className="text-sm text-secondary">{t("COPY.DEFINE_WHICH_ROLES_HAVE_ACCESS_TO_SPECIFIC_SAAS_MODULES")}</p>
            </div>
            
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-hover text-secondary">
                  <tr>
                    <th className="py-3 px-4 font-semibold border-b border-border">{t("COPY.MODULE_FEATURE")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border text-center text-info">{t("COPY.SUPERADMIN")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border text-center text-success">{t("COPY.ADMIN_TENANT")}</th>
                    <th className="py-3 px-4 font-semibold border-b border-border text-center text-warning">{t("COPY.MANAGER")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rolePermissions.map((row) => (
                    <tr key={row.module} className="hover:bg-surface-hover motion-safe:transition-colors motion-reduce:transition-none">
                      <td className="py-3 px-4 text-primary font-medium">{getRolePermissionModuleLabel(row.module)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="sr-only">{t("COPY.SUPERADMIN_2")} {row.superadmin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                        {row.superadmin ? <CheckCircle aria-hidden="true" size={16} className="text-success mx-auto" /> : <X aria-hidden="true" size={16} className="text-secondary mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="sr-only">{t("COPY.TENANT_ADMIN")} {row.admin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                        {row.admin ? <CheckCircle aria-hidden="true" size={16} className="text-success mx-auto" /> : <X aria-hidden="true" size={16} className="text-secondary mx-auto" />}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="sr-only">{t("COPY.MANAGER_2")} {row.manager ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                        {row.manager ? <CheckCircle aria-hidden="true" size={16} className="text-success mx-auto" /> : <X aria-hidden="true" size={16} className="text-secondary mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="sa-btn-primary" type="button" disabled title={t("COPY.UNAVAILABLE_NO_RBAC_WRITE_API_CONTRACT_IS_SUPPLIED")} data-testid="superadmin-users-users-content-unavailable-no-rbac-write-api-contract-is-supplied-2">{t("COPY.SAVE_RBAC_CHANGES_UNAVAILABLE")}</button>
            </div>
          </div>
        )}
      </div>

  );
}
