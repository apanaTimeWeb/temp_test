// RESPONSIBILITY: Own module-local state or interaction logic for system backup overview; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_system/system_backup_overview/hooks/useSuperadminBackupOverviewState.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { SuperadminBackupTab } from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/types/SuperadminBackupOverviewTypes';
const SUPERADMIN_NAVIGATION_ROUTES = {
  backup_history: '/superadmin/superadmin_system/backup_history',
  backup_history__restore: '/superadmin/superadmin_system/backup_history?view=restore',
  backup_overview__create: '/superadmin/superadmin_system/backup_overview?view=create',
  backup_schedules: '/superadmin/superadmin_system/backup_schedules',
} as const;


/** Owns the backup overview's selected tab and transient preview-notice lifecycle. 
 * @param initialTab - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminBackupOverviewState(initialTab: SuperadminBackupTab = 'create') {
  const [activeTab] = useState<SuperadminBackupTab>(initialTab);
  const setActiveTab = useCallback((tab: SuperadminBackupTab) => {
    const routes: Record<SuperadminBackupTab, string> = { create: SUPERADMIN_NAVIGATION_ROUTES.backup_overview__create, history: SUPERADMIN_NAVIGATION_ROUTES.backup_history, restore: SUPERADMIN_NAVIGATION_ROUTES.backup_history__restore, schedule: SUPERADMIN_NAVIGATION_ROUTES.backup_schedules };
    const target = new URL(routes[tab], window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash);
  }, []);
  const showPreviewNotice = useCallback((message: string) => {
    toast.message(message, { id: 'superadmin:backup:preview-notice' });
  }, []);

  return { activeTab, setActiveTab, showPreviewNotice };
}
