// RESPONSIBILITY: Render the route error boundary for settings library configuration; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_settings/settings_library_configuration/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry fallback. */
'use client';

import SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback from './components/SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function ModuleError({ reset }: ModuleErrorProps) {
  return <SuperadminSettingsGeneralSettingsLibraryConfigurationErrorFallback onRetry={reset} />;
}
