// RESPONSIBILITY: Render the route loading state for settings integrations; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_integrations/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsIntegrationsListSkeleton from './components/SuperadminSettingsIntegrationsListSkeleton';

/**
 * Performs the module loading operation within settings integrations; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsIntegrationsListSkeleton />;
}
