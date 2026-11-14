// RESPONSIBILITY: Define local sample fixtures for communication whatsapp templates; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_communication/communication_whatsapp_templates/mocks/fixtures/SuperadminCommunicationWhatsappTemplatesWhatsappTemplateMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminCommunicationWhatsappTemplatePreview } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_templates/types/superadmin_communication_whatsapp_templates.types';

/** Synthetic template text for local preview. These templates are not deployed or sent. */
export const SUPERADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_PREVIEWS: SuperadminCommunicationWhatsappTemplatePreview[] = [
  { id: 'welcome', labelKey: 'WHATSAPP_TEMPLATE_WELCOME_LABEL', icon: 'hand', bodyKey: 'WHATSAPP_TEMPLATE_WELCOME_BODY' },
  { id: 'fee_reminder', labelKey: 'WHATSAPP_TEMPLATE_FEE_REMINDER_LABEL', icon: 'wallet', bodyKey: 'WHATSAPP_TEMPLATE_FEE_REMINDER_BODY' },
  { id: 'renewal', labelKey: 'WHATSAPP_TEMPLATE_RENEWAL_LABEL', icon: 'repeat', bodyKey: 'WHATSAPP_TEMPLATE_RENEWAL_BODY' },
  { id: 'receipt', labelKey: 'WHATSAPP_TEMPLATE_RECEIPT_LABEL', icon: 'receipt', bodyKey: 'WHATSAPP_TEMPLATE_RECEIPT_BODY' },
  { id: 'notice', labelKey: 'WHATSAPP_TEMPLATE_NOTICE_LABEL', icon: 'megaphone', bodyKey: 'WHATSAPP_TEMPLATE_NOTICE_BODY' },
  { id: 'absentee', labelKey: 'WHATSAPP_TEMPLATE_ABSENTEE_LABEL', icon: 'calendar-days', bodyKey: 'WHATSAPP_TEMPLATE_ABSENTEE_BODY' },
  { id: 'ptp', labelKey: 'WHATSAPP_TEMPLATE_PTP_LABEL', icon: 'handshake', bodyKey: 'WHATSAPP_TEMPLATE_PTP_BODY' },
];
