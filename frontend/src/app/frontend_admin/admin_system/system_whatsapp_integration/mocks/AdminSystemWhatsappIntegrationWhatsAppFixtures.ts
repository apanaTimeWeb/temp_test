import type { AdminSystemWhatsAppMessageLog, AdminSystemWhatsAppProvider } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';

/** Provider choices are display examples only; the frontend has no verified provider integration. */
export const ADMIN_SYSTEM_WHATSAPP_PROVIDER_EXAMPLES: AdminSystemWhatsAppProvider[] = [
  { id: 'twilio', label: 'Twilio', logo: '🔵', requiresSecret: true },
  { id: 'wati', label: 'Wati', logo: '🟢', requiresSecret: false },
  { id: 'aisensy', label: 'AiSensy', logo: '🟣', requiresSecret: false },
  { id: 'custom', label: 'Custom', logo: '⚙️', requiresSecret: true },
];

/** Synthetic logs for an explicitly labelled demo preview, not proof of delivery. */
export const ADMIN_SYSTEM_WHATSAPP_MESSAGE_LOGS: AdminSystemWhatsAppMessageLog[] = [
  { id: 'wl-001', to: '98****2310', type: 'Fee Receipt', status: 'delivered', sentAt: '2026-04-12 10:45 AM', template: 'receipt_confirmation' },
  { id: 'wl-002', to: '97****8810', type: 'Renewal Reminder', status: 'delivered', sentAt: '2026-04-12 09:30 AM', template: 'renewal_alert' },
  { id: 'wl-003', to: '89****1230', type: 'Welcome Message', status: 'delivered', sentAt: '2026-04-11 06:01 PM', template: 'welcome_new_student' },
  { id: 'wl-004', to: '73****5670', type: 'Fee Reminder', status: 'failed', sentAt: '2026-04-11 02:00 PM', template: 'fee_due_reminder' },
  { id: 'wl-005', to: '91****4430', type: 'Seat Vacancy', status: 'delivered', sentAt: '2026-04-10 11:00 AM', template: 'waitlist_notify' },
  { id: 'wl-006', to: '98****0010', type: 'Fee Receipt', status: 'delivered', sentAt: '2026-04-10 09:15 AM', template: 'receipt_confirmation' },
];
