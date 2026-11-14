/** Responsibility: Route adapter for the communication_whatsapp_logs screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminCommunicationWhatsappLogsScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `whatsapp_logs` inside the communication_whatsapp_logs autonomous module. */
import SuperadminCommunicationWhatsappLogsPageClient from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/components/SuperadminCommunicationWhatsappLogsPageClient';

/**
 * Composes the communication whatsapp logs screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminCommunicationWhatsappLogsScreen({ id }: { id?: string }) {
  return <SuperadminCommunicationWhatsappLogsPageClient id={id} />;
}
