// RESPONSIBILITY: Adapt the canonical route for system backup overview to its leaf-owned screen or redirect; it does not implement sibling workflows.
// FLOW: App Router -> superadmin_system/system_backup_overview/page.tsx -> canonical URL contract -> owning feature screen or redirect.
/** Canonical single-leaf route; secondary workflows are selected by the view query parameter. */
import SuperadminBackupOverviewScreen from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewScreen';
import SuperadminBackupOverviewCreateFlowScreen from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowScreen';
type SearchParams = Record<string, string | string[] | undefined>;
function firstValue(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }
/**
 * Renders the backup overview route boundary and delegates business presentation to feature-local components.
 * @param parameter Input required by the declared feature contract. Declared type: { searchParams?: Promise<SearchParams> | SearchParams; }.
 */
export default async function SuperadminBackupOverviewPage({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const view = firstValue(query.view);
  const id = firstValue(query.id);
  if (view === 'create') return <div data-feature-module="superadmin_system" data-feature-route="system_backup_overview" data-feature-view="create"><SuperadminBackupOverviewCreateFlowScreen id={id} /></div>;
  return <div data-feature-module="superadmin_system" data-feature-route="system_backup_overview"><SuperadminBackupOverviewScreen /></div>;
}
