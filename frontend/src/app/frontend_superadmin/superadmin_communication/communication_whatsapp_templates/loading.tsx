// RESPONSIBILITY: Render the route loading state for communication whatsapp templates; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_communication/communication_whatsapp_templates/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationWhatsappTemplatesListSkeleton from './components/SuperadminCommunicationWhatsappTemplatesListSkeleton';

/**
 * Performs the module loading operation within communication whatsapp templates; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminCommunicationWhatsappTemplatesListSkeleton />;
}
