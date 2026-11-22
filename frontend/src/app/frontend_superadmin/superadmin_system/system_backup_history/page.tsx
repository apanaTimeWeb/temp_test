// RESPONSIBILITY: Adapt the canonical route for system backup history to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_system/system_backup_history/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical, directly refreshable route for the Backup History workflow. */
import SuperadminBackupHistoryRestoreFlowScreen from '@/app/frontend_superadmin/superadmin_system/system_backup_history/components/SuperadminBackupHistoryRestoreFlowScreen.tsx';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import SuperadminBackupHistoryScreen from '@/app/frontend_superadmin/superadmin_system/system_backup_history/components/SuperadminBackupHistoryScreen.tsx';

type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Resolves the canonical route for backup history and dispatches the selected view to its leaf-owned screen.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminBackupHistoryRoutePage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const id = firstValue(query.id);
  const view = firstValue(query.view);
  if (view === 'restore') return <div className="min-w-0" data-feature-module="superadmin_system" data-feature-route="system_backup_history" data-feature-view="restore"><SuperadminBackupHistoryRestoreFlowScreen id={id} /></div>;
  const tCopy = await getTranslations("SUPERADMIN_BACKUP");
  return <div className="min-w-0" data-feature-module="superadmin_system" data-feature-route="system_backup_history">
    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-secondary" role="status">{tCopy("COPY.MODULE_ROUTE_LOADING")}</div>}>
      <SuperadminBackupHistoryScreen id={id} />
    </Suspense>
  </div>;
}
