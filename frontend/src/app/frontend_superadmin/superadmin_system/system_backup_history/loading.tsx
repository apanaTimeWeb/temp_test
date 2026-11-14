// RESPONSIBILITY: Render the route loading state for system backup history; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_backup_history/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBackupHistoryListSkeleton from './components/SuperadminBackupHistoryListSkeleton';

/**
 * Performs the module loading operation within backup history; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminBackupHistoryListSkeleton />;
}
