// RESPONSIBILITY: Render the route error boundary for communication whatsapp logs; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_communication/communication_whatsapp_logs/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminCommunicationWhatsappLogsErrorFallback from './components/SuperadminCommunicationWhatsappLogsErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within communication whatsapp logs; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminCommunicationWhatsappLogsErrorFallback error={error} onRetry={reset} />;
}
