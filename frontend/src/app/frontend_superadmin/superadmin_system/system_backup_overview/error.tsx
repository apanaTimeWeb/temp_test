// RESPONSIBILITY: Render the route error boundary for system backup overview; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_system/system_backup_overview/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminBackupOverviewErrorFallback from './components/SuperadminBackupOverviewErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within backup overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminBackupOverviewErrorFallback error={error} reset={reset} />;
}
