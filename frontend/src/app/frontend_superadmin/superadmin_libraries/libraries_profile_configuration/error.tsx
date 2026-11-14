// RESPONSIBILITY: Render the route error boundary for libraries profile configuration; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_libraries/libraries_profile_configuration/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminLibrariesProfileConfigurationErrorFallback from './components/SuperadminLibrariesProfileConfigurationErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within libraries profile configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminLibrariesProfileConfigurationErrorFallback error={error} reset={reset} />;
}
