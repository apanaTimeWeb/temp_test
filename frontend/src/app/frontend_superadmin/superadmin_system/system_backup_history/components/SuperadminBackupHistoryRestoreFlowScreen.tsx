/** Responsibility: isolated route adapter for the Restore Point workflow. */
/** Data-Flow: canonical route props -> SuperadminBackupHistoryRestoreFlowScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminBackupRestorePageClient from '@/app/frontend_superadmin/superadmin_system/system_backup_history/components/SuperadminBackupHistoryRestoreFlowPageClient.tsx';

/**
 * Composes the backup history screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBackupHistoryRestoreFlowScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminBackupRestorePageClient />;
}
