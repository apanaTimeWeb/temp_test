// RESPONSIBILITY: Render the route error boundary for communication notification center; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_communication/communication_notification_center/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminCommunicationNotificationCenterErrorFallback from './components/SuperadminCommunicationNotificationCenterErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within communication notification center; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminCommunicationNotificationCenterErrorFallback error={error} reset={reset} />;
}
