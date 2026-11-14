'use client';
/** Responsibility: Canonical Main orchestration boundary for the WhatsApp templates leaf. */
import SuperadminCommunicationWhatsappTemplatesScreen from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/components/SuperadminCommunicationWhatsappTemplatesScreen';

/** Keep the existing Screen → PageClient behavior behind the canonical Main entrypoint. */
export default function SuperadminCommunicationWhatsappTemplatesMain({ id }: { id?: string }) {
  return <SuperadminCommunicationWhatsappTemplatesScreen id={id} />;
}
