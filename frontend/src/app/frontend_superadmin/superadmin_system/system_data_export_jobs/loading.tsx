// RESPONSIBILITY: Render the route loading state for system data export jobs; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_system/system_data_export_jobs/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminDataExportJobsListSkeleton from './components/SuperadminDataExportJobsListSkeleton';

/**
 * Performs the module loading operation within data export jobs; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminDataExportJobsListSkeleton />;
}
