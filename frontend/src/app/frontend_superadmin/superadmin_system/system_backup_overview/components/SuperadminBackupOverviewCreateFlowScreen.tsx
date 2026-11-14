/** Responsibility: isolated route adapter for the Create Backup workflow. */
/** Data-Flow: canonical route props -> SuperadminBackupOverviewCreateFlowScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminBackupOverviewCreateFlowPageClient from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewCreateFlowPageClient.tsx';

/**
 * Composes the backup overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBackupOverviewCreateFlowScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminBackupOverviewCreateFlowPageClient />;
}
