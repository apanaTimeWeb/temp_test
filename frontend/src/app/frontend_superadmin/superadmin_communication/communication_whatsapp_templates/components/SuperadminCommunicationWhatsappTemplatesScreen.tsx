'use client';
/** Responsibility: Route adapter for the communication_whatsapp_templates screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminCommunicationWhatsappTemplatesScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `whatsapp_templates` inside the communication_whatsapp_templates autonomous module. */
import SuperadminCommunicationWhatsappTemplatesPageClient from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesPageClient';

/**
 * Composes the communication whatsapp templates screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminCommunicationWhatsappTemplatesScreen({ id }: { id?: string }) {
  return <SuperadminCommunicationWhatsappTemplatesPageClient id={id} />;
}
