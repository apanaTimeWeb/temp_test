/** Responsibility: isolated route adapter for the Backup History workflow. */
/** Data-Flow: canonical route props -> SuperadminBackupHistoryScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminBackupHistoryPageClient from '@/app/frontend_superadmin/superadmin_system/system_backup_history/components/SuperadminBackupHistoryPageClient.tsx';

/**
 * Composes the backup history screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBackupHistoryScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminBackupHistoryPageClient />;
}
