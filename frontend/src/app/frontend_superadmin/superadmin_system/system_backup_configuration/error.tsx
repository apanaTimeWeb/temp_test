// RESPONSIBILITY: Render the route error boundary for system backup configuration; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_system/system_backup_configuration/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminBackupConfigurationErrorFallback from './components/SuperadminBackupConfigurationErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within backup configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminBackupConfigurationErrorFallback error={error} reset={reset} />;
}
