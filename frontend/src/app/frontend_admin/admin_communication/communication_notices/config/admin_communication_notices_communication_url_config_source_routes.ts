/** Canonical route and API URL registry for admin_communication. */
export const ADMIN_COMMUNICATION_ROOT = "/admin/admin_communication" as const;
const adminCommunicationRoute = (view: string): string => { const routes: Record<string, string> = {
    "complaints": "/admin/admin_communication/communication_complaints",
    "notices": "/admin/admin_communication/communication_notices",
    "notification_center": "/admin/admin_communication/communication_notification_center",
    "whatsapp_logs": "/admin/admin_communication/communication_whatsapp_logs",
    "whatsapp_templates": "/admin/admin_communication/communication_whatsapp_templates"
  }; return routes[view] ?? "/admin/admin_communication/communication_notices"; };
export const ADMIN_COMMUNICATION_ROUTE_COMPLAINTS = adminCommunicationRoute('complaints');
export const ADMIN_COMMUNICATION_ROUTE_NOTICES = adminCommunicationRoute('notices');
export const ADMIN_COMMUNICATION_ROUTE_NOTIFICATION_CENTER = adminCommunicationRoute('notification_center');
export const ADMIN_COMMUNICATION_ROUTE_WHATSAPP_LOGS = adminCommunicationRoute('whatsapp_logs');
export const ADMIN_COMMUNICATION_ROUTE_WHATSAPP_TEMPLATES = adminCommunicationRoute('whatsapp_templates');

export const ADMIN_COMMUNICATION_DETAIL = (id: string) => `${ADMIN_COMMUNICATION_ROOT}/${id}` as const;
export const ADMIN_COMMUNICATION_API_COMPLAINTS = "/communication/complaints" as const;
export const ADMIN_COMMUNICATION_API_NOTICES = "/communication/notices" as const;

export const ADMIN_COMMUNICATION_URLS = {
  ROOT: ADMIN_COMMUNICATION_ROOT,
  DETAIL: ADMIN_COMMUNICATION_DETAIL,
  COMPLAINTS: ADMIN_COMMUNICATION_API_COMPLAINTS,
  NOTICES: ADMIN_COMMUNICATION_API_NOTICES,
  ROUTE_COMPLAINTS: ADMIN_COMMUNICATION_ROUTE_COMPLAINTS,
  ROUTE_NOTICES: ADMIN_COMMUNICATION_ROUTE_NOTICES,
  ROUTE_NOTIFICATION_CENTER: ADMIN_COMMUNICATION_ROUTE_NOTIFICATION_CENTER,
  ROUTE_WHATSAPP_LOGS: ADMIN_COMMUNICATION_ROUTE_WHATSAPP_LOGS,
  ROUTE_WHATSAPP_TEMPLATES: ADMIN_COMMUNICATION_ROUTE_WHATSAPP_TEMPLATES,

} as const;

export const MODULE_URLS = ADMIN_COMMUNICATION_URLS;
