/** Responsibility: Superadmin Users Content; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: owning users-directory page -> active tab, typed user/session rows, columns and permission data -> feature-local semantic tables and localized role labels; this content component does not persist user or session changes. */
import SuperadminUsersDirectorySemanticTable from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectorySemanticTable';
import { CheckCircle, X } from 'lucide-react';
import type { SuperadminUsersContentProps, SuperadminUserData } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import { useTranslations } from 'next-intl';
/**
 * Renders the `superadmin_users` view owned by `SuperadminUsersDirectoryContent`.
 * Keeps rendering and interaction state within the owning feature module; preserves the existing route and user-facing labels.
 */
export default function SuperadminUsersDirectoryContent({ activeTab, users, userCols, rolePermissions }: SuperadminUsersContentProps) {
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
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm flex flex-col min-h-[480px]">
      {activeTab !== 'Roles & Permissions' ? (
        <div className="flex-1 w-full">
          <SuperadminUsersDirectorySemanticTable<SuperadminUserData>
            rowData={users}
            columnDefs={userCols}
            headerHeight={48}
            rowHeight={56}
            pagination={true}
            paginationPageSize={10}
            suppressCellFocus={false}
            getRowId={(params) => params.data.id}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">{t("COPY.ROLE_BASED_ACCESS_CONTROL_RBAC_MATRIX")}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{t("COPY.DEFINE_WHICH_ROLES_HAVE_ACCESS_TO_SPECIFIC_SAAS_MODULES")}</p>
            </div>
            <a
              href="/superadmin/superadmin_users/users_roles_permissions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
            >
              Open Full Roles Matrix →
            </a>
          </div>
          
          <div className="border border-border/80 rounded-2xl overflow-hidden bg-slate-900/40">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b border-border/80">{t("COPY.MODULE_FEATURE")}</th>
                  <th className="py-3 px-4 font-bold text-xs tracking-wider uppercase border-b border-border/80 text-center text-purple-400">{t("COPY.SUPERADMIN")}</th>
                  <th className="py-3 px-4 font-bold text-xs tracking-wider uppercase border-b border-border/80 text-center text-indigo-400">{t("COPY.ADMIN_TENANT")}</th>
                  <th className="py-3 px-4 font-bold text-xs tracking-wider uppercase border-b border-border/80 text-center text-sky-400">{t("COPY.MANAGER")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rolePermissions.map((row) => (
                  <tr key={row.module} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="py-3.5 px-4 text-slate-200 font-medium">{getRolePermissionModuleLabel(row.module)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="sr-only">{t("COPY.SUPERADMIN_2")} {row.superadmin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                      {row.superadmin ? <CheckCircle aria-hidden="true" size={17} className="text-emerald-400 mx-auto" /> : <X aria-hidden="true" size={16} className="text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="sr-only">{t("COPY.TENANT_ADMIN")} {row.admin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                      {row.admin ? <CheckCircle aria-hidden="true" size={17} className="text-emerald-400 mx-auto" /> : <X aria-hidden="true" size={16} className="text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="sr-only">{t("COPY.MANAGER_2")} {row.manager ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                      {row.manager ? <CheckCircle aria-hidden="true" size={17} className="text-emerald-400 mx-auto" /> : <X aria-hidden="true" size={16} className="text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
