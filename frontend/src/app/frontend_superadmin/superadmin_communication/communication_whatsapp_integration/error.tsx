// RESPONSIBILITY: Render the route error boundary for communication whatsapp integration; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_communication/communication_whatsapp_integration/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminCommunicationWhatsappIntegrationErrorFallback from './components/SuperadminCommunicationWhatsappIntegrationErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminCommunicationWhatsappIntegrationErrorFallback error={error} reset={reset} />;
}
