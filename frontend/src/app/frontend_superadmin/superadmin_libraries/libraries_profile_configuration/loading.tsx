// RESPONSIBILITY: Render the route loading state for libraries profile configuration; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_libraries/libraries_profile_configuration/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminLibrariesProfileConfigurationListSkeleton from './components/SuperadminLibrariesProfileConfigurationListSkeleton';

/**
 * Performs the module loading operation within libraries profile configuration; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminLibrariesProfileConfigurationListSkeleton />;
}
