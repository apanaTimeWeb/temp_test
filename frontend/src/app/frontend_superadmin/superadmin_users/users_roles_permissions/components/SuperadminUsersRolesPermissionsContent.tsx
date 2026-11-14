"use client";

/** Responsibility: render the read-only Roles & Permissions matrix and its zero-row state. */
/** Data-Flow: local permission preview fixture -> localized semantic matrix; this UI does not grant access. */
import { CheckCircle, X } from 'lucide-react';
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
    <section className="sa-card p-0 overflow-hidden" aria-labelledby="roles-permissions-matrix-title">
      <div className="p-6 overflow-x-auto">
        <div className="mb-6">
          <h2 id="roles-permissions-matrix-title" className="text-base font-bold text-primary">{t('COPY.ROLE_BASED_ACCESS_CONTROL_RBAC_MATRIX')}</h2>
          <p className="text-sm text-secondary">{t('COPY.DEFINE_WHICH_ROLES_HAVE_ACCESS_TO_SPECIFIC_SAAS_MODULES')}</p>
        </div>
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          {rolePermissions.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center p-6">
              <SuperadminUsersRolesPermissionsEmptyState />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-hover text-secondary">
                <tr>
                  <th scope="col" className="py-3 px-4 font-semibold border-b border-border">{t('COPY.MODULE_FEATURE')}</th>
                  <th scope="col" className="py-3 px-4 font-semibold border-b border-border text-center text-info">{t('COPY.SUPERADMIN')}</th>
                  <th scope="col" className="py-3 px-4 font-semibold border-b border-border text-center text-success">{t('COPY.ADMIN_TENANT')}</th>
                  <th scope="col" className="py-3 px-4 font-semibold border-b border-border text-center text-warning">{t('COPY.MANAGER')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rolePermissions.map((row) => (
                  <tr key={row.module} className="hover:bg-surface-hover motion-safe:transition-colors motion-reduce:transition-none">
                    <th scope="row" className="py-3 px-4 text-primary font-medium">{getRolePermissionModuleLabel(row.module)}</th>
                    <td className="py-3 px-4 text-center"><span className="sr-only">{t('COPY.SUPERADMIN_2')} {row.superadmin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>{row.superadmin ? <CheckCircle aria-hidden="true" size={16} className="text-success mx-auto" /> : <X aria-hidden="true" size={16} className="text-secondary mx-auto" />}</td>
                    <td className="py-3 px-4 text-center"><span className="sr-only">{t('COPY.TENANT_ADMIN')} {row.admin ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>{row.admin ? <CheckCircle aria-hidden="true" size={16} className="text-success mx-auto" /> : <X aria-hidden="true" size={16} className="text-secondary mx-auto" />}</td>
                    <td className="py-3 px-4 text-center"><span className="sr-only">{t('COPY.MANAGER_2')} {row.manager ? t('COPY.ALLOWED') : t('COPY.NOT_ALLOWED')}</span>{row.manager ? <CheckCircle aria-hidden="true" size={16} className="text-success mx-auto" /> : <X aria-hidden="true" size={16} className="text-secondary mx-auto" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
