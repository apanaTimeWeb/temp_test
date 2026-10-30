'use client';
// DATA FLOW: staff_directory route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStaffDirectory } from '@/app/frontend_admin/admin_staff/staff_directory/api/admin_staff_directory.api';
import { ADMIN_STAFF_DIRECTORY_QUERY_KEYS } from '@/app/frontend_admin/admin_staff/staff_directory/api/admin_staff_directory.query_keys';
import { ADMIN_STAFF_DIRECTORY_NAVIGATION } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import { ADMIN_STAFF_DIRECTORY_DEMO_BRANCH_OPTIONS } from '@/app/frontend_admin/admin_staff/staff_directory/config/admin_staff_directory.url_config';
import type { AdminStaffDirectoryTab, AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import type { AdminStaffDirectoryCreateManagerFormValues } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';
import { ADMIN_STAFF_DIRECTORY_FIXTURE_DATA } from '@/app/frontend_admin/admin_staff/staff_directory/mocks/scenarios/admin_staff_directory.scenarios';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import type { AdminStaffDirectoryManagerDetailTab } from '@/app/frontend_admin/admin_staff/staff_directory/types/AdminStaffDirectoryComponentTypes';





export function createAdminStaffDirectoryDemoManager(
  existing: readonly AdminStaffDirectoryManager[],
  values: AdminStaffDirectoryCreateManagerFormValues,
  branch: string,
  id: string,
): { manager: AdminStaffDirectoryManager; duplicate: false } | { manager: null; duplicate: true } {
  const username = values.username.trim().toLocaleLowerCase();
  const email = values.email.trim().toLocaleLowerCase();
  if (existing.some((manager) => manager.username.trim().toLocaleLowerCase() === username || manager.email.trim().toLocaleLowerCase() === email)) {
    return { manager: null, duplicate: true };
  }
  return {
    duplicate: false,
    manager: {
      id,
      name: values.fullName.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      branch,
      status: values.initialStatus,
      lastActive: 'Never',
    },
  };
}

export function addAdminStaffDirectoryDemoManager(existing: readonly AdminStaffDirectoryManager[], manager: AdminStaffDirectoryManager): AdminStaffDirectoryManager[] {
  return [manager, ...existing];
}

export default function useAdminStaffDirectory() {
  const t = useTranslations('ADMIN_STAFF_DIRECTORY');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('view');
  const activeTab: AdminStaffDirectoryTab = ADMIN_STAFF_DIRECTORY_NAVIGATION.some((item) => item.id === requestedTab) ? requestedTab as AdminStaffDirectoryTab : 'all';
  const setActiveTab = useCallback((tab: AdminStaffDirectoryTab) => { const next = new URLSearchParams(searchParams.toString()); next.set('view', tab); router.push(`${pathname}?${next.toString()}`, { scroll: false }); }, [pathname, router, searchParams]);
  const [demoManagersOverride, setDemoManagersOverride] = useState<AdminStaffDirectoryManager[] | null>(null);
  const [viewingManager, setViewingManager] = useState<AdminStaffDirectoryManager | null>(null);
  const [managerDetailTab, setManagerDetailTab] = useState<AdminStaffDirectoryManagerDetailTab>('overview');
  const managersQuery = useQuery({ queryKey: ADMIN_STAFF_DIRECTORY_QUERY_KEYS.list(), queryFn: fetchAdminStaffDirectory, enabled: !isDemoMode });
  const managers = isDemoMode ? demoManagersOverride ?? ADMIN_STAFF_DIRECTORY_FIXTURE_DATA : (managersQuery.data ?? []);
  const isLoading = !isDemoMode && managersQuery.isPending;
  const hasLoadError = !isDemoMode && managersQuery.isError;
  const handleAddManager = (values: AdminStaffDirectoryCreateManagerFormValues): 'created' | 'duplicate' | 'blocked' => {
    if (!isDemoMode) return 'blocked';
    const branchOption = ADMIN_STAFF_DIRECTORY_DEMO_BRANCH_OPTIONS.find((option) => option.id === values.branchId);
    if (!branchOption) return 'blocked';
    const branch = branchOption.id === 'b1' ? t('BRANCH_DOWNTOWN') : t('BRANCH_WESTSIDE');
    const result = createAdminStaffDirectoryDemoManager(managers, values, branch, `MGR-DEMO-${Date.now()}`);
    if (result.duplicate) return 'duplicate';
    setDemoManagersOverride((current) => addAdminStaffDirectoryDemoManager(current ?? ADMIN_STAFF_DIRECTORY_FIXTURE_DATA, result.manager));
    setActiveTab('all');
    return 'created';
  };
  const openManagerDetails = (manager: AdminStaffDirectoryManager) => { setViewingManager(manager); setManagerDetailTab('overview'); };
  const managerCounts = useMemo(() => ({ all: managers.length, active: managers.filter((manager) => manager.status === 'Active').length, suspended: managers.filter((manager) => manager.status === 'Suspended').length, deactivated: managers.filter((manager) => manager.status === 'Deactivated').length }), [managers]);
  return { activeTab, setActiveTab, viewingManager, setViewingManager, managerDetailTab, setManagerDetailTab, navItems: ADMIN_STAFF_DIRECTORY_NAVIGATION, managers, dummyManagers: managers, managerCounts, isDemoMode, isLoading, hasLoadError, retryLoadManagers: managersQuery.refetch, handleAddManager, openManagerDetails } as const;
}
