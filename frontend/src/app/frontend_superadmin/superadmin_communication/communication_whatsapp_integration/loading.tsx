// RESPONSIBILITY: Render the route loading state for communication whatsapp integration; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_communication/communication_whatsapp_integration/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationWhatsappIntegrationListSkeleton from './components/SuperadminCommunicationWhatsappIntegrationListSkeleton';

/**
 * Performs the module loading operation within communication whatsapp integration; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminCommunicationWhatsappIntegrationListSkeleton />;
}
