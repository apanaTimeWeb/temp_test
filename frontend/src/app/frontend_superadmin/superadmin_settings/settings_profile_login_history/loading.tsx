// RESPONSIBILITY: Render the route loading state for settings profile login history; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_profile_login_history/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminProfileLoginHistoryListSkeleton from './components/SuperadminProfileLoginHistoryListSkeleton';

/**
 * Performs the module loading operation within profile login history; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminProfileLoginHistoryListSkeleton />;
}
