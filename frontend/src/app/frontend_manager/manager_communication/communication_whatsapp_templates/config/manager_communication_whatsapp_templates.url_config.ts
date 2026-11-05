/** URL ownership for manager WhatsApp template screen. */
export const MANAGER_COMMUNICATION_WHATSAPP_TEMPLATES_ROUTES = { root: '/frontend_manager/manager_communication/communication_whatsapp_templates' } as const;

export const MANAGER_COMMUNICATION_WHATSAPP_TEMPLATES_API = {
  LIST: '/api/v1/manager/communication/whatsapp-templates' as const,
  PREVIEW: (id: string) => `/api/v1/manager/communication/whatsapp-templates/${encodeURIComponent(id)}/preview` as const,
} as const;
