// RESPONSIBILITY: Render the route loading state for settings profile security; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_profile_security/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminProfileSecurityListSkeleton from './components/SuperadminProfileSecurityListSkeleton';

/**
 * Performs the module loading operation within profile security; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminProfileSecurityListSkeleton />;
}
