// RESPONSIBILITY: Render the route loading state for system backup overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_backup_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBackupOverviewListSkeleton from './components/SuperadminBackupOverviewListSkeleton';

/**
 * Performs the module loading operation within backup overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminBackupOverviewListSkeleton />;
}
