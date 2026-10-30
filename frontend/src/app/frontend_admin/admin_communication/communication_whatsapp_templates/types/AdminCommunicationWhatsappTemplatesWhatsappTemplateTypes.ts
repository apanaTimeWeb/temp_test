/** Data shape for the Communication-owned WhatsApp template preview. */
export interface AdminCommunicationWhatsappTemplate {
  id: AdminCommunicationWhatsappTemplateId;
  labelKey: AdminCommunicationWhatsappTemplateLabelKey;
  icon: string;
  body: string;
}

export type AdminCommunicationWhatsappTemplateId = 'welcome' | 'fee_reminder' | 'renewal' | 'receipt' | 'notice' | 'absentee' | 'ptp';
export type AdminCommunicationWhatsappTemplateLabelKey = 'WHATSAPP_TEMPLATE_WELCOME' | 'WHATSAPP_TEMPLATE_FEE_REMINDER' | 'WHATSAPP_TEMPLATE_RENEWAL' | 'WHATSAPP_TEMPLATE_RECEIPT' | 'WHATSAPP_TEMPLATE_NOTICE' | 'WHATSAPP_TEMPLATE_ABSENTEE' | 'WHATSAPP_TEMPLATE_PTP';
