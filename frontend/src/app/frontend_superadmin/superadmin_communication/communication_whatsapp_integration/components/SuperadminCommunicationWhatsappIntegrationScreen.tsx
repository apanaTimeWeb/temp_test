/** Responsibility: Route adapter for the communication_whatsapp_integration screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminCommunicationWhatsappIntegrationScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `whatsapp_integration` inside the communication_whatsapp_integration autonomous module. */
import SuperadminSystemWhatsappIntegrationPageClient from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_integration/components/SuperadminCommunicationWhatsappIntegrationPageClient';

/**
 * Composes the communication whatsapp integration screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminCommunicationWhatsappIntegrationScreen({ id }: { id?: string }) {
  return <SuperadminSystemWhatsappIntegrationPageClient />;
}
