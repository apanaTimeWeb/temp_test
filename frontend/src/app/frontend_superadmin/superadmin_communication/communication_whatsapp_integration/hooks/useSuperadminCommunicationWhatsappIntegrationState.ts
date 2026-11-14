// RESPONSIBILITY: Own local provider and superadmin_communication_whatsapp_integration-sender-phone input state for the WhatsApp integration preview; does not connect to a provider or persist credentials.
// FLOW: WhatsApp integration page -> module-owned state hook -> local form state -> preview UI.
import { useState } from 'react';

/**
 * Returns local provider and superadmin_communication_whatsapp_integration-sender-phone input state. No provider integration or persistence is performed.
 * @returns Module-local UI state and stable React state setters.
 */
export function useSuperadminCommunicationWhatsappIntegrationState() {
  const [provider, setProvider] = useState('wati');
  const [senderPhone, setSenderPhone] = useState('');
  return { provider, setProvider, senderPhone, setSenderPhone };
}
