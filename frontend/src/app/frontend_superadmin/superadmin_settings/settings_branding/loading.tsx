// RESPONSIBILITY: Render the route loading state for settings branding; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_branding/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsBrandingListSkeleton from './components/SuperadminSettingsBrandingListSkeleton';

/**
 * Performs the module loading operation within settings branding; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsBrandingListSkeleton />;
}
