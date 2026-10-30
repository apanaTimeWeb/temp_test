import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';

/** Synthetic editable template defaults for local preview only; no service contract or persistence is implied. */
export const ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_FIXTURES: AdminCommunicationWhatsappTemplate[] = [
  { id: 'welcome', labelKey: 'WHATSAPP_TEMPLATE_WELCOME', icon: '👋', body: `Welcome to {libraryname}, {name}! Your seat {seat} is confirmed. We wish you a productive study journey. — ${ADMIN_BRAND_CONFIG.displayName} Team` },
  { id: 'fee_reminder', labelKey: 'WHATSAPP_TEMPLATE_FEE_REMINDER', icon: '💰', body: 'Hi {name}, your fee of ₹{amount} is due on {duedate}. Please pay on time to avoid late charges. — {libraryname}' },
  { id: 'renewal', labelKey: 'WHATSAPP_TEMPLATE_RENEWAL', icon: '🔁', body: 'Hi {name}, your {planname} subscription expires in 3 days. Renew now to continue uninterrupted access. — {libraryname}' },
  { id: 'receipt', labelKey: 'WHATSAPP_TEMPLATE_RECEIPT', icon: '🧾', body: 'Dear {name}, your payment of ₹{amount} has been received. Thank you! Contact us at {phone} for queries. — {libraryname}' },
  { id: 'notice', labelKey: 'WHATSAPP_TEMPLATE_NOTICE', icon: '📢', body: 'Important Notice from {libraryname}: Dear {name}, please note the following update from the library management.' },
  { id: 'absentee', labelKey: 'WHATSAPP_TEMPLATE_ABSENTEE', icon: '📅', body: 'Dear Parent, your ward {name} (Seat: {seat}) has been absent for multiple consecutive days. Please contact {libraryname} at {phone}.' },
  { id: 'ptp', labelKey: 'WHATSAPP_TEMPLATE_PTP', icon: '🤝', body: 'Hi {name}, this is a reminder that you had committed to pay ₹{amount} by {duedate}. Please complete your payment. — {libraryname}' },
];
