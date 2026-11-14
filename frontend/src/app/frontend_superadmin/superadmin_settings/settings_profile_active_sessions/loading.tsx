// RESPONSIBILITY: Render the route loading state for settings profile active sessions; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_profile_active_sessions/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminProfileActiveSessionsListSkeleton from './components/SuperadminProfileActiveSessionsListSkeleton';

/**
 * Performs the module loading operation within profile active sessions; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminProfileActiveSessionsListSkeleton />;
}
