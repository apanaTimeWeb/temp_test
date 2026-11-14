/** Responsibility: Route adapter for the backup_configuration screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBackupConfigurationScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `backups` inside the backup_configuration autonomous module. */
import SuperadminBackupConfigurationPageClient from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/components/SuperadminBackupConfigurationPageClient';

/**
 * Composes the backup configuration screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBackupConfigurationScreen({ id }: { id?: string }) {
  return <SuperadminBackupConfigurationPageClient />;
}
