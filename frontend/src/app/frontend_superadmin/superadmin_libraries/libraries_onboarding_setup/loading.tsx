// RESPONSIBILITY: Render the route loading state for libraries onboarding setup; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_onboarding_setup/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminLibrariesOnboardingSetupListSkeleton from './components/SuperadminLibrariesOnboardingSetupListSkeleton';

/**
 * Performs the module loading operation within libraries onboarding setup; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminLibrariesOnboardingSetupListSkeleton />;
}
