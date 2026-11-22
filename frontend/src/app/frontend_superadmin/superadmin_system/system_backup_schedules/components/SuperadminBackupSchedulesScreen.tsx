/** Responsibility: isolated route adapter for the Automated Schedules workflow. */
/** Data-Flow: canonical route props -> SuperadminBackupSchedulesScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminBackupSchedulesPageClient from '@/app/frontend_superadmin/superadmin_system/system_backup_schedules/components/SuperadminBackupSchedulesPageClient.tsx';

/**
 * Composes the backup schedules screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBackupSchedulesScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminBackupSchedulesPageClient />;
}
