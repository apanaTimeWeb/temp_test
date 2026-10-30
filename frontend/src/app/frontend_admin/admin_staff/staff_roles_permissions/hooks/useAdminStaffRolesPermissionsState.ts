'use client';
// DATA FLOW: staff_roles_permissions route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { ADMIN_STAFF_ROLES_PERMISSIONS_QUERY_KEYS } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/api/admin_staff_roles_permissions.query_keys';
import { getAdminStaffRolesPermissionsDemoState } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/mocks/AdminStaffRolesPermissionsDemoState';
import type { AdminStaffRolesPermissionsModule } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/types/AdminStaffRolesPermissionsTypes';
import { fetchAdminStaffRolesPermissions } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/api/admin_staff_roles_permissions.api';

/** Demo mode uses an explicit local fixture; live mode fails closed until an API contract is supplied. */
export default function useAdminStaffRolesPermissionsState() {
  const demoMode = isFrontendDemoModeEnabled();
  const permsQuery = useQuery({
    queryKey: ADMIN_STAFF_ROLES_PERMISSIONS_QUERY_KEYS.list(),
    queryFn: () => demoMode
      ? Promise.resolve(getAdminStaffRolesPermissionsDemoState())
      : fetchAdminStaffRolesPermissions(),
    retry: false,
  });
  const [perms, setPerms] = useState<AdminStaffRolesPermissionsModule[]>([]);
  useEffect(() => { if (permsQuery.data) setPerms(permsQuery.data); }, [permsQuery.data]);
  return { permsQuery, perms, setPerms } as const;
}
