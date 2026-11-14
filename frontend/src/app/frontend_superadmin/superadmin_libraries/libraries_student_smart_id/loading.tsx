// RESPONSIBILITY: Render the route loading state for libraries student smart id; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_student_smart_id/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton from './components/SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminLibrariesOnboardingSetupStudentSmartIdRouteSkeleton />;
}
