// RESPONSIBILITY: Render the route loading state for libraries student bulk import; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_student_bulk_import/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton from './components/SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOnboardingSetupStudentBulkImportRouteSkeleton />;
}
