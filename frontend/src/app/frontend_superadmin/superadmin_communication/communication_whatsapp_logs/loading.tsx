// RESPONSIBILITY: Render the route loading state for communication whatsapp logs; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_communication/communication_whatsapp_logs/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminCommunicationWhatsappLogsListSkeleton from './components/SuperadminCommunicationWhatsappLogsListSkeleton';

/**
 * Performs the module loading operation within communication whatsapp logs; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminCommunicationWhatsappLogsListSkeleton />;
}
