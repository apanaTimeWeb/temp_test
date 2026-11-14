// RESPONSIBILITY: Render the route error boundary for settings general; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_settings/settings_general/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminSettingsGeneralErrorFallback from './components/SuperadminSettingsGeneralErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within settings general; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminSettingsGeneralErrorFallback error={error} reset={reset} />;
}
