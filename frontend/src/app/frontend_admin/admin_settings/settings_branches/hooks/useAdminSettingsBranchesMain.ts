'use client';
// DATA FLOW: settings_branches route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ADMIN_SETTINGS_BRANCHES_NAVIGATION, ADMIN_BRANCHES_DETAIL_NAVIGATION } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import { ADMIN_BRANCHES_STATUS_OPTIONS } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import type { AdminBranchesBranch, AdminSettingsBranchesTab } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import type { AdminBranchesCreateFormValues } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import { useAdminBranchesStore } from '@/app/frontend_admin/admin_settings/settings_branches/state/useAdminSettingsBranchesStore';
import { ADMIN_SETTINGS_BRANCHES_ROUTES } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';
import { ADMIN_BRANCHES_FIXTURE_DATA } from '@/app/frontend_admin/admin_settings/settings_branches/mocks/scenarios/admin_settings_branches.scenarios';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { fetchAdminBranches } from '@/app/frontend_admin/admin_settings/settings_branches/api/admin_settings_branches_api';
import { ADMIN_BRANCHES_QUERY_KEYS } from '@/app/frontend_admin/admin_settings/settings_branches/api/admin_settings_branches.query_keys';


const ADMIN_SETTINGS_BRANCHES_TABS: readonly AdminSettingsBranchesTab[] = ['all', 'create', 'active', 'suspended', 'archived', 'managers', 'settings', 'usage', 'reports'];
function readMainTab(value: string | null): AdminSettingsBranchesTab { return ADMIN_SETTINGS_BRANCHES_TABS.includes(value as AdminSettingsBranchesTab) ? value as AdminSettingsBranchesTab : 'all'; }
export default function useAdminSettingsBranchesMain() {
  const t = useTranslations('ADMIN_BRANCHES');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router=useRouter(); const pathname=usePathname(); const searchParams=useSearchParams();
  const viewingBranchId = useAdminBranchesStore((state) => state.viewingBranchId);
  const detailTab = useAdminBranchesStore((state) => state.detailTab);
  const setViewingBranchId = useAdminBranchesStore((state) => state.setViewingBranchId);
  const setDetailTab = useAdminBranchesStore((state) => state.setDetailTab);
  const branchesQuery = useQuery({ queryKey: ADMIN_BRANCHES_QUERY_KEYS.list(), queryFn: fetchAdminBranches, enabled: !isDemoMode });
  const [demoBranchesOverride, setDemoBranchesOverride] = useState<AdminBranchesBranch[] | null>(null);
  const branches = isDemoMode ? demoBranchesOverride ?? ADMIN_BRANCHES_FIXTURE_DATA : (branchesQuery.data ?? []);
  const createDemoBranch = useCallback((values: AdminBranchesCreateFormValues): 'created' | 'duplicate-code' | 'blocked' => {
    if (!isDemoMode) return 'blocked';
    const code = values.code.trim().toLocaleUpperCase();
    if (branches.some((branch) => branch.code.trim().toLocaleUpperCase() === code)) return 'duplicate-code';
    const newBranch: AdminBranchesBranch = {
      id: `BR-DEMO-${Date.now()}`, name: values.name.trim(), code, address: values.address.trim(),
      phone: values.phone.trim(), email: values.email.trim(), manager: t('MANAGER_UNASSIGNED'), status: ADMIN_BRANCHES_STATUS_OPTIONS[0],
    };
    setDemoBranchesOverride((current) => [newBranch, ...(current ?? ADMIN_BRANCHES_FIXTURE_DATA)]);
    return 'created';
  }, [branches, isDemoMode, t]);
  const viewingBranch = useMemo(() => branches.find((branch) => branch.id === viewingBranchId) ?? null, [branches, viewingBranchId]);
  const setViewingBranch = useCallback((branch: AdminBranchesBranch | null) => setViewingBranchId(branch?.id ?? null), [setViewingBranchId]);
  const activeTab=readMainTab(searchParams.get('view') ?? searchParams.get('tab'));
  const setActiveTab=useCallback((tab:AdminSettingsBranchesTab)=>{ const next=new URLSearchParams(searchParams.toString()); next.set('view',tab); next.delete('tab'); const query=next.toString(); router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }); },[pathname,router,searchParams]);
  const [activeStatus, suspendedStatus, archivedStatus] = ADMIN_BRANCHES_STATUS_OPTIONS;
  const branchCounts=useMemo(()=>({all:branches.length,active:branches.filter(b=>b.status===activeStatus).length,suspended:branches.filter(b=>b.status===suspendedStatus).length,archived:branches.filter(b=>b.status===archivedStatus).length}),[branches, activeStatus, suspendedStatus, archivedStatus]);
  return {activeTab,setActiveTab,viewingBranch,setViewingBranch,detailTab,setDetailTab,mainNav:ADMIN_SETTINGS_BRANCHES_NAVIGATION,detailNav:ADMIN_BRANCHES_DETAIL_NAVIGATION,branches,branchCounts,isDemoMode,branchesLoading: branchesQuery.isPending && !isDemoMode,branchesError: branchesQuery.isError ? t('LOAD_ERROR') : null,retryBranches: branchesQuery.refetch,createDemoBranch,routeUrls:ADMIN_SETTINGS_BRANCHES_ROUTES} as const;
}
