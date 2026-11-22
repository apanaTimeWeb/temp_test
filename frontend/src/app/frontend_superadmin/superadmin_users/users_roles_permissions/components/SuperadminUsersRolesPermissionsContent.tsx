"use client";

/** Responsibility: render the read-only Roles & Permissions matrix and its zero-row state. */
/** Data-Flow: local permission preview fixture -> localized semantic matrix; this UI does not grant access. */
import { CheckCircle, X, Shield, Lock, RotateCcw } from 'lucide-react';
import SuperadminUsersRolesPermissionsEmptyState from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/components/SuperadminUsersRolesPermissionsEmptyState';
import type { SuperadminUsersContentProps } from '@/app/frontend_superadmin/superadmin_users/users_roles_permissions/types/SuperadminUsersRolesPermissionsTypes';
import { useTranslations } from 'next-intl';

export default function SuperadminUsersRolesPermissionsContent({ rolePermissions }: SuperadminUsersContentProps) {
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
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm" aria-labelledby="roles-permissions-matrix-title">
      <div className="p-4 sm:p-6 overflow-x-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="roles-permissions-matrix-title" className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              <span>{t('COPY.ROLE_BASED_ACCESS_CONTROL_RBAC_MATRIX')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t('COPY.DEFINE_WHICH_ROLES_HAVE_ACCESS_TO_SPECIFIC_SAAS_MODULES')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold">
              <Lock size={12} className="text-purple-400" />
              <span>System Enforced</span>
            </span>
          </div>
        </div>

        <div className="border border-border/80 rounded-2xl overflow-hidden bg-slate-900/40">
          {rolePermissions.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center p-6">
              <SuperadminUsersRolesPermissionsEmptyState />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th scope="col" className="py-3 px-4 font-semibold text-xs uppercase tracking-wider border-b border-border/80 text-slate-300">{t('COPY.MODULE_FEATURE')}</th>
                  <th scope="col" className="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-border/80 text-center text-purple-400">{t('COPY.SUPERADMIN')}</th>
                  <th scope="col" className="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-border/80 text-center text-indigo-400">{t('COPY.ADMIN_TENANT')}</th>
                  <th scope="col" className="py-3 px-4 font-bold text-xs uppercase tracking-wider border-b border-border/80 text-center text-sky-400">{t('COPY.MANAGER')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rolePermissions.map((row) => (
                  <tr key={row.module} className="hover:bg-indigo-500/5 transition-colors">
                    <th scope="row" className="py-3.5 px-4 text-slate-200 font-medium">{getRolePermissionModuleLabel(row.module)}</th>
                    <td className="py-3.5 px-4 text-center">
                      <span className="sr-only">{t('COPY.SUPERADMIN_2')} {row.superadmin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                      {row.superadmin ? <CheckCircle aria-hidden="true" size={17} className="text-emerald-400 mx-auto" /> : <X aria-hidden="true" size={16} className="text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="sr-only">{t('COPY.TENANT_ADMIN')} {row.admin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                      {row.admin ? <CheckCircle aria-hidden="true" size={17} className="text-emerald-400 mx-auto" /> : <X aria-hidden="true" size={16} className="text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="sr-only">{t('COPY.MANAGER_2')} {row.manager ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>
                      {row.manager ? <CheckCircle aria-hidden="true" size={17} className="text-emerald-400 mx-auto" /> : <X aria-hidden="true" size={16} className="text-slate-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80">
          <p className="text-xs text-slate-400">
            {t('COPY.CHANGES_IN_THIS_SCREEN_UPDATE_SAMPLE_DATA_IN_THIS_PAGE_ONLY_NO_USER_ACCOUNT_IS_CREATED_OR_CHANGED_ON_THE_SERVER')}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all cursor-not-allowed opacity-50"
              disabled
            >
              <RotateCcw size={14} className="text-indigo-400" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 opacity-50 cursor-not-allowed"
              disabled
              title={t('COPY.UNAVAILABLE_NO_RBAC_WRITE_API_CONTRACT_IS_SUPPLIED')}
            >
              <Lock size={14} />
              <span>{t('COPY.SAVE_RBAC_CHANGES_UNAVAILABLE')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
