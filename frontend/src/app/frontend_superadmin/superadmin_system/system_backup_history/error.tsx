// RESPONSIBILITY: Render the route error boundary for system backup history; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_system/system_backup_history/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminBackupHistoryErrorFallback from './components/SuperadminBackupHistoryErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within backup history; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminBackupHistoryErrorFallback error={error} reset={reset} />;
}
