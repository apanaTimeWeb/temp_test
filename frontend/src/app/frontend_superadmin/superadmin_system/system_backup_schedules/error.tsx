// RESPONSIBILITY: Render the route error boundary for system backup schedules; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_system/system_backup_schedules/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminBackupSchedulesErrorFallback from './components/SuperadminBackupSchedulesErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within backup schedules; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminBackupSchedulesErrorFallback error={error} reset={reset} />;
}
