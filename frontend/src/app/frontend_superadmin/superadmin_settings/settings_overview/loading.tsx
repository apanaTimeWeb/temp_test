// RESPONSIBILITY: Render the route loading state for settings overview; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_overview/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsOverviewListSkeleton from './components/SuperadminSettingsOverviewListSkeleton';

/**
 * Performs the module loading operation within settings overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsOverviewListSkeleton />;
}
