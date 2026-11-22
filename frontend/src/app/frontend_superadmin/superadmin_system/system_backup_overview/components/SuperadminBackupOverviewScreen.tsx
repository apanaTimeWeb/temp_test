/** Responsibility: Route adapter for the backup_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminBackupOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the backup_overview autonomous module. */
import SuperadminBackupOverviewPageClient from '@/app/frontend_superadmin/superadmin_system/system_backup_overview/components/SuperadminBackupOverviewPageClient';

/**
 * Composes the backup overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminBackupOverviewScreen({ id }: { id?: string }) {
  return <SuperadminBackupOverviewPageClient />;
}
