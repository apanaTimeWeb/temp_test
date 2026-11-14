// RESPONSIBILITY: Render the route loading state for system backup schedules; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_backup_schedules/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBackupSchedulesListSkeleton from './components/SuperadminBackupSchedulesListSkeleton';

/**
 * Performs the module loading operation within backup schedules; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminBackupSchedulesListSkeleton />;
}
