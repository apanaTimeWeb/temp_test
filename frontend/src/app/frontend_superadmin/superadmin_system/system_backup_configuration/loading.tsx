// RESPONSIBILITY: Render the route loading state for system backup configuration; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_backup_configuration/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBackupConfigurationListSkeleton from './components/SuperadminBackupConfigurationListSkeleton';

/**
 * Performs the module loading operation within backup configuration; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminBackupConfigurationListSkeleton />;
}
